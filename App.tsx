import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from "@vercel/analytics/react";

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import AnimatedBackground from './components/AnimatedBackground';

// Pages
import Home from './views/Home';
import Team from './views/Team';
import Alumni from './views/Alumni';
import Events from './views/Events';
import Gallery from './views/Gallery';
import Contact from './views/Contact';
import Developers from './views/Developers';
import Recruit from './views/Recruit';
import Inginiux from './views/Inginiux';
import Exam from './views/Exam';
import Admin from './views/Admin';
import MegaEvent from './views/MegaEvent';
import Profile from './views/Profile';
import Attend from './views/Attend';
import Register from './views/Register';
import Login from './views/Login';

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        <Route path="/alumni" element={<Alumni />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/recruit" element={<Recruit />} />
        <Route path="/inginiux" element={<Inginiux />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/attend" element={<Attend />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/:slug" element={<MegaEvent />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContents: React.FC = () => {
  const { pathname } = useLocation();
  const hideNav = pathname === '/exam';

  return (
    <div className="bg-dark text-white min-h-screen selection:bg-primary selection:text-white">
      <Cursor />
      <AnimatedBackground />
      {!hideNav && <Navbar />}
      <ScrollToTop />
      <main>
        <AnimatedRoutes />
      </main>
      {!hideNav && <Footer />}
      <Analytics />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContents />
    </Router>
  );
};

export default App;