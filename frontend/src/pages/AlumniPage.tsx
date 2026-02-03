import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Globe, Award, Quote, Search, Filter, ExternalLink, Star, Loader2, MapPin, School, Building2, Users } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from '../utils/animations';
import SEO from '../components/SEO';
import api from '../api/axiosInstance';

const AlumniPage: React.FC = () => {
    const [alumnis, setAlumnis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlumnis = async () => {
            try {
                const response = await api.get('/alumni');
                setAlumnis(response.data.data || []);
            } catch (error) {
                console.error('Error fetching alumni:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlumnis();
    }, []);

    const stats = [
        { label: "Total Graduates", value: "50+", icon: GraduationCap },
        { label: "Global Presence", value: "5+ Countries", icon: Globe },
        { label: "Higher Pursuits", value: "85%", icon: Award },
        { label: "In Leadership Roles", value: "30+", icon: Briefcase }
    ];

    return (
        <div className="bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-500 min-h-screen">
            <SEO 
                title="Global Alumni Network | Tharqiya Success Stories" 
                description="Explore the global impact of Tharqiyathul Huffaz graduates. Our alumni are ethical leaders, renowned scholars, and successful professionals in over 5 countries." 
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
                            "name": "Alumni",
                            "item": "https://darussalameduvillage.com/alumni"
                        }
                    ]
                }}
            />
            {/* Hero Section */}
            <section className="relative pt-24 pb-12 sm:pt-48 sm:pb-32 bg-tharqiya-cream/50 dark:bg-slate-950 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full bg-edu-coral/10 text-edu-coral text-[10px] sm:text-xs font-black tracking-widest uppercase mb-6 border border-edu-coral/20">
                            Our Global Impact
                        </span>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-tharqiya-deep dark:text-white font-outfit mb-6 tracking-tighter uppercase leading-none">
                            Tharqiya <span className="text-gold-orange">Alumni</span>
                        </h1>
                        <p className="text-sm sm:text-lg md:text-xl text-academic-muted max-w-3xl mx-auto leading-relaxed font-bold uppercase tracking-tight">
                            A global network of scholars, leaders, and professionals bridging sacred tradition with modern innovation.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 -mt-10 sm:-mt-20 relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                className="bg-white/80 dark:bg-slate-900 border border-white/50 dark:border-white/10 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl backdrop-blur-xl text-center hover:scale-105 transition-transform"
                            >
                                <div className="icon-placard mx-auto mb-4 sm:mb-6">
                                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                                <h3 className="text-xl sm:text-3xl font-black text-tharqiya-deep dark:text-slate-100 font-outfit mb-1 leading-none">
                                    {stat.value}
                                </h3>
                                <p className="text-[10px] sm:text-xs font-black text-professional-muted dark:text-slate-400 uppercase tracking-widest">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section className="py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-6xl font-black text-tharqiya-deep dark:text-slate-100 font-outfit tracking-tighter uppercase mb-6 leading-none">
                            Scholarly <span className="text-edu-teal">&</span> Professional <span className="text-edu-coral">Success</span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-12 h-12 text-edu-coral animate-spin" />
                            <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Loading Registry...</p>
                        </div>
                    ) : alumnis.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {alumnis.map((alumni, idx) => (
                                <motion.div
                                    key={alumni.id}
                                    variants={fadeInUp}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                    className="relative group p-8 rounded-[3rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white dark:border-white/5 shadow-2xl overflow-hidden flex flex-col h-full hover:scale-[1.02] transition-all"
                                >
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 dark:bg-slate-950 border-2 border-white dark:border-slate-800 shadow-xl overflow-hidden shrink-0 group-hover:rotate-3 transition-transform duration-500">
                                            {alumni.photoUrl ? (
                                                <img src={alumni.photoUrl} alt={alumni.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-2xl font-black text-slate-200">{alumni.name?.[0]}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-tharqiya-deep dark:text-slate-100 font-outfit uppercase tracking-tighter leading-tight">
                                                {alumni.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-slate-500 mt-1">
                                                <MapPin size={10} className="text-edu-teal" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{alumni.place}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-grow space-y-4">
                                        <div className="inline-block px-3 py-1 bg-tharqiya-deep text-white rounded-lg text-[10px] font-black uppercase tracking-widest leading-none mb-2">
                                            {alumni.status === 'WORKING' ? 'Professional' : 'Scholarly'}
                                        </div>

                                        {alumni.status === 'WORKING' ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <Briefcase size={14} className="text-edu-teal" />
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{alumni.position}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Building2 size={14} className="text-edu-coral" />
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{alumni.organization}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <School size={14} className="text-edu-teal" />
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{alumni.institution}</p>
                                                </div>
                                                {alumni.university && (
                                                    <div className="flex items-center gap-3">
                                                        <GraduationCap size={14} className="text-edu-coral" />
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{alumni.university}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Quote size={40} className="rotate-180" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-black text-tharqiya-deep dark:text-slate-100 font-outfit uppercase tracking-[0.2em]">Tracing Impact...</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4">Registry will be available soon.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Alumni CTA - Premium Academic Section */}
            <section className="py-24 sm:py-32 relative overflow-hidden bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Glassmorphic CTA Card */}
                        <div className="relative p-10 sm:p-20 rounded-[3rem] sm:rounded-[4rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white dark:border-white/5 shadow-2xl overflow-hidden group">
                            {/* Decorative Islamic Pattern Background */}
                            <div className="absolute inset-0 islamic-pattern opacity-[0.03] dark:opacity-[0.07] pointer-events-none" />
                            
                            {/* Animated Background Glow */}
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-edu-teal/10 rounded-full blur-[100px] animate-pulse" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-edu-coral/10 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />

                            <div className="relative z-10 text-center space-y-8">
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-edu-teal/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <div className="icon-placard mx-auto relative z-10 group-hover:rotate-6">
                                        <Users className="w-8 h-8 sm:w-10 sm:h-10 text-edu-teal" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-black text-tharqiya-deep dark:text-white transition-colors duration-500 max-w-4xl mx-auto leading-tight uppercase tracking-tighter">
                                        Are you a <span className="text-gold-orange font-outfit">Tharqiya Alumnus?</span>
                                    </h2>
                                    <p className="text-sm sm:text-lg text-academic-muted max-w-2xl mx-auto font-bold uppercase tracking-widest leading-relaxed">
                                        Join our <span className="text-gold-orange">Global Network</span> to stay connected, mentor junior scholars, and access exclusive professional opportunities.
                                    </p>
                                </div>

                                <div className="pt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn-primary"
                                    >
                                        Join the Network
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

export default AlumniPage;
