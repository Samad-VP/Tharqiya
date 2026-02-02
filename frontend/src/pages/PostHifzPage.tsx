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
    Sparkles,
    Trophy,
    GraduationCap
} from 'lucide-react';
import SEO from '../components/SEO';

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

    const courseStructure = [
        { course: "التمهيدية", qualification: "HIFZ", age: "10-12", duration: "1-3 Years", academic: "BASIC", color: "bg-edu-coral" },
        { course: "الإبتدائية", qualification: "HIFZ", age: "14", duration: "2 Years", academic: "IX, X", color: "bg-edu-teal" },
        { course: "الإعدادية", qualification: "HIFZ+SSLC", age: "16", duration: "3 Years", academic: "+1, +2, D1", color: "bg-edu-teal/80" },
        { course: "الثانوية", qualification: "الإبتدائية", age: "17", duration: "2 Years", academic: "+2, D1", color: "bg-edu-coral" },
        { course: "العالية", qualification: "الثانوية/الإعدادية", age: "19", duration: "3 Years", academic: "D2, D3, PG", color: "bg-edu-teal" },
        { course: "الفاضل", qualification: "العالية", age: "22", duration: "2 Years", academic: "PG", color: "bg-edu-teal/80" },
    ];

    const extraCurricular = [
        {
            title: "Islamic Astronomy",
            subtitle: "Celestial Exploration",
            desc: "A specialized class led by Prof. Shuaibul Haithami, a distinguished researcher in Islamic astronomy. Students explore celestial wonders, star movements, and decorative lunar calendar deciphering, blending Islamic tradition with scientific exploration.",
            icon: Sparkles,
            accent: "from-blue-500 to-indigo-600"
        },
        {
            title: "Ashr Qira'ath",
            subtitle: "Ten Recitation Styles",
            desc: "Meticulous study and mastery of the ten recognized styles of Quranic recitation. Led by esteemed Qari Abdul Qadir Musliyar (Chief Qari of Samastha), ensuring unparalleled guidance in preserving this sacred art.",
            icon: Mic2,
            accent: "from-edu-coral to-red-600"
        },
        {
            title: "Quranic Contests",
            subtitle: "Mental Fortitude",
            desc: "Engage in 'Muqara'a' and 'Mufradhath' contests designed to enhance memory. These unique formats foster seamless recitation and reinforce knowledge of specific Quranic vocabulary.",
            icon: Trophy,
            accent: "from-edu-teal to-yellow-600"
        },
        {
            title: "AHSAS Union",
            subtitle: "Student Leadership",
            desc: "The Anwarul Huda Students' Association cultivates political awareness through a parliamentary system. It features various ministries including Quranic Studies, Public Relations, and Multilingual Affairs.",
            icon: GraduationCap,
            accent: "from-emerald-500 to-teal-600"
        }
    ];

    const sessions = [
        { title: "Doura Intensive", desc: "Twice-yearly month-long residential camps for master-level Quranic revision.", icon: BookMarked },
        { title: "Tharqiya Debates", desc: "Weekly public speaking and argumentative skills training in three languages.", icon: Mic2 },
        { title: "IT & Media Lab", desc: "Equipping scholars with digital literacy, graphic design, and content creation tools.", icon: Cpu },
        { title: "Leadership Seminars", desc: "Monthly workshops by global leaders on psychology, management, and Da'wa strategies.", icon: Lightbulb },
    ];

    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Tharqiya Post-Hifz Integrated Course",
        "description": "A unique 10-year integrated curriculum blending traditional Quranic sciences with modern academic scholarship (SSLC, Plus Two, Degree, PG).",
        "provider": {
            "@type": "EducationalOrganization",
            "name": "Darussalam Edu Village",
            "sameAs": "https://darussalameduvillage.com"
        },
        "courseCode": "THQ-001",
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "Full-time",
            "location": "Koyilandy, Kerala"
        }
    };

    return (
        <div className="bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-500">
            <SEO 
                title="10-Year Integrated Post-Hifz Curriculum | Tharqiya Course Syllabus" 
                description="Explore the comprehensive 10-year integrated curriculum for Huffaz. Blending Quranic sciences with UGC-recognized degrees and professional development at Darussalam Edu Village." 
                jsonLd={[
                    courseSchema,
                    {
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://darussalameduvillage.com"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Programme",
                                "item": "https://darussalameduvillage.com/programme"
                            }
                        ]
                    }
                ]}
            />
            {/* Hero Section */}
            <section className="relative pt-24 pb-12 sm:pt-48 sm:pb-40 bg-brand-cream/50 dark:bg-slate-950 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-brand-deep/10 dark:bg-white/10 text-edu-teal text-[8px] sm:text-xs font-black tracking-widest uppercase mb-4 sm:mb-6 border border-brand-deep/20 dark:border-white/20">
                            Integrated Residency
                        </span>
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-brand-deep dark:text-white font-outfit mb-4 sm:mb-6 tracking-tighter">
                            <span className="text-edu-teal">Tharqiya</span> Course
                        </h1>
                        <p className="text-sm sm:text-xl md:text-2xl text-brand-deep/80 dark:text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
                            A revolutionary 10-year integrated journey transforming memorizers of the Quran into multifaceted global leaders.
                        </p>
                    </motion.div>
                </div>
            </section>


            {/* Course Structure - Stunning Redesign */}
            <section className="py-16 md:py-32 bg-slate-50 dark:bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 md:mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 mb-6"
                        >
                            <div className="w-12 h-1 bg-edu-coral rounded-full" />
                            <span className="text-edu-coral dark:text-edu-teal text-xs md:text-sm font-black uppercase tracking-[0.4em]">
                                The Roadmap
                            </span>
                        </motion.div>
                        <h2 className="text-3xl md:text-7xl font-black text-brand-deep dark:text-white font-outfit tracking-tighter uppercase mb-6">
                            Course <span className="text-edu-coral">Structure</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                            A meticulously tiered progression designed to synchronize spiritual depth with academic excellence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {courseStructure.map((row, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.6 }}
                                whileHover={{ y: -15 }}
                                className="group relative"
                            >
                                 <div className="relative bg-brand-cream dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-white/10 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl sm:shadow-2xl dark:shadow-none h-full flex flex-col overflow-hidden">
                                    {/* Level Indicator */}
                                    <div className="mb-6 sm:mb-10 relative">
                                        <div className={`w-16 sm:w-20 h-1.5 sm:h-2 bg-gradient-to-r ${row.color.includes('coral') ? 'from-edu-coral to-edu-coral/50' : 'from-edu-teal to-edu-teal/50'} rounded-full mb-4 sm:mb-6`} />
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl sm:text-3xl font-black text-brand-deep dark:text-white font-outfit tracking-tight mb-1 sm:mb-2 group-hover:text-edu-coral dark:group-hover:text-edu-teal transition-colors">
                                                    {row.course}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[8px] sm:text-xs font-black text-edu-coral dark:text-edu-teal uppercase tracking-[0.2em]">
                                                        Level {idx + 1}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 mt-auto">
                                        <div className="space-y-1">
                                            <p className="text-[8px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Age Limit</p>
                                            <p className="text-base sm:text-lg font-black text-brand-deep dark:text-white">{row.age} Yrs</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Duration</p>
                                            <p className="text-base sm:text-lg font-black text-brand-deep dark:text-white">{row.duration}</p>
                                        </div>
                                    </div>

                                    {/* Detailed Sections */}
                                    <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 border-t border-slate-50 dark:border-white/5">
                                        <div className="flex gap-3 sm:gap-4 items-start">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0 text-edu-coral dark:text-edu-teal">
                                                <CheckCircle2 size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[8px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Entrance Requirement</p>
                                                <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">
                                                    {row.qualification}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 sm:gap-4 items-start">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0 text-edu-coral dark:text-edu-teal">
                                                <Sparkles size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[8px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Academic Parallel</p>
                                                <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">
                                                    {row.academic}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Syllabus Matrix */}
            <section className="py-16 md:py-32 bg-slate-950">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="mb-12 md:mb-20 text-center lg:text-left">
                        <h2 className="text-2xl sm:text-5xl font-black text-white font-outfit tracking-tighter">The Tharqiya Curriculum Matrix</h2>
                        <p className="text-slate-400 mt-4 text-xs sm:text-lg max-w-2xl font-medium">A meticulously balanced academic and spiritual journey divided into four transformative phases.</p>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        {syllabusData.map((item, idx) => (
                             <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.01, x: 10 }}
                                className="group bg-white/5 border border-white/10 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[3rem] hover:bg-white/10 transition-all duration-500 flex flex-col lg:flex-row gap-6 sm:gap-12 items-start lg:items-center"
                            >
                                <div className="w-14 h-14 sm:w-24 sm:h-24 bg-edu-teal text-white rounded-2xl sm:rounded-[2rem] flex items-center justify-center shrink-0 shadow-xl sm:shadow-2xl shadow-edu-teal/20">
                                    <item.icon className="w-7 h-7 sm:w-10 sm:h-10" />
                                </div>
                                <div className="flex-grow grid md:grid-cols-2 gap-6 sm:gap-12 w-full">
                                    <div className="relative">
                                        <span className="text-edu-teal font-black uppercase text-[8px] sm:text-[10px] tracking-widest block mb-1">{item.level}</span>
                                        <h3 className="text-lg sm:text-2xl font-black text-white mb-2 sm:mb-3 font-outfit tracking-tight">Islamic Mastery</h3>
                                        <p className="text-sm sm:text-lg text-slate-400 leading-relaxed font-medium">{item.islamic}</p>
                                    </div>
                                    <div className="lg:border-l lg:border-white/10 lg:pl-12">
                                        <h3 className="text-lg sm:text-2xl font-black text-white mb-2 sm:mb-3 font-outfit tracking-tight">Academic Pursuit</h3>
                                        <p className="text-sm sm:text-lg text-slate-400 leading-relaxed font-medium">{item.academic}</p>
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
                        <h2 className="text-4xl md:text-5xl font-black text-brand-deep dark:text-white font-outfit tracking-tighter">Complementary Sessions</h2>
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
                                className="p-6 sm:p-10 bg-slate-50 dark:bg-slate-900/40 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all group"
                            >
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-edu-coral dark:bg-edu-teal text-white dark:text-slate-950 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:rotate-12 transition-transform duration-500">
                                    <session.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                                <h4 className="text-xl sm:text-2xl font-black text-brand-deep dark:text-white mb-3 sm:mb-4 font-outfit tracking-tight">{session.title}</h4>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{session.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Extra Curricular Section */}
            <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 mb-6"
                        >
                            <div className="w-12 h-1 bg-edu-coral rounded-full" />
                            <span className="text-edu-coral dark:text-edu-teal text-xs md:text-sm font-black uppercase tracking-[0.4em]">
                                Beyond The Books
                            </span>
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-black text-brand-deep dark:text-white font-outfit tracking-tighter uppercase mb-6">
                            Extra <span className="text-edu-coral">Curricular</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {extraCurricular.map((act, idx) => (
                             <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-tharqiya-cream dark:bg-slate-900/40 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-tharqiya-gold/30 transition-all duration-500 overflow-hidden"
                            >
                                
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${act.accent} flex items-center justify-center text-white mb-6 sm:mb-8 group-hover:scale-110 transition-transform`}>
                                    <act.icon size={28} />
                                </div>

                                <h3 className="text-lg sm:text-xl font-black text-brand-deep dark:text-white mb-1 sm:mb-2 font-outfit uppercase tracking-tight">
                                    {act.title}
                                </h3>
                                <p className="text-[8px] sm:text-[10px] font-black text-edu-coral dark:text-edu-teal uppercase tracking-widest mb-3 sm:mb-4">
                                    {act.subtitle}
                                </p>
                                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {act.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Premium CTA */}
            <section className="py-16 sm:py-24 bg-edu-teal dark:bg-edu-teal relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-3xl md:text-6xl font-black text-white dark:text-slate-950 mb-6 sm:mb-8 font-outfit tracking-tighter">Begin Your Transformation</h2>
                    <p className="text-lg sm:text-xl text-white/90 dark:text-slate-900/80 mb-8 sm:mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Join the elite ranks of the Tharqiyathul Huffaz and shape the future of spiritual and global leadership.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 sm:px-16 py-4 sm:py-5 bg-brand-cream dark:bg-slate-950 text-edu-coral dark:text-edu-teal rounded-full font-black text-lg sm:text-xl shadow-2xl hover:shadow-white/20 transition-all tracking-widest uppercase"
                    >
                        Apply for Admission
                    </motion.button>
                </div>
            </section>
        </div>
    );
};

export default PostHifzPage;
