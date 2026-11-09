import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, ShieldAlert, Terminal } from 'lucide-react';
import { api } from '../lib/api';
import { useNavigate, Link } from '../lib/navigation';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.login(formData);
            localStorage.setItem('ignite_admin_token', res.token);

            if (res.role === 'admin') {
                navigate('/admin');
            } else {
                localStorage.setItem('ignite_user', JSON.stringify(res.user));
                navigate('/profile');
            }
        } catch (err: any) {
            if (err.message === 'Please verify your email first') {
                setError('Please verify your email first');
            } else {
                setError('Invalid email or password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-32 relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/3 left-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass-card border-t-[1.5px] border-t-white/40 p-8 md:p-10 rounded-3xl relative z-10 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-code text-primary mb-4">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>SESSION AUTHENTICATION</span>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Welcome Back.{' '}
                        <span className="font-editorial text-primary font-normal block sm:inline">
                          Stay Sharp.
                        </span>
                    </h1>
                    <p className="text-gray-400 text-xs font-mono-code">
                        "Keep the IGNITE burning within you"
                    </p>
                </div>

                {error && (
                    <div className="bg-cyber-red/10 border border-cyber-red/20 text-cyber-red p-3.5 rounded-xl text-xs mb-6 flex items-center gap-2.5 font-mono-code">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-mono-code uppercase tracking-wider text-gray-400 px-1">Email / Operator Handle</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text" required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm outline-none focus:border-primary transition-all"
                                placeholder="admin or email@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-mono-code uppercase tracking-wider text-gray-400">Passphrase</label>
                            <Link to="/forgot-password" className="text-[10px] font-mono-code text-primary/70 hover:text-primary">Forgot Key?</Link>
                        </div>
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
                        {loading ? 'Authenticating...' : (
                            <>
                                <span>Sign In Now</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-gray-400 text-xs font-mono-code mt-6">
                        No active credentials? <Link to="/register" className="text-primary hover:underline">Register for Ignite</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
