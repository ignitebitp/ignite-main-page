'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Globe, Sparkles } from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';
import ProtectedImage from '@/components/ProtectedImage';
import { TeamMember } from '@/types';
import { TEAM_SECTION } from '@/data';

const hasValidLink = (url?: string) => Boolean(url && url.trim() !== '' && url.trim() !== '#');

const TeamCard: React.FC<{ member: TeamMember; isExecutive?: boolean }> = ({
  member,
  isExecutive = false,
}) => {
  const cardWidthClass = isExecutive ? 'w-[300px]' : 'w-[210px]';
  const imgBoxClass = isExecutive ? 'w-[300px] h-[400px]' : 'w-[210px] h-[280px]';
  const linkedinUrl = hasValidLink(member.socials?.linkedin) ? member.socials.linkedin!.trim() : '';
  const websiteUrl = hasValidLink(member.socials?.website) ? member.socials.website!.trim() : '';
  const hasAnyLink = Boolean(linkedinUrl || websiteUrl);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative group flex justify-center flex-shrink-0"
    >
      <div className={`glass-card box-content rounded-2xl overflow-hidden flex flex-col border-t-[1.5px] border-t-white/40 group-hover:border-primary/50 transition-all duration-300 ${cardWidthClass} flex-shrink-0 shadow-lg`}>
        {/* Image placeholder: exactly 300x400 for Executive Board, 210x280 for others */}
        <div className={`relative ${imgBoxClass} overflow-hidden bg-[#0e1319] flex-shrink-0`}>
          <ProtectedImage
            src={member.image || '/placeholder.svg'}
            alt={member.name}
            className="transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14]/80 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Socials floating trigger on image bottom-left */}
          {hasAnyLink && (
            <div className={`absolute ${isExecutive ? 'bottom-3 left-3' : 'bottom-2.5 left-2.5'} flex items-center gap-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20`}>
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${isExecutive ? 'w-9 h-9' : 'w-8 h-8'} rounded-full bg-black/75 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-primary hover:border-primary/50 transition-colors shadow-md`}
                  aria-label={`${member.name} LinkedIn`}
                >
                  <Linkedin size={isExecutive ? 16 : 14} />
                </a>
              )}
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${isExecutive ? 'w-9 h-9' : 'w-8 h-8'} rounded-full bg-black/75 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-primary hover:border-primary/50 transition-colors shadow-md`}
                  aria-label={`${member.name} Website`}
                >
                  <Globe size={isExecutive ? 16 : 14} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Name & role below the image */}
        <div className={`${isExecutive ? 'p-4' : 'p-3'} text-center flex-1 flex flex-col justify-center gap-1.5`}>
          <h3 className={`${isExecutive ? 'text-base sm:text-lg' : 'text-xs'} font-display font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight`} title={member.name}>
            {member.name}
          </h3>
          <span className={`inline-block mx-auto ${isExecutive ? 'px-3 py-0.5 text-[11px]' : 'px-2 py-0.5 text-[9px]'} rounded-full bg-white/5 border border-white/10 font-mono-code uppercase tracking-wider text-primary truncate max-w-full`}>
            {member.role}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Team: React.FC = () => {
  const executiveBoard = TEAM_SECTION.executiveBoard;
  const president = executiveBoard.find(m => m.role.toLowerCase() === 'president');
  const otherExecutives = executiveBoard.filter(m => m !== president);

  const coreTeam = TEAM_SECTION.coreTechnicalTeam;
  const members = TEAM_SECTION.members;
  const juniorCoordinators = TEAM_SECTION.juniorCoordinators || [];

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

          {/* Top Row: Only President centered */}
          {president && (
            <div className="flex justify-center max-w-[964px] mx-auto mb-10">
              <SectionWrapper delay={0.06} className="flex justify-center">
                <TeamCard member={president} isExecutive />
              </SectionWrapper>
            </div>
          )}

          {/* Remaining Executive Board in 3 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-[964px] mx-auto">
            {otherExecutives.map((exec, index) => (
              <SectionWrapper key={`${exec.name}-${exec.role}-${index}`} delay={0.1 + index * 0.03} className="flex justify-center">
                <TeamCard member={exec} isExecutive />
              </SectionWrapper>
            ))}
          </div>
        </div>

        {/* Core Team (70% scaled cards fitted to the exact same container width) */}
        {coreTeam.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-6 h-[2px] bg-primary" />
              <h2 className="text-xs font-mono-code uppercase tracking-[0.2em] text-primary">
                CORE TECHNICAL TEAM
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-6 justify-items-center max-w-[964px] mx-auto">
              {coreTeam.map((member, index) => (
                <SectionWrapper key={`${member.name}-${member.role}-${index}`} delay={index * 0.03} className="flex justify-center flex-shrink-0">
                  <TeamCard member={member} />
                </SectionWrapper>
              ))}
            </div>
          </div>
        )}

        {/* General Members / Senior Coordinators */}
        {members.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-6 h-[2px] bg-primary" />
              <h2 className="text-xs font-mono-code uppercase tracking-[0.2em] text-primary">
                Senior Coordinators
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
              {members.map((member, index) => (
                <SectionWrapper key={`${member.name}-${member.role}-${index}`} delay={index * 0.02} className="flex justify-center flex-shrink-0">
                  <TeamCard member={member} />
                </SectionWrapper>
              ))}
            </div>
          </div>
        )}

        {/* Junior Coordinators */}
        {juniorCoordinators.length > 0 && (
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-6 h-[2px] bg-primary" />
              <h2 className="text-xs font-mono-code uppercase tracking-[0.2em] text-primary">
                Junior Coordinators
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
              {juniorCoordinators.map((member, index) => (
                <SectionWrapper key={`${member.name}-${member.role}-${index}`} delay={index * 0.02} className="flex justify-center flex-shrink-0">
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
