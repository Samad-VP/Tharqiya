import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Laptop, Home as HomeIcon, Utensils, HeartPulse, Shield, Bus, Wind, Wifi, Monitor, School, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';

// Import images
import adminExt from '../assets/facilities/admin-block-ext-highres.jpg';
import adminInt from '../assets/facilities/admin-block-int-highres.jpg';
import academicExt from '../assets/facilities/academic-block-ext-highres.jpg';
import classroomInt from '../assets/facilities/classroom-int-highres.png';
import itLab from '../assets/facilities/it-lab-highres.jpg';
import avTheatre from '../assets/facilities/av-theatre-highres.png';
import library from '../assets/facilities/library.png';
import livingSpace from '../assets/facilities/living-space-highres.png';
import foodCourt from '../assets/facilities/food-court-highres.jpg';

const FacilityCard = ({ title, subtitle, description, features, image, reverse = false }: any) => (
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center mb-20 lg:mb-32`}>
        <motion.div 
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
        >
                <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-brand-cream dark:border-slate-800">
                    <img 
                        src={image} 
                        alt={title} 
                        className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110 brightness-[1.02] contrast-[1.02]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-40" />
                </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-1/2 space-y-6"
        >
            <div className="flex items-center gap-3">
                <div className="w-12 h-1 bg-edu-coral dark:bg-edu-teal rounded-full" />
                <span className="text-edu-coral dark:text-edu-teal font-black tracking-[0.2em] uppercase text-sm">
                    {subtitle}
                </span>
            </div>
            
            <h3 className="text-3xl md:text-5xl font-black text-brand-deep dark:text-white leading-tight">
                <span className="text-gold-orange">{title}</span>
            </h3>

            <p className="text-lg text-brand-deep/80 dark:text-slate-400 leading-relaxed font-medium">
                {description}
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-3 group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-edu-coral/10 dark:bg-edu-teal/10 flex items-center justify-center group-hover:bg-edu-coral dark:group-hover:bg-edu-teal transition-colors duration-300">
                            <CheckCircle2 className="w-4 h-4 text-edu-coral dark:text-edu-teal group-hover:text-white" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">{feature}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    </div>
);

const FacilitiesPage: React.FC = () => {
    const facilities = [
        {
            title: "Administration Block",
            subtitle: "The Nerve Center",
            description: "A state-of-the-art administrative hub designed for efficiency and professional excellence. Our admin block houses the core management operations and serves as the welcoming face of Darussalam Edu Village.",
            image: adminExt,
            features: [
                "Modern Reception Area",
                "Executive Conference Hall",
                "Head Offices",
                "Parent-Pupil Meeting Rooms",
                "Advanced Digital Filing",
                "Visitor Lounge"
            ]
        },
        {
            title: "Academic Block",
            subtitle: "Hub of Learning",
            description: "Surrounded by greenery, our academic block provides a serene and focused environment for higher Islamic learning. Designed with traditional aesthetics and modern functionality.",
            image: academicExt,
            reverse: true,
            features: [
                "Spacious Lecture Halls",
                "Dedicated Reading Rooms",
                "Staff Preparation Area",
                "Central Student Office",
                "Serene Environment",
                "Modern Architecture"
            ]
        },
        {
            title: "Smart Classrooms",
            subtitle: "Innovation in Education",
            description: "Our classrooms are a hub of innovation and comfort, providing students with state-of-the-art facilities for an enriched learning experience. Equipped with modern amenities and comfortable seating.",
            image: classroomInt,
            features: [
                "Multimedia Projectors",
                "Ergonomic Seating",
                "High-Speed Connectivity",
                "Interactive Boards",
                "Collaborative Layout",
                "Natural Ventilation"
            ]
        },
        {
            title: "Advanced IT Lab",
            subtitle: "Digital Excellence",
            description: "Housing 30 computers with advanced specifications tailored to the pedagogical requirements of our academic community. A crucible for the cultivation of computer literacy and AI acumen.",
            image: itLab,
            reverse: true,
            features: [
                "30 High-End Workstations",
                "Quranic Research Tools",
                "Islamic Propagation Tech",
                "AI Learning Resources",
                "Fiber-Optic Internet",
                "Digital Library Access"
            ]
        },
        {
            title: "Audio Visual Theatre",
            subtitle: "Creative Hub",
            description: "Step into our dynamic audiovisual theatre, where creativity and expression converge. Here, students record Quranic recitations, Islamic songs, and other programs, share impactful narratives with the world.",
            image: avTheatre,
            features: [
                "Quranic Recording Studio",
                "Islamic Multimedia Projects",
                "Social Media Engagement",
                "Documentary Production",
                "Amplify Student Voices",
                "Narrative Sharing"
            ]
        },
        {
            title: "Library & Creative Space",
            subtitle: "Enlightenment Hub",
            description: "Our library offers an extensive collection spanning over 100 categories. It serves as a vibrant hub for individuals seeking enlightenment, catering to diverse needs and nurturing a holistic environment.",
            image: library,
            reverse: true,
            features: [
                "100+ Asset Categories",
                "Quran Recitation Spaces",
                "Worship Activities",
                "Personal Growth",
                "Holistic Environment",
                "Peaceful Reflection"
            ]
        },
        {
            title: "Food Court",
            subtitle: "Culinary Haven",
            description: "Our food court is a culinary haven, offering a diverse array of delicious options in a clean and sociable atmosphere. At Darussalam Edu Village, satisfaction is always on the menu.",
            image: foodCourt,
            features: [
                "Diverse Cuisines",
                "Healthy Choices",
                "Prompt Service",
                "Sociable Atmosphere",
                "Clean Environment",
                "Friendly Staff"
            ]
        },
        {
            title: "Comfortable Living Space",
            subtitle: "Home Away From Home",
            description: "Our student housing system provides spacious accommodations with built-in cupboards and expansive windows offering picturesque outdoor views to create a revitalizing atmosphere.",
            image: livingSpace,
            reverse: true,
            features: [
                "Spacious Accommodations",
                "Built-in Cupboards",
                "Expansive Windows",
                "Bunk Bed System",
                "Picturesque Views",
                "Revitalizing Atmosphere"
            ]
        }
    ];

    return (
        <div className="bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
            <SEO 
                title="Premium Campus Facilities | Darussalam Edu Village Infrastructure" 
                description="Explore our world-class campus in Koyilandy, Kerala. Featuring residential huffaz blocks, advanced IT labs, smart classrooms, and a serenity environment for higher learning." 
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
                            "name": "Facilities",
                            "item": "https://darussalameduvillage.com/facilities"
                        }
                    ]
                }}
            />
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
                    >
                        <h1 className="text-4xl md:text-7xl font-black text-brand-deep dark:text-white mb-6 tracking-tighter uppercase">
                            Premium <span className="text-gold-orange">Campus</span> Facilities
                        </h1>
                        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                            Discover the world-class infrastructure of <span className="text-edu-coral dark:text-edu-teal font-bold">Darussalam Edu Village</span>, where tradition meets modern excellence.
                        </p>
                    </motion.div>

                    {/* Stats/Quick Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
                        {[
                            { icon: Building2, label: "Admin Blocks", value: "02" },
                            { icon: School, label: "Modern Rooms", value: "24+" },
                            { icon: Monitor, label: "IT Stations", value: "30" },
                            { icon: MapPin, label: "Campus Area", value: "20+ acres" },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card p-6 rounded-3xl text-center group hover:-translate-y-2 transition-transform duration-500"
                            >
                                <stat.icon className="w-8 h-8 mx-auto mb-4 text-edu-coral dark:text-edu-teal" />
                                <div className="text-3xl font-black text-brand-deep dark:text-white mb-1">{stat.value}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Facilities List */}
                    <div className="space-y-32">
                        {facilities.map((facility, idx) => (
                            <FacilityCard key={idx} {...facility} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Interior Preview Grid */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-brand-deep dark:text-white tracking-tighter">
                            Campus <span className="text-gold-orange">Gallery</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-edu-coral dark:bg-edu-teal mx-auto mt-4 rounded-full" />
                    </div>

                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                        <div className="w-20 h-20 rounded-full bg-edu-coral/10 dark:bg-edu-teal/10 flex items-center justify-center mb-6">
                            <Monitor className="w-10 h-10 text-edu-coral dark:text-edu-teal opacity-50" />
                        </div>
                        <p className="text-xl font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                            New Photos Coming Soon
                        </p>
                        <p className="text-sm text-slate-400 dark:text-slate-700 mt-2 font-medium">
                            Capturing more moments of excellence
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FacilitiesPage;
