import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Download, Library, BookCheck, ShieldCheck, LifeBuoy } from 'lucide-react';

const StudentResources: React.FC = () => {
    const resources = [
        {
            title: "Tharqiya Scholars Guide 2026",
            description: "A comprehensive handbook detailing the vision, mission, and academic journey at Darussalam Edu Village.",
            type: "PDF",
            size: "2.4 MB",
            icon: Library,
            color: "text-edu-coral",
            bg: "bg-edu-coral/10"
        },
        {
            title: "Post-Hifz Curriculum Syllabus",
            description: "Detailed breakdown of the subjects, modules, and learning outcomes for the 2026 academic batch.",
            type: "PDF",
            size: "1.8 MB",
            icon: BookOpen,
            color: "text-edu-teal",
            bg: "bg-edu-teal/10"
        },
        {
            title: "Campus Rules & Code of Conduct",
            description: "Guidelines and expectations for students to maintain the sanctity and discipline of the Edu Village.",
            type: "PDF",
            size: "950 KB",
            icon: ShieldCheck,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Admission Result Criteria",
            description: "Explanation of the benchmarking system and how interview scores are calculated for final allotment.",
            type: "PDF",
            size: "1.1 MB",
            icon: BookCheck,
            color: "text-edu-yellow",
            bg: "bg-edu-yellow/10"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-10 sm:space-y-16 pb-20">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center sm:text-left"
            >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4">
                    <h2 className="text-4xl sm:text-6xl font-black font-outfit tracking-tighter text-tharqiya-deep dark:text-white uppercase leading-none">
                        Scholarly <span className="text-edu-coral">Repository</span>
                    </h2>
                    <div className="hidden sm:block h-px flex-grow bg-slate-100 dark:bg-slate-800" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] ml-1">
                    Direct access to official Darussalam Edu Village publications
                </p>
            </motion.div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.15 } }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12"
            >
                {resources.map((res, idx) => (
                    <motion.div
                        key={idx}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        whileHover={{ y: -10 }}
                        className="p-8 sm:p-12 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl hover:shadow-tharqiya-deep/5 dark:hover:shadow-white/5 transition-all duration-500 group flex flex-col justify-between relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 dark:bg-slate-800/20 -mr-20 -mt-20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div>
                            <div className={`w-16 h-16 rounded-2xl ${res.bg} ${res.color} flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-current/10`}>
                                <res.icon size={32} />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-tharqiya-deep dark:text-white font-outfit mb-4 leading-tight group-hover:text-edu-teal transition-colors tracking-tight uppercase">{res.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mb-12 leading-relaxed text-sm sm:text-base border-l-4 border-slate-50 dark:border-slate-800 pl-6">{res.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated Download</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-tharqiya-deep dark:text-white uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">{res.type}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Archive Size: {res.size}</span>
                                </div>
                            </div>
                            <motion.button 
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center justify-center w-14 h-14 bg-tharqiya-deep dark:bg-white text-white dark:text-tharqiya-deep hover:bg-edu-coral hover:text-white rounded-2xl transition-all shadow-xl shadow-tharqiya-deep/10 dark:shadow-white/10 group/btn"
                            >
                                <Download size={24} className="group-hover/btn:translate-y-1 transition-transform" />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            
            {/* Help Section */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-20 p-12 sm:p-20 rounded-[3.5rem] bg-tharqiya-deep text-white dark:bg-slate-800/50 border border-slate-200/10 text-center relative overflow-hidden group"
            >
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-[2rem] bg-white/10 backdrop-blur-3xl flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform duration-700 ring-1 ring-white/20">
                        <LifeBuoy size={40} className="text-edu-coral" />
                    </div>
                    <h4 className="text-3xl sm:text-4xl font-black text-white font-outfit mb-4 uppercase tracking-tighter">Scholarly Support</h4>
                    <p className="text-white/60 font-medium mb-12 max-w-xl text-sm sm:text-base leading-relaxed">If you cannot locate a specific manuscript or administrative protocol, our academic secretariat is available for personal assistance.</p>
                    <a href="mailto:contact@darussalam.in" className="h-20 px-16 bg-edu-coral text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center shadow-2xl shadow-edu-coral/40 hover:scale-105 active:scale-95 transition-all">Contact Secretariat</a>
                </div>
                
                {/* Abstract background elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-edu-teal/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-edu-coral/10 blur-[100px] rounded-full" />
                </div>
            </motion.div>
        </div>
    );
};

export default StudentResources;
