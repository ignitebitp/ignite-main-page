'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '@/components/SectionWrapper';
import ProtectedImage from '@/components/ProtectedImage';
import { ALUMNI_SECTION } from '@/data';
import { AlumniMember } from '@/types';
import { GraduationCap, Linkedin, Globe, Search, Filter } from 'lucide-react';

const hasValidLink = (url?: string) => Boolean(url && url.trim() !== '' && url.trim() !== '#');

const batchSortKey = (batch: string): number => {
  const match = batch.match(/\d+/g);
  return match ? Number(match.join('')) : 0;
};

const Alumni: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('2k23');

  const allAlumni = useMemo<AlumniMember[]>(() => {
    return Object.entries(ALUMNI_SECTION).flatMap(([batch, list]) =>
      list.map(member => ({ ...member, batch }))
    );
  }, []);

  const batches = useMemo(() => {
    const unique = Array.from(new Set(allAlumni.map(a => a.batch)));
    return unique.sort((a, b) => batchSortKey(b) - batchSortKey(a));
  }, [allAlumni]);

  const filteredAlumni = useMemo(() => {
    return allAlumni
      .filter(alum => {
        const matchesName = alum.name
          .toLowerCase()
          .includes(search.trim().toLowerCase());
        const matchesBatch =
          selectedBatch === 'All' || alum.batch === selectedBatch;
        return matchesName && matchesBatch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allAlumni, search, selectedBatch]);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <SectionWrapper className="mb-14 text-center max-w-3xl mx-auto">
          <h1 className="text-[clamp(2.25rem,5vw,4.5rem)] font-display font-extrabold text-white mb-4">
            Alumni Network.{' '}
            <span className="font-editorial text-primary font-normal block sm:inline">
              The Living Legacy.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Our legacy continues through innovators, founders, and security researchers who remain an integral part of our journey.
          </p>
        </SectionWrapper>

        {/* Controls Bar: Search + Mobile Batch Dropdown + Desktop Batch Tabs */}
        <div className="max-w-5xl mx-auto mb-10 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end justify-between">
            {/* Search Input with Top Label */}
            <div className="w-full md:flex-1 space-y-1.5">
              <label
                htmlFor="alumni-search"
                className="block text-[11px] font-mono-code uppercase tracking-wider text-gray-400 px-1"
              >
                Search alumni
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="alumni-search"
                  type="text"
                  placeholder="Filter by name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-sans transition-colors"
                />
              </div>
            </div>

            {/* Mobile Dropdown: Batch of Admission */}
            <div className="w-full md:hidden space-y-1.5">
              <label
                htmlFor="batch-admission-select"
                className="block text-[11px] font-mono-code uppercase tracking-wider text-gray-400 px-1"
              >
                Batch of admission
              </label>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <select
                  id="batch-admission-select"
                  value={selectedBatch}
                  onChange={e => setSelectedBatch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0e1319] border border-white/10 text-white focus:outline-none focus:border-primary text-sm font-mono-code transition-colors cursor-pointer"
                >
                  {batches.map(batch => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                  <option value="All">All Batches</option>
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Batch Tabs */}
          <div className="hidden md:flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2" role="tablist" aria-label="Batch of admission">
              {[...batches, 'All'].map(tab => {
                const isActive = selectedBatch === tab;
                const count =
                  tab === 'All'
                    ? allAlumni.length
                    : allAlumni.filter(a => a.batch === tab).length;
                return (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedBatch(tab)}
                    className={`relative px-4 py-2 rounded-full text-xs font-mono-code transition-colors flex items-center gap-2 ${
                      isActive
                        ? 'text-[#0b0f14] font-bold'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="alumniBatchTab"
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 rounded-full btn-cyber-primary shadow-lg -z-10"
                      />
                    )}
                    <span className="relative z-10">
                      {tab === 'All' ? 'All batches' : tab}
                    </span>
                    <span
                      className={`relative z-10 text-[10px] tabular-nums px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-black/15 text-[#0b0f14]' : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-mono-code tabular-nums text-gray-400">
              Showing {filteredAlumni.length} {filteredAlumni.length === 1 ? 'alumnus' : 'alumni'} · A–Z
            </span>
          </div>
        </div>

        {/* Alumni Grid: 2 Columns on Desktop, Card List Style on Mobile, Alphabetical Order */}
        <div className="max-w-5xl mx-auto">
          {filteredAlumni.length === 0 ? (
            <div className="text-center py-20 px-6 glass-card rounded-3xl border-t-[1.5px] border-t-white/30 space-y-4">
              <p className="text-gray-200 font-display text-xl font-bold">
                No alumni match your filter
              </p>
              <p className="text-gray-400 font-mono-code text-xs">
                Try clearing your search or switching to another batch.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedBatch('All');
                }}
                className="btn-cyber-primary px-6 py-2.5 rounded-full text-sm font-bold"
              >
                Show all alumni
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {filteredAlumni.map((alum, index) => {
                const linkedinUrl = hasValidLink(alum.linkedin) ? alum.linkedin!.trim() : '';
                const websiteUrl = hasValidLink(alum.website) ? alum.website!.trim() : '';
                const hasAnyLink = Boolean(linkedinUrl || websiteUrl);

                return (
                <motion.div
                  key={`${alum.batch}-${alum.name}-${index}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.03, 0.36),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className="glass-card p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-3 border-t-[1.5px] border-t-white/35 group hover:border-primary/40 transition-all duration-300 h-full">
                    <div className="flex items-center space-x-3.5 sm:space-x-4 min-w-0">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#0e1319] border border-primary/40 group-hover:border-primary transition-colors">
                        <ProtectedImage
                          src={alum.image || '/placeholder.svg'}
                          alt={alum.name}
                        />

                        {hasAnyLink && (
                          <div className="absolute bottom-1 left-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-10">
                            {linkedinUrl && (
                              <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-6 h-6 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-primary hover:border-primary/50 transition-colors shadow-md"
                                aria-label={`${alum.name} LinkedIn`}
                              >
                                <Linkedin size={11} />
                              </a>
                            )}
                            {websiteUrl && (
                              <a
                                href={websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-6 h-6 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-primary hover:border-primary/50 transition-colors shadow-md"
                                aria-label={`${alum.name} Website`}
                              >
                                <Globe size={11} />
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-primary transition-colors truncate">
                          {alum.name}
                        </h3>

                        <div className="flex items-center gap-1.5 text-primary text-xs font-mono-code mb-1">
                          <GraduationCap size={13} className="flex-shrink-0" />
                          <span className="truncate">IGNITE Alumnus</span>
                        </div>

                        <span className="inline-block px-2 py-0.5 bg-white/5 rounded-full text-[10px] font-mono-code text-gray-400 border border-white/5">
                          {alum.batch}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alumni;
