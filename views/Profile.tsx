import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { useNavigate } from '../lib/navigation';
import { User, ClipboardList, BookOpen, UserCheck, LogOut, ShieldCheck, GraduationCap, Calendar, Mail, Phone, Book, Terminal } from 'lucide-react';

const Profile: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('ignite_user');
        if (!storedUser) {
            navigate('/register');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchProfile(parsedUser.email);
    }, []);

    const fetchProfile = async (email: string) => {
        setLoading(true);
        try {
            const res = await api.getProfile(email);
            setData(res);
        } catch (err: any) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('ignite_admin_token');
        localStorage.removeItem('ignite_user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center font-mono-code text-sm text-gray-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping mr-2 inline-block" />
                    <span>Synchronizing Member Dossier...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 min-h-screen relative overflow-hidden">
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header Profile Card */}
                <div className="max-w-5xl mx-auto mb-10">
                    <div className="glass-card border-t-[1.5px] border-t-white/40 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-2xl">
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10 relative z-10">
                            <div className="relative group">
                                <div className="w-24 h-24 md:w-28 md:h-28 bg-[#0e1319] border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-xl">
                                    <User className="w-12 h-12 md:w-14 md:h-14 text-primary" />
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                                    <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
                                        {user?.name}
                                    </h1>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyber-green/10 border border-cyber-green/30 rounded-full text-xs font-mono-code text-cyber-green">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span>VERIFIED OPERATOR</span>
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs font-mono-code text-gray-400">
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <Mail className="w-3.5 h-3.5 text-primary" />
                                        <span className="truncate">{user?.email}</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <Phone className="w-3.5 h-3.5 text-primary" />
                                        <span>{data?.user?.phone || 'Not set'}</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <GraduationCap className="w-3.5 h-3.5 text-primary" />
                                        <span className="truncate">{data?.user?.college || 'Not set'}</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <Book className="w-3.5 h-3.5 text-primary" />
                                        <span>{data?.user?.branch || 'N/A'} • {data?.user?.batch || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="px-5 py-2.5 bg-white/5 hover:bg-cyber-red/15 border border-white/10 hover:border-cyber-red/30 text-gray-400 hover:text-cyber-red rounded-xl transition-all flex items-center gap-2 font-mono-code text-xs"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Telemetry Panels */}
                <div className="max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        {data && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                {/* Recruitment Info Card */}
                                <div className="glass-card border-t-[1.5px] border-t-white/35 p-6 rounded-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                            <UserCheck className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <span className="text-[10px] font-mono-code text-gray-500">// ADMISSION</span>
                                    </div>
                                    <h3 className="text-lg font-display font-bold text-white mb-4">Recruitment</h3>
                                    {data.recruitment ? (
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[10px] font-mono-code text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-mono-code font-bold ${
                                                    data.recruitment.status === 'accepted' ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/30' :
                                                    data.recruitment.status === 'rejected' ? 'bg-cyber-red/15 text-cyber-red border border-cyber-red/30' :
                                                    'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                                }`}>
                                                    {data.recruitment.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-mono-code text-gray-400 uppercase tracking-wider mb-1">Applied Guild</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {data.recruitment.interests?.map((i: string) => (
                                                        <span key={i} className="text-[10px] font-mono-code bg-white/5 px-2 py-0.5 rounded border border-white/5 text-gray-300">
                                                            {i}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs font-mono-code text-gray-500 italic">No recruitment submission found.</p>
                                    )}
                                </div>

                                {/* Registered Events Card */}
                                <div className="glass-card border-t-[1.5px] border-t-white/35 p-6 rounded-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                            <ClipboardList className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <span className="text-[10px] font-mono-code text-gray-500">// ARENA</span>
                                    </div>
                                    <h3 className="text-lg font-display font-bold text-white mb-4">Registered Events</h3>
                                    {data.events?.length > 0 ? (
                                        <div className="space-y-3">
                                            {data.events.map((reg: any) => (
                                                <div key={reg._id} className="border-b border-white/5 pb-2.5 last:border-0">
                                                    <p className="font-semibold text-xs text-white">{reg.eventId?.name}</p>
                                                    <p className="text-[10px] font-mono-code text-gray-500">
                                                        {new Date(reg.eventId?.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs font-mono-code text-gray-500 italic">No event registrations logged.</p>
                                    )}
                                </div>

                                {/* Exam Results Card */}
                                <div className="glass-card border-t-[1.5px] border-t-white/35 p-6 rounded-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2.5 bg-cyber-green/10 border border-cyber-green/20 rounded-xl">
                                            <BookOpen className="w-5 h-5 text-cyber-green" />
                                        </div>
                                        <span className="text-[10px] font-mono-code text-gray-500">// EVALUATION</span>
                                    </div>
                                    <h3 className="text-lg font-display font-bold text-white mb-4">Exam Results</h3>
                                    {data.exams?.length > 0 ? (
                                        <div className="space-y-3">
                                            {data.exams.map((exam: any) => (
                                                <div key={exam._id} className="border-b border-white/5 pb-2.5 last:border-0">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded ${
                                                            exam.status === 'submitted' || exam.status === 'auto-submitted' ? 'bg-cyber-green/15 text-cyber-green' : 'bg-amber-500/15 text-amber-400'
                                                        }`}>
                                                            {exam.status}
                                                        </span>
                                                        <span className="font-mono-code font-bold text-primary text-xs">
                                                            {exam.score}/{exam.totalQuestions}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] font-mono-code text-gray-500">
                                                        Attempted: {new Date(exam.startedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs font-mono-code text-gray-500 italic">No exam attempts found.</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Profile;
