'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Menu, X, Play, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
import { useEvidence } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    setIsDrawerOpen, 
    judgeMode, 
    setJudgeMode, 
    judgeStep, 
    setJudgeStep,
    reports,
    setSelectedReport
  } = useEvidence();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for header background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Story', href: '#story' },
    { name: 'Digital Twin', href: '#digital-twin' },
    { name: 'Intelligence', href: '#ai-vision' },
    { name: 'Risk Observatory', href: '#risk-observatory' },
    { name: 'Impact', href: '#impact' },
    { name: 'Technology', href: '#technology' },
  ];

  // Guided tour steps configuration
  const tourSteps = [
    {
      step: 1,
      targetId: 'problem',
      title: 'The Critical Heritage Gap',
      desc: 'Monuments deteriorate 24/7, but inspection is fragmented, manual, and reactive.',
    },
    {
      step: 2,
      targetId: 'core-concept',
      title: 'The Solution: Digital Memory',
      desc: 'Connecting fragmented evidence through the progression: Remember → Understand → Preserve.',
    },
    {
      step: 3,
      targetId: 'digital-twin',
      title: 'Interactive 3D Digital Twin',
      desc: 'Scrub the temporal timeline (2018–2026) and switch layers to inspect cracks and rising dampness.',
    },
    {
      step: 4,
      targetId: 'ai-vision',
      title: 'Computer Vision Scan',
      desc: 'CNNs and Vision Transformers scan surface textures to automatically map anomalies.',
    },
    {
      step: 5,
      targetId: 'evidence-engine',
      title: 'Evidence-Aware Confidence',
      desc: 'AI does not replace experts: we segment predictions into Documented, Inferred, and Uncertain.',
    },
    {
      step: 6,
      targetId: 'risk-observatory',
      title: 'Explainable Risk Index & Alerting',
      desc: 'Risk = Severity × Rate of Change × Significance × Exposure. P1 structures get immediate routing.',
    },
    {
      step: 7,
      targetId: 'national-grid',
      title: 'Hierarchical National Scale',
      desc: 'Scaling from a single pilot monument to state hubs, into a unified National Heritage Grid.',
    }
  ];

  const handleTourStep = (stepNum: number) => {
    setJudgeStep(stepNum);
    const stepConfig = tourSteps.find(s => s.step === stepNum);
    if (stepConfig) {
      // Ensure we are on the homepage
      if (pathname !== '/') {
        router.push('/');
        setTimeout(() => scrollToSection(stepConfig.targetId), 300);
      } else {
        scrollToSection(stepConfig.targetId);
      }

      // Contextual action triggers for specific steps to make it feel super interactive!
      if (stepNum === 5) {
        // Open the evidence drawer with the first AI-Inferred report
        setTimeout(() => {
          setSelectedReport(reports[1]);
        }, 800);
      } else {
        // Close drawer for other steps to clean layout
        setIsDrawerOpen(false);
      }
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const startTour = () => {
    setJudgeMode(true);
    handleTourStep(1);
    setMobileMenuOpen(false);
  };

  const exitTour = () => {
    setJudgeMode(false);
    setIsDrawerOpen(false);
    setSelectedReport(null);
  };

  return (
    <>
      <header className={`fixed top-0 inset-x-0 h-20 z-40 transition-all duration-300 border-b ${
        scrolled ? 'bg-sentinel-obsidian/90 backdrop-blur-md border-white/10' : 'bg-transparent border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-xl md:text-2xl tracking-[0.2em] text-white group-hover:text-sentinel-gold transition-colors duration-300">
              HERITAGE <span className="text-sentinel-gold font-sans font-light">SENTINELS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((link) => {
              const isHashActive = pathname === '/' && pathname.includes(link.href);
              return (
                <button
                  key={link.name}
                  onClick={() => {
                    if (pathname !== '/') {
                      router.push('/');
                      setTimeout(() => scrollToSection(link.href.slice(1)), 300);
                    } else {
                      scrollToSection(link.href.slice(1));
                    }
                  }}
                  className={`font-sans text-xs uppercase tracking-widest hover:text-sentinel-gold transition-colors duration-300 relative py-1 cursor-pointer ${
                    isHashActive ? 'text-sentinel-gold' : 'text-zinc-400'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            {/* Judge Mode Switcher */}
            <button
              onClick={judgeMode ? exitTour : startTour}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-sans font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 ${
                judgeMode 
                  ? 'bg-sentinel-gold text-black border-sentinel-gold hover:bg-white hover:border-white' 
                  : 'bg-white/5 border-white/10 text-white hover:border-sentinel-gold hover:text-sentinel-gold'
              }`}
            >
              {judgeMode ? <LogOut size={12} /> : <Play size={12} fill="currentColor" />}
              <span>{judgeMode ? 'Exit Tour' : 'Judge Mode'}</span>
            </button>

            {/* Main Portal Redirect */}
            <button
              onClick={() => {
                if (pathname !== '/') {
                  router.push('/');
                  setTimeout(() => scrollToSection('digital-twin'), 300);
                } else {
                  scrollToSection('digital-twin');
                }
              }}
              className="px-4 py-2 border border-sentinel-gold/30 hover:border-sentinel-gold bg-sentinel-gold/10 hover:bg-sentinel-gold hover:text-black text-[10px] font-sans font-bold uppercase tracking-widest transition-all duration-300 rounded cursor-pointer"
            >
              ENTER SENTINEL
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 inset-x-0 bg-sentinel-obsidian border-b border-white/10 z-30 lg:hidden flex flex-col p-6 gap-6"
          >
            {links.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (pathname !== '/') {
                    router.push('/');
                    setTimeout(() => scrollToSection(link.href.slice(1)), 300);
                  } else {
                    scrollToSection(link.href.slice(1));
                  }
                }}
                className="text-left font-sans text-xs uppercase tracking-widest text-zinc-400 hover:text-white"
              >
                {link.name}
              </button>
            ))}
            
            <button
              onClick={judgeMode ? exitTour : startTour}
              className={`w-full py-3 text-center text-xs font-sans font-bold uppercase tracking-widest border rounded cursor-pointer ${
                judgeMode 
                  ? 'bg-sentinel-gold text-black border-sentinel-gold' 
                  : 'bg-white/5 border-white/10 text-white'
              }`}
            >
              {judgeMode ? 'EXIT JUDGE TOUR' : 'START JUDGE TOUR'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING TOUR CONTROLS PANEL FOR SIH JUDGING */}
      <AnimatePresence>
        {judgeMode && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-6 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[600px] z-50 glass rounded-2xl border border-sentinel-gold/30 shadow-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            {/* Step info */}
            <div className="flex items-start gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-sentinel-gold/15 border border-sentinel-gold/30 flex items-center justify-center text-sentinel-gold font-mono text-sm font-bold flex-shrink-0 mt-0.5 animate-pulse">
                {judgeStep}/7
              </div>
              <div className="flex-1">
                <span className="text-[9px] font-sans tracking-widest text-sentinel-gold uppercase font-bold block">
                  SIH 2026 JUDGE GUIDED TOUR
                </span>
                <h4 className="text-white font-serif text-sm font-bold mt-0.5">
                  {tourSteps[judgeStep - 1].title}
                </h4>
                <p className="text-[11px] text-zinc-400 font-sans mt-1 leading-normal max-w-sm">
                  {tourSteps[judgeStep - 1].desc}
                </p>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t border-white/5 pt-3 md:pt-0 md:border-t-0">
              <button
                onClick={() => handleTourStep(Math.max(1, judgeStep - 1))}
                disabled={judgeStep === 1}
                className="p-2 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30 cursor-pointer"
                aria-label="Previous step"
              >
                <ChevronLeft size={16} />
              </button>
              
              <button
                onClick={() => handleTourStep(Math.min(7, judgeStep + 1))}
                disabled={judgeStep === 7}
                className="px-4 py-2 bg-sentinel-gold text-black text-[10px] font-sans font-bold uppercase tracking-wider rounded-lg hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{judgeStep === 7 ? 'Finish' : 'Next Step'}</span>
                <ChevronRight size={12} />
              </button>

              <button
                onClick={exitTour}
                className="p-2 text-zinc-500 hover:text-sentinel-red transition-colors cursor-pointer"
                title="Exit Guided Tour"
              >
                <LogOut size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
