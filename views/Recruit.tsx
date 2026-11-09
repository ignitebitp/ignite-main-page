import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, ArrowRight, Sparkles, Check, X, MessageCircle, Terminal } from 'lucide-react';
import SectionWrapper from '../components/SectionWrapper';
import { api } from '../lib/api';

// WhatsApp Popup Modal with Specular Glass Surface
const WhatsAppModal: React.FC<{ link: string; onClose: () => void }> = ({ link, onClose }) => (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                className="relative glass-card bg-[#0e1319]/95 border-t-[1.5px] border-t-white/50 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="w-16 h-16 bg-[#25D366]/15 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#25D366]/30">
                    <MessageCircle className="w-8 h-8 text-[#25D366]" />
                </div>

                <span className="text-[10px] font-mono-code text-primary uppercase tracking-widest block mb-1">
                    // ADMISSION CONFIRMED
                </span>
                <h2 className="text-2xl font-display font-bold text-white mb-2">You're In! 🎉</h2>
                <p className="text-gray-300 text-sm mb-2">
                    Your candidate dossier has been transmitted successfully.
                </p>
                <p className="text-gray-400 text-xs font-mono-code mb-6">
                    Connect to the official <strong className="text-white">WhatsApp Node</strong> for live recruitment updates & interview schedules.
                </p>

                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#25D366] hover:bg-[#22c35e] text-black font-bold rounded-xl transition-all shadow-lg text-sm mb-3"
                >
                    <MessageCircle className="w-4 h-4 text-black" />
                    Join Candidate Channel
                </a>

                <button
                    onClick={onClose}
                    className="w-full py-3 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-mono-code"
                >
                    Dismiss for now
                </button>
            </motion.div>
        </motion.div>
    </AnimatePresence>
);

const Recruit: React.FC = () => {
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [showWhatsApp, setShowWhatsApp] = useState(false);
    const [whatsappLink, setWhatsappLink] = useState('https://chat.whatsapp.com/G8Ds9PBrIlpFV5lpvClOVV?mode=gi_t');
    const [recruitmentOpen, setRecruitmentOpen] = useState<boolean | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeBatches, setActiveBatches] = useState<string[]>([]);
    const [form, setForm] = useState<{
        name: string; email: string; phone: string; rollNo: string; branch: string; batch: string;
        interests: string[]; esportsGame: string;
        whyJoin: string;
    }>({
        name: '', email: '', phone: '', rollNo: '', branch: '', batch: '2025',
        interests: [], esportsGame: '',
        whyJoin: '',
    });

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const targetBatch = (currentYear - 1).toString();
        setForm(f => ({ ...f, batch: targetBatch }));
        setActiveBatches([targetBatch]);

        api.getConfig('whatsappGroupLink')
            .then((link: string | null) => { if (link) setWhatsappLink(link); })
            .catch(() => { });
        api.getConfig('recruitmentOpen')
            .then((val: boolean | null) => setRecruitmentOpen(val !== false))
            .catch(() => setRecruitmentOpen(true));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (value: string) => {
        setForm(prev => {
            const interests = prev.interests.includes(value)
                ? prev.interests.filter(i => i !== value)
                : [...prev.interests, value];
            return { ...prev, interests };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step !== 3) return;

        if (form.interests.length === 0) {
            setError('Please select at least one track (Ignite Club or BITP Esports).');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await api.submitApplication(form);
            if (res?.whatsappLink) setWhatsappLink(res.whatsappLink);
            setShowWhatsApp(true);
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleWhatsAppClose = () => {
        setShowWhatsApp(false);
        setSubmitted(true);
    };

    if (recruitmentOpen === null) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center font-mono-code text-sm text-gray-500">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping mr-2" />
                Querying recruitment status...
            </div>
        );
    }

    if (!recruitmentOpen) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center px-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md mx-auto p-8 glass-card border-t-[1.5px] border-t-white/40 rounded-3xl">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-500/20">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <span className="text-[10px] font-mono-code text-cyber-red uppercase tracking-widest block mb-1">
                        // STATUS: INACTIVE
                    </span>
                    <h2 className="text-2xl font-display font-bold text-white mb-3">Recruitment Closed</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Recruitment windows are presently paused. Follow club announcements and social channels for upcoming season schedules.
                    </p>
                </motion.div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center px-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md mx-auto p-8 glass-card border-t-[1.5px] border-t-white/40 rounded-3xl">
                    <div className="w-16 h-16 bg-cyber-green/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-cyber-green/30">
                        <CheckCircle className="w-8 h-8 text-cyber-green" />
                    </div>
                    <span className="text-[10px] font-mono-code text-cyber-green uppercase tracking-widest block mb-1">
                        // ADMISSION LOGGED
                    </span>
                    <h2 className="text-2xl font-display font-bold text-white mb-3">Application Transmitted!</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Thank you for applying to IGNITE. The technical board will review your credentials and contact you shortly.
                    </p>
                </motion.div>
            </div>
        );
    }

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-sans transition-all";

    return (
        <div className="min-h-screen pt-32 pb-24">
            {showWhatsApp && (
                <WhatsAppModal link={whatsappLink} onClose={handleWhatsAppClose} />
            )}

            <div className="container mx-auto px-6 max-w-2xl">
                <SectionWrapper>
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-code text-primary mb-4">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>COHORT RECRUITMENT {activeBatches.join(' / ') || 'ACTIVE'}</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white mb-3">
                            Join IGNITE.{' '}
                            <span className="font-editorial text-primary font-normal block sm:inline">
                                Become a Builder.
                            </span>
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base">
                            Be part of the premier technical innovation and engineering guild at BIT Mesra.
                        </p>
                    </div>
                </SectionWrapper>

                {/* Progress Stepper */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl font-mono-code flex items-center justify-center text-xs font-bold transition-all border ${
                                step >= s
                                    ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(255,140,90,0.5)]'
                                    : 'bg-white/5 text-gray-500 border-white/5'
                            }`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-white/10'}`} />}
                        </div>
                    ))}
                </div>

                <div className="glass-card p-8 md:p-10 rounded-3xl border-t-[1.5px] border-t-white/40 shadow-2xl">
                    <motion.form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <div className="border-b border-white/10 pb-3 mb-4">
                                    <span className="text-[10px] font-mono-code text-primary uppercase tracking-widest">STEP 01</span>
                                    <h3 className="text-xl font-display font-bold text-white">Personal Credentials</h3>
                                </div>
                                <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name *" required className={inputClass} />
                                <input name="email" value={form.email} onChange={handleChange} placeholder="Institutional Email *" type="email" required className={inputClass} />
                                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number *" required className={inputClass} />
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full btn-cyber-primary py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-4"
                                >
                                    <span>Proceed to Track Selection</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <div className="border-b border-white/10 pb-3 mb-4">
                                    <span className="text-[10px] font-mono-code text-primary uppercase tracking-widest">STEP 02</span>
                                    <h3 className="text-xl font-display font-bold text-white">Academic Roster & Interests</h3>
                                </div>
                                <input name="rollNo" value={form.rollNo} onChange={handleChange} placeholder="Roll Number (e.g., BTECH/15XXX/2X) *" required className={inputClass} />

                                <div className="relative">
                                    <input
                                        name="batch"
                                        type="number"
                                        value={form.batch}
                                        readOnly
                                        className={`${inputClass} opacity-50 cursor-not-allowed`}
                                    />
                                    <p className="text-gray-500 font-mono-code text-[11px] mt-1 absolute right-3 top-3.5">
                                        BATCH {new Date().getFullYear() - 1} AUTO
                                    </p>
                                </div>

                                <input name="branch" value={form.branch} onChange={handleChange} placeholder="Branch (e.g., CSE / ECE / BCA / AIML) *" required className={inputClass} />

                                <div className="space-y-3 pt-2">
                                    <label className="text-xs font-mono-code text-gray-400 block mb-2">TARGET GUILD TRACK: *</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {['Ignite Club', 'BITP Esports'].map(interest => (
                                            <div
                                                key={interest}
                                                onClick={() => handleCheckboxChange(interest)}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                                                    form.interests.includes(interest)
                                                        ? 'bg-primary/15 border-primary shadow-[0_0_15px_rgba(255,140,90,0.2)]'
                                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                }`}
                                            >
                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                                    form.interests.includes(interest) ? 'bg-primary border-primary' : 'border-gray-500'
                                                }`}>
                                                    {form.interests.includes(interest) && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                                                </div>
                                                <span className="font-semibold text-sm text-white">{interest}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {form.interests.includes('BITP Esports') && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                        <input
                                            name="esportsGame"
                                            value={form.esportsGame}
                                            onChange={handleChange}
                                            placeholder="Primary Competitive Title (e.g., Valorant, BGMI, CS2) *"
                                            required
                                            className={inputClass}
                                        />
                                    </motion.div>
                                )}

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 font-mono-code text-xs transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        className="flex-1 btn-cyber-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                                    >
                                        <span>Next Step</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <div className="border-b border-white/10 pb-3 mb-4">
                                    <span className="text-[10px] font-mono-code text-primary uppercase tracking-widest">STEP 03</span>
                                    <h3 className="text-xl font-display font-bold text-white">Personal Statement</h3>
                                </div>
                                <textarea
                                    name="whyJoin"
                                    value={form.whyJoin}
                                    onChange={handleChange}
                                    placeholder="Why do you want to join IGNITE? Describe your goals, past projects, or areas of interest... *"
                                    required
                                    rows={4}
                                    className={`${inputClass} resize-none`}
                                />

                                {error && (
                                    <div className="flex items-center gap-2 text-cyber-red bg-cyber-red/10 p-3 rounded-xl border border-cyber-red/20 text-xs font-mono-code">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="flex-1 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 font-mono-code text-xs transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 btn-cyber-primary py-3.5 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <span>Transmitting Dossier...</span>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span>Transmit Application</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.form>
                </div>
            </div>
        </div>
    );
};

export default Recruit;
