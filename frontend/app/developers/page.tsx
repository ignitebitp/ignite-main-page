'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Terminal, Code2, Sparkles, ArrowUpRight } from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';

const developers = [
  {
    name: "Aditya Agarwal",
    role: "Full Stack Developer",
    image: "/team/aditya.webp",
    socials: { linkedin: "https://www.linkedin.com/in/aditya2227?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
    skills: ["React 19", "Node.js", "DSA", "Distributed Systems"],
    telemetry: "SYS_ARCH // BIT MESRA",
  },
  {
    name: "Kishlaya Sinha",
    role: "Frontend Engineer",
    image: "/team/kishlaya.webp",
    socials: { linkedin: "https://www.linkedin.com/in/kishlaya-sinha-9134a0211?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
    skills: ["UI/UX Architecture", "AI/ML", "React", "Motion Design"],
    telemetry: "UI_SPEC // BIT MESRA",
  },
];

const Developers: React.FC = () => {
  return (
    <div className="pt-32 pb-24 min-h-screen relative overflow-hidden">
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionWrapper className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-code text-primary mb-4">
            <Terminal size={14} />
            <span>ENGINEERING & ARCHITECTURE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white mb-4">
            The Developers.{' '}
            <span className="font-editorial text-primary font-normal block sm:inline">
              Behind the Code.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Crafting tactile digital experiences, specular interfaces, and resilient web infrastructure with precision and passion.
          </p>
        </SectionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {developers.map((dev, index) => (
            <SectionWrapper key={dev.name} delay={index * 0.15}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="glass-card p-8 rounded-3xl border-t-[1.5px] border-t-white/40 group relative overflow-hidden shadow-2xl h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono-code text-primary tracking-widest px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                      {dev.telemetry}
                    </span>
                    <a
                      href={dev.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/5 hover:bg-primary hover:text-black text-gray-300 rounded-full border border-white/10 transition-colors"
                      aria-label={`${dev.name} LinkedIn`}
                    >
                      <Linkedin size={16} />
                    </a>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-28 h-28 mb-5 rounded-full p-[2px] bg-gradient-to-br from-primary to-purple-600 shadow-xl">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#0e1319]">
                        <img
                          src={encodeURI(dev.image)}
                          alt={dev.name}
                          draggable={false}
                          className="w-full h-full object-cover object-center select-none"
                        />
                      </div>
                    </div>

                    <h3 className="text-2xl font-display font-bold text-white group-hover:text-primary transition-colors">
                      {dev.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-primary text-xs font-mono-code mt-1 mb-5">
                      <Code2 size={14} />
                      <span>{dev.role}</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                      {dev.skills.map(skill => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 text-[11px] font-mono-code bg-white/5 rounded-lg border border-white/5 text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono-code text-gray-400">
                  <span>BIT MESRA NODE</span>
                  <a
                    href={dev.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <span>Connect</span>
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              </motion.div>
            </SectionWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Developers;
