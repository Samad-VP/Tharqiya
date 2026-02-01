import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { User, Save, ArrowLeft, GraduationCap, FileText, Loader2, Camera, Trash2, Upload } from 'lucide-react';
import { INDIAN_STATES } from '../utils/constants';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const StudentProfile: React.FC = () => {
    const { user, loading: authLoading, updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<'photo' | 'document' | 'generalEdu' | 'madrasaEdu' | null>(null);
    const [initialized, setInitialized] = useState(false);
    
    const [formData, setFormData] = useState({
        dob: '',
        address: '',
        place: '',
        district: '',
        hifzCenter: '',
        fatherName: '',
        motherName: '',
        whatsapp: '',
        phone: '', 
        profileImageUrl: '',
        profileImagePublicId: '',
        documentUrl: '',
        documentPublicId: '',
        generalEduUrl: '',
        generalEduPublicId: '',
        madrasaEduUrl: '',
        madrasaEduPublicId: '',
        primeHifzMentor: '',
        madrasaEducation: '',
        pincode: '',
        state: '',
        country: 'India',
        documents: {} as any
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/admissions/my-status');
                const student = response.data.data;
                
                if (student) {
                    setFormData({
                        dob: student.dob ? (new Date(student.dob).toISOString().split('T')[0] || '') : '',
                        address: student.address || '',
                        place: student.place || '',
                        district: student.district || '',
                        hifzCenter: student.hifzCenter || '',
                        fatherName: student.fatherName || '',
                        motherName: student.motherName || '',
                        whatsapp: student.whatsapp || student.user?.whatsapp || '',
                        phone: student.user?.phone || '',
                        profileImageUrl: student.user?.profileImageUrl || '',
                        profileImagePublicId: student.user?.profileImagePublicId || '',
                        documentUrl: student.documentUrl || '',
                        documentPublicId: student.documentPublicId || '',
                        generalEduUrl: student.documents?.generalEdu || '',
                        generalEduPublicId: student.documents?.generalEduPublicId || '',
                        madrasaEduUrl: student.documents?.madrasaEdu || '',
                        madrasaEduPublicId: student.documents?.madrasaEduPublicId || '',
                        primeHifzMentor: student.primeHifzMentor || '',
                        madrasaEducation: student.madrasaEducation || '',
                        pincode: student.pincode || '',
                        state: student.state || '',
                        country: student.country || 'India',
                        documents: student.documents || {}
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Failed to load profile data');
            } finally {
                setLoading(false);
                setInitialized(true);
            }
        };

        if (user && !authLoading && !initialized) {
            fetchProfile();
        }
    }, [user, authLoading, initialized]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Auto-fetch location for Indian pincodes
        if (name === 'pincode' && value.length === 6 && formData.country === 'India') {
            fetchLocation(value);
        }
    };

    const fetchLocation = async (pincode: string) => {
        const loadingToast = toast.loading('Fetching location details...');
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            
            if (data[0].Status === 'Success') {
                const details = data[0].PostOffice[0];
                setFormData(prev => ({
                    ...prev,
                    district: details.District,
                    state: details.State,
                    place: prev.place || details.Name
                }));
                toast.success('Location updated!', { id: loadingToast });
            } else {
                toast.error('Invalid Pincode', { id: loadingToast });
            }
        } catch (error) {
            console.error('Pincode fetch error:', error);
            toast.error('Failed to fetch location', { id: loadingToast });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'document' | 'generalEdu' | 'madrasaEdu') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (type === 'photo') {
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                toast.error('Please upload a JPEG or PNG image');
                return;
            }
            if (file.size > 300 * 1024) {
                toast.error('Profile photo must be less than 300KB');
                return;
            }
        } else {
            if (!['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
                toast.error('Please upload a PDF or JPG/PNG image file');
                return;
            }
            if (file.size > 500 * 1024) {
                toast.error('Document size must be less than 500KB');
                return;
            }
        }

        setUploading(type);
        const data = new FormData();
        data.append('file', file);
        
        // Handle replacement if we have an old ID
        let oldId = '';
        if (type === 'photo') oldId = formData.profileImagePublicId;
        else if (type === 'document') oldId = formData.documentPublicId;
        else if (type === 'generalEdu') oldId = formData.generalEduPublicId;
        else if (type === 'madrasaEdu') oldId = formData.madrasaEduPublicId;

        if (oldId) {
            data.append('oldPublicId', oldId);
        }

        const docTypeMap = {
            photo: 'profiles',
            document: 'certificates',
            generalEdu: 'general_edu',
            madrasaEdu: 'madrasa_edu'
        };
        const docType = docTypeMap[type];

        try {
            const baseEndpoint = type === 'photo' ? '/uploads/profile' : '/uploads/document';
            const endpoint = `${baseEndpoint}?docType=${docType}`;
            const response = await api.post(endpoint, data);
            
            const fileUrl = response.data.data.url;
            const fileId = response.data.data.public_id;

            if (type === 'photo') {
                setFormData(prev => ({ ...prev, profileImageUrl: fileUrl, profileImagePublicId: fileId }));
                updateUser({ profileImageUrl: fileUrl, profileImagePublicId: fileId });
                await api.patch('/admissions/my-profile', { profileImageUrl: fileUrl, profileImagePublicId: fileId });
            } else if (type === 'document') {
                const updatedDocs = { ...formData.documents, certificate: fileUrl, certificatePublicId: fileId };
                setFormData(prev => ({ ...prev, documentUrl: fileUrl, documentPublicId: fileId, documents: updatedDocs }));
                await api.patch('/admissions/my-profile', { 
                    documentUrl: fileUrl, 
                    documentPublicId: fileId,
                    documents: updatedDocs
                });
            } else if (type === 'generalEdu') {
                const updatedDocs = { ...formData.documents, generalEdu: fileUrl, generalEduPublicId: fileId };
                setFormData(prev => ({ ...prev, generalEduUrl: fileUrl, generalEduPublicId: fileId, documents: updatedDocs }));
                await api.patch('/admissions/my-profile', { 
                    documents: updatedDocs
                });
            } else if (type === 'madrasaEdu') {
                const updatedDocs = { ...formData.documents, madrasaEdu: fileUrl, madrasaEduPublicId: fileId };
                setFormData(prev => ({ ...prev, madrasaEduUrl: fileUrl, madrasaEduPublicId: fileId, documents: updatedDocs }));
                await api.patch('/admissions/my-profile', { 
                    documents: updatedDocs
                });
            }
            toast.success('File updated and saved successfully!');
        } catch (error: any) {
            console.error('Upload/Auto-save Error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload and save file');
        } finally {
            setUploading(null);
        }
    };

    const removeFile = async (type: 'photo' | 'document' | 'generalEdu' | 'madrasaEdu') => {
        try {
            if (type === 'photo') {
                setFormData(prev => ({ ...prev, profileImageUrl: '', profileImagePublicId: '' }));
                updateUser({ profileImageUrl: '', profileImagePublicId: '' });
                await api.patch('/admissions/my-profile', { profileImageUrl: '', profileImagePublicId: '' });
            } else if (type === 'document') {
                const updatedDocs = { ...formData.documents };
                delete updatedDocs.certificate;
                delete updatedDocs.certificatePublicId;
                setFormData(prev => ({ ...prev, documentUrl: '', documentPublicId: '', documents: updatedDocs }));
                await api.patch('/admissions/my-profile', { documentUrl: '', documentPublicId: '', documents: updatedDocs });
            } else if (type === 'generalEdu') {
                const updatedDocs = { ...formData.documents };
                delete updatedDocs.generalEdu;
                delete updatedDocs.generalEduPublicId;
                setFormData(prev => ({ ...prev, generalEduUrl: '', generalEduPublicId: '', documents: updatedDocs }));
                await api.patch('/admissions/my-profile', { documents: updatedDocs });
            } else if (type === 'madrasaEdu') {
                const updatedDocs = { ...formData.documents };
                delete updatedDocs.madrasaEdu;
                delete updatedDocs.madrasaEduPublicId;
                setFormData(prev => ({ ...prev, madrasaEduUrl: '', madrasaEduPublicId: '', documents: updatedDocs }));
                await api.patch('/admissions/my-profile', { documents: updatedDocs });
            }
            toast.success('File removed successfully');
        } catch (error) {
            toast.error('Failed to remove file from server');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch('/admissions/my-profile', formData);
            toast.success('Profile updated successfully');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 sm:py-32">
                <Loader2 className="w-12 h-12 text-edu-coral animate-spin mb-6" />
                <p className="text-slate-500 font-black tracking-[0.3em] uppercase text-[10px]">Synchronizing Scholarly Records...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 sm:gap-6"
            >
                <Link to="/student/portal" className="p-3 sm:p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-edu-coral transition-all shadow-sm group">
                    <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform duration-300" />
                </Link>
                <div>
                    <h2 className="text-3xl sm:text-5xl font-black font-outfit tracking-tighter text-brand-deep dark:text-white uppercase leading-none">
                        Scholar <span className="text-edu-teal">Registry</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Personal Academic Registry</p>
                </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
                {/* Identity Visualization */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 sm:p-12 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden relative group"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-edu-coral/5 blur-3xl rounded-full" />
                    <div className="flex flex-col items-center sm:flex-row gap-8 sm:gap-12 text-center sm:text-left">
                        <div className="relative group/photo">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="w-32 h-32 sm:w-44 sm:h-44 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center relative ring-8 ring-slate-50/50 dark:ring-slate-800/20"
                            >
                                {formData.profileImageUrl ? (
                                    <img src={formData.profileImageUrl} alt="Profile" className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-1000" />
                                ) : (
                                    <User size={48} className="text-slate-300 dark:text-slate-700" />
                                )}
                                <label className="absolute inset-0 bg-brand-deep/70 backdrop-blur-[4px] flex flex-col items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-all duration-500 cursor-pointer">
                                    <Camera size={28} className="text-white mb-2 scale-75 group-hover/photo:scale-100 transition-transform" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Update Photo</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo')} />
                                </label>
                            </motion.div>
                            {uploading === 'photo' && (
                                <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-edu-coral animate-spin" />
                                </div>
                            )}
                        </div>
                        <div className="flex-grow space-y-4">
                            <h3 className="text-2xl sm:text-3xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-tighter">Candidate Image</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm">Your digital identity for admission cards and official certificates.</p>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                                <button type="button" onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()} className="px-6 py-3 bg-edu-coral text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-edu-coral/90 transition-all">Replace</button>
                                {formData.profileImageUrl && (
                                    <button type="button" onClick={() => removeFile('photo')} className="px-6 py-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all">Remove</button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Information Sections */}
                <div className="grid grid-cols-1 gap-8 sm:gap-12">
                    {/* Personal Information */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 sm:p-12 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-4 bg-edu-teal/10 text-edu-teal rounded-2xl">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-tighter">Personal Records</h3>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name (Read Only)</label>
                                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-2xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest text-sm cursor-not-allowed">
                                    {user?.name}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-slate-800 dark:text-white focus:ring-4 focus:ring-edu-teal/10 outline-none transition-all" />
                            </div>
                            <div className="space-y-3 col-span-full">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Permanent Address</label>
                                <textarea name="address" rows={3} value={formData.address} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-800 dark:text-white focus:ring-4 focus:ring-edu-teal/10 outline-none transition-all resize-none" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Country</label>
                                <select name="country" value={formData.country} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-slate-800 dark:text-white focus:ring-4 focus:ring-edu-teal/10 outline-none transition-all">
                                    <option value="India">India</option>
                                    <option value="United Arab Emirates">United Arab Emirates</option>
                                    <option value="Saudi Arabia">Saudi Arabia</option>
                                    <option value="Oman">Oman</option>
                                    <option value="Qatar">Qatar</option>
                                    <option value="Kuwait">Kuwait</option>
                                    <option value="Bahrain">Bahrain</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{formData.country === 'India' ? 'Pincode' : 'Zip/Postal Code'}</label>
                                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-slate-800 dark:text-white focus:ring-4 focus:ring-edu-teal/10 outline-none transition-all" placeholder={formData.country === 'India' ? "6 digit pincode" : "Postal Code"} />
                            </div>
                             <div className="space-y-3">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State / Union Territory</label>
                                 {formData.country === 'India' ? (
                                     <select 
                                         name="state" 
                                         value={formData.state} 
                                         onChange={handleChange} 
                                         className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-slate-800 dark:text-white focus:ring-4 focus:ring-edu-teal/10 outline-none transition-all"
                                     >
                                         <option value="">Select State/UT</option>
                                         {INDIAN_STATES.map(state => (
                                             <option key={state} value={state}>{state}</option>
                                         ))}
                                     </select>
                                 ) : (
                                     <input 
                                         type="text" 
                                         name="state" 
                                         value={formData.state} 
                                         onChange={handleChange} 
                                         className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-slate-800 dark:text-white focus:ring-4 focus:ring-edu-teal/10 outline-none transition-all" 
                                     />
                                 )}
                             </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">District</label>
                                <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-slate-800 dark:text-white focus:ring-4 focus:ring-edu-teal/10 outline-none transition-all" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Place / City</label>
                                <input type="text" name="place" value={formData.place} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-slate-800 dark:text-white focus:ring-4 focus:ring-edu-teal/10 outline-none transition-all" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Academic Heritage */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 sm:p-12 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-4 bg-edu-yellow/10 text-edu-yellow rounded-2xl">
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-tighter">Academic Origin</h3>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Madrasa / Hifz Institution</label>
                                <input type="text" name="hifzCenter" value={formData.hifzCenter} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-slate-800 dark:text-white focus:ring-4 focus:ring-edu-yellow/10 outline-none transition-all" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Madrasa Education</label>
                                <input type="text" name="madrasaEducation" value={formData.madrasaEducation} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-slate-800 dark:text-white focus:ring-4 focus:ring-edu-yellow/10 outline-none transition-all" placeholder="e.g., Saniyya" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Documents */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 sm:p-12 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-4 bg-edu-teal/10 text-edu-teal rounded-2xl">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-tighter">Scholarly Records</h3>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">PDF/JPG (Max 500KB)</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* SSLC */}
                            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border-2 border-dashed border-slate-200 dark:border-slate-800 relative overflow-hidden group/upload">
                                {formData.documentUrl ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                                <FileText size={20} className="text-edu-teal" />
                                            </div>
                                            <p className="text-[10px] font-black text-brand-deep dark:text-white uppercase">SSLC/Cert</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <a href={formData.documentUrl} target="_blank" rel="noopener noreferrer" className="flex-grow text-center py-2 bg-white dark:bg-slate-800 border rounded-lg text-[8px] font-black uppercase">View</a>
                                            <button type="button" onClick={() => removeFile('document')} className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-2">
                                        <Upload size={20} className="mx-auto text-slate-300 mb-2" />
                                        <p className="text-[10px] font-black uppercase mb-3 text-slate-500">SSLC/Cert</p>
                                        <button type="button" onClick={() => document.getElementById('sslc-up')?.click()} className="px-4 py-2 bg-edu-teal text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg shadow-edu-teal/20">Upload</button>
                                        <input id="sslc-up" type="file" className="hidden" accept=".pdf,.jpeg,.png,.jpg" onChange={(e) => handleFileUpload(e, 'document')} />
                                    </div>
                                )}
                                {uploading === 'document' && (
                                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-edu-teal" />
                                    </div>
                                )}
                            </div>

                            {/* General Edu */}
                            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border-2 border-dashed border-slate-200 dark:border-slate-800 relative overflow-hidden group/upload">
                                {formData.generalEduUrl ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                                <FileText size={20} className="text-edu-teal" />
                                            </div>
                                            <p className="text-[10px] font-black text-brand-deep dark:text-white uppercase">General Edu</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <a href={formData.generalEduUrl} target="_blank" rel="noopener noreferrer" className="flex-grow text-center py-2 bg-white dark:bg-slate-800 border rounded-lg text-[8px] font-black uppercase">View</a>
                                            <button type="button" onClick={() => removeFile('generalEdu')} className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-2">
                                        <Upload size={20} className="mx-auto text-slate-300 mb-2" />
                                        <p className="text-[10px] font-black uppercase mb-3 text-slate-500">General Education</p>
                                        <button type="button" onClick={() => document.getElementById('gen-up')?.click()} className="px-4 py-2 bg-edu-teal text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg shadow-edu-teal/20">Upload</button>
                                        <input id="gen-up" type="file" className="hidden" accept=".pdf,.jpeg,.png,.jpg" onChange={(e) => handleFileUpload(e, 'generalEdu')} />
                                    </div>
                                )}
                                {uploading === 'generalEdu' && (
                                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-edu-teal" />
                                    </div>
                                )}
                            </div>

                            {/* Madrasa Edu */}
                            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border-2 border-dashed border-slate-200 dark:border-slate-800 relative overflow-hidden group/upload">
                                {formData.madrasaEduUrl ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                                <FileText size={20} className="text-edu-teal" />
                                            </div>
                                            <p className="text-[10px] font-black text-brand-deep dark:text-white uppercase">Madrasa Edu</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <a href={formData.madrasaEduUrl} target="_blank" rel="noopener noreferrer" className="flex-grow text-center py-2 bg-white dark:bg-slate-800 border rounded-lg text-[8px] font-black uppercase">View</a>
                                            <button type="button" onClick={() => removeFile('madrasaEdu')} className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-2">
                                        <Upload size={20} className="mx-auto text-slate-300 mb-2" />
                                        <p className="text-[10px] font-black uppercase mb-3 text-slate-500">Madrasa Education</p>
                                        <button type="button" onClick={() => document.getElementById('mad-up')?.click()} className="px-4 py-2 bg-edu-teal text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg shadow-edu-teal/20">Upload</button>
                                        <input id="mad-up" type="file" className="hidden" accept=".pdf,.jpeg,.png,.jpg" onChange={(e) => handleFileUpload(e, 'madrasaEdu')} />
                                    </div>
                                )}
                                {uploading === 'madrasaEdu' && (
                                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-edu-teal" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="pt-10 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={saving || uploading !== null} type="submit" className="px-12 h-16 bg-brand-deep dark:bg-white text-white dark:text-brand-deep rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center gap-4 shadow-xl hover:bg-edu-teal hover:text-white transition-all">
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? 'Saving...' : 'Update Registry'}
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

export default StudentProfile;
