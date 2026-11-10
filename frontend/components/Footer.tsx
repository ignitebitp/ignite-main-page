import React from 'react';
import { Github, Linkedin, Instagram, Mail, PhoneCall, Radio, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from '../lib/navigation';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#080c10] border-t border-white/10 pt-16 pb-10 overflow-hidden">
      {/* Specular top light line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Column (Spans 2 on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <img
                  src="/image.png"
                  alt="IGNITE"
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,140,90,0.6)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-display font-extrabold tracking-tight text-white">
                  IGNITE
                </span>
                <span className="text-[10px] font-mono-code text-primary tracking-widest uppercase">
                  TECHNICAL INNOVATION SOCIETY
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Fostering innovation, collaborative development, and engineering excellence. We build the future, one line of code at a time.
            </p>

            {/* Institutional Affiliation Badge & Real-time Status Pill */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-code text-gray-300">
                <Radio className="w-3 h-3 text-primary animate-pulse" />
                <span>BIT Mesra Campus Node</span>
              </div>

              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-green/10 border border-cyber-green/30 text-xs font-mono-code text-cyber-green">
                <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping inline-block" />
                <span>System Status: Operational</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-primary mb-4">
              // EXPLORE
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/team" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Events & Hackathons
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Gallery & Moments
                </Link>
              </li>
              <li>
                <Link to="/alumni" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Alumni Network
                </Link>
              </li>
              <li>
                <Link to="/recruit" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Join Recruitment
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs & Archives Column */}
          <div>
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-primary mb-4">
              // ARCHIVES
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/inginiux" className="hover:text-white hover:translate-x-1 inline-block transition-all flex items-center gap-1.5">
                  <span>Inginiux Flagship</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Workshops & Labs
                </Link>
              </li>
              <li>
                <Link to="/developers" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Engineering Team
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Student Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials Column */}
          <div>
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-primary mb-4">
              // CONNECT
            </h4>
            <ul className="space-y-2 text-sm text-gray-400 mb-5">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="font-mono-code text-xs">ignite@bitmesra.ac.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-primary" />
                <span className="font-mono-code text-xs">+91 9386881353</span>
              </li>
              <li className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-primary" />
                <span className="font-mono-code text-xs">+91 9508664027</span>
              </li>
            </ul>

            <div className="flex items-center space-x-2.5">
              <a
                href="https://www.instagram.com/ignite_bitp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/ignite-club-bit-mesra/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <Link
                to="/developers"
                aria-label="Developers Terminal"
                className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/40 transition-all duration-300"
              >
                <Terminal className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Security Disclaimer */}
        <div className="border-t border-white/5 pt-8 text-xs font-mono-code text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyber-green" />
            <p>© {new Date().getFullYear()} IGNITE Technical Club. All rights reserved.</p>
          </div>
          <p className="text-[11px] text-gray-600">
            Engineered with high-tech specular design system. All telemetry operational.
          </p>
          <Link
            to="/developers"
            className="text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
          >
            <span>Developed by Aditya & Kishlaya</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
