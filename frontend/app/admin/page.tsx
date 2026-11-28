'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, LogOut, Users, Calendar, FileText, Brain, Mail, Image as ImageIcon, ShieldCheck, MessageSquare, KeyRound, X, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { RecruitmentPanel } from '@/components/admin/RecruitmentPanel';
import { EventsPanel } from '@/components/admin/EventsPanel';
import { ExamPanel } from '@/components/admin/ExamPanel';
import { TeamPanel } from '@/components/admin/TeamPanel';
import { GalleryPanel } from '@/components/admin/GalleryPanel';
import { UsersPanel } from '@/components/admin/UsersPanel';
import { MailerPanel } from '@/components/admin/MailerPanel';
import { MessagesPanel } from '@/components/admin/MessagesPanel';

type Tab = 'recruitment' | 'events' | 'messages' | 'mailer' | 'exam' | 'team' | 'gallery' | 'users';
type StaffRole = 'owner' | 'admin' | 'moderator';

const STAFF_ROLES: StaffRole[] = ['owner', 'admin', 'moderator'];

const Admin: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<StaffRole>('moderator');
    const [userEmail, setUserEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('recruitment');

    // First-time invited user password creation & Owner recovery reset
    const [setupMode, setSetupMode] = useState(false);
    const [resetOwnerMode, setResetOwnerMode] = useState(false);
    const [inviteToken, setInviteToken] = useState('');
    const [setupEmail, setSetupEmail] = useState('');
    const [setupPassword, setSetupPassword] = useState('');
    const [setupConfirm, setSetupConfirm] = useState('');
    const [recoveryKey, setRecoveryKey] = useState('');

    // Logged-in Change Password modal
    const [showChangePass, setShowChangePass] = useState(false);
    const [cpCurrent, setCpCurrent] = useState('');
    const [cpNew, setCpNew] = useState('');
    const [cpConfirm, setCpConfirm] = useState('');
    const [cpLoading, setCpLoading] = useState(false);
    const [cpError, setCpError] = useState('');
    const [cpSuccess, setCpSuccess] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const inv = params.get('invite');
            const em = params.get('email');
            if (inv || em) {
                setInviteToken(inv || '');
                setSetupEmail(em || '');
                setSetupMode(true);
            }
        }

        const token = localStorage.getItem('ignite_admin_token');
        if (token) {
            api.verifyToken()
                .then((res: any) => {
                    const role = res?.role || res?.user?.role;
                    if (res?.valid && STAFF_ROLES.includes(role)) {
                        setIsLoggedIn(true);
                        setUserRole(role);
                        setUserEmail(res?.user?.email || '');
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
            const res = await api.login({ email: username.trim(), password: password.trim() });
            if (!STAFF_ROLES.includes(res?.role)) {
                setLoginError('Access restricted to Owner, Admin, and Moderator accounts.');
                setLoggingIn(false);
                return;
            }
            localStorage.setItem('ignite_admin_token', res.token);
            setUserRole(res.role);
            setUserEmail(res?.user?.email || '');
            setIsLoggedIn(true);
        } catch (err: any) {
            const msg = err?.message || 'Invalid credentials';
            if (msg.toLowerCase().includes('password not set')) {
                setSetupEmail(username.trim());
                setSetupMode(true);
            }
            setLoginError(msg);
        }
        setLoggingIn(false);
    };

    const handleSetupPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        if (setupPassword.length < 6) {
            setLoginError('Password must be at least 6 characters.');
            return;
        }
        if (setupPassword !== setupConfirm) {
            setLoginError('Passwords do not match.');
            return;
        }
        setLoggingIn(true);
        try {
            const res = await api.setupPassword({
                token: inviteToken || undefined,
                email: setupEmail.trim() || undefined,
                password: setupPassword,
            });
            localStorage.setItem('ignite_admin_token', res.token);
            setUserRole(res.role || 'moderator');
            setUserEmail(res?.user?.email || setupEmail);
            setIsLoggedIn(true);
            setSetupMode(false);
        } catch (err: any) {
            setLoginError(err?.message || 'Failed to set password.');
        } finally {
            setLoggingIn(false);
        }
    };

    const handleResetOwnerPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        if (setupPassword.length < 6) {
            setLoginError('New password must be at least 6 characters.');
            return;
        }
        if (setupPassword !== setupConfirm) {
            setLoginError('Passwords do not match.');
            return;
        }
        setLoggingIn(true);
        try {
            await api.resetOwnerPassword({
                email: setupEmail.trim(),
                recoveryPassword: recoveryKey,
                newPassword: setupPassword,
            });
            setResetOwnerMode(false);
            setUsername(setupEmail.trim());
            setPassword(setupPassword);
            setSetupPassword('');
            setSetupConfirm('');
            setRecoveryKey('');
        } catch (err: any) {
            setLoginError(err?.message || 'Failed to reset owner password.');
        } finally {
            setLoggingIn(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setCpError('');
        if (cpNew.length < 6) {
            setCpError('New password must be at least 6 characters.');
            return;
        }
        if (cpNew !== cpConfirm) {
            setCpError('New passwords do not match.');
            return;
        }
        setCpLoading(true);
        try {
            await api.changePassword({ currentPassword: cpCurrent, newPassword: cpNew });
            setCpSuccess(true);
            setCpCurrent('');
            setCpNew('');
            setCpConfirm('');
            setTimeout(() => {
                setCpSuccess(false);
                setShowChangePass(false);
            }, 1500);
        } catch (err: any) {
            setCpError(err?.message || 'Failed to update password.');
        } finally {
            setCpLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('ignite_admin_token');
        setIsLoggedIn(false);
        setUserRole('moderator');
        setUserEmail('');
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
                            {setupMode ? <KeyRound className="w-8 h-8 text-primary" /> : <Lock className="w-8 h-8 text-primary" />}
                        </div>
                        <span className="text-[10px] font-mono-code text-primary uppercase tracking-widest block mb-1">
                            // {setupMode ? 'INVITE ACTIVATION' : 'SECURE ACCESS GATEWAY'}
                        </span>
                        <h1 className="text-2xl font-display font-bold text-white">
                            {setupMode ? 'Create Your Password' : 'IGNITE Admin Panel'}
                        </h1>
                        <p className="text-xs text-gray-400 mt-1 font-mono-code">
                            {setupMode
                                ? 'Set a password for your invited email to access the console'
                                : 'Owner, Admin & Moderator clearance only'}
                        </p>
                    </div>

                    {setupMode ? (
                        <form onSubmit={handleSetupPassword} className="space-y-4">
                            <div>
                                <label className="text-xs font-mono-code text-gray-400 block mb-1">Invited Email</label>
                                <input
                                    type="email"
                                    value={setupEmail}
                                    onChange={e => setSetupEmail(e.target.value)}
                                    placeholder="you@bitmesra.ac.in"
                                    required={!inviteToken}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-mono-code transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-mono-code text-gray-400 block mb-1">Create Password *</label>
                                <input
                                    type="password"
                                    value={setupPassword}
                                    onChange={e => setSetupPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-mono-code transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-mono-code text-gray-400 block mb-1">Confirm Password *</label>
                                <input
                                    type="password"
                                    value={setupConfirm}
                                    onChange={e => setSetupConfirm(e.target.value)}
                                    placeholder="Repeat password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-mono-code transition-all"
                                />
                            </div>

                            {loginError && (
                                <p className="text-red-400 text-xs font-mono-code bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                                    {loginError}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loggingIn}
                                className="w-full btn-cyber-primary py-3.5 rounded-xl font-bold transition-all text-sm"
                            >
                                {loggingIn ? 'Activating...' : 'Save Password & Enter Console'}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setSetupMode(false); setLoginError(''); }}
                                className="w-full text-xs font-mono-code text-gray-400 hover:text-white py-2"
                            >
                                Back to Login
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="text-xs font-mono-code text-gray-400 block mb-1">Email / Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="you@bitmesra.ac.in"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-mono-code transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-mono-code text-gray-400 block mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-mono-code transition-all"
                                />
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

                            <button
                                type="button"
                                onClick={() => { setSetupMode(true); setLoginError(''); }}
                                className="w-full text-xs font-mono-code text-primary hover:underline py-1"
                            >
                                Invited by Admin? Create your password
                            </button>
                            <button
                                type="button"
                                onClick={() => { setResetOwnerMode(true); setLoginError(''); }}
                                className="w-full text-xs font-mono-code text-gray-400 hover:text-white py-1"
                            >
                                Reset Owner Password (.env recovery)
                            </button>
                        </form>
                    )}

                    {resetOwnerMode && (
                        <form onSubmit={handleResetOwnerPassword} className="space-y-4 mt-4 pt-4 border-t border-white/10">
                            <div>
                                <label className="text-xs font-mono-code text-gray-400 block mb-1">Owner Email</label>
                                <input
                                    type="text"
                                    value={setupEmail}
                                    onChange={e => setSetupEmail(e.target.value)}
                                    placeholder="owner@igniteclub.tech"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-mono-code"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-mono-code text-gray-400 block mb-1">.env OWNER_PASSWORD</label>
                                <input
                                    type="password"
                                    value={recoveryKey}
                                    onChange={e => setRecoveryKey(e.target.value)}
                                    placeholder="Recovery password from .env"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-mono-code"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-mono-code text-gray-400 block mb-1">New Password *</label>
                                <input
                                    type="password"
                                    value={setupPassword}
                                    onChange={e => setSetupPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-mono-code"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-mono-code text-gray-400 block mb-1">Confirm New Password *</label>
                                <input
                                    type="password"
                                    value={setupConfirm}
                                    onChange={e => setSetupConfirm(e.target.value)}
                                    placeholder="Repeat new password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-mono-code"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loggingIn}
                                className="w-full btn-cyber-primary py-3 rounded-xl font-bold text-sm"
                            >
                                {loggingIn ? 'Updating DB...' : 'Reset Owner Password in DB'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setResetOwnerMode(false); setLoginError(''); }}
                                className="w-full text-xs font-mono-code text-gray-400 hover:text-white py-1"
                            >
                                Cancel
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        );
    }

    const canManageUsers = userRole === 'owner' || userRole === 'admin';

    const tabs: { id: Tab; label: string; icon: React.ReactNode; visible: boolean }[] = [
        { id: 'recruitment', label: 'Recruitment', icon: <FileText className="w-4 h-4" />, visible: true },
        { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" />, visible: true },
        { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" />, visible: true },
        { id: 'mailer', label: 'Resend Mailer', icon: <Mail className="w-4 h-4" />, visible: true },
        { id: 'exam', label: 'Exam', icon: <Brain className="w-4 h-4" />, visible: true },
        { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" />, visible: true },
        { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" />, visible: true },
        { id: 'users', label: 'Users', icon: <ShieldCheck className="w-4 h-4" />, visible: canManageUsers },
    ];

    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <div>
                        <span className="text-[10px] font-mono-code text-primary uppercase tracking-widest block mb-1">
                            // COMMAND CONSOLE · {userRole.toUpperCase()} {userEmail ? `(${userEmail})` : ''}
                        </span>
                        <h1 className="text-3xl font-display font-bold text-white">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => { setShowChangePass(true); setCpError(''); setCpSuccess(false); }}
                            className="flex items-center gap-2 text-xs font-mono-code px-3.5 py-2 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <KeyRound className="w-3.5 h-3.5 text-primary" /> Change Password
                        </button>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 text-xs font-mono-code px-3.5 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5" /> Logout
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1.5 mb-8 bg-white/[0.02] p-1.5 rounded-2xl border border-white/5 overflow-x-auto">
                    {tabs.filter(t => t.visible).map(tab => (
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
                        {activeTab === 'messages' && <MessagesPanel />}
                        {activeTab === 'mailer' && <MailerPanel />}
                        {activeTab === 'exam' && <ExamPanel />}
                        {activeTab === 'team' && <TeamPanel />}
                        {activeTab === 'gallery' && <GalleryPanel />}
                        {activeTab === 'users' && canManageUsers && <UsersPanel currentRole={userRole} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Change Password Modal (Direct DB update, no email) */}
            <AnimatePresence>
                {showChangePass && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.2 } }}
                        exit={{ opacity: 0, transition: { duration: 0.16 } }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
                            exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.15 } }}
                            className="glass-card bg-[#0e1319]/95 border-t-[1.5px] border-t-white/40 rounded-2xl p-6 md:p-8 max-w-md w-full relative shadow-2xl"
                        >
                            <button
                                type="button"
                                onClick={() => setShowChangePass(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-xl font-display font-bold text-white mb-1">Change Password</h3>
                            <p className="text-xs font-mono-code text-gray-400 mb-5">
                                Updates your password directly in PostgreSQL (no email sent).
                            </p>

                            {cpSuccess ? (
                                <div className="py-8 text-center space-y-3">
                                    <div className="w-14 h-14 bg-cyber-green/10 border border-cyber-green/30 rounded-full flex items-center justify-center mx-auto animate-success-pulse">
                                        <CheckCircle2 className="w-7 h-7 text-cyber-green" />
                                    </div>
                                    <p className="text-sm font-mono-code text-cyber-green font-bold">Password updated in DB!</p>
                                </div>
                            ) : (
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-mono-code text-gray-400 block mb-1">Current Password *</label>
                                        <input
                                            type="password"
                                            required
                                            value={cpCurrent}
                                            onChange={e => setCpCurrent(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-mono-code text-gray-400 block mb-1">New Password *</label>
                                        <input
                                            type="password"
                                            required
                                            value={cpNew}
                                            onChange={e => setCpNew(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-mono-code text-gray-400 block mb-1">Confirm New Password *</label>
                                        <input
                                            type="password"
                                            required
                                            value={cpConfirm}
                                            onChange={e => setCpConfirm(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary"
                                        />
                                    </div>
                                    {cpError && (
                                        <p className="text-xs font-mono-code text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                                            {cpError}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={cpLoading}
                                        className="w-full btn-cyber-primary py-3 rounded-xl font-bold text-sm"
                                    >
                                        {cpLoading ? 'Saving...' : 'Update Password'}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Admin;
