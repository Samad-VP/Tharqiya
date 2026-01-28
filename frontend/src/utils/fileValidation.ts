export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateFile = (
  file: File,
  type: 'image' | 'document',
  maxSizeKB: number
): ValidationResult => {
  // Check size
  if (file.size > maxSizeKB * 1024) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeKB > 1000 ? (maxSizeKB / 1024).toFixed(1) + 'MB' : maxSizeKB + 'KB'}`
    };
  }

  // Check type
  if (type === 'image') {
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedImageTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Only JPG, PNG, and WebP images are allowed'
      };
    }
  } else if (type === 'document') {
    if (file.type !== 'application/pdf') {
      return {
        isValid: false,
        error: 'Only PDF documents are allowed'
      };
    }
  }

  return { isValid: true };
};
