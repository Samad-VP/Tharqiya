import React from 'react';
import { motion } from 'framer-motion';
import { Library, UsersRound, Languages, Trophy, Eye, Target, Sparkles, Building2, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-950 transition-colors duration-500">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.jdmagicbox.com/comp/kozhikode/t8/0495px495.x495.221103222315.n1t8/catalogue/darussalam-tharqiya-kozhikode-colleges-wf6j5gab23.jpg"
                    alt="Tharqiya College Campus"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-[2px]"></div>

                {/* Decorative Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-slate-950"></div>

                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-7xl font-black text-white mb-6 font-outfit tracking-tighter drop-shadow-2xl">
                            About <span className="text-tharqiya-gold">Tharqiya</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
                            Nurturing excellence in Quranic memory and modern academic scholarship at Muchukunnu Edu Village.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] islamic-pattern pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px w-10 bg-tharqiya-green dark:bg-tharqiya-gold" />
                                <span className="text-tharqiya-green dark:text-tharqiya-gold font-black tracking-[0.3em] uppercase text-xs">Our Heritage</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 md:mb-8 font-outfit leading-[1.1] tracking-tighter">
                                A Legacy of Faith & <span className="text-tharqiya-gold">Scholarly Brilliance</span>
                            </h2>
                            <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                <p>
                                    Darussalam Tharqiyathul Huffaz is a flagship institution under the prestigious **Jamia Darussalam Al-Islamiyya (Nandi)**. Nestled in the serene **Muchukunnu Edu Village**, our campus provides a unique sanctuary where spiritual depth meets intellectual vigor.
                                </p>
                                <p>
                                    As Kerala's premier Post-Hifz destination, Tharqiya empowers Huffaz to pursue world-class education without compromising their sacred identity.
                                </p>
                                <p className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-l-4 border-tharqiya-green dark:border-tharqiya-gold italic">
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
                            <div className="rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] dark:shadow-[0_50px_100px_-20_rgba(0,0,0,0.6)] border-4 sm:border-[10px] border-white dark:border-slate-900 group">
                                <img
                                    src="https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&q=80&w=1000"
                                    alt="Academic Excellence"
                                    className="w-full h-[400px] sm:h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-left-10 bg-tharqiya-green dark:bg-tharqiya-gold p-6 sm:p-10 rounded-2xl sm:rounded-[2rem] shadow-2xl text-white dark:text-slate-950 animate-float">
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
                                color: "bg-tharqiya-green",
                                tone: "text-tharqiya-green"
                            },
                            {
                                icon: Eye,
                                title: "Our Vision",
                                desc: "To be the global benchmark for modern Post-Hifz education, serving as a beacon of spiritually-anchored leadership.",
                                color: "bg-tharqiya-gold",
                                tone: "text-tharqiya-gold"
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -15 }}
                                className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl dark:shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-500"
                            >
                                <div className={`w-16 h-16 sm:w-20 sm:h-20 ${item.color}/10 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 ${item.tone}`}>
                                    <item.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 font-outfit tracking-tight">{item.title}</h3>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Features */}
            <section className="py-16 md:py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12 sm:mb-20">
                        <span className="text-tharqiya-gold font-black tracking-widest uppercase text-xs">Unmatched Potential</span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter mt-4">The Tharqiya Advantage</h2>
                        <div className="w-20 h-1 bg-tharqiya-green dark:bg-tharqiya-gold mx-auto mt-6 rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Library, title: "Integrated Curriculum", desc: "Simultaneous pursuit of Al-Darimi Degree and Government-recognized Academic Degrees." },
                            { icon: UsersRound, title: "Expert Mentorship", desc: "Guidance from internationally trained scholars and experienced academic professors." },
                            { icon: Building2, title: "Residential Excellence", desc: "Fully residential programme with state-of-the-art boarding and discipline-focused life." },
                            { icon: Languages, title: "Language Proficiency", desc: "Intensive training in Arabic, English, and Malayalam to master communication." },
                            { icon: Trophy, title: "Prestigious Title", desc: "Graduation with the title 'Tharqawi Darimi', a mark of distinction in the scholarly world." },
                            { icon: Heart, title: "Spiritual Environment", desc: "Located in the serene Muchukunnu village, ideal for focused Quranic revision and study." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                className="p-8 sm:p-10 rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-transparent hover:border-tharqiya-green/20 dark:hover:border-tharqiya-gold/20 transition-all group"
                            >
                                <div className="text-tharqiya-green dark:text-tharqiya-gold mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <feature.icon className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
                                </div>
                                <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 font-outfit tracking-tight">{feature.title}</h4>
                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA / Village Section */}
            <section className="py-24 md:py-32 bg-tharqiya-green dark:bg-islamic-deep relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 islamic-pattern" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <Sparkles className="w-12 h-12 text-tharqiya-gold mx-auto mb-8 animate-pulse" />
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 font-outfit tracking-tighter">Muchukunnu Edu Village</h2>
                        <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-12 font-medium">
                            Located in a tranquil sanctuary, Muchukunnu allows students to escape urban static and focus entirely on their spiritual and academic evolution.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-secondary px-12 py-5 text-xl font-black tracking-widest"
                        >
                            Plan a Visit
                        </motion.button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
