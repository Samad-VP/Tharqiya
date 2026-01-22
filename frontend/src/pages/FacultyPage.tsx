import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, GraduationCap, Users } from 'lucide-react';

const facultyMembers = [
    {
        nameEn: "Hafiz Shakeer Haithami",
        nameAr: "الحافظ شكير بن محمد الهيتمي",
        role: "Principal & Chief Coordinator",
        specialization: "Islamic Jurisprudence & Quranic Sciences",
        category: "Administration",
        color: "bg-edu-coral"
    },
    {
        nameEn: "Prof. Shuaibul Haithami",
        nameAr: "الأستاذ شعيب الهيتمي",
        role: "Senior Faculty",
        specialization: "Islamic Astronomy & Research",
        category: "Academic",
        color: "bg-edu-teal"
    },
    {
        nameEn: "Qari Abdul Qadir Musliyar",
        nameAr: "القارئ عبد القادر مصلحي",
        role: "Chief Qari",
        specialization: "Ten Recitation Styles (Ashr Qira'ath)",
        category: "Scholars",
        color: "bg-edu-teal"
    },
    {
        nameEn: "Usthad Faisal Ahsani",
        nameAr: "الأستاذ فيصل أحسني",
        role: "Faculty Member",
        specialization: "Arabic Literature & Linguistics",
        category: "Scholars",
        color: "bg-edu-coral"
    }
];

const FacultyPage: React.FC = () => {
    return (
        <div className="bg-brand-cream dark:bg-slate-950 transition-colors duration-500 min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 sm:pt-48 sm:pb-40 bg-brand-cream/50 dark:bg-slate-950 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full bg-edu-teal/10 text-edu-teal text-[10px] sm:text-xs font-black tracking-widest uppercase mb-6 border border-edu-teal/20">
                            Academic Excellence
                        </span>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-brand-deep dark:text-white font-outfit mb-6 tracking-tighter">
                            Our <span className="text-edu-teal">Faculty</span>
                        </h1>
                        <p className="text-sm sm:text-xl md:text-2xl text-brand-deep/80 dark:text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
                            A distinguished panel of world-class scholars and academic professors dedicated to nurturing future leaders.
                        </p>
                    </motion.div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] pointer-events-none" />
            </section>

            {/* Faculty Grid */}
            <section className="py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 md:gap-16">
                        {facultyMembers.map((member, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.8 }}
                                className="group relative"
                            >
                                <div className="absolute -inset-4 bg-gradient-to-br from-edu-teal/20 to-edu-coral/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="relative p-8 sm:p-12 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left transition-all duration-500 hover:scale-[1.02]">
                                    {/* Profile Avatar Placeholder */}
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border-4 border-white dark:border-slate-800 shadow-xl group-hover:rotate-3 transition-transform duration-500">
                                        <Users className="w-10 h-10 sm:w-16 sm:h-16 text-slate-300 dark:text-slate-700" />
                                    </div>

                                    <div className="flex-grow space-y-4">
                                        <div className="inline-block px-3 py-1 bg-edu-teal/10 text-edu-teal rounded-full text-[10px] font-black uppercase tracking-widest border border-edu-teal/20 mb-2">
                                            {member.category}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-2xl sm:text-3xl font-black text-brand-deep dark:text-white font-outfit leading-tight">
                                                {member.nameEn}
                                            </h3>
                                            <p className="text-xl sm:text-2xl font-black text-edu-coral/80 font-outfit">
                                                {member.nameAr}
                                            </p>
                                        </div>
                                        <p className="text-sm sm:text-base font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                            {member.role}
                                        </p>
                                        <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex flex-wrap justify-center md:justify-start gap-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-xl">
                                                <Award className="w-4 h-4 text-edu-teal" />
                                                {member.specialization}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Motivational Quote */}
            <section className="py-16 sm:py-24 bg-edu-teal/10 dark:bg-edu-teal/5 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <BookOpen className="w-12 h-12 text-edu-teal/40 mx-auto mb-8 animate-pulse" />
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-brand-deep dark:text-white font-outfit tracking-tighter max-w-4xl mx-auto leading-tight italic">
                            "The scholar's ink is more sacred than the blood of martyrs. Our faculty represents the living bridge between timeless wisdom and contemporary challenge."
                        </h2>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default FacultyPage;
