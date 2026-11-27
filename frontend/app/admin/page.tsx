'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, LogOut, Users, Calendar, FileText, Brain, Mail, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { RecruitmentPanel } from '@/components/admin/RecruitmentPanel';
import { EventsPanel } from '@/components/admin/EventsPanel';
import { ExamPanel } from '@/components/admin/ExamPanel';
import { TeamPanel } from '@/components/admin/TeamPanel';
import { GalleryPanel } from '@/components/admin/GalleryPanel';
import { UsersPanel } from '@/components/admin/UsersPanel';
import { MailerPanel } from '@/components/admin/MailerPanel';

type Tab = 'recruitment' | 'events' | 'mailer' | 'exam' | 'team' | 'gallery' | 'users';

const Admin: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin');
    const [loginError, setLoginError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('recruitment');

    // Check existing token
    useEffect(() => {
        const token = localStorage.getItem('ignite_admin_token');
        if (token) {
            api.verifyToken()
                .then((res: any) => {
                    if (res?.role === 'admin' || res?.valid) {
                        setIsLoggedIn(true);
                    } else {
                        localStorage.removeItem('ignite_admin_token');
                    }
                })
                .catch(() => localStorage.removeItem('ignite_admin_token'));
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoggingIn(true);
        setLoginError('');
        try {
            const { token } = await api.login({ email: username.trim(), password: password.trim() });
            localStorage.setItem('ignite_admin_token', token);
            setIsLoggedIn(true);
        } catch (err: any) {
            setLoginError(err?.message || 'Invalid credentials. Default: admin / admin');
        }
        setLoggingIn(false);
    };

    const logout = () => {
        localStorage.removeItem('ignite_admin_token');
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full mx-auto p-8 glass-card border-t-[1.5px] border-t-white/40 rounded-3xl shadow-2xl"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                        <span className="text-[10px] font-mono-code text-primary uppercase tracking-widest block mb-1">
                            // SECURE ACCESS GATEWAY
                        </span>
                        <h1 className="text-2xl font-display font-bold text-white">IGNITE Admin Panel</h1>
                        <p className="text-xs text-gray-400 mt-1 font-mono-code">
                            Authorized personnel & board clearance only
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-xs font-mono-code text-gray-400 block mb-1">Admin Username / Email</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="admin"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-mono-code transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-mono-code text-gray-400 block mb-1">Admin Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="admin"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-mono-code transition-all"
                            />
                        </div>

                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-2 text-xs text-primary font-mono-code">
                            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                            <span>Default Access: <strong>admin</strong> / <strong>admin</strong></span>
                        </div>

                        {loginError && (
                            <p className="text-red-400 text-xs font-mono-code bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                                {loginError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loggingIn}
                            className="w-full btn-cyber-primary py-3.5 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2"
                        >
                            {loggingIn ? 'Authenticating...' : 'Authenticate Clearance'}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'recruitment', label: 'Recruitment', icon: <FileText className="w-4 h-4" /> },
        { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
        { id: 'mailer', label: 'Resend Mailer', icon: <Mail className="w-4 h-4" /> },
        { id: 'exam', label: 'Exam', icon: <Brain className="w-4 h-4" /> },
        { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
        { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
        { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <span className="text-[10px] font-mono-code text-primary uppercase tracking-widest block mb-1">
                            // COMMAND CONSOLE
                        </span>
                        <h1 className="text-3xl font-display font-bold text-white">Admin Dashboard</h1>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-xs font-mono-code px-3.5 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1.5 mb-8 bg-white/[0.02] p-1.5 rounded-2xl border border-white/5 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono-code transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-primary text-black font-bold shadow-[0_0_15px_rgba(255,140,90,0.4)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        {activeTab === 'recruitment' && <RecruitmentPanel />}
                        {activeTab === 'events' && <EventsPanel />}
                        {activeTab === 'mailer' && <MailerPanel />}
                        {activeTab === 'exam' && <ExamPanel />}
                        {activeTab === 'team' && <TeamPanel />}
                        {activeTab === 'gallery' && <GalleryPanel />}
                        {activeTab === 'users' && <UsersPanel />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Admin;
