'use client';

import React from 'react';
import { ArrowUpRight, Code, Cpu, Users, Rocket, Target, Compass, Sparkles } from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';
import { ABOUT_US } from '@/data';
import { Link } from '@/lib/navigation';

const PILLAR_ICONS = [
  { icon: Code, color: 'text-primary', tagBg: 'bg-primary/10 text-primary border-primary/20' },
  { icon: Cpu, color: 'text-cyber-blue', tagBg: 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20' },
  { icon: Users, color: 'text-cyber-violet', tagBg: 'bg-cyber-violet/10 text-cyber-violet border-cyber-violet/20' },
];

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <SectionWrapper className="mb-16 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-code text-primary mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{ABOUT_US.eyebrow}</span>
          </div>

          <h1 className="text-[clamp(2.25rem,5vw,4.5rem)] font-display font-extrabold text-white mb-5">
            About {ABOUT_US.clubName}.{' '}
            <span className="font-editorial text-primary font-normal block sm:inline">
              {ABOUT_US.societySubtitle}.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {ABOUT_US.heroDescription}
          </p>
        </SectionWrapper>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto mb-16">
          {ABOUT_US.stats.map((stat, index) => (
            <SectionWrapper key={stat.label} delay={index * 0.03}>
              <div className="glass-card p-5 rounded-2xl border-t-[1.5px] border-t-white/30">
                <span className="inline-block text-[10px] font-mono-code text-gray-400 border border-white/10 px-2 py-0.5 rounded-full mb-3">
                  {stat.tag}
                </span>
                <h2 className="text-3xl md:text-4xl font-mono-code font-bold tabular-nums text-white mb-1">
                  {stat.value}
                </h2>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {stat.label}
                </p>
              </div>
            </SectionWrapper>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          <SectionWrapper delay={0.05}>
            <div className="glass-card p-7 md:p-8 rounded-2xl h-full border-t-[1.5px] border-t-white/35">
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-3">
                {ABOUT_US.mission.title}
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {ABOUT_US.mission.summary}
              </p>
            </div>
          </SectionWrapper>

          <SectionWrapper delay={0.08}>
            <div className="glass-card p-7 md:p-8 rounded-2xl h-full border-t-[1.5px] border-t-white/35">
              <div className="w-11 h-11 rounded-xl bg-cyber-violet/10 border border-cyber-violet/20 flex items-center justify-center text-cyber-violet mb-5">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-3">
                {ABOUT_US.vision.title}
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {ABOUT_US.vision.summary}
              </p>
            </div>
          </SectionWrapper>
        </div>

        {/* Our Story */}
        <SectionWrapper className="max-w-5xl mx-auto mb-16">
          <div className="glass-card p-7 md:p-10 rounded-3xl border-t-[1.5px] border-t-white/35 space-y-4">
            <span className="text-xs font-mono-code uppercase tracking-wider text-primary block">
              // WHO WE ARE · {ABOUT_US.campus.toUpperCase()}
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
              {ABOUT_US.headline}
            </h2>
            <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
              {ABOUT_US.story.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* Core Pillars */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ABOUT_US.pillars.map((pillar, index) => {
              const style = PILLAR_ICONS[index % PILLAR_ICONS.length];
              const Icon = style.icon;
              return (
                <SectionWrapper key={pillar.title} delay={index * 0.04}>
                  <div className="glass-card p-7 rounded-2xl h-full flex flex-col justify-between border-t-[1.5px] border-t-white/35">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${style.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-mono-code px-2.5 py-1 rounded-full border ${style.tagBg}`}>
                          {pillar.badge}
                        </span>
                      </div>
                      <h3 className="text-lg font-display font-bold text-white mb-2">
                        {pillar.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </SectionWrapper>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <SectionWrapper className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-8 md:p-12 rounded-3xl border-t-[1.5px] border-t-white/40 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto text-primary">
              <Rocket className="w-7 h-7" />
            </div>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-white">
              Want to build with {ABOUT_US.clubName}?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
              {ABOUT_US.shortDescription}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/team"
                className="btn-cyber-primary px-7 py-3.5 rounded-full text-sm font-bold inline-flex items-center gap-2"
              >
                <span>Meet the Team</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/events"
                className="btn-cyber-secondary px-7 py-3.5 rounded-full text-sm font-medium"
              >
                Explore Events
              </Link>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
};

export default About;
