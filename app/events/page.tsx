'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, MapPin, ChevronRight, X, Phone, User, GraduationCap, Hash, Trophy, Info, Share2, Sparkles, Terminal } from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';
import { api } from '@/lib/api';

const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [regForm, setRegForm] = useState({ name: '', email: '', rollNo: '', phone: '', teamName: '' });
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState('');

  useEffect(() => {
    api.getAllEvents().then(data => {
      setEvents(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');
    try {
      await api.registerForEvent({ ...regForm, eventId: selectedEvent._id });
      setRegSuccess(true);
      setTimeout(() => {
        setRegSuccess(false);
        setSelectedEvent(null);
        setRegForm({ name: '', email: '', rollNo: '', phone: '', teamName: '' });
      }, 2000);
    } catch (err: any) {
      setRegError(err.message || 'Registration failed');
    }
    setRegLoading(false);
  };

  const rootEvents = events.filter(e => !e.parentId);
  const getSubEvents = (parentId: string) => events.filter(e => e.parentId === parentId);

  const handleShare = async (event: any) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_API_URL || '');
    const shareUrl = `${origin}/share/events/${event._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: event.description,
          url: shareUrl
        });
      } catch (err) { console.error('Error sharing:', err); }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const EventCard = ({ event, isSub = false }: { event: any, isSub?: boolean, key?: any }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative overflow-hidden glass-card border-t-[1.5px] border-t-white/40 ${
        isSub ? 'p-5 rounded-xl border border-white/10' : 'rounded-3xl'
      }`}
    >
      {/* Image for Root Events */}
      {!isSub && (
        <div className="h-52 md:h-64 overflow-hidden relative bg-[#0e1319]">
          {event.image ? (
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-purple-900/20 to-black/60 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary/60" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14] via-[#0b0f14]/50 to-transparent" />
          
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono-code uppercase tracking-wider rounded-full inline-block">
              {event.type === 'mega' ? 'FLAGSHIP ARENA' : 'TECHNICAL LAB'}
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              {event.name}
            </h3>
          </div>
        </div>
      )}

      <div className="p-6 md:p-8">
        {isSub && (
          <div className="mb-3">
            <h4 className="text-xl font-display font-bold text-white">{event.name}</h4>
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-xs font-mono-code text-gray-400 mb-5">
          {event.date && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
          )}
          {event.venue && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>{event.venue}</span>
            </div>
          )}
          {event.isTeamEvent && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyber-green/10 border border-cyber-green/30 text-cyber-green">
              <Users className="w-3.5 h-3.5" />
              <span>Team Track (Max {event.maxTeamSize})</span>
            </div>
          )}
        </div>

        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
          {event.description}
        </p>

        {event.type === 'mega' ? (
          <div className="space-y-4 mt-6 border-t border-white/10 pt-6">
            <div className="flex justify-between items-center">
              <h5 className="font-mono-code uppercase text-xs tracking-wider text-primary">
                // SUB TRACKS & ROUNDS
              </h5>
              <button
                onClick={() => handleShare(event)}
                className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Share event"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getSubEvents(event._id).map(sub => (
                <EventCard key={sub._id} event={sub} isSub={true} />
              ))}
              {getSubEvents(event._id).length === 0 && (
                <p className="text-gray-500 text-xs font-mono-code italic">Rounds telemetry synchronizing...</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedEvent(event)}
              className="flex-1 btn-cyber-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 group/btn"
            >
              <span>Register Now</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => handleShare(event)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Share event"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        <SectionWrapper className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white mb-4">
            Events & Hackathons.{' '}
            <span className="font-editorial text-primary font-normal block sm:inline">
              Hands-on Arena.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Explore our flagship multi-track hackathons, hands-on bootcamps, and technical keynotes at BIT Mesra.
          </p>
        </SectionWrapper>

        {loading ? (
          <div className="text-center font-mono-code text-sm text-gray-500 py-24 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>Fetching live event telemetry...</span>
          </div>
        ) : (
          <div className="space-y-10 max-w-5xl mx-auto">
            {rootEvents.map(event => (
              <SectionWrapper key={event._id}>
                <EventCard event={event} />
              </SectionWrapper>
            ))}
            {rootEvents.length === 0 && (
              <div className="text-center py-20 glass-card rounded-3xl border-t-[1.5px] border-t-white/30">
                <p className="text-gray-400 font-mono-code text-sm">No scheduled events active at this moment.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Registration Modal with Specular Borders */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="glass-card bg-[#0e1319]/95 border-t-[1.5px] border-t-white/50 rounded-2xl p-6 md:p-8 max-w-md w-full relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-[10px] font-mono-code text-primary uppercase tracking-widest">
                  // ENTRY REGISTRATION
                </span>
                <h3 className="text-2xl font-display font-bold text-white mt-1">
                  Register for {selectedEvent.name}
                </h3>
                <p className="text-gray-400 text-xs font-mono-code mt-1">
                  Fill in your credentials to secure your position.
                </p>
              </div>

              {regSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-cyber-green/10 border border-cyber-green/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChevronRight className="w-8 h-8 text-cyber-green" />
                  </div>
                  <h4 className="text-xl font-display font-bold text-cyber-green mb-2">Registration Confirmed!</h4>
                  <p className="text-gray-400 text-xs font-mono-code">Telemetry saved. See you in the arena.</p>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <input
                    value={regForm.name}
                    onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="Full Name *"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none text-sm font-sans"
                  />
                  <input
                    value={regForm.email}
                    onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="Institutional Email *"
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none text-sm font-sans"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      value={regForm.rollNo}
                      onChange={e => setRegForm({ ...regForm, rollNo: e.target.value })}
                      placeholder="Roll No *"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none text-sm font-sans"
                    />
                    <input
                      value={regForm.phone}
                      onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                      placeholder="Phone *"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none text-sm font-sans"
                    />
                  </div>
                  {selectedEvent.isTeamEvent && (
                    <input
                      value={regForm.teamName}
                      onChange={e => setRegForm({ ...regForm, teamName: e.target.value })}
                      placeholder="Team Name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none text-sm font-sans"
                    />
                  )}

                  {regError && <p className="text-cyber-red text-xs font-mono-code">{regError}</p>}

                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full btn-cyber-primary py-3.5 rounded-xl font-bold disabled:opacity-50 mt-2"
                  >
                    {regLoading ? 'Transmitting Registration...' : 'Confirm Registration'}
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

export default Events;
