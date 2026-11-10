'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Shield, Sparkles, Terminal } from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';
import { TeamMember } from '@/types';
import { TEAM_MEMBERS } from '@/data';

const TeamCard: React.FC<{ member: TeamMember; isExecutive?: boolean }> = ({
  member,
  isExecutive = false,
}) => {
  const cardWidthClass = isExecutive ? 'w-[300px]' : 'w-[200px]';
  const imgBoxClass = isExecutive ? 'w-[300px] h-[400px]' : 'w-[200px] h-[250px]';
  const imgWidth = isExecutive ? 300 : 200;
  const imgHeight = isExecutive ? 400 : 250;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative group flex justify-center"
    >
      <div className={`glass-card box-content rounded-2xl overflow-hidden flex flex-col border-t-[1.5px] border-t-white/40 group-hover:border-primary/50 transition-all duration-300 ${cardWidthClass} max-w-full shadow-lg`}>
        {/* Image placeholder: exactly 300x400 for Executive Board, 200x250 for others */}
        <div className={`relative ${imgBoxClass} max-w-full overflow-hidden bg-[#0e1319] flex-shrink-0`}>
          <img
            src={member.image || '/placeholder.svg'}
            alt={member.name}
            width={imgWidth}
            height={imgHeight}
            onError={(e: any) => { e.currentTarget.src = '/placeholder.svg'; }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14]/80 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Socials floating trigger */}
          {member.socials?.linkedin && member.socials.linkedin !== '#' && (
            <div className={`absolute ${isExecutive ? 'top-3 right-3' : 'top-2.5 right-2.5'} opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10`}>
              <a
                href={member.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`${isExecutive ? 'w-8 h-8' : 'w-7 h-7'} rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-primary transition-colors shadow-md`}
                aria-label={`${member.name} LinkedIn`}
              >
                <Linkedin size={isExecutive ? 16 : 14} />
              </a>
            </div>
          )}

          {/* Role badge overlay on image */}
          <div className={`absolute ${isExecutive ? 'bottom-3' : 'bottom-2'} inset-x-2 z-10 flex justify-center pointer-events-none`}>
            <span className={`inline-block ${isExecutive ? 'px-3 py-1 text-[11px]' : 'px-2 py-0.5 text-[9px]'} rounded-full bg-black/80 backdrop-blur-md border border-white/10 font-mono-code uppercase tracking-wider text-primary truncate max-w-full text-center`}>
              {member.role}
            </span>
          </div>
        </div>

        {/* Other paddings and content take extra space below the image placeholder */}
        <div className={`${isExecutive ? 'p-4' : 'p-3'} text-center flex-1 flex flex-col justify-center`}>
          <h3 className={`${isExecutive ? 'text-base sm:text-lg' : 'text-xs'} font-display font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight`} title={member.name}>
            {member.name}
          </h3>
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

          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto mb-10">
            {president && (
              <SectionWrapper delay={0.1} className="flex justify-center">
                <TeamCard member={president} isExecutive />
              </SectionWrapper>
            )}

            {vicePresidents.map((vp, index) => (
              <SectionWrapper key={vp.id} delay={0.2 + index * 0.1} className="flex justify-center">
                <TeamCard member={vp} isExecutive />
              </SectionWrapper>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
            {secretary && (
              <SectionWrapper delay={0.35} className="flex justify-center">
                <TeamCard member={secretary} isExecutive />
              </SectionWrapper>
            )}

            {treasurer && (
              <SectionWrapper delay={0.45} className="flex justify-center">
                <TeamCard member={treasurer} isExecutive />
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-[920px] mx-auto justify-items-center">
              {coreTeam.map((member, index) => (
                <SectionWrapper key={member.id} delay={index * 0.03} className="w-full flex justify-center">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 max-w-[1140px] mx-auto justify-items-center">
              {members.map((member, index) => (
                <SectionWrapper key={member.id} delay={index * 0.02} className="w-full flex justify-center">
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
