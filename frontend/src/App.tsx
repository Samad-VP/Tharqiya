import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LoginPage from './pages/LoginPage';
import StudentPortal from './pages/StudentPortal';
import AboutPage from './pages/AboutPage';
import PostHifzPage from './pages/PostHifzPage';
import AdmissionPage from './pages/AdmissionPage';
import Footer from './components/Footer';

const Home: React.FC = () => (
    <div className="islamic-pattern">
        <Hero />
        <section className="py-24 bg-white dark:bg-slate-900/50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-playfair italic">Admissions Process</h2>
                <div className="w-24 h-1 bg-tharqiya-gold mx-auto mb-16 rounded-full" />
                <div className="grid md:grid-cols-4 gap-8 mb-16">
                    {[
                        { step: '01', title: 'Online Registration', desc: 'Fill out the application form with required details.' },
                        { step: '02', title: 'Interview Call', desc: 'Receive schedule for Hifz & Academic evaluation.' },
                        { step: '03', title: 'Evaluation', desc: 'Face-to-face interview with our panel.' },
                        { step: '04', title: 'Final Result', desc: 'Check admission status and download enrollment PDF.' },
                    ].map((item, idx) => (
                        <div key={idx} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 hover:border-tharqiya-green dark:hover:border-tharqiya-gold transition-all group hover:shadow-2xl hover:-translate-y-2">
                            <span className="text-5xl font-black text-tharqiya-green/10 dark:text-tharqiya-gold/10 group-hover:text-tharqiya-green/20 dark:group-hover:text-tharqiya-gold/20 transition-colors block mb-4 font-outfit">{item.step}</span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <Link to="/admission">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="btn-primary"
                    >
                        Start Your Application
                    </motion.button>
                </Link>
            </div>
        </section>
    </div>
);

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
                        <Routes>
                            <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
                            <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
                            <Route path="/programme" element={<><Navbar /><PostHifzPage /><Footer /></>} />
                            <Route path="/admission" element={<><Navbar /><AdmissionPage /><Footer /></>} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/portal" element={<><Navbar /><StudentPortal /><Footer /></>} />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
