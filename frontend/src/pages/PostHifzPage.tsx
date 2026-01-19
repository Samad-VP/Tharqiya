import React from 'react';
import { motion } from 'framer-motion';
import {
    Hourglass,
    BookOpenCheck,
    Map,
    Diamond,
    BookMarked,
    Mic2,
    Cpu,
    Lightbulb,
    CheckCircle2,
    Sparkles
} from 'lucide-react';

const PostHifzPage: React.FC = () => {
    const syllabusData = [
        {
            level: "Preparatory Phase (Years 1-3)",
            islamic: "Introduction to Fiqh, Nahw (Grammar), Sira, and Intensive Quran Revision.",
            academic: "Preparation for Kerala State SSLC Examination.",
            icon: Hourglass
        },
        {
            level: "Intermediate Phase (Years 4-5)",
            islamic: "Advanced Arabic Literature, Usul-ul-Fiqh, and Basic Hadith Studies.",
            academic: "Higher Secondary (Plus Two) - Humanities/Commerce streams.",
            icon: BookOpenCheck
        },
        {
            level: "Degree Phase (Years 6-8)",
            islamic: "Comprehensive Hadith (Sihah-ul-Sitta), Tafsir, and Comparative Religion.",
            academic: "UGC Recognized Bachelor's Degree (B.A. English/Sociology).",
            icon: Map
        },
        {
            level: "Masters Phase (Years 9-10)",
            islamic: "Specialization in Islamic Law or Hadith Sciences. Preparation for Darimi Title.",
            academic: "Post-Graduation (M.A.) or Professional Certifications.",
            icon: Diamond
        }
    ];

    const sessions = [
        { title: "Doura Intensive", desc: "Twice-yearly month-long residential camps for master-level Quranic revision.", icon: BookMarked },
        { title: "Tharqiya Debates", desc: "Weekly public speaking and argumentative skills training in three languages.", icon: Mic2 },
        { title: "IT & Media Lab", desc: "Equipping scholars with digital literacy, graphic design, and content creation tools.", icon: Cpu },
        { title: "Leadership Seminars", desc: "Monthly workshops by global leaders on psychology, management, and Da'wa strategies.", icon: Lightbulb },
    ];

    return (
        <div className="bg-white dark:bg-slate-950 transition-colors duration-500">
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 md:pt-48 md:pb-40 bg-slate-950 dark:bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-10 islamic-pattern" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-tharqiya-gold/10 skew-x-12 translate-x-24" />

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-tharqiya-gold text-[10px] sm:text-xs font-black tracking-widest uppercase mb-6 border border-white/20">
                            Integrated Residency
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-7xl font-black text-white font-outfit mb-6 md:mb-8 tracking-tighter">
                            <span className="text-tharqiya-gold">Tharqawi</span> Course
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium px-4">
                            A revolutionary 10-year integrated journey transforming memorizers of the Quran into multifaceted global leaders.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Campus Environment */}
            <section className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative order-2 lg:order-1"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl h-48 sm:h-80 border-4 sm:border-8 border-white dark:border-slate-900">
                                        <img src="https://images.jdmagicbox.com/comp/kozhikode/t8/0495px495.x495.221103222315.n1t8/catalogue/darussalam-tharqiya-kozhikode-colleges-6oehxk8bbm.jpg" className="w-full h-full object-cover" alt="Campus" />
                                    </div>
                                    <div className="bg-tharqiya-gold/10 dark:bg-tharqiya-gold/5 p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col items-center justify-center text-center">
                                        <CheckCircle2 className="text-tharqiya-gold w-8 h-8 sm:w-12 sm:h-12 mb-2 sm:mb-4" />
                                        <span className="text-[10px] sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Village Oasis</span>
                                    </div>
                                </div>
                                <div className="pt-8 sm:pt-12 space-y-4">
                                    <div className="bg-tharqiya-green/10 dark:bg-tharqiya-green/5 p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col items-center justify-center text-center">
                                        <Sparkles className="text-tharqiya-green dark:text-tharqiya-gold w-8 h-8 sm:w-12 sm:h-12 mb-2 sm:mb-4" />
                                        <span className="text-[10px] sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Dars Tradition</span>
                                    </div>
                                    <div className="rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl h-48 sm:h-80 border-4 sm:border-8 border-white dark:border-slate-900">
                                        <img src="https://images.jdmagicbox.com/comp/kozhikode/t8/0495px495.x495.221103222315.n1t8/catalogue/darussalam-tharqiya-kozhikode-colleges-yi6t7u3nd0.jpg" className="w-full h-full object-cover" alt="Students" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="order-1 lg:order-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px w-10 bg-tharqiya-green dark:bg-tharqiya-gold" />
                                <span className="text-tharqiya-green dark:text-tharqiya-gold font-black tracking-widest uppercase text-xs">Environment</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white font-outfit mb-8 tracking-tighter leading-tight">Edu Village <span className="text-tharqiya-green">Campus Life</span></h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                                Our campus in Muchukunnu is an intentional "Edu Village"—a holistic ecosystem blending ancient Dars intimacy with modern university scale.
                            </p>
                            <div className="grid gap-4">
                                {[
                                    "Digital Smart Classrooms for global connectivity",
                                    "Sacred Revision Halls (Hifz-khana)",
                                    "Boutique Residential Blocks with private study pods",
                                    "Lush Organic Farms & Meditative Green Spaces",
                                    "State-of-the-art Research Library"
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-4 items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-tharqiya-green/20 dark:hover:border-tharqiya-gold/20 transition-all font-bold text-slate-800 dark:text-slate-200"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-tharqiya-green/10 dark:bg-tharqiya-gold/10 flex items-center justify-center text-tharqiya-green dark:text-tharqiya-gold shrink-0">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        {item}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Syllabus Matrix */}
            <section className="py-16 md:py-32 bg-slate-950">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="mb-12 sm:mb-20 text-center lg:text-left">
                        <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit tracking-tighter">The Tharqawi Curriculum Matrix</h2>
                        <p className="text-slate-400 mt-4 text-sm sm:text-lg max-w-2xl font-medium">A meticulously balanced academic and spiritual journey divided into four transformative phases.</p>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        {syllabusData.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.01, x: 10 }}
                                className="group bg-white/5 border border-white/10 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] hover:bg-white/10 transition-all duration-500 flex flex-col lg:flex-row gap-6 sm:gap-12 items-start lg:items-center"
                            >
                                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-tharqiya-gold text-white rounded-2xl sm:rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl shadow-tharqiya-gold/20">
                                    <item.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                                </div>
                                <div className="flex-grow grid md:grid-cols-2 gap-12">
                                    <div>
                                        <span className="text-tharqiya-gold font-black uppercase text-xs tracking-widest block mb-2">{item.level}</span>
                                        <h3 className="text-2xl font-black text-white mb-4 font-outfit tracking-tight">Islamic Mastery</h3>
                                        <p className="text-slate-400 text-lg leading-relaxed font-medium">{item.islamic}</p>
                                    </div>
                                    <div className="lg:border-l lg:border-white/10 lg:pl-12">
                                        <h3 className="text-2xl font-black text-white mb-4 font-outfit tracking-tight">Academic Pursuit</h3>
                                        <p className="text-slate-400 text-lg leading-relaxed font-medium">{item.academic}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Beyond the Course */}
            <section className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter">Complementary Sessions</h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 mt-4 font-medium uppercase tracking-widest">Synthesizing the Tharqawi Spirit</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {sessions.map((session, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className="p-6 sm:p-10 bg-slate-50 dark:bg-slate-900/40 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all group"
                            >
                                <div className="w-16 h-16 bg-tharqiya-green dark:bg-tharqiya-gold text-white dark:text-slate-950 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500">
                                    <session.icon className="w-8 h-8" />
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4 font-outfit tracking-tight">{session.title}</h4>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-sm">{session.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium CTA */}
            <section className="py-24 bg-tharqiya-gold dark:bg-islamic-accent relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 islamic-pattern" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-white dark:text-slate-950 mb-8 font-outfit tracking-tighter">Begin Your Transformation</h2>
                    <p className="text-xl text-white/90 dark:text-slate-900/80 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Applications for the 2026 intake cycle are currently active for elite Huffaz candidates.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-16 py-5 bg-white dark:bg-slate-950 text-tharqiya-green dark:text-tharqiya-gold rounded-full font-black text-xl shadow-2xl hover:shadow-white/20 transition-all tracking-widest uppercase"
                    >
                        Apply for Admission
                    </motion.button>
                </div>
            </section>
        </div>
    );
};

export default PostHifzPage;
