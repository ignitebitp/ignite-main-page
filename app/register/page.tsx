'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, GraduationCap, BookOpen, Calendar, ArrowRight, ShieldCheck, Timer, CheckCircle2, ClipboardList, Terminal } from 'lucide-react';
import { api } from '@/lib/api';
import { useNavigate, Link } from '@/lib/navigation';

export default function Register() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        college: '',
        branch: '',
        batch: ''
    });
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            setStep(2);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.verifyOTP({ email: formData.email, otp });
            localStorage.setItem('ignite_admin_token', res.token);
            localStorage.setItem('ignite_user', JSON.stringify(res.user));
            setStep(3);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.completeProfile({
                phone: formData.phone,
                college: formData.college,
                branch: formData.branch,
                batch: formData.batch
            });
            localStorage.setItem('ignite_user', JSON.stringify(res.user));
            setStep(4);
            setTimeout(() => navigate('/profile'), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-32 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl glass-card border-t-[1.5px] border-t-white/40 p-8 md:p-10 rounded-3xl relative z-10 shadow-2xl"
            >
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-code text-primary mb-4">
                                    <Terminal className="w-3.5 h-3.5" />
                                    <span>ACCOUNT PROVISIONING</span>
                                </div>
                                <h1 className="text-3xl font-display font-bold text-white mb-2">
                                    Join IGNITE.{' '}
                                    <span className="font-editorial text-primary font-normal block sm:inline">
                                        The Tech Society.
                                    </span>
                                </h1>
                                <p className="text-gray-400 text-xs font-mono-code">
                                    Create your identity token to streamline event & hackathon registrations
                                </p>
                            </div>

                            {error && (
                                <div className="bg-cyber-red/10 border border-cyber-red/20 text-cyber-red p-3 rounded-xl text-xs mb-6 text-center font-mono-code">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono-code uppercase tracking-wider text-gray-400 px-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text" required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm outline-none focus:border-primary transition-all"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono-code uppercase tracking-wider text-gray-400 px-1">Institutional Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="email" required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm outline-none focus:border-primary transition-all"
                                            placeholder="jane@bitmesra.ac.in"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono-code uppercase tracking-wider text-gray-400 px-1">Passphrase</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="password" required
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm outline-none focus:border-primary transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit" disabled={loading}
                                    className="w-full btn-cyber-primary py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
                                >
                                    {loading ? 'Processing Credentials...' : (
                                        <>
                                            <span>Continue to Verification</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-gray-400 text-xs font-mono-code mt-5">
                                    Already have credentials? <Link to="/login" className="text-primary hover:underline">Log in</Link>
                                </p>
                            </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="py-6 text-center"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 text-primary">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <span className="text-[10px] font-mono-code text-primary uppercase tracking-widest block mb-1">
                                // OTP CHALLENGE
                            </span>
                            <h2 className="text-2xl font-display font-bold text-white mb-2">Verify Your Email</h2>
                            <p className="text-gray-400 text-xs font-mono-code mb-8">
                                One-time verification token dispatched to <span className="text-white font-bold">{formData.email}</span>
                            </p>

                            {error && (
                                <div className="bg-cyber-red/10 border border-cyber-red/20 text-cyber-red p-3 rounded-lg text-xs mb-6 inline-block font-mono-code text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleVerify} className="max-w-xs mx-auto text-left">
                                <div className="relative group mb-6">
                                    <Timer className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text" required maxLength={6}
                                        value={otp}
                                        onChange={e => setOtp(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 text-center text-2xl font-mono-code font-bold text-white outline-none focus:border-primary tracking-[0.4em] pl-6"
                                        placeholder="000000"
                                    />
                                </div>

                                <button
                                    type="submit" disabled={loading}
                                    className="w-full btn-cyber-primary py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? 'Verifying Token...' : 'Verify Token'}
                                </button>

                                <p className="text-gray-400 text-[11px] font-mono-code mt-5 text-center">
                                    Didn't receive token? <button type="button" onClick={handleRegister} className="text-primary hover:underline">Resend</button>
                                </p>
                            </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="text-center mb-8">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary">
                                    <ClipboardList className="w-7 h-7" />
                                </div>
                                <span className="text-[10px] font-mono-code text-primary uppercase tracking-widest block mb-1">
                                    // PROFILE SYNC
                                </span>
                                <h2 className="text-2xl font-display font-bold text-white mb-1">Complete Your Dossier</h2>
                                <p className="text-gray-400 text-xs font-mono-code">Fill in academic telemetry to complete member record</p>
                            </div>

                            {error && (
                                <div className="bg-cyber-red/10 border border-cyber-red/20 text-cyber-red p-3 rounded-xl text-xs mb-6 text-center font-mono-code">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleCompleteProfile} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono-code uppercase tracking-wider text-gray-400 px-1">Phone Number</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="tel" required
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm outline-none focus:border-primary transition-all"
                                            placeholder="+91 00000 00000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono-code uppercase tracking-wider text-gray-400 px-1">Institution / Campus</label>
                                    <div className="relative group">
                                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text" required
                                            value={formData.college}
                                            onChange={e => setFormData({ ...formData, college: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm outline-none focus:border-primary transition-all"
                                            placeholder="BIT Mesra"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-mono-code uppercase tracking-wider text-gray-400 px-1">Branch</label>
                                        <div className="relative group">
                                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text" required
                                                value={formData.branch}
                                                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm outline-none focus:border-primary transition-all"
                                                placeholder="Computer Science"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-mono-code uppercase tracking-wider text-gray-400 px-1">Batch / Cohort</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text" required
                                                value={formData.batch}
                                                onChange={e => setFormData({ ...formData, batch: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm outline-none focus:border-primary transition-all"
                                                placeholder="2022-26"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit" disabled={loading}
                                    className="w-full btn-cyber-primary py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
                                >
                                    {loading ? 'Saving Profile...' : (
                                        <>
                                            <span>Save & Launch Dashboard</span>
                                            <CheckCircle2 className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-16 text-center"
                        >
                            <div className="w-20 h-20 bg-cyber-green/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyber-green/30">
                                <CheckCircle2 className="w-10 h-10 text-cyber-green" />
                            </div>
                            <span className="text-[10px] font-mono-code text-cyber-green uppercase tracking-widest block mb-1">
                                // INITIALIZATION COMPLETE
                            </span>
                            <h2 className="text-3xl font-display font-bold text-white mb-2">Dossier Verified!</h2>
                            <p className="text-gray-400 text-sm">Welcome to the IGNITE community, {formData.name.split(' ')[0]}.</p>
                            <p className="text-primary text-xs font-mono-code mt-6 animate-pulse">Routing to member terminal...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
