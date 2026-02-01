import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './components/SEO';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LoginPage from './pages/LoginPage';
import StudentPortal from './pages/StudentPortal';
import AboutPage from './pages/AboutPage';
import PostHifzPage from './pages/PostHifzPage';
import AdmissionPage from './pages/AdmissionPage';
import Footer from './components/Footer';
import Leadership from './components/Leadership';
import WelcomeSection from './components/WelcomeSection';
import FacilitiesPage from './pages/Facilities';
import FacultyPage from './pages/FacultyPage';
import AlumniPage from './pages/AlumniPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminApplications from './pages/AdminApplications';
import AdminInterviews from './pages/AdminInterviews';
import AdminFaculty from './pages/AdminFaculty';
import AdminAlumni from './pages/AdminAlumni';
import AdminRoute from './components/AdminRoute';
import InterviewerRoute from './components/InterviewerRoute';
import InterviewerDashboard from './pages/InterviewerDashboard';
import AdminUsers from './pages/AdminUsers';
import SettingsPage from './pages/SettingsPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PrincipalRoute from './components/PrincipalRoute';
import PrincipalDashboard from './pages/PrincipalDashboard';
import AllotmentEngine from './pages/AllotmentEngine';
import AdminNotificationLogs from './pages/AdminNotificationLogs';
import StudentProfile from './pages/StudentProfile';
import InterviewerProfile from './pages/InterviewerProfile';
import StudentNotifications from './pages/StudentNotifications';
import AdminProfile from './pages/AdminProfile';
import StudentResources from './pages/StudentResources';
import StudentAllotment from './pages/StudentAllotment';
import StudentLayout from './components/StudentLayout';
import InterviewerEvaluation from './pages/InterviewerEvaluation';
import InterviewerInterviews from './pages/InterviewerInterviews';
import InterviewerEvaluations from './pages/InterviewerEvaluations';
import PerformanceInsights from './pages/PerformanceInsights';

import { UserPlus, PhoneCall, GraduationCap, FileCheck, ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation();
    
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    
    return null;
};

