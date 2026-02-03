import React from 'react';
import { motion } from 'framer-motion';
import chancellorImg from '../assets/leadership/chancellor_clean.png';
import proChancellorImg from '../assets/leadership/pro_chancellor_clean.png';
import viceChancellorImg from '../assets/leadership/vice_chancellor_clean.png';
import principalImg from '../assets/leadership/principal_clean.png';

interface Leader {
    role: string;
    nameEn: string;
    nameAr: string;
    image: string;
}

const leaders: Leader[] = [
    {
        role: "CHANCELLOR",
        nameEn: "SAYYID RASHEEDALI SHIHAB",
        nameAr: "السيد رشيد علي شهاب",
        image: chancellorImg
    },
    {
        role: "PRO. CHANCELLOR",
        nameEn: "MOOSAKKUTTY HAZRATH",
        nameAr: "الشيخ موسى كوتي حضرت",
        image: proChancellorImg
    },
    {
        role: "VICE. CHANCELLOR",
        nameEn: "AV ABDURAHMAN MUSLIYAR",
        nameAr: "الشيخ عبد الرحمن ااي في",
        image: viceChancellorImg
    },
    {
        role: "PRINCIPAL",
        nameEn: "HAFIZ SHAKEER HAITHAMI",
        nameAr: "الحافظ شكير بن محمد الهيتمي",
        image: principalImg
    }
];

const Leadership: React.FC = () => {
    return (
        <section className="py-12 sm:py-24 bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 sm:mb-20 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl lg:text-5xl font-black text-gold-orange font-outfit tracking-tighter mb-4">
                            Our Leadership
                        </h2>
                        <div className="w-16 sm:w-24 h-1.5 bg-tharqiya-orange dark:bg-tharqiya-gold mx-auto rounded-full" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-12">
                    {leaders.map((leader, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15, duration: 0.8 }}
                            className="flex flex-col items-center"
                        >
                            {/* Role Title */}
                            <span className="text-[8px] sm:text-[10px] md:text-xs font-black text-tharqiya-orange dark:text-tharqiya-gold tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-4 sm:mb-6 text-center">
                                {leader.role}
                            </span>

                            {/* Portrait Container */}
                            <div className="relative group mb-4 sm:mb-8 w-full max-w-[140px] sm:max-w-[220px] aspect-square overflow-hidden rounded-[2rem] sm:rounded-[4rem] shadow-2xl">
                                {/* Decorative Background to accentuate the capsule shape if needed, 
                                    but the image already has the colored capsule background. */}
                                <div className="absolute inset-0 transition-transform group-hover:scale-110 duration-700">
                                    <img 
                                        src={leader.image}
                                        alt={leader.nameEn}
                                        className="w-full h-full object-cover filter brightness-[1.05]"
                                    />
                                </div>
                            </div>

                            {/* Names */}
                            <div className="text-center space-y-1 mt-2">
                                <p className="text-sm sm:text-xl font-black text-tharqiya-gold font-outfit leading-none mb-1">
                                    {leader.nameAr}
                                </p>
                                <p className="text-[8px] sm:text-sm font-black text-tharqiya-orange/70 dark:text-tharqiya-gold/70 tracking-wider uppercase">
                                    {leader.nameEn}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Leadership;
