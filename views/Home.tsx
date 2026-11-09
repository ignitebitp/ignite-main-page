import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Code, Cpu, Users, Zap, Terminal, Shield, Sparkles, ChevronDown, Rocket, Layers } from 'lucide-react';
import SectionWrapper from '../components/SectionWrapper';
import BinaryRain from '../components/BinaryRain';
import InteractiveTerminal from '../components/InteractiveTerminal';
import { Link } from '../lib/navigation';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* ================= HERO SECTION (2-COLUMN RESPONSIVE) ================= */}
      <section className="relative min-h-[92vh] pt-32 pb-20 flex items-center justify-center overflow-hidden">
        {/* Ambient radial glow */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Eyebrow + Headline with Serif Italic Accent + CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow indicator */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center space-x-3"
              >
                <div className="w-7 h-[2px] bg-primary" />
                <span className="font-mono-code text-xs uppercase tracking-[0.25em] text-primary font-semibold">
                  BIT MESRA TECHNICAL SOCIETY // EST. 2021
                </span>
              </motion.div>

              {/* Headline with Space Grotesk & Editorial Serif Italic Accent */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-display font-extrabold leading-[1.02] tracking-tight text-white"
              >
                IGNITE THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
                  FUTURE.
                </span>{' '}
                <span className="font-editorial text-primary font-normal block sm:inline">
                  Together.
                </span>
              </motion.h1>

              {/* Subtitle / Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed"
              >
                The premier Tech Society of <span className="text-white font-medium">BIT Mesra</span> — fostering innovation, coding excellence,
                and technical leadership for the next generation of builders and security practitioners.
              </motion.p>

              {/* Action Buttons Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link
                  to="/register"
                  className="btn-cyber-primary px-7 py-3.5 rounded-full flex items-center gap-2 text-sm md:text-base font-bold shadow-lg"
                >
                  <span>Join the Community</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                <Link
                  to="/events"
                  className="btn-cyber-secondary px-7 py-3.5 rounded-full flex items-center gap-2 text-sm md:text-base font-medium"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>▷ Explore Events</span>
                </Link>
              </motion.div>

              {/* Live Metric Pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5 font-mono-code text-xs text-gray-400"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                  <span>ACTIVE RECRUITMENT: OPEN</span>
                </div>
                <span className="text-gray-700">|</span>
                <div className="flex items-center space-x-2">
                  <span className="text-primary">NODE:</span>
                  <span className="text-gray-300">PATNA CAMPUS</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Interactive Binary Rain Matrix Tree */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <BinaryRain />
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 hidden md:flex flex-col items-center gap-1.5"
        >
          <span className="text-[10px] font-mono-code uppercase tracking-[0.3em] text-gray-500">
            SCROLL TO EXPLORE
          </span>
          <ChevronDown className="w-4 h-4 text-primary/70" />
        </motion.div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-20 relative border-y border-white/10 bg-black/30 backdrop-blur-sm">
        {/* Specular top and bottom highlights */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Members', value: '200+', tag: 'GROWING ROSTER', icon: Users, color: 'text-primary' },
              { label: 'Active Innovators', value: '85+', tag: 'CORE CONTRIBUTORS', icon: Zap, color: 'text-amber-400' },
              { label: 'Events Hosted', value: '50+', tag: 'HACKATHONS & LABS', icon: Code, color: 'text-cyber-green' },
              { label: 'Years of Excellence', value: '4+', tag: 'CAMPUS GUILD', icon: Rocket, color: 'text-purple-400' },
            ].map((stat, index) => (
              <SectionWrapper key={index} delay={index * 0.1}>
                <div className="glass-card p-6 rounded-2xl relative group overflow-hidden border-t-[1.5px] border-t-white/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <span className="text-[10px] font-mono-code text-gray-500 border border-white/5 px-2 py-0.5 rounded-full">
                      {stat.tag}
                    </span>
                  </div>

                  <h3 className="text-4xl md:text-5xl font-mono-code font-bold text-white mb-1 group-hover:text-primary transition-colors tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </SectionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHAT WE DO / FOCUS PILLARS ================= */}
      <section className="py-28 relative">
        <div className="container mx-auto px-6">
          <SectionWrapper className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-primary" />
              <span className="text-primary font-mono-code text-xs uppercase tracking-[0.25em]">
                CORE DOMAINS & DISCIPLINES
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-4">
              What We Do.{' '}
              <span className="font-editorial text-primary font-normal">From Kernel to Cloud.</span>
            </h2>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl leading-relaxed">
              We provide a structured launchpad for students to explore, experiment, and engineer.
              From competitive coding and security CTFs to full-stack IoT and AI systems.
            </p>
          </SectionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Code className="w-6 h-6" />,
                title: 'Development & Engineering',
                desc: 'Intensive workshops on Web, Cloud, AI, and distributed software systems using modern industry stacks.',
                badge: 'FULL-STACK // DEV',
                color: 'text-primary',
                tagBg: 'bg-primary/10 text-primary border-primary/20',
              },
              {
                icon: <Cpu className="w-6 h-6" />,
                title: 'Hardware & IoT Systems',
                desc: 'Hands-on embedded prototyping with microcontrollers, sensor matrices, Arduino, and edge compute nodes.',
                badge: 'EMBEDDED // IOT',
                color: 'text-cyber-blue',
                tagBg: 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Guild & Community',
                desc: 'Peer mentorship, tech speaker sessions, inter-collegiate hackathons, and high-impact career pathways.',
                badge: 'COLLABORATIVE // GUILD',
                color: 'text-cyber-violet',
                tagBg: 'bg-cyber-violet/10 text-cyber-violet border-cyber-violet/20',
              },
            ].map((item, index) => (
              <SectionWrapper key={index} delay={index * 0.12}>
                <div className="glass-card p-8 rounded-2xl h-full flex flex-col justify-between border-t-[1.5px] border-t-white/35 hover:border-primary/40 group relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <span className={`text-[11px] font-mono-code px-2.5 py-1 rounded-full border ${item.tagBg}`}>
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center text-xs font-mono-code text-gray-400 group-hover:text-primary transition-colors">
                    <span>EXPLORE SYLLABUS</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </SectionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE TERMINAL SANDBOX ================= */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <SectionWrapper className="mb-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-code text-primary mb-4">
              <Terminal className="w-3.5 h-3.5" />
              <span>LIVE INTERACTIVE CLI</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-3">
              Interactive Terminal Sandbox.{' '}
              <span className="font-editorial text-primary font-normal">Test Your Shell.</span>
            </h2>
            <p className="text-sm md:text-base text-gray-400">
              Run live commands, view system telemetry, or attempt to crack the CTF cryptographic bypass puzzle.
            </p>
          </SectionWrapper>

          <div className="max-w-4xl mx-auto">
            <InteractiveTerminal />
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA SECTION ================= */}
      <section className="py-28 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionWrapper>
            <div className="glass-card max-w-4xl mx-auto p-10 md:p-16 rounded-3xl border-t-[1.5px] border-t-white/40 shadow-2xl relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6 text-primary">
                <Rocket className="w-8 h-8" />
              </div>

              <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-6">
                Ready to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
                  Ignite
                </span>
                ? <span className="font-editorial text-primary font-normal block sm:inline">Build the Future.</span>
              </h2>

              <p className="text-base md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join a guild of passionate developers, designers, and innovators at BIT Mesra.
                Let's build something extraordinary together.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="btn-cyber-primary px-8 py-4 rounded-full text-base font-bold flex items-center gap-2 shadow-xl"
                >
                  <span>Register for Club</span>
                  <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                </Link>

                <Link
                  to="/contact"
                  className="btn-cyber-secondary px-8 py-4 rounded-full text-base font-medium"
                >
                  Get In Touch
                </Link>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </section>
    </div>
  );
};

export default Home;
