import React from 'react';
import { motion } from 'framer-motion';
import { Library, UsersRound, Languages, Trophy, Eye, Target, Sparkles, Building2, Heart, MessageCircle } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from '../utils/animations';
import SEO from '../components/SEO';
import academicBg from '../assets/campus-view-academic.jpg';
import campusMonument from '../assets/campus-monument.jpg';
import viceChancellorImg from '../assets/leadership/vice_chancellor_clean.png';

const AboutPage: React.FC = () => {
    return (
        <div className="bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-500">
            <SEO 
                title="About Darussalam Edu Village | Kerala's Premier Post-Hifz Institution" 
                description="Learn about Tharqiyathul Huffaz at Darussalam Edu Village. Discover our legacy of integrating Hifz-ul-Quran with modern academic excellence to nurture ethical global leaders." 
                jsonLd={{
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
                            "name": "About",
                            "item": "https://darussalameduvillage.com/about"
                        }
                    ]
                }}
            />
            {/* Hero Section */}
            <section className="relative h-[40vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-500 pt-16 md:pt-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-tharqiya-cream dark:to-slate-950"></div>

                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                    >
                        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-7xl font-black text-tharqiya-deep dark:text-white mb-4 sm:mb-6 font-outfit tracking-tighter">
                            About <span className="text-gold-orange">Tharqiya</span>
                        </h1>
                        <p className="text-sm sm:text-lg md:text-2xl text-academic-muted max-w-2xl mx-auto font-medium leading-relaxed">
                            Nurturing excellence in Quranic memory and modern academic scholarship at Darussalam Edu Village.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Vice Chancellor's Message */}
            <section className="py-24 sm:py-32 relative overflow-hidden bg-white/50 dark:bg-slate-900/20 backdrop-blur-sm border-b border-white/20 dark:border-slate-800/50">
                {/* Highlight Glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-edu-teal/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-edu-coral/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col items-center">
                        {/* Content Side - Top */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="h-px w-10 bg-tharqiya-gold" />
                                <span className="text-tharqiya-gold font-black tracking-[0.3em] uppercase text-xs">Visions & Values</span>
                                <div className="h-px w-10 bg-tharqiya-gold" />
                            </div>

                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-tharqiya-deep dark:text-white mb-10 font-outfit leading-tight tracking-tighter">
                                A Message from the <br />
                                <span className="text-gold-orange">General Secretary</span>
                            </h2>

                            <motion.div 
                                whileHover={{ y: -8, scale: 1.01 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] border border-white dark:border-white/5 shadow-2xl relative group mb-12 text-left max-w-3xl mx-auto"
                            >
                                <MessageCircle className="absolute -top-6 -right-6 w-16 h-16 text-edu-teal/20 group-hover:rotate-12 transition-transform duration-500" />
                                <p className="text-lg sm:text-xl text-academic-muted leading-relaxed italic mb-8 relative z-10">
                                    "Our vision for Darussalam Edu Village is to provide a sanctuary where the sacred memory of the Quran meets the highest standards of modern academic scholarship. Every facility on this campus is designed to nurture the intellect and the soul equally."
                                </p>
                                
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-slate-950 overflow-hidden border-2 border-tharqiya-gold/30 shadow-lg shrink-0">
                                        <img src={viceChancellorImg} alt="AV Abdurahman Musliyar" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl sm:text-2xl font-black text-tharqiya-deep dark:text-slate-100 font-outfit uppercase tracking-tighter">
                                            AV Abdurahman Musliyar
                                        </h4>
                                        <p className="text-xs sm:text-sm font-black text-edu-teal uppercase tracking-widest mt-1">
                                            General Secretary, DIU
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <p className="text-academic-muted font-medium mb-12 max-w-2xl mx-auto">
                                Experience the serenity of our campus, our state-of-the-art library, and the creative spaces that define the Tharqiya experience through this special institutional feature.
                            </p>
                        </motion.div>

                        {/* Video Side - Bottom */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative w-full max-w-5xl mx-auto"
                        >
                            {/* Premium Video Frame with Hover */}
                            <motion.div 
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="relative group cursor-pointer"
                            >
                                <div className="absolute -inset-4 sm:-inset-6 bg-edu-teal/10 rounded-[2.5rem] blur-3xl group-hover:bg-edu-teal/20 transition-all duration-700" />
                                <div className="relative aspect-video rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border-4 sm:border-8 border-white dark:border-slate-800 bg-slate-900">
                                    <iframe 
                                        className="absolute inset-0 w-full h-full"
                                        src="https://www.youtube.com/embed/C3IeDIE3OT4" 
                                        title="General Secretary's Message & Campus Tour"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 md:py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px w-10 bg-tharqiya-orange dark:bg-tharqiya-gold" />
                                <span className="text-tharqiya-orange dark:text-tharqiya-gold font-black tracking-[0.3em] uppercase text-xs">Our Heritage</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-tharqiya-deep dark:text-slate-100 mb-6 md:mb-8 font-outfit leading-[1.1] tracking-tighter">
                                A Legacy of Faith & <span className="text-tharqiya-gold">Scholarly Brilliance</span>
                            </h2>
                            <div className="space-y-6 text-lg text-academic-muted leading-relaxed font-medium">
                                <p>
                                    Darussalam Tharqiyathul Huffaz is a flagship institution under the prestigious Darussalam Islamic University (DIU). Nestled in the serene Darussalam Edu Village, our campus provides a unique sanctuary where spiritual depth meets intellectual vigor.
                                </p>
                                <p>
                                    As Kerala's premier Post-Hifz destination, Tharqiya empowers Huffaz to pursue world-class education without compromising their sacred identity.
                                </p>
                                <p className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-l-4 border-tharqiya-orange dark:border-tharqiya-gold italic">
                                    "Our mission is to transform young Quranic scholars into ethical leaders of tomorrow, equipped with both traditional wisdom and modern degrees."
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] dark:shadow-[0_50px_100px_-20_rgba(0,0,0,0.6)] border-4 sm:border-[10px] border-tharqiya-cream dark:border-slate-900 group relative">
                                <img
                                    src={campusMonument}
                                    alt="Darussalam Campus Monument"
                                    className="w-full h-[400px] sm:h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-left-10 bg-tharqiya-orange dark:bg-tharqiya-gold p-6 sm:p-10 rounded-2xl sm:rounded-[2rem] shadow-2xl text-white dark:text-slate-950 animate-float">
                                <div className="text-3xl sm:text-5xl font-black mb-1 font-outfit tracking-tighter">10+</div>
                                <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">Years of Integration</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-10">
                        {[
                            {
                                icon: Target,
                                title: "Our Mission",
                                desc: "To empower Huffaz with a 10-year integrated curriculum that blends Quranic sciences with university-level academic excellence.",
                                color: "bg-tharqiya-orange",
                                tone: "text-tharqiya-orange",
                                gradient: "from-tharqiya-orange/5 to-transparent"
                            },
                            {
                                icon: Eye,
                                title: "Our Vision",
                                desc: "To be the global benchmark for modern Post-Hifz education, serving as a beacon of spiritually-anchored leadership.",
                                color: "bg-tharqiya-gold",
                                tone: "text-tharqiya-gold",
                                gradient: "from-tharqiya-gold/5 to-transparent"
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                whileHover={{ y: -15, transition: { duration: 0.4 } }}
                                className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 sm:p-14 rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-white/20 dark:border-slate-800/50 transition-all duration-500 overflow-hidden"
                            >
                                {/* Decorative Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                                
                                <div className="relative z-10">
                                    <motion.div 
                                        variants={scaleIn}
                                        className={`icon-placard ${item.color.includes('orange') ? 'icon-placard-sm' : 'icon-placard-sm'} !border-current/20 mb-8 sm:mb-12`}
                                    >
                                        <item.icon className="w-8 h-8 sm:w-12 sm:h-12" strokeWidth={1.5} />
                                    </motion.div>
                                    
                                    <h3 className="text-2xl sm:text-4xl font-black text-tharqiya-deep dark:text-slate-100 mb-4 sm:mb-8 font-outfit tracking-tighter leading-none">
                                        {item.title}
                                    </h3>
                                    
                                    <p className="text-base sm:text-xl text-academic-muted leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
                                    
                                    {/* Action Indicator */}
                                    <div className={`mt-8 sm:mt-12 h-1 w-12 sm:w-20 rounded-full ${item.color} transform origin-left scale-x-50 group-hover:scale-x-100 transition-transform duration-500`} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Features */}
            <section className="py-16 md:py-32 bg-tharqiya-cream dark:bg-slate-950 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12 sm:mb-20">
                        <span className="text-tharqiya-gold font-black tracking-widest uppercase text-xs">Unmatched Potential</span>
                        <h2 className="text-4xl md:text-6xl font-black text-tharqiya-deep dark:text-slate-100 font-outfit tracking-tighter mt-4">The Tharqiya Advantage</h2>
                        <div className="w-20 h-1 bg-tharqiya-orange dark:bg-tharqiya-gold mx-auto mt-6 rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Library, title: "Integrated Curriculum", desc: "Simultaneous pursuit of Al-Darimi Degree and Government-recognized Academic Degrees." },
                            { icon: UsersRound, title: "Expert Mentorship", desc: "Guidance from internationally trained scholars and experienced academic professors." },
                            { icon: Building2, title: "Residential Excellence", desc: "Fully residential programme with state-of-the-art boarding and discipline-focused life." },
                            { icon: Languages, title: "Language Proficiency", desc: "Intensive training in Arabic, English, and Malayalam to master communication." },
                            { icon: Trophy, title: "Prestigious Title", desc: "Graduation with the title 'Tharqawi Darimi', a mark of distinction in the scholarly world." },
                            { icon: Heart, title: "Spiritual Environment", desc: "Located in the serene Darussalam Edu Village, ideal for focused Quranic revision and study." }
                        ].map((feature, idx) => (
                             <motion.div
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                className="p-6 sm:p-10 rounded-[1.5rem] sm:rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-transparent hover:border-tharqiya-orange/20 dark:hover:border-tharqiya-gold/20 transition-all group"
                            >
                                <div className="icon-placard mb-4 sm:mb-8">
                                    <feature.icon className="w-7 h-7 sm:w-10 sm:h-10" strokeWidth={1.5} />
                                </div>
                                <h4 className="text-lg sm:text-2xl font-bold text-tharqiya-deep dark:text-slate-100 mb-2 sm:mb-4 font-outfit tracking-tight">{feature.title}</h4>
                                <p className="text-xs sm:text-base text-academic-muted leading-relaxed font-medium">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

             {/* CTA / Village Section */}
             {/* CTA / Village Section - Premium Academic Look */}
            <section className="py-24 sm:py-32 relative overflow-hidden bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Glassmorphic Village Card */}
                        <div className="relative p-10 sm:p-20 rounded-[3rem] sm:rounded-[4rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white dark:border-white/5 shadow-2xl overflow-hidden group text-center">
                            {/* Decorative Islamic Pattern Background */}
                            <div className="absolute inset-0 islamic-pattern opacity-[0.03] dark:opacity-[0.07] pointer-events-none" />
                            
                            {/* Animated Background Glow */}
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-edu-teal/10 rounded-full blur-[100px] animate-pulse" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-edu-coral/10 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />

                            <div className="relative z-10 space-y-10">
                                <div className="space-y-6">
                                    <h2 className="text-3xl sm:text-5xl md:text-7xl font-playfair font-black italic leading-[1.2] text-tharqiya-deep dark:text-white transition-colors duration-500 max-w-5xl mx-auto tracking-tight uppercase">
                                        Darussalam <span className="text-gold-orange font-outfit not-italic">Edu Village</span>
                                    </h2>
                                    <p className="text-sm sm:text-xl text-academic-muted max-w-3xl mx-auto font-bold uppercase tracking-[0.2em] leading-relaxed">
                                        Located in a tranquil sanctuary, Darussalam Edu Village allows students to escape urban static and focus entirely on their <span className="text-gold-orange">spiritual and academic evolution</span>.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn-primary"
                                    >
                                        Plan a Visit
                                    </motion.button>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-10 py-4 text-tharqiya-deep dark:text-white font-black tracking-widest border-2 border-tharqiya-deep/10 dark:border-white/10 rounded-full hover:bg-tharqiya-deep hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all duration-300"
                                    >
                                        Contact Us
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

export default AboutPage;
