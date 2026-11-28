import React, { useState, useEffect } from 'react';
import { Link, useLocation } from '../lib/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, User, ArrowUpRight } from 'lucide-react';
import { api } from '../lib/api';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  if (location.pathname === '/exam') return null; // Hide Navbar on exam page

  useEffect(() => {
    api.getAllEvents().then(events => {
      const featured = events.filter(e => e.type === 'mega' && e.isFeatured);
      setFeaturedEvents(featured);
    }).catch(() => { });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem('ignite_admin_token');
    if (token) {
      api.verifyToken().then(res => setIsLoggedIn(res.valid)).catch(() => setIsLoggedIn(false));
    }
  }, [location]);

  const customRoutes: Record<string, string> = {
    'inginiux': '/inginiux',
  };

  const getEventPath = (eventName: string) => {
    const lowerName = eventName.toLowerCase();
    for (const key in customRoutes) {
      if (lowerName.includes(key)) {
        return customRoutes[key];
      }
    }
    return `/${lowerName.replace(/\s+/g, '-')}`;
  };

  const navLinks: { label: string; path: string; featured?: boolean }[] = [
    { label: 'Home', path: '/' },
    { label: 'Team', path: '/team' },
    { label: 'Alumni', path: '/alumni' },
    { label: 'Events', path: '/events' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Recruit', path: '/recruit' },
    ...featuredEvents.map(e => ({
      label: e.name,
      path: getEventPath(e.name),
      featured: true
    })),
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none pt-[max(0.75rem,env(safe-area-inset-top))] md:pt-4 transition-all duration-300">
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto transition-all duration-300 w-[94%] max-w-6xl glass-island-nav rounded-full px-4 md:px-5 flex items-center justify-between ${
            scrolled ? 'py-2 shadow-2xl backdrop-blur-2xl' : 'py-3'
          }`}
        >
          {/* Left: Brand Logo & Title */}
          <Link to="/" className="flex items-center space-x-2.5 group pr-2">
            <motion.div
              className="relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/image.png"
                alt="IGNITE"
                className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(255,140,90,0.65)] group-hover:drop-shadow-[0_0_20px_rgba(255,140,90,0.9)] transition-all duration-300"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-display font-extrabold tracking-tight text-white group-hover:text-primary transition-colors flex items-center gap-1.5">
                IGNITE
              </span>
            </div>
          </Link>

          {/* Center: Gliding Navigation Pill */}
          <nav className="hidden lg:flex items-center space-x-0.5">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onMouseEnter={() => setHoveredPath(item.path)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className={`relative px-3.5 py-1.5 text-xs md:text-sm font-medium transition-colors duration-200 rounded-full z-10 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1">
                    {item.label}
                    {item.featured && (
                      <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                    )}
                  </span>

                  {/* Active Link Gliding Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-white/10 rounded-full border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.4)] -z-10"
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}

                  {/* Hover Pill */}
                  {!isActive && hoveredPath === item.path && (
                    <motion.div
                      layoutId="hoverNavPill"
                      className="absolute inset-0 bg-white/5 rounded-full -z-10"
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Register CTA + Mobile Trigger */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Primary Action Button (Cyber Violet Pill) */}
            <Link
              to={isLoggedIn ? '/profile' : '/register'}
              className="btn-cyber-violet hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs md:text-sm font-medium tracking-wide shadow-md"
            >
              {isLoggedIn ? (
                <>
                  <User className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </>
              ) : (
                <>
                  <span>Register</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                </>
              )}
            </Link>

            {!isLoggedIn && (
              <Link
                to="/login"
                className="hidden md:inline-flex text-xs font-mono-code text-gray-400 hover:text-white transition-colors px-2 py-1"
              >
                Login
              </Link>
            )}

            {/* Mobile Hamburger Trigger (44px touch hit slop) */}
            <button
              className="lg:hidden relative text-white p-2.5 rounded-lg hover:bg-white/10 transition-colors focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.18, ease: 'easeIn' } }}
            className="lg:hidden fixed inset-0 z-40 bg-[#0b0f14]/98 backdrop-blur-2xl flex flex-col justify-between pt-24 pb-[max(2rem,env(safe-area-inset-bottom))] px-6 overflow-y-auto"
          >
            <div className="flex flex-col space-y-4">
              <span className="text-xs font-mono-code text-primary uppercase tracking-widest pl-2">
                // NAVIGATION PROTOCOL
              </span>

              {navLinks.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block py-2.5 px-4 rounded-xl text-xl font-display font-bold transition-all ${
                        isActive
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {item.featured && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono-code">
                            FEATURED
                          </span>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile bottom actions */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <Link
                to={isLoggedIn ? '/profile' : '/register'}
                onClick={() => setIsOpen(false)}
                className="w-full btn-cyber-violet py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-center"
              >
                {isLoggedIn ? 'Access Profile' : 'Register for Club'}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              {!isLoggedIn && (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full block py-2.5 rounded-xl text-center text-sm font-mono-code text-gray-400 hover:text-white bg-white/5"
                >
                  Member Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
