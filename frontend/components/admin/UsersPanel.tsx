import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, ShieldCheck, ShieldAlert, User, Trash2, UserPlus, Copy, Check, KeyRound } from 'lucide-react';
import { api } from '../../lib/api';

interface UsersPanelProps {
    currentRole: 'owner' | 'admin' | 'moderator';
}

export const UsersPanel: React.FC<UsersPanelProps> = ({ currentRole }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Invite user by email
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'admin' | 'moderator'>('moderator');
    const [inviting, setInviting] = useState(false);
    const [inviteError, setInviteError] = useState('');
    const [createdLink, setCreatedLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [resetUserId, setResetUserId] = useState<string | null>(null);
    const [resetNewPass, setResetNewPass] = useState('');
    const [resetting, setResetting] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await api.getAdminUsers();
            setUsers(data);
        } catch (err) {
            console.error('Failed to load users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviting(true);
        setInviteError('');
        setCreatedLink('');
        try {
            const res = await api.addAdminUser({
                email: inviteEmail.trim(),
                role: currentRole === 'owner' ? inviteRole : 'moderator',
            });
            setCreatedLink(res.inviteLink || '');
            setInviteEmail('');
            await loadUsers();
        } catch (err: any) {
            setInviteError(err?.message || 'Failed to add user');
        } finally {
            setInviting(false);
        }
    };

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Remove access for ${email}?`)) return;
        try {
            await api.deleteAdminUser(id);
            setUsers(prev => prev.filter(u => u._id !== id));
        } catch (err: any) {
            alert(err?.message || 'Failed to remove user');
        }
    };

    const handleResetPassword = async (id: string) => {
        if (resetNewPass.trim().length < 6) {
            alert('New password must be at least 6 characters.');
            return;
        }
        setResetting(true);
        try {
            await api.resetStaffPassword(id, resetNewPass.trim());
            setResetUserId(null);
            setResetNewPass('');
            await loadUsers();
        } catch (err: any) {
            alert(err?.message || 'Failed to reset password');
        } finally {
            setResetting(false);
        }
    };

    const copyLink = () => {
        if (!createdLink) return;
        navigator.clipboard.writeText(createdLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const roleBadgeClass = (role: string) => {
        if (role === 'owner') return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
        if (role === 'admin') return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
        return 'bg-primary/15 text-primary border-primary/30';
    };

    return (
        <div className="space-y-6">
            {/* Add / Invite User Card */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                <div>
                    <h2 className="text-xl font-bold mb-1">Add Staff User</h2>
                    <p className="text-gray-400 text-sm">
                        {currentRole === 'owner'
                            ? 'As Owner, you can invite new Admins or Moderators by email.'
                            : 'As Admin, you can invite new Moderators by email. Only the Owner can add Admins.'}
                    </p>
                </div>

                <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
                    <div className="flex-1 space-y-1.5">
                        <label className="text-[11px] font-mono-code uppercase tracking-wider text-gray-400 px-1">
                            Email ID *
                        </label>
                        <input
                            type="email"
                            required
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            placeholder="member@bitmesra.ac.in"
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary"
                        />
                    </div>

                    <div className="w-full md:w-48 space-y-1.5">
                        <label className="text-[11px] font-mono-code uppercase tracking-wider text-gray-400 px-1">
                            Role
                        </label>
                        {currentRole === 'owner' ? (
                            <select
                                value={inviteRole}
                                onChange={e => setInviteRole(e.target.value as 'admin' | 'moderator')}
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary font-mono-code"
                            >
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                            </select>
                        ) : (
                            <div className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-sm text-gray-300 font-mono-code">
                                Moderator
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={inviting}
                        className="btn-cyber-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>{inviting ? 'Inviting...' : 'Add User'}</span>
                    </button>
                </form>

                {inviteError && (
                    <p className="text-xs font-mono-code text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                        {inviteError}
                    </p>
                )}

                {createdLink && (
                    <div className="bg-cyber-green/10 border border-cyber-green/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-xs font-mono-code text-cyber-green font-bold mb-1">
                                User added & invited! Share this password-setup link if needed:
                            </p>
                            <p className="text-xs font-mono-code text-gray-300 truncate">{createdLink}</p>
                        </div>
                        <button
                            type="button"
                            onClick={copyLink}
                            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono-code flex items-center gap-1.5 flex-shrink-0"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-cyber-green" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'Copied' : 'Copy Link'}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Search & List */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                <div>
                    <h3 className="text-lg font-bold">Staff Directory</h3>
                    <p className="text-gray-400 text-xs font-mono-code">
                        1 Owner · Admins (can add Moderators) · Moderators (view forms & create events)
                    </p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search name, email, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#1a1a1a] border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-primary/50 w-full md:w-72"
                    />
                </div>
            </div>

            {loading ? (
                <div className="py-16 text-center text-gray-400 font-mono-code text-sm">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
                <div className="py-16 text-center bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                    <User className="w-10 h-10 text-white/10 mx-auto mb-3" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No staff users added yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {filteredUsers.map((user) => {
                        const canDelete =
                            user.role !== 'owner' &&
                            (currentRole === 'owner' || (currentRole === 'admin' && user.role === 'moderator'));

                        return (
                            <motion.div
                                layout
                                key={user._id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#121212] border border-white/5 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="font-bold text-white text-base">{user.name}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code uppercase font-bold border ${roleBadgeClass(user.role)}`}>
                                                {user.role || 'moderator'}
                                            </span>
                                            {user.isVerified ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] text-green-400 font-mono-code uppercase">
                                                    <ShieldCheck className="w-3 h-3" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] text-yellow-400 font-mono-code uppercase">
                                                    <ShieldAlert className="w-3 h-3" /> Pending Password
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono-code">
                                            <Mail className="w-3.5 h-3.5" /> {user.email}
                                        </div>
                                    </div>
                                </div>

                                {canDelete && (
                                    <div className="flex items-center gap-2">
                                        {resetUserId === user._id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="password"
                                                    value={resetNewPass}
                                                    onChange={e => setResetNewPass(e.target.value)}
                                                    placeholder="New password (6+)"
                                                    className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary w-40"
                                                />
                                                <button
                                                    type="button"
                                                    disabled={resetting}
                                                    onClick={() => handleResetPassword(user._id)}
                                                    className="px-3 py-1.5 rounded-lg bg-primary text-black text-xs font-bold"
                                                >
                                                    {resetting ? '...' : 'Save'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setResetUserId(null); setResetNewPass(''); }}
                                                    className="px-2 py-1.5 text-xs text-gray-400 hover:text-white"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => { setResetUserId(user._id); setResetNewPass(''); }}
                                                className="px-2.5 py-1.5 rounded-lg text-xs font-mono-code text-gray-300 hover:text-primary hover:bg-white/5 border border-white/10 flex items-center gap-1.5 transition-colors"
                                            >
                                                <KeyRound className="w-3.5 h-3.5" /> Reset Password
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(user._id, user.email)}
                                            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                            aria-label={`Remove ${user.email}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