const Home: React.FC = () => {
    const steps = [
        { 
            icon: UserPlus, 
            step: '01', 
            title: 'Online Registration', 
            desc: 'Fill out the application form with required details.',
            color: 'from-blue-500/20 to-blue-600/20',
            iconColor: 'text-blue-500'
        },
        { 
            icon: PhoneCall, 
            step: '02', 
            title: 'Interview Call', 
            desc: 'Receive schedule for Hifz & Academic evaluation.',
            color: 'from-tharqiya-orange/20 to-tharqiya-orange/40',
            iconColor: 'text-tharqiya-orange'
        },
        { 
            icon: GraduationCap, 
            step: '03', 
            title: 'Evaluation', 
            desc: 'Face-to-face interview with our panel of scholars.',
            color: 'from-tharqiya-gold/20 to-tharqiya-gold/40',
            iconColor: 'text-tharqiya-gold'
        },
        { 
            icon: FileCheck, 
            step: '04', 
            title: 'Final Result', 
            desc: 'Check admission status and download enrollment PDF.',
            color: 'from-emerald-500/20 to-emerald-600/20',
            iconColor: 'text-emerald-500'
        },
    ];

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Darussalam Edu Village",
        "url": "https://darussalameduvillage.com",
        "logo": "https://darussalameduvillage.com/logo.png",
        "sameAs": [
            "https://www.facebook.com/darussalameduvillage",
            "https://www.instagram.com/darussalameduvillage",
            "https://www.youtube.com/@darussalameduvillage"
        ],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Valiyamala, Muchukunnu",
            "addressLocality": "Koyilandy",
            "addressRegion": "Kerala",
            "postalCode": "673307",
            "addressCountry": "IN"
        }
    };

    return (
        <div>
            <SEO 
                title="Tharqiya Course | Kerala's Premier Post-Hifz Educational Hub" 
                description="Welcome to Darussalam Edu Village - Home of the Tharqiya Course. Nurturing Quranic excellence and academic brilliance in a holistic environment. Apply now for 2026 admissions." 
                jsonLd={organizationSchema}
            />
            <Hero />
            <section className="py-12 sm:py-24 md:py-32 bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-full h-full bg-slate-50/50 dark:bg-slate-900/10 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12 md:mb-20"
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full bg-tharqiya-orange/10 dark:bg-tharqiya-gold/10 text-tharqiya-orange dark:text-tharqiya-gold text-[8px] sm:text-[10px] font-black tracking-widest uppercase mb-4 sm:mb-6">
                            Simplifying Success
                        </span>
                        <h2 className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 font-outfit tracking-tighter uppercase text-tharqiya-deep dark:text-white">
                            Admissions <span className="text-tharqiya-orange">Process</span>
                        </h2>
                        <div className="w-12 h-1.5 bg-tharqiya-gold mx-auto rounded-full" />
                    </motion.div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-20 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-[40%] left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-slate-200 dark:border-slate-800 -z-10" />

                        {steps.map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15, duration: 0.6 }}
                                className="group relative"
                            >
                                <div className="absolute -inset-2 bg-gradient-to-br from-tharqiya-orange/20 to-tharqiya-gold/20 rounded-[1.5rem] sm:rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="relative p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] bg-tharqiya-cream dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 hover:border-tharqiya-gold/30 transition-all duration-500 h-full flex flex-col items-center text-center">
                                    {/* Icon Container */}
                                    <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 sm:mb-8 relative group-hover:rotate-6 transition-transform duration-500`}>
                                        <item.icon className={`w-7 h-7 sm:w-10 sm:h-10 ${item.iconColor}`} />
                                        <span className="absolute -top-2 -right-2 sm:-top-3 -right-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-tharqiya-cream dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[10px] sm:text-xs font-black text-tharqiya-deep dark:text-white">
                                            {item.step}
                                        </span>
                                    </div>

                                    <h3 className="text-lg sm:text-xl font-black text-tharqiya-deep dark:text-white mb-2 sm:mb-4 font-outfit tracking-tight group-hover:text-tharqiya-orange dark:group-hover:text-tharqiya-gold transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <Link to="/admission" className="inline-block">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-8 sm:px-10 py-3.5 sm:py-4 bg-tharqiya-deep dark:bg-tharqiya-gold text-white dark:text-slate-950 rounded-full font-black text-sm sm:text-lg shadow-2xl transition-all tracking-widest uppercase overflow-hidden flex items-center justify-center"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Start Application <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-tharqiya-orange to-tharqiya-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                    </Link>
                </div>
            </section>
            <Leadership />
            <WelcomeSection />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <HelmetProvider>
            <ThemeProvider>
                <AuthProvider>
                    <Router>
                        <ScrollToTop />
                        <div className="min-h-screen bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-300">
                            <Routes>
                                <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
                                <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
                                <Route path="/programme" element={<><Navbar /><PostHifzPage /><Footer /></>} />
                                <Route path="/admission" element={<><Navbar /><AdmissionPage /><Footer /></>} />
                                <Route path="/facilities" element={<><Navbar /><FacilitiesPage /><Footer /></>} />
                                <Route path="/faculty" element={<><Navbar /><FacultyPage /><Footer /></>} />
                                <Route path="/alumni" element={<><Navbar /><AlumniPage /><Footer /></>} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/student/portal" element={<StudentLayout><StudentPortal /></StudentLayout>} />
                                <Route path="/student/profile" element={<StudentLayout><StudentProfile /></StudentLayout>} />
                                <Route path="/student/notifications" element={<StudentLayout><StudentNotifications /></StudentLayout>} />
                                <Route path="/student/resources" element={<StudentLayout><StudentResources /></StudentLayout>} />
                                <Route path="/student/allotment" element={<StudentLayout><StudentAllotment /></StudentLayout>} />
                                <Route path="/change-password" element={<ChangePasswordPage />} />
                                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                                {/* Admin Protected Routes */}
                                <Route element={<AdminRoute />}>
                                    <Route path="/admin" element={<AdminDashboard />} />
                                    <Route path="/admin/applications" element={<AdminApplications />} />
                                    <Route path="/admin/interviews" element={<AdminInterviews />} />
                                    <Route path="/admin/faculty" element={<AdminFaculty />} />
                                    <Route path="/admin/alumni" element={<AdminAlumni />} />
                                    <Route path="/admin/users" element={<AdminUsers />} />
                                    <Route path="/admin/notifications" element={<AdminNotificationLogs />} />
                                    <Route path="/admin/profile" element={<AdminProfile />} />
                                    <Route path="/admin/settings" element={<SettingsPage />} />
                                </Route>

                                {/* Interviewer Protected Routes */}
                                <Route element={<InterviewerRoute />}>
                                    <Route path="/interviewer" element={<InterviewerDashboard />} />
                                    <Route path="/interviewer/profile" element={<InterviewerProfile />} />
                                    <Route path="/interviewer/interviews" element={<InterviewerInterviews />} />
                                    <Route path="/interviewer/evaluations" element={<InterviewerEvaluations />} />
                                    <Route path="/interviewer/evaluate/:id" element={<InterviewerEvaluation />} />
                                    <Route path="/interviewer/settings" element={<SettingsPage />} />
                                </Route>

                                {/* Principal Protected Routes */}
                                <Route element={<PrincipalRoute />}>
                                    <Route path="/principal" element={<PrincipalDashboard />} />
                                    <Route path="/principal/allotments" element={<AllotmentEngine />} />
                                    <Route path="/principal/insights" element={<PerformanceInsights />} />
                                    <Route path="/principal/applications" element={<AdminApplications />} />
                                    <Route path="/principal/notifications" element={<AdminNotificationLogs />} />
                                    <Route path="/principal/users" element={<AdminUsers />} />
                                    <Route path="/principal/profile" element={<AdminProfile />} />
                                    <Route path="/principal/settings" element={<SettingsPage />} />
                                </Route>
                            </Routes>
                        </div>
                    </Router>
                </AuthProvider>
            </ThemeProvider>
        </HelmetProvider>
    );
}

export default App;
