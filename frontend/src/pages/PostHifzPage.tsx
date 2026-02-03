import React from 'react';
import { motion } from 'framer-motion';
import { Hourglass, BookOpenCheck, Map, Diamond, BookMarked, Mic2, Cpu, Lightbulb, CheckCircle2, Sparkles, Trophy, GraduationCap, Quote } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from '../utils/animations';
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
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-tharqiya-deep/10 dark:bg-white/10 text-edu-teal text-[8px] sm:text-xs font-black tracking-widest uppercase mb-4 sm:mb-6 border border-tharqiya-deep/20 dark:border-white/20">
                            Integrated Residency
                        </span>
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-tharqiya-deep dark:text-white font-outfit mb-4 sm:mb-6 tracking-tighter">
                            <span className="text-gold-orange">Tharqiya</span> Course
                        </h1>
                        <p className="text-sm sm:text-xl md:text-2xl text-academic-muted max-w-3xl mx-auto leading-relaxed font-medium">
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
                        <h2 className="text-3xl md:text-7xl font-black text-tharqiya-deep dark:text-slate-100 font-outfit tracking-tighter uppercase mb-6">
                            Course <span className="text-edu-coral">Structure</span>
                        </h2>
                        <p className="text-academic-muted text-sm sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                            A meticulously tiered progression designed to synchronize spiritual depth with academic excellence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {courseStructure.map((row, idx) => (
                             <motion.div
                                key={idx}
                                variants={fadeInUp}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                whileHover={{ y: -12, transition: { duration: 0.4, ease: "easeOut" } }}
                                className="group relative h-full"
                            >
                                 <div className="relative bg-brand-cream dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-white/10 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl sm:shadow-2xl dark:shadow-none h-full flex flex-col overflow-hidden transition-all duration-500 group-hover:border-tharqiya-orange/20 dark:group-hover:border-white/20 group-hover:shadow-[0_20px_50px_-10px_rgba(234,88,12,0.15)] dark:group-hover:shadow-[0_20px_50px_-10px_rgba(255,255,255,0.05)]">
                                    {/* Subtle Glow Background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 dark:from-white/0 dark:via-white/2 dark:to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                    {/* Level Indicator */}
                                    <div className="mb-6 sm:mb-10 relative">
                                        <div className={`w-16 sm:w-20 h-1.5 sm:h-2 bg-gradient-to-r ${row.color.includes('coral') ? 'from-edu-coral to-edu-coral/50' : 'from-edu-teal to-edu-teal/50'} rounded-full mb-4 sm:mb-6`} />
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl sm:text-3xl font-black text-tharqiya-deep dark:text-slate-100 font-outfit tracking-tight mb-1 sm:mb-2 group-hover:text-edu-coral dark:group-hover:text-edu-teal transition-colors">
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
                                            <p className="text-base sm:text-lg font-black text-tharqiya-deep dark:text-white">{row.age} Yrs</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Duration</p>
                                            <p className="text-base sm:text-lg font-black text-tharqiya-deep dark:text-white">{row.duration}</p>
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
                        <h2 className="text-2xl sm:text-5xl font-black text-white font-outfit tracking-tighter">The Tharqiya <span className="text-gold-orange">Curriculum Matrix</span></h2>
                        <p className="text-slate-200 mt-4 text-xs sm:text-lg max-w-2xl font-medium leading-relaxed">A meticulously balanced academic and spiritual journey divided into four transformative phases.</p>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        {syllabusData.map((item, idx) => (
                              <motion.div
                                 key={idx}
                                 variants={fadeInUp}
                                 initial="initial"
                                 whileInView="animate"
                                 viewport={{ once: true }}
                                 whileHover={{ scale: 1.005, x: 8, transition: { duration: 0.3 } }}
                                 className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[3rem] hover:bg-white/[0.07] hover:border-white/20 hover:shadow-[0_20px_50px_-10px_rgba(255,255,255,0.05)] transition-all duration-500 flex flex-col lg:flex-row gap-6 sm:gap-12 items-start lg:items-center"
                             >
                                <div className="icon-placard !text-white !bg-edu-teal group-hover:rotate-6 transition-transform">
                                    <item.icon className="w-7 h-7 sm:w-10 sm:h-10" />
                                </div>
                                <div className="flex-grow grid md:grid-cols-2 gap-6 sm:gap-12 w-full">
                                    <div className="relative">
                                        <span className="text-edu-teal font-black uppercase text-[8px] sm:text-[10px] tracking-widest block mb-2">{item.level}</span>
                                        <h3 className="text-lg sm:text-2xl font-black text-white mb-2 sm:mb-4 font-outfit tracking-tight group-hover:text-gold-orange transition-colors">Islamic Mastery</h3>
                                        <p className="text-sm sm:text-lg text-slate-300 leading-relaxed font-medium">{item.islamic}</p>
                                    </div>
                                    <div className="lg:border-l lg:border-white/10 lg:pl-12">
                                        <h3 className="text-lg sm:text-2xl font-black text-white mb-2 sm:mb-4 font-outfit tracking-tight group-hover:text-gold-orange transition-colors">Academic Pursuit</h3>
                                        <p className="text-sm sm:text-lg text-slate-300 leading-relaxed font-medium">{item.academic}</p>
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
                        <h2 className="text-4xl md:text-5xl font-black text-tharqiya-deep dark:text-slate-100 font-outfit tracking-tighter">Complementary Sessions</h2>
                        <p className="text-lg text-academic-muted mt-4 font-medium uppercase tracking-widest">Synthesizing the Tharqawi Spirit</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {sessions.map((session, i) => (
                              <motion.div
                                 key={i}
                                 variants={fadeInUp}
                                 initial="initial"
                                 whileInView="animate"
                                 viewport={{ once: true }}
                                 whileHover={{ y: -10 }}
                                 className="p-6 sm:p-10 bg-slate-50 dark:bg-slate-900/40 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all group"
                             >
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-edu-coral dark:bg-edu-teal text-white dark:text-slate-950 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:rotate-12 transition-transform duration-500">
                                    <session.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                                <h4 className="text-xl sm:text-2xl font-black text-tharqiya-deep dark:text-slate-100 mb-3 sm:mb-4 font-outfit tracking-tight">{session.title}</h4>
                                <p className="text-xs sm:text-sm text-academic-muted leading-relaxed font-medium">{session.desc}</p>
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
                        <h2 className="text-4xl md:text-6xl font-black text-tharqiya-deep dark:text-slate-100 font-outfit tracking-tighter uppercase mb-6">
                            Extra <span className="text-edu-coral">Curricular</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {extraCurricular.map((act, idx) => (
                              <motion.div
                                 key={idx}
                                 variants={fadeInUp}
                                 initial="initial"
                                 whileInView="animate"
                                 viewport={{ once: true }}
                                 className="group relative bg-tharqiya-cream dark:bg-slate-900/40 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-tharqiya-gold/30 transition-all duration-500 overflow-hidden"
                             >
                                
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${act.accent} flex items-center justify-center text-white mb-6 sm:mb-8 group-hover:scale-110 transition-transform`}>
                                    <act.icon size={28} />
                                </div>

                                <h3 className="text-lg sm:text-xl font-black text-tharqiya-deep dark:text-slate-100 mb-1 sm:mb-2 font-outfit uppercase tracking-tight">
                                    {act.title}
                                </h3>
                                <p className="text-[8px] sm:text-[10px] font-black text-edu-coral dark:text-edu-teal uppercase tracking-widest mb-3 sm:mb-4">
                                    {act.subtitle}
                                </p>
                                <p className="text-xs sm:text-sm font-medium text-academic-muted leading-relaxed">
                                    {act.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Premium Post-Hifz CTA */}
            <section className="py-24 sm:py-32 relative overflow-hidden bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Glassmorphic Call to Action Card */}
                        <div className="relative p-10 sm:p-20 rounded-[3rem] sm:rounded-[4rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white dark:border-white/5 shadow-2xl overflow-hidden group text-center">
                            {/* Decorative Islamic Pattern Background */}
                            <div className="absolute inset-0 islamic-pattern opacity-[0.03] dark:opacity-[0.07] pointer-events-none" />
                            
                            {/* Animated Background Glow */}
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-edu-teal/10 rounded-full blur-[100px] animate-pulse" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-edu-coral/10 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />

                            <div className="relative z-10 space-y-10">
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-edu-teal/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <Quote className="w-12 h-12 sm:w-16 sm:h-16 text-edu-teal/40 mx-auto relative z-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-3xl sm:text-5xl md:text-7xl font-playfair font-black italic leading-[1.2] text-tharqiya-deep dark:text-white transition-colors duration-500 max-w-5xl mx-auto tracking-tight uppercase">
                                        Begin Your <span className="text-gold-orange font-outfit not-italic">Transformation</span>
                                    </h2>
                                    <p className="text-sm sm:text-xl text-academic-muted max-w-2xl mx-auto font-bold uppercase tracking-[0.2em] leading-relaxed">
                                        Join the elite ranks of the <span className="text-gold-orange">Tharqiyathul Huffaz</span> and shape the future of spiritual and global leadership.
                                    </p>
                                </div>

                                <div className="pt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn-primary"
                                    >
                                        Apply for Admission
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Floating Accents */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white dark:border-white/10 rounded-3xl -rotate-12 animate-float -z-10 hidden lg:block" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white dark:border-white/10 rounded-[2rem] rotate-12 animate-float [animation-delay:2s] -z-10 hidden lg:block" />
                    </motion.div>
                </div>
                
                {/* Background Decorations */}
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-edu-teal/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-edu-coral/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
            </section>
        </div>
    );
};

export default PostHifzPage;
