import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface Leader {
    role: string;
    nameEn: string;
    nameAr: string;
    bgColor: string;
}

const leaders: Leader[] = [
    {
        role: "CHANCELLOR",
        nameEn: "SAYYID RASHEEDALI SHIHAB",
        nameAr: "السيد رشيد علي شهاب",
        bgColor: "bg-tharqiya-orange/10"
    },
    {
        role: "PRO. CHANCELLOR",
        nameEn: "MOOSAKKUTTY HAZRATH",
        nameAr: "الشيخ موسى كوتي حضرت",
        bgColor: "bg-tharqiya-gold/10"
    },
    {
        role: "VICE. CHANCELLOR",
        nameEn: "AV ABDURAHMAN MUSLIYAR",
        nameAr: "الشيخ عبد الرحمن ااي في",
        bgColor: "bg-tharqiya-orange/10"
    },
    {
        role: "PRINCIPAL",
        nameEn: "HAFIZ SHAKEER HAITHAMI",
        nameAr: "الحافظ شكير بن محمد الهيتمي",
        bgColor: "bg-tharqiya-gold/10"
    }
];

const Leadership: React.FC = () => {
    return (
        <section className="py-24 bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-gold-orange font-outfit tracking-tighter mb-4">
                            Our Leadership
                        </h2>
                        <div className="w-24 h-1.5 bg-tharqiya-orange dark:bg-tharqiya-gold mx-auto rounded-full" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
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
                            <span className="text-[10px] md:text-xs font-black text-tharqiya-orange dark:text-tharqiya-gold tracking-[0.3em] uppercase mb-6">
                                {leader.role}
                            </span>

                            {/* Portrait Container */}
                            <div className="relative group mb-6 md:mb-8 w-full max-w-[200px] sm:max-w-[240px] aspect-[4/5]">
                                
                                {/* Main Placeholder Container */}
                                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900/50 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform group-hover:-translate-y-2 group-hover:-translate-x-1 duration-500 border-2 sm:border-4 border-white dark:border-slate-800 flex items-center justify-center">
                                    <User className="w-16 h-16 sm:w-24 sm:h-24 text-slate-300 dark:text-slate-700" />
                                </div>
                            </div>

                            {/* Names */}
                            <div className="text-center space-y-1">
                                <p className="text-xl font-black text-tharqiya-gold font-outfit leading-none mb-1">
                                    {leader.nameAr}
                                </p>
                                <p className="text-xs md:text-sm font-black text-tharqiya-orange/70 dark:text-tharqiya-gold/70 tracking-wider uppercase">
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
