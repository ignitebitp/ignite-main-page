import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Shield, Sparkles, Terminal } from 'lucide-react';
import SectionWrapper from '../components/SectionWrapper';
import { TeamMember } from '../types';
import { TEAM_MEMBERS } from '../data';

const TeamCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative group w-full h-full"
    >
      <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col justify-between border-t-[1.5px] border-t-white/40 group-hover:border-primary/50 transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-[#0e1319]">
          <img
            src={member.image || '/placeholder.svg'}
            alt={member.name}
            onError={(e: any) => { e.currentTarget.src = '/placeholder.svg'; }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14] via-transparent to-transparent opacity-80" />

          {/* Socials floating trigger */}
          {member.socials?.linkedin && member.socials.linkedin !== '#' && (
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <a
                href={member.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-primary transition-colors shadow-md"
                aria-label={`${member.name} LinkedIn`}
              >
                <Linkedin size={16} />
              </a>
            </div>
          )}

          {/* Role badge overlay on image */}
          <div className="absolute bottom-3 left-3 right-3">
            <span className="inline-block px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono-code uppercase tracking-wider text-primary">
              {member.role}
            </span>
          </div>
        </div>

        <div className="p-5 text-left">
          <h3 className="text-lg font-display font-bold text-white group-hover:text-primary transition-colors">
            {member.name}
          </h3>
          <p className="text-gray-400 text-xs font-mono-code mt-0.5">
            BIT Mesra Node // Core Roster
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Team: React.FC = () => {
  const president = TEAM_MEMBERS.find(m => m.role.toLowerCase() === 'president');
  const vicePresidents = TEAM_MEMBERS.filter(m => m.role.toLowerCase().includes('vice president'));
  const secretary = TEAM_MEMBERS.find(m => m.role.toLowerCase() === 'secretary');
  const treasurer = TEAM_MEMBERS.find(m => m.role.toLowerCase() === 'treasurer');

  const coreTeam = TEAM_MEMBERS.filter(
    m =>
      !['president', 'vice president', 'secretary', 'treasurer', 'member'].includes(
        m.role.toLowerCase()
      ) && !m.role.toLowerCase().includes('vice president')
  );

  const members = TEAM_MEMBERS.filter(m => m.role.toLowerCase() === 'member');

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <SectionWrapper className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-code text-primary mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>CORE LEADERSHIP & GUILD ROSTER</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white mb-4">
            Find the Pattern.{' '}
            <span className="font-editorial text-primary font-normal block sm:inline">
              Find the People.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            The minds behind the technical innovation society. Dedicated student leaders, engineers, and researchers driving excellence.
          </p>
        </SectionWrapper>

        {/* Vision Statement Callout Card */}
        <SectionWrapper className="mb-20 max-w-4xl mx-auto">
          <div className="glass-card p-6 md:p-8 rounded-2xl border-t-[1.5px] border-t-white/40 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-1">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-mono-code uppercase tracking-wider text-primary mb-1">
                // GUILD PHILOSOPHY
              </h3>
              <p className="text-base md:text-lg text-gray-200 font-editorial leading-relaxed">
                "Demystifying technology from kernel to cloud. Less theory, more building. Fostering a culture where curiosity meets raw execution."
              </p>
            </div>
          </div>
        </SectionWrapper>

        {/* Executive Leadership Grid */}
        <div className="mb-20">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-6 h-[2px] bg-primary" />
            <h2 className="text-xs font-mono-code uppercase tracking-[0.2em] text-primary">
              EXECUTIVE BOARD
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-10">
            {president && (
              <SectionWrapper delay={0.1}>
                <TeamCard member={president} />
              </SectionWrapper>
            )}

            {vicePresidents.map((vp, index) => (
              <SectionWrapper key={vp.id} delay={0.2 + index * 0.1}>
                <TeamCard member={vp} />
              </SectionWrapper>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {secretary && (
              <SectionWrapper delay={0.35}>
                <TeamCard member={secretary} />
              </SectionWrapper>
            )}

            {treasurer && (
              <SectionWrapper delay={0.45}>
                <TeamCard member={treasurer} />
              </SectionWrapper>
            )}
          </div>
        </div>

        {/* Core Team */}
        {coreTeam.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-6 h-[2px] bg-primary" />
              <h2 className="text-xs font-mono-code uppercase tracking-[0.2em] text-primary">
                CORE TECHNICAL TEAM
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {coreTeam.map((member, index) => (
                <SectionWrapper key={member.id} delay={index * 0.06}>
                  <TeamCard member={member} />
                </SectionWrapper>
              ))}
            </div>
          </div>
        )}

        {/* General Members */}
        {members.length > 0 && (
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-6 h-[2px] bg-primary" />
              <h2 className="text-xs font-mono-code uppercase tracking-[0.2em] text-primary">
                MEMBERS & RESEARCHERS
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {members.map((member, index) => (
                <SectionWrapper key={member.id} delay={index * 0.04}>
                  <TeamCard member={member} />
                </SectionWrapper>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
