'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowUpRight, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { Link, useNavigate } from '@/lib/navigation';

export default function Register() {
  const [loading, setLoading] = useState(true);
  const [activeEvents, setActiveEvents] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getAllEvents()
      .then((events: any[]) => {
        const active = (events || []).filter(
          e => e.isActive !== false && e.registrationsOpen !== false && e.status !== 'ended'
        );
        setActiveEvents(active);
        if (active.length > 0) {
          navigate('/events');
        }
      })
      .catch(() => setActiveEvents([]))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-32 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg glass-card border-t-[1.5px] border-t-white/40 p-8 md:p-10 rounded-3xl relative z-10 shadow-2xl text-center space-y-5"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto border border-primary/20 text-primary">
          <Calendar className="w-8 h-8" />
        </div>

        {loading ? (
          <p className="text-sm font-mono-code text-gray-400">Checking active events...</p>
        ) : activeEvents.length === 0 ? (
          <>
            <span className="text-[10px] font-mono-code text-primary uppercase tracking-widest block">
              // EVENT REGISTRATION
            </span>
            <h1 className="text-3xl font-display font-bold text-white">No Active Events Right Now</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              There are no open event registrations at the moment. Looking to join IGNITE instead?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/recruit"
                className="btn-cyber-primary px-6 py-3 rounded-full text-sm font-bold inline-flex items-center gap-2"
              >
                <span>Join Recruitment</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/events"
                className="btn-cyber-secondary px-6 py-3 rounded-full text-sm font-medium inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span>View Events</span>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-sm font-mono-code text-gray-300">Redirecting to active events...</p>
        )}
      </motion.div>
    </div>
  );
}
