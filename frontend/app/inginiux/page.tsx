'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, CheckCircle, AlertCircle, Sparkles, Terminal, ArrowRight, ArrowLeft } from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';
import { api } from '@/lib/api';

interface EventType {
    _id: string;
    name: string;
    description: string;
    date: string;
    venue: string;
    isTeamEvent: boolean;
    maxTeamSize: number;
}

const Inginiux: React.FC = () => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', rollNo: '', branch: '', teamName: '' });

    useEffect(() => {
        api.getEvents().then(setEvents).catch(() => { });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEvent) return;
        setLoading(true);
        setError('');
        try {
            await api.registerForEvent({ ...form, eventId: selectedEvent._id });
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-sans transition-all";

    if (submitted) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center px-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md mx-auto p-8 glass-card border-t-[1.5px] border-t-white/40 rounded-3xl shadow-2xl">
                    <div className="w-16 h-16 bg-cyber-green/10 border border-cyber-green/30 rounded-2xl flex items-center justify-center mx-auto mb-5 text-cyber-green">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-mono-code text-cyber-green uppercase tracking-widest block mb-1">
                        // REGISTRATION LOGGED
                    </span>
                    <h2 className="text-2xl font-display font-bold text-white mb-2">Registered Successfully!</h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        You've been successfully enrolled in <span className="text-primary font-bold">{selectedEvent?.name}</span>. Telemetry saved.
                    </p>
                    <button
                        onClick={() => { setSubmitted(false); setSelectedEvent(null); setForm({ name: '', email: '', phone: '', rollNo: '', branch: '', teamName: '' }); }}
                        className="btn-cyber-secondary px-6 py-2.5 rounded-full text-xs font-mono-code"
                    >
                        Register for another sprint track
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6">
                {/* Header */}
                <SectionWrapper>
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-code text-primary mb-4">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>FLAGSHIP TECHNICAL ARENA</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white mb-4">
                            INGINIUX <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">2.0</span>.{' '}
                            <span className="font-editorial text-primary font-normal block sm:inline">
                                The Tech Fest.
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
                            The landmark technical festival by IGNITE. Compete across algorithmic battles, hackathons, and hardware showcases.
                        </p>
                    </div>
                </SectionWrapper>

                {!selectedEvent ? (
                    /* Event Cards Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {events.length === 0 && (
                            <div className="col-span-2 text-center py-20 glass-card rounded-3xl border-t-[1.5px] border-t-white/30 text-gray-400 font-mono-code text-sm">
                                <p className="text-lg text-white font-display mb-1">Events will be announced soon!</p>
                                <p className="text-xs text-gray-500">Check back later for track registration.</p>
                            </div>
                        )}
                        {events.map((event, i) => (
                            <SectionWrapper key={event._id} delay={i * 0.1}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    onClick={() => setSelectedEvent(event)}
                                    className="group cursor-pointer p-7 rounded-2xl glass-card border-t-[1.5px] border-t-white/40 hover:border-primary/50 transition-all duration-300 h-full flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[10px] font-mono-code text-primary uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                                                INGINIUX TRACK
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                            {event.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 text-xs font-mono-code text-gray-400">
                                        {event.date && (
                                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
                                                <Calendar className="w-3 h-3 text-primary" />
                                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                            </span>
                                        )}
                                        {event.venue && (
                                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
                                                <MapPin className="w-3 h-3 text-primary" />
                                                <span>{event.venue}</span>
                                            </span>
                                        )}
                                        {event.isTeamEvent && (
                                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyber-green/10 text-cyber-green border border-cyber-green/20">
                                                <Users className="w-3 h-3" />
                                                <span>Team ({event.maxTeamSize})</span>
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            </SectionWrapper>
                        ))}
                    </div>
                ) : (
                    /* Registration Form */
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="text-xs font-mono-code text-gray-400 hover:text-white mb-6 flex items-center gap-1.5 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Return to Track Overview</span>
                        </button>
                        
                        <div className="p-8 rounded-3xl glass-card border-t-[1.5px] border-t-white/40 shadow-2xl">
                            <span className="text-[10px] font-mono-code text-primary uppercase tracking-widest block mb-1">
                                // TRACK REGISTRATION
                            </span>
                            <h3 className="text-2xl font-display font-bold text-white mb-1">{selectedEvent.name}</h3>
                            <p className="text-gray-400 text-xs font-mono-code mb-6">Enter participant credentials to lock in your slot</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name *" required className={inputClass} />
                                <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address *" type="email" required className={inputClass} />
                                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number *" required className={inputClass} />
                                <input name="rollNo" value={form.rollNo} onChange={handleChange} placeholder="Roll Number *" required className={inputClass} />
                                <select name="branch" value={form.branch} onChange={handleChange} className={`${inputClass} cursor-pointer bg-[#0e1319]`}>
                                    <option value="">Select Branch</option>
                                    <option>Computer Science</option>
                                    <option>Information Technology</option>
                                    <option>Electronics</option>
                                    <option>Electrical</option>
                                    <option>Mechanical</option>
                                    <option>Civil</option>
                                    <option>Other</option>
                                </select>
                                {selectedEvent.isTeamEvent && (
                                    <input name="teamName" value={form.teamName} onChange={handleChange} placeholder="Team Name" className={inputClass} />
                                )}
                                {error && (
                                    <div className="flex items-center gap-2 text-cyber-red bg-cyber-red/10 p-3 rounded-xl text-xs font-mono-code border border-cyber-red/20">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-cyber-primary py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                                >
                                    {loading ? 'Submitting Registration...' : 'Confirm Registration'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Inginiux;
