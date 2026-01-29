import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap,
    FolderOpen,
    UserRound,
    MapPin,
    Phone,
    Calendar,
    BookOpen,
    Flag,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Send,
    Building2,
    AlertCircle,
    ShieldCheck,
    Mail
} from 'lucide-react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';
import FileUploader from '../components/common/FileUploader';

const AdmissionPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        place: '',
        district: '',
        address: '',
        parentName: '',
        motherName: '',
        dob: '',
        phone: '',
        whatsapp: '',
        email: '',
        hifzCenter: '',
        dawrasCount: '',
        schoolEducation: '',
        kitabsStudied: '',
        firstOption: '',
        secondOption: '',
        thirdOption: '',
        primeHifzMentor: '',
        documents: {} as Record<string, string>
    });

    const campuses = [
        "Darussalam College of Tharqiyathul Huffaz, Darussalam Edu Village, Koyilandi",
        "Shamsul Ulama College of Tharqiyathul Huffaz, Mannarkkad, Palakkad",
        "Umariyya College of Tharqiyathul Huffaz, Athinjal, Kanjangad"
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateStep = (currentStep: number) => {
        let requiredFields: string[] = [];
        if (currentStep === 1) {
            requiredFields = ['name', 'parentName', 'motherName', 'address', 'dob', 'place', 'district', 'phone', 'email', 'whatsapp'];
        } else if (currentStep === 2) {
            requiredFields = ['hifzCenter', 'dawrasCount', 'schoolEducation', 'primeHifzMentor'];
        } else if (currentStep === 3) {
            requiredFields = ['firstOption', 'secondOption', 'thirdOption'];
        }

        const missingFields = requiredFields.filter(f => !formData[f as keyof typeof formData]);
        if (missingFields.length > 0) {
            toast.error("Please fill in all required fields to proceed.");
            return false;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        }
    };
    const prevStep = () => setStep(prev => prev - 1);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successData, setSuccessData] = useState<{ applicationNo: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.documents.photo || !formData.documents.certificate) {
            toast.error("Please upload both your Photo and Certificate to submit.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.post('/admissions/public/apply', formData);
            setSuccessData(response.data);
            toast.success("Application submitted successfully!");
            setStep(5); // Move to a success step
        } catch (err: any) {
            console.error("Form Submission Error:", err);
            toast.error(err.response?.data?.message || "Failed to submit application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-500 min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative h-[30vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-500 pt-20 sm:pt-0">
                <div className="relative z-10 text-center px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-5xl md:text-7xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tighter uppercase"
                    >
                        Admission <span className="text-tharqiya-gold">2026-27</span>
                    </motion.h1>
                    <p className="text-sm sm:text-xl text-tharqiya-deep/80 dark:text-white/80 mt-2 sm:mt-4 font-medium max-w-2xl mx-auto">
                        Join the elite circle of Tharqawi scholars. Applications are now open for the upcoming academic cycle.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid lg:grid-cols-3 gap-12">
                {/* Info Sidebar */}
                <div className="lg:col-span-1 space-y-8 order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="glass-card p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800"
                    >
                        <h3 className="text-2xl font-black text-tharqiya-deep dark:text-white mb-6 font-outfit tracking-tight flex items-center gap-3">
                            <ShieldCheck className="text-tharqiya-orange dark:text-tharqiya-gold" />
                            Eligibility
                        </h3>
                        <ul className="space-y-4">
                            {[
                                "Successful completion of Quran Hifz",
                                "Completed SSLC (10th Grade)",
                                "Age between 13 and 15 years",
                                "Commitment to 10-year integrated study"
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-400 font-medium text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-tharqiya-gold mt-1.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <div className="glass-card p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] relative overflow-hidden">
                        <h3 className="text-xl sm:text-2xl font-black text-tharqiya-deep dark:text-white mb-4 sm:mb-6 font-outfit tracking-tight relative z-10">Application Guide</h3>
                        <ul className="space-y-3 sm:space-y-4 text-slate-600 dark:text-white/80 text-xs sm:text-sm relative z-10 mb-6 sm:mb-8 font-medium">
                            <li className="flex gap-3">
                                <div className="w-5 h-5 bg-tharqiya-gold rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-tharqiya-deep font-black text-[10px]">1</span>
                                </div>
                                Fill in candidate and guardian details.
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 bg-tharqiya-gold rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-tharqiya-deep font-black text-[10px]">2</span>
                                </div>
                                Select your preferred institutions.
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 bg-tharqiya-gold rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-tharqiya-deep font-black text-[10px]">3</span>
                                </div>
                                Upload required documents.
                            </li>
                        </ul>
                        <p className="text-slate-500 dark:text-white/70 text-xs sm:text-sm mb-4 sm:mb-6 relative z-10 font-bold">Need help with your application? Contact our helpdesk.</p>
                        <div className="flex flex-col gap-3 relative z-10">
                            <a href="tel:+914962673322" className="flex items-center justify-center gap-2 bg-slate-950/10 dark:bg-white/10 p-3 rounded-2xl font-bold hover:bg-slate-950/20 dark:hover:bg-white/20 text-slate-900 dark:text-white transition-all text-sm">
                                <Phone size={16} /> +91 496 2673322
                            </a>
                        </div>
                    </div>
                </div>

                {/* Admission Form */}
                <div className="lg:col-span-2 order-1 lg:order-2">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6 sm:p-12 rounded-[1.5rem] sm:rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl sm:shadow-2xl relative overflow-hidden"
                    >

                        <div className="mb-10">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter">Registration Form</h2>
                                <span className="px-4 py-1.5 bg-tharqiya-gold/10 text-tharqiya-gold rounded-full text-[10px] font-black uppercase">Step {step} of 4</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: "25%" }}
                                    animate={{ width: step === 1 ? "25%" : step === 2 ? "50%" : step === 3 ? "75%" : "100%" }}
                                    className="h-full bg-tharqiya-orange dark:bg-tharqiya-gold transition-all duration-500"
                                />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Candidate Name <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input name="name" required value={formData.name} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-medium dark:text-white" placeholder="Full Name" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Father's Name <span className="text-red-500">*</span></label>
                                                <input name="parentName" required value={formData.parentName} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-medium dark:text-white" placeholder="Guardian Name" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Mother's Name <span className="text-red-500">*</span></label>
                                            <input name="motherName" required value={formData.motherName} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-medium dark:text-white" placeholder="Mother's name" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Full Address <span className="text-red-500">*</span></label>
                                            <textarea name="address" required value={formData.address} onChange={handleInputChange} rows={3} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-medium dark:text-white" placeholder="Complete postal address" />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                            <div className="sm:col-span-1 space-y-2">
                                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Date of Birth <span className="text-red-500">*</span></label>
                                                <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-medium dark:text-white" />
                                            </div>
                                            <div className="sm:col-span-1 space-y-2">
                                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Place <span className="text-red-500">*</span></label>
                                                <input name="place" required value={formData.place} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-medium dark:text-white" placeholder="Gramam/City" />
                                            </div>
                                            <div className="sm:col-span-1 space-y-2">
                                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">District <span className="text-red-500">*</span></label>
                                                <input name="district" required value={formData.district} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-medium dark:text-white" placeholder="District" />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Phone Number <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-medium dark:text-white" placeholder="Mobile Number" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Email Address <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-medium dark:text-white" placeholder="yourname@gmail.com" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number <span className="text-red-500">*</span></label>
                                            <input name="whatsapp" required value={formData.whatsapp} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-medium dark:text-white" placeholder="WhatsApp" />
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                                            <button type="button" onClick={nextStep} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                                                Academic Details <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Hifz Institution <span className="text-red-500">*</span></label>
                                            <textarea name="hifzCenter" required value={formData.hifzCenter} onChange={handleInputChange} rows={3} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-medium dark:text-white" placeholder="Name and address of Madrasa/Institution" />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Number of Dawras Completed <span className="text-red-500">*</span></label>
                                                <input name="dawrasCount" required value={formData.dawrasCount} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-medium dark:text-white" placeholder="Count" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">School Education <span className="text-red-500">*</span></label>
                                                <input name="schoolEducation" required value={formData.schoolEducation} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-medium dark:text-white" placeholder="Class/Qualification" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Prime Hifz Mentor <span className="text-red-500">*</span></label>
                                                <input name="primeHifzMentor" required value={formData.primeHifzMentor} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-medium dark:text-white" placeholder="Teacher Name" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Names of Kitabs Studied (If any)</label>
                                            <textarea name="kitabsStudied" value={formData.kitabsStudied} onChange={handleInputChange} rows={3} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-medium dark:text-white" placeholder="Optional" />
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
                                            <button type="button" onClick={prevStep} className="px-8 py-3 rounded-full text-slate-600 dark:text-slate-400 font-bold flex items-center justify-center gap-2 order-2 sm:order-1">
                                                <ArrowLeft size={18} /> Back
                                            </button>
                                            <button type="button" onClick={nextStep} className="btn-primary flex items-center justify-center gap-2 order-1 sm:order-2">
                                                Campus Selection <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                            <h4 className="text-sm font-black text-tharqiya-orange dark:text-tharqiya-gold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                                <Flag size={18} /> Choice of Institutions
                                            </h4>

                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">First Option <span className="text-red-500">*</span></label>
                                                    <select name="firstOption" required value={formData.firstOption} onChange={handleInputChange} className="w-full px-6 py-4 bg-tharqiya-cream dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-bold text-sm dark:text-white">
                                                        <option value="">Select Campus</option>
                                                        {campuses.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Second Option <span className="text-red-500">*</span></label>
                                                    <select name="secondOption" required value={formData.secondOption} onChange={handleInputChange} className="w-full px-6 py-4 bg-tharqiya-cream dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-bold text-sm dark:text-white">
                                                        <option value="">Select Campus</option>
                                                        {campuses.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Third Option <span className="text-red-500">*</span></label>
                                                    <select name="thirdOption" required value={formData.thirdOption} onChange={handleInputChange} className="w-full px-6 py-4 bg-tharqiya-cream dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 outline-none font-bold text-sm dark:text-white">
                                                        <option value="">Select Campus</option>
                                                        {campuses.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800">
                                            <AlertCircle className="text-amber-600 shrink-0" size={18} />
                                            <p className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider leading-relaxed">
                                                By submitting, you confirm that all provided data is true and that you are prepared for the mandatory entrance examination.
                                            </p>
                                        </div>

                                        <div className="flex justify-between pt-6">
                                            <button type="button" onClick={prevStep} className="px-8 py-3 rounded-full text-slate-600 dark:text-slate-400 font-bold flex items-center gap-2">
                                                <ArrowLeft size={18} /> Back
                                            </button>
                                            <button type="button" onClick={nextStep} className="btn-primary flex items-center justify-center gap-2">
                                                Next: Documents <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                            <h4 className="text-sm font-black text-tharqiya-orange dark:text-tharqiya-gold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                                <FolderOpen size={18} /> Required Documents
                                            </h4>

                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Photo (Max 300KB) <span className="text-red-500">*</span></label>
                                                    <FileUploader 
                                                        label="Upload Photo"
                                                        type="image"
                                                        onUploadSuccess={(url) => setFormData(prev => ({ ...prev, documents: { ...prev.documents, photo: url } }))}
                                                        onRemove={() => setFormData(prev => {
                                                            const newDocs = { ...prev.documents };
                                                            delete newDocs.photo;
                                                            return { ...prev, documents: newDocs };
                                                        })}
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">SSLC/Cert (PDF Only) (Max 2MB) <span className="text-red-500">*</span></label>
                                                    <FileUploader 
                                                        label="Upload Certificate"
                                                        type="document"
                                                        onUploadSuccess={(url) => setFormData(prev => ({ ...prev, documents: { ...prev.documents, certificate: url } }))}
                                                        onRemove={() => setFormData(prev => {
                                                            const newDocs = { ...prev.documents };
                                                            delete newDocs.certificate;
                                                            return { ...prev, documents: newDocs };
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800">
                                            <AlertCircle className="text-amber-600 shrink-0" size={18} />
                                            <p className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider leading-relaxed">
                                                By submitting, you confirm that all provided data is true and that you are prepared for the mandatory entrance examination.
                                            </p>
                                        </div>

                                        <div className="flex justify-between pt-6">
                                            <button type="button" onClick={prevStep} className="px-8 py-3 rounded-full text-slate-600 dark:text-slate-400 font-bold flex items-center gap-2">
                                                <ArrowLeft size={18} /> Back
                                            </button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="btn-primary px-12 flex items-center gap-3 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Submit Application'} <Send size={18} />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 5 && successData && (
                                    <motion.div
                                        key="step5"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-24 h-24 bg-tharqiya-gold/10 text-tharqiya-gold rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                            <CheckCircle2 size={48} />
                                        </div>
                                        <h2 className="text-3xl font-black text-tharqiya-deep dark:text-white mb-4 font-outfit">Application Received!</h2>
                                        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Your application has been successfully submitted to Darussalam Edu Village.</p>
                                        
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 mb-10">
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Application Number</p>
                                                <p className="text-4xl font-black text-tharqiya-orange dark:text-tharqiya-gold">{successData.applicationNo}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed px-6">
                                                Your application is now under review. Once an administrator approves your documents, your login credentials will be sent to your <span className="text-tharqiya-deep dark:text-white">WhatsApp</span> and <span className="text-tharqiya-deep dark:text-white">Email</span>.
                                            </p>
                                            <a href="/" className="btn-primary w-full py-5 text-xl mt-4">Return to Home</a>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdmissionPage;
