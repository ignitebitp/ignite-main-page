'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Image as ImageIcon, Download, Terminal, Sparkles } from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';
import { api, API_URL } from '@/lib/api';

const CATEGORIES = ['All', 'Inauguration', 'Hackathon', 'Workshop', 'Gaming', 'General'];

const Gallery: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGallery().then(data => {
      setItems(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredItems = filter === 'All'
    ? items
    : items.filter(item => item.category === filter);

  const resolveUrl = (path: string | undefined) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_URL}${cleanPath}`;
  };

  const getCover = (item: any) => resolveUrl(item.image || item.coverUrl);

  const handleCardClick = (item: any) => {
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedImage(item);
    }
  };

  const getInternalImages = (item: any) => {
    const list: string[] = [];
    if (item.image) list.push(resolveUrl(item.image));
    if (item.images && Array.isArray(item.images)) {
      item.images.forEach((img: string) => {
        if (img) list.push(resolveUrl(img));
      });
    }
    return [...new Set(list)];
  };

  const downloadImage = async (url: string, title: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const ext = url.split('.').pop()?.split('?')[0] || 'webp';
      link.download = `${title.replace(/\s+/g, '_')}_${index + 1}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen container mx-auto px-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-primary font-mono-code text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
          <span>Synchronizing visual repository...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        <SectionWrapper className="mb-14 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white mb-4">
            Moments & Gallery.{' '}
            <span className="font-editorial text-primary font-normal block sm:inline">
              The Visual Chronicle.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Capturing the spirit of technical innovation, sprint victories, and engineering community at BIT Mesra.
          </p>
        </SectionWrapper>

        {/* Specular Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-mono-code transition-all ${
                filter === cat
                  ? 'btn-cyber-primary shadow-lg'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                onClick={() => handleCardClick(item)}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer glass-card border-t-[1.5px] border-t-white/35 shadow-2xl"
              >
                {getCover(item) ? (
                  <img
                    src={getCover(item)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#0e1319]">
                    <ImageIcon className="w-10 h-10 text-gray-600" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14] via-[#0b0f14]/40 to-transparent p-5 flex flex-col justify-end text-left">
                  <p className="text-[10px] text-primary font-mono-code font-bold mb-1 uppercase tracking-widest">
                    {item.category}
                  </p>
                  <h3 className="text-base font-display font-bold text-white leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  {(item.link || (item.images && item.images.length > 0)) && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <ImageIcon className={`w-3.5 h-3.5 ${item.link ? 'text-cyber-green' : 'text-primary'}`} />
                      <span className={`text-[11px] font-mono-code ${item.link ? 'text-cyber-green' : 'text-primary'}`}>
                        {item.link ? 'EXTERNAL ALBUM' : `${(item.images?.length || 0) + (item.image ? 1 : 0)} PHOTOS`}
                      </span>
                    </div>
                  )}
                </div>

                {item.link && (
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 flex items-center gap-1.5">
                    <ExternalLink className="w-3 h-3 text-cyber-green" />
                    <span className="text-[10px] text-cyber-green font-mono-code">GOOGLE PHOTOS</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center glass-card rounded-2xl max-w-md mx-auto">
            <p className="text-gray-400 font-mono-code text-sm">No archive items found in this category.</p>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl p-4 md:p-8 overflow-y-auto"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-7xl mx-auto w-full min-h-full flex flex-col">
              <div className="flex justify-between items-center mb-8 py-4 border-b border-white/10 sticky top-0 bg-[#0b0f14]/80 backdrop-blur-md z-10 px-4 rounded-xl">
                <div className="text-left">
                  <span className="text-primary font-mono-code text-xs uppercase tracking-widest mb-1 block">
                    {selectedImage.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
                    {selectedImage.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {getInternalImages(selectedImage).map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="aspect-[4/3] rounded-2xl overflow-hidden glass-card border-t-[1.5px] border-t-white/30 group relative shadow-xl"
                  >
                    <img
                      src={img}
                      alt={`${selectedImage.title} - ${idx}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as any).src = 'https://placehold.co/600x400?text=Image+Not+Found';
                      }}
                    />

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(img, selectedImage.title, idx);
                        }}
                        className="btn-cyber-primary px-5 py-2.5 text-xs font-mono-code rounded-full flex items-center gap-2"
                      >
                        <Download size={14} />
                        <span>Download Raw</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
