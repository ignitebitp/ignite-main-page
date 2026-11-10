'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Terminal, Sparkles } from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';

const Contact: React.FC = () => {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          {/* Info Side */}
          <SectionWrapper>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-code text-primary mb-4">
              <Terminal className="w-3.5 h-3.5" />
              <span>DIRECT NODE COMMUNICATION</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white mb-6">
              Get in Touch.{' '}
              <span className="font-editorial text-primary font-normal block sm:inline">
                Let's Collaborate.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 mb-10 leading-relaxed">
              Have questions regarding membership, upcoming hackathons, sponsorship, or campus workshops? We'd love to connect.
            </p>

            <div className="space-y-6">
              <div className="glass-card p-5 rounded-2xl border-t-[1.5px] border-t-white/40 flex items-start space-x-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-mono-code uppercase tracking-wider text-gray-300">Email Dispatch</h3>
                  <a href="mailto:ignite@bitmesra.ac.in" className="text-base font-semibold text-white hover:text-primary transition-colors">
                    ignite@bitmesra.ac.in
                  </a>
                </div>
              </div>

              <div className="glass-card p-5 rounded-2xl border-t-[1.5px] border-t-white/40 flex items-start space-x-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-mono-code uppercase tracking-wider text-gray-300">Voice Line</h3>
                  <p className="text-base font-semibold text-white font-mono-code">+91 9386881353</p>
                  <p className="text-base font-semibold text-white font-mono-code">+91 9508664027</p>
                </div>
              </div>

              <div className="glass-card p-5 rounded-2xl border-t-[1.5px] border-t-white/40 flex items-start space-x-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-mono-code uppercase tracking-wider text-gray-300">Physical Node</h3>
                  <p className="text-base font-semibold text-white">
                    BIT Mesra Patna Campus
                  </p>
                  <p className="text-xs text-gray-400 font-mono-code">Near Patna Airport, Bihar 800014</p>
                </div>
              </div>
            </div>
          </SectionWrapper>

          {/* Form Side */}
          <SectionWrapper delay={0.2}>
            <div className="glass-card p-8 md:p-10 rounded-3xl border-t-[1.5px] border-t-white/40 shadow-2xl">
              <div className="mb-6">
                <span className="text-[10px] font-mono-code text-primary uppercase tracking-widest">
                  // DISPATCH TRANSMISSION
                </span>
                <h2 className="text-2xl font-display font-bold text-white mt-1">
                  Send a Message
                </h2>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono-code text-gray-400 mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-code text-gray-400 mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none text-sm transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-gray-400 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="Sponsorship / Collaboration / Query"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-gray-400 mb-2">Message Content *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your query or collaboration idea..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none text-sm transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-cyber-primary py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Message</span>
                </button>
              </form>
            </div>
          </SectionWrapper>
        </div>
      </div>
    </div>
  );
};

export default Contact;
