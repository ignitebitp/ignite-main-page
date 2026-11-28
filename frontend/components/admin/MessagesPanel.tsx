import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, Trash2, Search, UserCheck } from 'lucide-react';
import { api } from '../../lib/api';

export const MessagesPanel: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'contact' | 'interest'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const data = await api.getContactMessages();
            setMessages(data);
        } catch (err) {
            console.error('Failed to load messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this message?')) return;
        try {
            await api.deleteContactMessage(id);
            setMessages(prev => prev.filter(m => m._id !== id));
        } catch (err) {
            console.error('Failed to delete message:', err);
        }
    };

    const filtered = messages.filter(m => {
        const matchesType = filter === 'all' || m.type === filter;
        const q = searchTerm.toLowerCase();
        const matchesSearch =
            !q ||
            m.name?.toLowerCase().includes(q) ||
            m.email?.toLowerCase().includes(q) ||
            m.subject?.toLowerCase().includes(q) ||
            m.message?.toLowerCase().includes(q);
        return matchesType && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                <div>
                    <h2 className="text-xl font-bold mb-1">Messages & Student Interest</h2>
                    <p className="text-gray-400 text-sm">
                        Submissions from /contact and /register (also emailed to ignite@bitmesra.ac.in)
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5">
                        {(['all', 'interest', 'contact'] as const).map(tab => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setFilter(tab)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono-code capitalize transition-colors ${
                                    filter === tab ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {tab === 'interest' ? 'Register Interest' : tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-[#1a1a1a] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-primary/50 w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center text-gray-400 font-mono-code text-sm">Loading messages...</div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                    <MessageSquare className="w-10 h-10 text-white/10 mx-auto mb-3" />
                    <p className="text-gray-500 font-mono-code text-xs uppercase tracking-widest">No messages yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map(item => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-3"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code uppercase font-bold border ${
                                                item.type === 'interest'
                                                    ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/30'
                                                    : 'bg-primary/10 text-primary border-primary/30'
                                            }`}
                                        >
                                            {item.type === 'interest' ? 'Student Interest' : 'Contact'}
                                        </span>
                                        <h3 className="text-white font-bold text-base">{item.name}</h3>
                                        <span className="text-xs text-gray-500 font-mono-code">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5 text-primary" /> {item.email}
                                        </span>
                                        {item.phone && (
                                            <span className="flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5 text-primary" /> {item.phone}
                                            </span>
                                        )}
                                        {(item.branch || item.batch) && (
                                            <span className="flex items-center gap-1.5">
                                                <UserCheck className="w-3.5 h-3.5 text-primary" />{' '}
                                                {[item.branch, item.batch].filter(Boolean).join(' · ')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(item._id)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    aria-label="Delete message"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {item.subject && (
                                <p className="text-xs font-mono-code text-primary">{item.subject}</p>
                            )}
                            <p className="text-sm text-gray-300 whitespace-pre-wrap bg-white/[0.03] p-4 rounded-xl border border-white/5">
                                {item.message}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
