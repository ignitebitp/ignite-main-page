'use client';

import React, { useMemo, useState } from 'react';
import SectionWrapper from '@/components/SectionWrapper';
import { ALUMNI_MEMBERS } from '@/data';
import { GraduationCap, Linkedin, ChevronDown, Terminal, Search, Filter } from 'lucide-react';

const Alumni: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [openBatches, setOpenBatches] = useState<Record<string, boolean>>({});

  const batches = useMemo(() => {
    const unique = Array.from(new Set(ALUMNI_MEMBERS.map(a => a.batch)));
    return unique.sort((a, b) => Number(b) - Number(a));
  }, []);

  const filteredAlumni = useMemo(() => {
    return ALUMNI_MEMBERS.filter(alum => {
      const matchesName = alum.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesBatch =
        selectedBatch === 'All' || alum.batch === selectedBatch;

      return matchesName && matchesBatch;
    });
  }, [search, selectedBatch]);

  const alumniByBatch = useMemo(() => {
    return filteredAlumni.reduce<Record<string, typeof ALUMNI_MEMBERS>>(
      (acc, alum) => {
        if (!acc[alum.batch]) acc[alum.batch] = [];
        acc[alum.batch].push(alum);
        return acc;
      },
      {}
    );
  }, [filteredAlumni]);

  const toggleBatch = (batch: string) => {
    setOpenBatches(prev => ({
      ...prev,
      [batch]: !prev[batch],
    }));
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <SectionWrapper className="mb-14 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white mb-4">
            Alumni Network.{' '}
            <span className="font-editorial text-primary font-normal block sm:inline">
              The Living Legacy.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Our legacy continues through innovators, founders, and security researchers who remain an integral part of our journey.
          </p>
        </SectionWrapper>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between max-w-5xl mx-auto mb-14">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Filter by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-sans transition-colors"
            />
          </div>

          <div className="relative w-full md:w-1/3">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0e1319] border border-white/10 text-white focus:outline-none focus:border-primary text-sm font-mono-code transition-colors cursor-pointer"
            >
              <option value="All">All Batches</option>
              {batches.map(batch => (
                <option key={batch} value={batch}>
                  Batch {batch}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alumni by Batch */}
        {Object.keys(alumniByBatch)
          .sort((a, b) => Number(b) - Number(a))
          .map((batch, batchIndex) => {
            const isOpen = openBatches[batch] ?? true;

            return (
              <div key={batch} className="mb-14 max-w-5xl mx-auto">
                <button
                  onClick={() => toggleBatch(batch)}
                  className="w-full flex items-center justify-between pb-4 border-b border-white/10 text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white group-hover:text-primary transition-colors">
                      Class of {batch}
                    </h2>
                    <span className="text-xs font-mono-code px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                      {alumniByBatch[batch].length} MEMBERS
                    </span>
                  </div>
                  <ChevronDown
                    className={`text-gray-400 group-hover:text-white transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    {alumniByBatch[batch].map((alum, index) => (
                      <SectionWrapper
                        key={alum.id}
                        delay={batchIndex * 0.08 + index * 0.04}
                      >
                        <div className="glass-card p-5 rounded-2xl flex items-center justify-between border-t-[1.5px] border-t-white/35 group hover:border-primary/40 transition-all duration-300">
                          <div className="flex items-center space-x-4">
                            <img
                              src={encodeURI(alum.image || '/placeholder.svg')}
                              alt={alum.name}
                              onError={(e: any) => { e.currentTarget.src = '/placeholder.svg'; }}
                              className="w-16 h-16 rounded-xl object-cover border border-primary/40 group-hover:border-primary transition-colors flex-shrink-0"
                            />

                            <div>
                              <h3 className="text-lg font-display font-bold text-white group-hover:text-primary transition-colors">
                                {alum.name}
                              </h3>

                              <div className="flex items-center gap-1.5 text-primary text-xs font-mono-code mb-1">
                                <GraduationCap size={13} />
                                <span>IGNITE ALUMNUS</span>
                              </div>

                              <span className="inline-block px-2 py-0.5 bg-white/5 rounded-full text-[10px] font-mono-code text-gray-400 border border-white/5">
                                Batch {alum.batch}
                              </span>
                            </div>
                          </div>

                          {alum.linkedin && (
                            <a
                              href={alum.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 bg-white/5 rounded-xl hover:bg-primary hover:text-black text-gray-300 transition-all border border-white/10"
                              aria-label={`${alum.name} LinkedIn`}
                            >
                              <Linkedin size={16} />
                            </a>
                          )}
                        </div>
                      </SectionWrapper>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Alumni;
