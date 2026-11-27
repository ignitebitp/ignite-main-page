import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Users, UserCheck, Calendar } from 'lucide-react';

export function MailerPanel() {
    const [resendStatus, setResendStatus] = useState<{ configured: boolean; sender: string; message: string } | null>(null);
    const [targetGroup, setTargetGroup] = useState<'custom' | 'recruits' | 'events' | 'users'>('custom');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const status = await api.getResendStatus();
            setResendStatus(status);
        } catch {
            setResendStatus({ configured: false, sender: 'onboarding@resend.dev', message: 'Unable to check Resend status.' });
        }
    };

    const applyTemplate = (type: 'whatsapp' | 'interview' | 'event') => {
        if (type === 'whatsapp') {
            setSubject('IGNITE: Official Recruitment Update & WhatsApp Channel');
            setMessage(
`Greetings Candidate,

Thank you for your application to IGNITE Technical Innovation Club for the current cohort.

Please make sure you have joined the official WhatsApp group for live announcements and recruitment interview schedules:
https://chat.whatsapp.com/G8Ds9PBrIlpFV5lpvClOVV?mode=gi_t

Stay sharp and keep building!

Best Regards,
IGNITE Technical Club, BIT Mesra`
            );
        } else if (type === 'interview') {
            setSubject('IGNITE Recruitment: Technical Guild Interview Invitation');
            setMessage(
`Hi Candidate,

Congratulations! Based on your submitted dossier and technical track preferences, you have been shortlisted for the Guild Interview round.

Date & Time: Announced on the WhatsApp node
Venue: Tech Lab / Virtual Google Meet
Format: 15-minute conversation covering your domain interests and past projects.

Please bring any project demos or repositories you would like to showcase.

Best Regards,
Technical Board, IGNITE`
            );
        } else if (type === 'event') {
            setSubject('IGNITE: Upcoming Tech Event Announcement');
            setMessage(
`Hello Builders & Enthusiasts,

IGNITE is excited to announce our upcoming technical session and competition.

Check the live events roster on our website:
https://ignitebitp.in/events

Registrations are currently open for all tracks. Secure your spot before slots fill up!

Best Regards,
Team IGNITE`
            );
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const res = await api.sendAdminEmail({
                targetGroup,
                to: targetGroup === 'custom' ? recipientEmail : undefined,
                subject,
                message,
            });
            setResult({ success: true, message: res.message || 'Emails transmitted successfully!' });
        } catch (err: any) {
            setResult({ success: false, message: err.message || 'Failed to send email' });
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            {/* Status Header */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-display font-bold text-white">Resend Email Gateway</h2>
                            {resendStatus && (
                                <span className={`text-[11px] font-mono-code px-2 py-0.5 rounded-full border ${
                                    resendStatus.configured
                                        ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/30'
                                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                }`}>
                                    {resendStatus.configured ? '● RESEND ACTIVE' : '○ API KEY PENDING'}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-400 text-xs mt-1 font-mono-code">
                            Outbound Sender: <span className="text-white">{resendStatus?.sender || 'onboarding@resend.dev'}</span>
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={checkStatus}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code text-gray-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                >
                    <RefreshCw className="w-3 h-3" />
                    <span>Check Gateway</span>
                </button>
            </div>

            {/* Quick Templates */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-mono-code text-gray-400 uppercase tracking-wider">Quick Email Presets</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => applyTemplate('whatsapp')}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 font-mono-code transition-colors flex items-center gap-2"
                    >
                        <span>📱 WhatsApp Node Announcement</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => applyTemplate('interview')}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 font-mono-code transition-colors flex items-center gap-2"
                    >
                        <span>🎯 Interview Shortlist Invite</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => applyTemplate('event')}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 font-mono-code transition-colors flex items-center gap-2"
                    >
                        <span>⚡ Event Registration Notice</span>
                    </button>
                </div>
            </div>

            {/* Email Composer Form */}
            <form onSubmit={handleSend} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
                {/* Target Audience Selector */}
                <div>
                    <label className="text-xs font-mono-code text-gray-400 block mb-2 uppercase tracking-wider">
                        Recipient Target Audience *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button
                            type="button"
                            onClick={() => setTargetGroup('custom')}
                            className={`p-3 rounded-xl border text-xs font-mono-code flex flex-col items-center gap-1.5 transition-all ${
                                targetGroup === 'custom'
                                    ? 'bg-primary/15 border-primary text-primary shadow-[0_0_12px_rgba(255,140,90,0.25)]'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            <Mail className="w-4 h-4" />
                            <span>Custom Recipient</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setTargetGroup('recruits')}
                            className={`p-3 rounded-xl border text-xs font-mono-code flex flex-col items-center gap-1.5 transition-all ${
                                targetGroup === 'recruits'
                                    ? 'bg-primary/15 border-primary text-primary shadow-[0_0_12px_rgba(255,140,90,0.25)]'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            <UserCheck className="w-4 h-4" />
                            <span>All Applicants</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setTargetGroup('events')}
                            className={`p-3 rounded-xl border text-xs font-mono-code flex flex-col items-center gap-1.5 transition-all ${
                                targetGroup === 'events'
                                    ? 'bg-primary/15 border-primary text-primary shadow-[0_0_12px_rgba(255,140,90,0.25)]'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            <Calendar className="w-4 h-4" />
                            <span>Event Registrants</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setTargetGroup('users')}
                            className={`p-3 rounded-xl border text-xs font-mono-code flex flex-col items-center gap-1.5 transition-all ${
                                targetGroup === 'users'
                                    ? 'bg-primary/15 border-primary text-primary shadow-[0_0_12px_rgba(255,140,90,0.25)]'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            <span>All Users</span>
                        </button>
                    </div>
                </div>

                {/* Custom Email Input */}
                {targetGroup === 'custom' && (
                    <div>
                        <label className="text-xs font-mono-code text-gray-400 block mb-1.5">
                            Target Email Address(es) (comma separated for multiple) *
                        </label>
                        <input
                            type="text"
                            value={recipientEmail}
                            onChange={e => setRecipientEmail(e.target.value)}
                            placeholder="e.g. member@bitmesra.ac.in, tech@ignitebitp.in"
                            required={targetGroup === 'custom'}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary font-mono-code"
                        />
                    </div>
                )}

                {/* Subject */}
                <div>
                    <label className="text-xs font-mono-code text-gray-400 block mb-1.5">
                        Email Subject Line *
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="e.g. IGNITE: Recruitment Update & WhatsApp Node Link"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary"
                    />
                </div>

                {/* Message Body */}
                <div>
                    <label className="text-xs font-mono-code text-gray-400 block mb-1.5">
                        Message Body *
                    </label>
                    <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Write your email body here. Plain text and newlines will be automatically formatted for email clients..."
                        rows={8}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary resize-y font-sans"
                    />
                </div>

                {/* Result Feedback */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
                            result.success
                                ? 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green'
                                : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}
                    >
                        {result.success ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                        <span>{result.message}</span>
                    </motion.div>
                )}

                {/* Submit Action */}
                <div className="flex items-center justify-between pt-2">
                    <p className="text-gray-500 text-xs font-mono-code">
                        Dispatched via Resend REST API infrastructure
                    </p>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-cyber-primary py-3 px-6 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 text-sm"
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Transmitting via Resend...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                <span>Send via Resend API</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
