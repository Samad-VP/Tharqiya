import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { validateFile } from '../../utils/fileValidation';

interface FileUploaderProps {
  onUploadSuccess: (url: string, publicId: string) => void;
  onUploadError?: (error: string) => void;
  onRemove?: () => void;
  label?: string;
  accept?: string;
  type?: 'image' | 'document';
  currentPublicId?: string; // For replacement
  docType?: string; // For Cloudinary subfolder
  email?: string; // For public uploads identification
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  onRemove,
  label = 'Upload File',
  accept = 'image/*,application/pdf',
  type = 'image',
  currentPublicId,
  docType,
  email
}) => {
  const { user: currentUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showReplace, setShowReplace] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set limits based on category - all uploads now limited to 300KB
  const maxSizeKB = 300;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate size and type
    const validation = validateFile(selectedFile, type, maxSizeKB);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid file');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFile(selectedFile);
    
    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    uploadFile(selectedFile);
  };

  const uploadFile = async (selectedFile: File) => {
    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);
    
    // Pass old public ID if replacing
    if (currentPublicId) {
      formData.append('oldPublicId', currentPublicId);
      formData.append('resourceType', type === 'image' ? 'image' : 'auto');
    }

    // Pass identifier and docType in query params for Cloudinary folder logic
    const params = new URLSearchParams();
    if (docType) params.append('docType', docType);
    if (email) params.append('email', email);
    
    const baseEndpoint = type === 'image' ? '/uploads/image' : '/uploads/document';
    const endpoint = `${baseEndpoint}?${params.toString()}`;

    try {
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setProgress(percentCompleted);
        }
      });

      const { url, public_id } = response.data.data;
      onUploadSuccess(url, public_id);
      toast.success('Upload successful!');
      setShowReplace(false);
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to upload file';
      toast.error(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
      setFile(null);
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setShowReplace(false);
    if (onRemove) onRemove();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReplaceClick = () => {
    setShowReplace(true);
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-4 transition-all duration-300 ${
          isUploading ? 'border-primary/50 bg-primary/5' : 
          file ? 'border-success/50 bg-success/5' : 
          'border-gray-300 dark:border-gray-700 hover:border-primary/50'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        {!file && !isUploading && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center cursor-pointer py-4"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
            <p className="text-xs text-gray-500 mt-1">
              Max size: {maxSizeKB}KB
            </p>
          </div>
        )}

        {isUploading && (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Uploading... {progress}%</p>
            <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {file && !isUploading && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {preview ? (
                <img src={preview} alt="Preview" className="w-12 h-12 rounded object-cover border border-gray-200 dark:border-gray-800" />
              ) : (
                <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
              )}
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[150px]">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleReplaceClick}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 hover:text-primary"
                title="Replace file"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={handleRemove}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 hover:text-red-500"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
