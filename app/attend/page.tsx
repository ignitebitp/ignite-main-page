'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from '@/lib/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { CheckCircle, AlertCircle, Scan, Terminal } from 'lucide-react';

function AttendContent() {
    const [searchParams] = useSearchParams();
    const eventId = searchParams ? searchParams.get('event') : null;
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const savedEmail = localStorage.getItem('student_email');
        if (savedEmail) setEmail(savedEmail);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventId) return;

        setStatus('loading');
        try {
            const res = await api.markAttendance({ eventId, email });
            localStorage.setItem('student_email', email);
            setStatus('success');
            setMessage(res.message);
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message || 'Failed to mark attendance');
        }
    };

    if (!eventId) {
        return (
            <div className="pt-32 pb-20 min-h-screen container mx-auto px-6 text-center flex items-center justify-center">
                <div className="glass-card p-10 rounded-3xl border-t-[1.5px] border-t-white/40 max-w-md w-full shadow-2xl">
                    <AlertCircle className="w-12 h-12 text-cyber-red mx-auto mb-4" />
                    <span className="text-[10px] font-mono-code text-cyber-red uppercase tracking-widest block mb-2">
                        // SCAN ERROR
                    </span>
                    <h1 className="text-2xl font-display font-bold text-white mb-2">Invalid Attendance Link</h1>
                    <p className="text-gray-400 text-sm">Please scan an authorized workshop check-in QR code.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 min-h-screen container mx-auto px-6 flex items-center justify-center">
            <div className="max-w-md w-full glass-card border-t-[1.5px] border-t-white/40 p-8 md:p-10 rounded-3xl text-center shadow-2xl">
                <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary">
                    <Scan className="w-7 h-7" />
                </div>

                <div className="mb-6">
                    <span className="text-[10px] font-mono-code text-primary uppercase tracking-widest block mb-1">
                        // PHYSICAL PRESENCE CHECK-IN
                    </span>
                    <h1 className="text-3xl font-display font-bold text-white mb-1">Mark Attendance</h1>
                    <p className="text-gray-400 text-xs font-mono-code">Enter registered institutional email to confirm presence</p>
                </div>

                {status === 'success' ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-6">
                        <CheckCircle className="w-14 h-14 text-cyber-green mx-auto mb-3" />
                        <h2 className="text-2xl font-display font-bold text-white mb-1">Check-in Confirmed!</h2>
                        <p className="text-gray-300 text-xs font-mono-code">{message}</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@bitmesra.ac.in"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary text-center text-sm font-sans transition-all"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full btn-cyber-primary py-3.5 rounded-xl font-bold transition-all disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Verifying Presence...' : 'Confirm Attendance'}
                        </button>
                        {status === 'error' && (
                            <p className="text-cyber-red text-xs font-mono-code mt-2">{message}</p>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default function AttendPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-gray-500 font-mono-code text-sm">Loading attendance...</div>}>
      <AttendContent />
    </Suspense>
  );
}