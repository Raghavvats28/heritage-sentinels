'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ShieldCheck, Flame, Compass, Star, 
  Layers, Sliders, Calendar, AlertTriangle, Activity, 
  MapPin, CheckCircle, Smartphone, Database, Zap, BookOpen 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEvidence } from '../context/CartContext';

gsap.registerPlugin(ScrollTrigger);

// Dynamic loading for heavy 3D canvases
const ScrollCanvas = dynamic(() => import('../components/ScrollCanvas'), { ssr: false });
const Monument3D = dynamic(() => import('../components/Monument3D'), { ssr: false });

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // GSAP scrubbing overlays refs
  const heroTextRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);

  const { reports, setSelectedReport, judgeMode, judgeStep } = useEvidence();

  // 3D Digital Twin Viewer State
  const [activeLayer, setActiveLayer] = useState<'normal' | 'cracks' | 'moisture' | 'damage' | 'historical' | 'risk'>('normal');
  const [timelineYear, setTimelineYear] = useState<number>(2026);
  
  // Before/After Slider state
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Core Concept Active Step
  const [activeConceptStep, setActiveConceptStep] = useState<number>(0);

  // Anomaly Risk Calculator Inputs
  const [severity, setSeverity] = useState<number>(8.2);
  const [rateOfChange, setRateOfChange] = useState<number>(7.4);
  const [significance, setSignificance] = useState<number>(9.6);
  const [exposure, setExposure] = useState<number>(6.8);

  const calculatedRisk = (severity * rateOfChange * significance * exposure) / 100;
  const getRiskCategory = (score: number) => {
    if (score > 35) return { label: 'P1 - IMMEDIATE', color: 'text-sentinel-red bg-sentinel-red/10 border-sentinel-red/20' };
    if (score > 20) return { label: 'P2 - SCHEDULED', color: 'text-sentinel-orange bg-sentinel-orange/10 border-sentinel-orange/20' };
    if (score > 10) return { label: 'P3 - ACTIVE MONITORING', color: 'text-sentinel-blue bg-sentinel-blue/10 border-sentinel-blue/20' };
    return { label: 'P4 - ROUTINE', color: 'text-sentinel-green bg-sentinel-green/10 border-sentinel-green/20' };
  };

  // GSAP animation for scrolling storytelling overlays
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=350%',
        scrub: 1,
      }
    });

    tl.to(heroTextRef.current, { opacity: 0, y: -50, duration: 1 })
      .fromTo(text1Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
      .to(text1Ref.current, { opacity: 0, y: -50, duration: 1 }, '+=1')
      .fromTo(text2Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
      .to(text2Ref.current, { opacity: 0, y: -50, duration: 1 }, '+=1')
      .fromTo(text3Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
      .to(text3Ref.current, { opacity: 0, y: -50, duration: 1 });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Before/After Drag Logic
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleSliderMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1 || isDraggingRef.current) handleSliderMove(e.clientX);
  };

  // Core Concept items
  const conceptSteps = [
    { name: 'REMEMBER', title: 'Archival Memory', desc: 'Consolidates historical photographs, inspection logs, excavation records, and ASI catalog registers into a unified dataset.' },
    { name: 'UNDERSTAND', title: '3D Mesh Alignment', desc: 'Combines smartphone video photogrammetry into 3D point clouds, texture coordinates, and mesh structures.' },
    { name: 'DETECT', title: 'AI Anomaly Scan', desc: 'Vision Transformers scan sandstone patterns, automatically registering micro-cracks, spalling, and biogrowth.' },
    { name: 'VERIFY', title: 'Evidence Confidence', desc: 'Assesses evidence confidence. Discrepancies are flagged for human-in-the-loop validation, routing alerts to conservationists.' },
    { name: 'PREDICT', title: 'Temporal Projection', desc: 'Models deterioration curves over time, computing crack widening speeds and moisture expansion trends.' },
    { name: 'PRIORITIZE', title: 'Explainable Risk', desc: 'Runs calculations: Severity × Rate of Change × Significance × Exposure to sort damage from P1 (immediate) to P4.' },
    { name: 'PRESERVE', title: 'Actionable Conservation', desc: 'Generates detailed intervention reports with exact coordinates, reducing inspection times from months to hours.' }
  ];

  return (
    <div className="relative w-full bg-sentinel-obsidian min-h-screen">
      {/* 1. CINEMATIC SCROLL HERO SECTION */}
      <div ref={containerRef} className="relative w-full">
        {/* Canvas renderer */}
        <ScrollCanvas />

        {/* HERO TEXT BLOCK (Overlay 0) */}
        <div 
          ref={heroTextRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-6"
        >
          {/* Volumetric glow lights */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[380px] h-[380px] rounded-full bg-sentinel-gold/10 filter blur-[130px] pointer-events-none" />
          
          <span className="text-[10px] font-sans tracking-[0.4em] uppercase text-sentinel-gold mb-6 font-bold">
            SMART INDIA HACKATHON 2026 PROTOTYPE
          </span>
          
          <h1 className="font-serif text-5xl md:text-8xl tracking-tight text-white max-w-5xl leading-tight font-light">
            Giving India&apos;s heritage a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sentinel-ivory via-sentinel-gold to-sentinel-bronze italic font-serif">
              digital memory.
            </span>
          </h1>
          
          <p className="font-sans text-xs tracking-[0.2em] text-zinc-400 max-w-xl mt-8 leading-relaxed uppercase">
            Evidence-aware intelligence for understanding, predicting, and preserving historic monuments.
          </p>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => document.getElementById('digital-twin')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-sentinel-gold text-black text-xs font-sans font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 rounded cursor-pointer"
            >
              ENTER DIGITAL TWIN
            </button>
            <button 
              onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 border border-white/10 hover:border-sentinel-gold hover:text-sentinel-gold text-white text-xs font-sans font-bold uppercase tracking-widest transition-all duration-300 rounded cursor-pointer"
            >
              EXPLORE STORY
            </button>
          </div>

          <p className="text-[10px] font-sans text-zinc-600 tracking-widest uppercase mt-12 animate-bounce">
            Scroll to begin spatial registration
          </p>
        </div>

        {/* OVERLAY STORY 1 */}
        <div 
          ref={text1Ref}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-6 opacity-0"
        >
          <span className="text-[10px] font-sans tracking-[0.4em] uppercase text-sentinel-gold mb-4 font-bold">
            01 / ARCHIVAL MEMORY
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-white tracking-wide max-w-4xl leading-tight">
            Connecting fragmented historical records.
          </h2>
          <p className="font-sans text-sm text-zinc-400 max-w-lg mt-6 leading-relaxed">
            Heritage Sentinel references decades of manual inspection notes, old drawings, and photographic catalogs, forming a baseline of the monument&apos;s journey.
          </p>
        </div>

        {/* OVERLAY STORY 2 */}
        <div 
          ref={text2Ref}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-6 opacity-0"
        >
          <span className="text-[10px] font-sans tracking-[0.4em] uppercase text-sentinel-gold mb-4 font-bold">
            02 / COMPUTER VISION SWEEP
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-white tracking-wide max-w-4xl leading-tight">
            AI detects micro-fissures and rising dampness.
          </h2>
          <p className="font-sans text-sm text-zinc-400 max-w-lg mt-6 leading-relaxed">
            Vision Transformers segment structural anomalies on high-resolution photogrammetry meshes, mapping weathering indices with geometric precision.
          </p>
        </div>

        {/* OVERLAY STORY 3 */}
        <div 
          ref={text3Ref}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-6 opacity-0"
        >
          <span className="text-[10px] font-sans tracking-[0.4em] uppercase text-sentinel-gold mb-4 font-bold">
            03 / RESOURCE ROUTING
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-white tracking-wide max-w-4xl leading-tight">
            Human-in-the-loop expert prioritization.
          </h2>
          <p className="font-sans text-sm text-zinc-400 max-w-lg mt-6 leading-relaxed">
            When evidence confidence is low, the platform flags the record for manual validation, providing explainable risk metrics to optimize conservation budgets.
          </p>
        </div>
      </div>

      {/* 2. THE EMOTIONAL HOOK */}
      <section id="story" className="relative py-32 px-6 bg-black flex items-center justify-center border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <p className="text-zinc-500 font-sans tracking-[0.4em] text-xs uppercase">
            A TEMPORAL PROMISE
          </p>
          <blockquote className="font-serif text-3xl md:text-5xl text-white leading-relaxed font-light">
            &ldquo;A monument can survive for centuries. <br />
            But the evidence of its condition can disappear in years.&rdquo;
          </blockquote>
          <div className="w-16 h-[1px] bg-sentinel-gold/40 mx-auto" />
          <h3 className="font-serif text-2xl md:text-4xl text-sentinel-gold italic">
            What if we could remember every change?
          </h3>
        </div>
      </section>

      {/* 3. THE GAP / PROBLEM SECTION */}
      <section id="problem" className="py-24 md:py-32 px-6 bg-sentinel-charcoal border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16 space-y-4">
            <span className="text-xs font-sans tracking-[0.3em] text-sentinel-gold uppercase block font-bold">
              THE CONSERVATION CRISIS
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight">
              Heritage deteriorates 24/7.
            </h2>
            <p className="text-sm font-sans text-zinc-400 leading-relaxed max-w-xl">
              But preservation intelligence is often periodic, fragmented, and reactive. Current efforts struggle against systemic diagnostic gaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-sentinel-gold/20 hover:bg-white/[0.02] transition-all duration-300 space-y-4">
              <span className="font-mono text-zinc-700 text-sm font-bold block">01 / WEATHERING</span>
              <h3 className="font-serif text-2xl text-white">Continuous stress</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Pollution, moisture absorption, train vibrations, and human foot traffic wear structural integrity continuously, far outstripping physical patrols.
              </p>
            </div>
            {/* Card 2 */}
            <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-sentinel-gold/20 hover:bg-white/[0.02] transition-all duration-300 space-y-4">
              <span className="font-mono text-zinc-700 text-sm font-bold block">02 / SILOED DATA</span>
              <h3 className="font-serif text-2xl text-white">Fragmented evidence</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Historical records, point clouds, drone inspection folders, and IoT vibration metrics remain scattered across departments, limiting correlation.
              </p>
            </div>
            {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-sentinel-gold/20 hover:bg-white/[0.02] transition-all duration-300 space-y-4">
              <span className="font-mono text-zinc-700 text-sm font-bold block">03 / DELAYED RESPONSE</span>
              <h3 className="font-serif text-2xl text-white">Reactive action</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Intervention typically begins only after deep visible fissures compromise structural load, dramatically inflating conservation costs.
              </p>
            </div>
            {/* Card 4 */}
            <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-sentinel-gold/20 hover:bg-white/[0.02] transition-all duration-300 space-y-4">
              <span className="font-mono text-zinc-700 text-sm font-bold block">04 / TIME GAP</span>
              <h3 className="font-serif text-2xl text-white">Missing timeline</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Without a chronological ledger, researchers cannot model weather deterioration speeds, rendering crack propagation trends invisible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE BIG TRANSFORMATION */}
      <section className="py-24 px-6 bg-black border-t border-white/5 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-sentinel-gold/5 rounded-full filter blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <span className="text-xs font-sans tracking-[0.2em] text-zinc-500 uppercase block">
            THE SYSTEMIC SHIFT
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 md:gap-4">
            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-xl space-y-3">
              <h4 className="text-sm font-sans font-bold tracking-widest text-zinc-400 uppercase">BEFORE PRESCRIPTION</h4>
              <ul className="text-xs text-zinc-500 space-y-2 font-sans">
                <li>• Scattered smartphone photographs</li>
                <li>• Paper inspection logs in drawers</li>
                <li>• Isolated IoT telemetry CSVs</li>
                <li>• Static, offline 3D scans</li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center py-4">
              <span className="text-sentinel-gold text-4xl font-serif tracking-[0.3em] font-light block mb-2">
                SENTINELS
              </span>
              <div className="w-24 h-[1px] bg-sentinel-gold/40" />
              <span className="text-[10px] text-zinc-500 tracking-wider font-mono mt-2 uppercase">INTEGRATING LOGS</span>
            </div>

            <div className="p-6 bg-sentinel-gold/[0.02] border border-sentinel-gold/25 rounded-xl space-y-3">
              <h4 className="text-sm font-sans font-bold tracking-widest text-sentinel-gold uppercase">AFTER PRESCRIPTION</h4>
              <ul className="text-xs text-sentinel-sandstone space-y-2 font-sans">
                <li>• Chronologically registered digital twins</li>
                <li>• Real-time confidence checking models</li>
                <li>• Automated Vision Transformer sweeps</li>
                <li>• Explainable P1–P4 intervention routing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE CORE CONCEPT */}
      <section id="core-concept" className="py-24 md:py-32 px-6 bg-sentinel-charcoal border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-sans tracking-[0.3em] text-sentinel-gold uppercase block font-bold">
              THE INTEL LIFECYCLE
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight">
              A Digital Memory of Heritage
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Interactive Timeline Tabs */}
            <div className="lg:col-span-1 space-y-2">
              {conceptSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveConceptStep(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border font-sans text-xs tracking-wider transition-all duration-300 flex items-center justify-between cursor-pointer ${
                    activeConceptStep === idx 
                      ? 'bg-sentinel-gold text-black border-sentinel-gold font-bold shadow-md' 
                      : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span>{step.name}</span>
                  <span className="font-mono opacity-60">0{idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Showcase Details */}
            <div className="lg:col-span-2 p-8 md:p-12 rounded-2xl glass border border-white/10 relative overflow-hidden min-h-[300px] flex flex-col justify-between">
              {/* Volumetric background lights */}
              <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-sentinel-gold/5 rounded-full filter blur-[60px]" />
              
              <div className="space-y-6">
                <span className="text-[10px] font-mono text-sentinel-gold tracking-[0.2em] border border-sentinel-gold/25 px-2.5 py-1 rounded bg-sentinel-gold/5 uppercase">
                  LIFECYCLE PHASE 0{activeConceptStep + 1}
                </span>
                
                <h3 className="font-serif text-3xl md:text-4xl text-white tracking-wide">
                  {conceptSteps[activeConceptStep].title}
                </h3>
                
                <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                  {conceptSteps[activeConceptStep].desc}
                </p>
              </div>

              <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-zinc-600">
                <span>SYSTEM STATUS: VALIDATED</span>
                <span>SIH PRESERVATION SYSTEM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DIGITAL TWIN - THE MAIN INTERACTIVE WORKSPACE */}
      <section id="digital-twin" className="py-24 md:py-32 px-6 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Controls Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <span className="text-xs font-sans tracking-[0.3em] text-sentinel-gold uppercase block font-bold mb-2">
                  MONUMENT DATA CENTER
                </span>
                <h2 className="font-serif text-4xl text-white tracking-tight leading-none">
                  Enter the Digital Twin
                </h2>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed mt-4">
                  Interact with the 3D spire. Rotate, zoom, and select analysis layers to inspect detected micro-fissures and moisture anomalies chronologically.
                </p>
              </div>

              {/* Analysis Layers Selector */}
              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                <span className="text-[9px] font-sans font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
                  <Layers size={12} /> ANALYSIS LAYERS
                </span>
                <div className="space-y-2">
                  {([
                    { id: 'normal', name: 'Standard Mode' },
                    { id: 'cracks', name: 'Micro-Cracks (ViT)' },
                    { id: 'moisture', name: 'Moisture Map (CNN)' },
                    { id: 'damage', name: 'Surface Degradation' },
                    { id: 'historical', name: 'Archival Comparison' },
                    { id: 'risk', name: 'Risk Observatory' }
                  ] as const).map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id)}
                      className={`w-full text-left px-3 py-2 rounded font-sans text-xs tracking-wider transition-all cursor-pointer ${
                        activeLayer === layer.id 
                          ? 'bg-sentinel-gold/20 text-sentinel-gold border-l-2 border-sentinel-gold'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {layer.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Temporal Timeline scrubbing (2018 - 2026) */}
              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                <span className="text-[9px] font-sans font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
                  <Calendar size={12} /> TEMPORAL REGISTRATION
                </span>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-zinc-400">
                    <span>Year</span>
                    <span className="text-sentinel-gold font-bold">{timelineYear}</span>
                  </div>
                  <input
                    type="range"
                    min="2018"
                    max="2026"
                    step="2"
                    value={timelineYear}
                    onChange={(e) => setTimelineYear(Number(e.target.value))}
                    className="w-full accent-sentinel-gold h-1 bg-zinc-800 rounded cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                    <span>2018</span>
                    <span>2020</span>
                    <span>2022</span>
                    <span>2024</span>
                    <span>2026</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center R3F 3D Canvas Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              <Monument3D layer={activeLayer} timelineYear={timelineYear} />

              {/* Anomaly diagnostics overlay */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Anomaly details */}
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                  <span className="text-[9px] font-sans font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
                    <Activity size={12} /> CHRONOLOGICAL CHANGE LOG
                  </span>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 font-sans">Crack Propagation</span>
                      <span className="font-mono text-white font-medium">
                        {timelineYear === 2018 ? '0.0 cm' : timelineYear === 2020 ? '+1.5 cm' : timelineYear === 2022 ? '+4.2 cm' : timelineYear === 2024 ? '+8.8 cm' : '+12.4 cm'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 font-sans">Moisture Dampness</span>
                      <span className="font-mono text-white font-medium">
                        {timelineYear === 2018 ? '0.2 m²' : timelineYear === 2020 ? '0.4 m²' : timelineYear === 2022 ? '0.9 m²' : timelineYear === 2024 ? '1.3 m²' : '1.8 m²'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 font-sans">Surface Erosion (SfM diff)</span>
                      <span className="font-mono text-white font-medium">
                        {timelineYear === 2018 ? '0.00 %' : timelineYear === 2020 ? '0.12 %' : timelineYear === 2022 ? '0.34 %' : timelineYear === 2024 ? '0.78 %' : '1.14 %'}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-sentinel-orange uppercase font-bold animate-pulse">
                      Status: {timelineYear === 2026 ? 'P1 Action Required' : 'Monitoring'}
                    </span>
                    <span className="text-[8px] font-mono text-zinc-600">PROTOTYPE DEMO</span>
                  </div>
                </div>

                {/* 2. Deterioration Trend Graph (SVG) */}
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col justify-between">
                  <span className="text-[9px] font-sans font-bold tracking-widest text-zinc-500 uppercase block mb-3">
                    WEATHERING DECAY SLOPE
                  </span>
                  
                  {/* Custom SVG line plot */}
                  <div className="h-24 w-full relative">
                    <svg className="w-full h-full" viewBox="0 0 100 40">
                      <path
                        d={
                          timelineYear === 2018 ? "M 10 35 L 30 35" :
                          timelineYear === 2020 ? "M 10 35 L 30 32 L 50 32" :
                          timelineYear === 2022 ? "M 10 35 L 30 32 L 50 26 L 70 26" :
                          timelineYear === 2024 ? "M 10 35 L 30 32 L 50 26 L 70 18 L 90 18" :
                          "M 10 35 L 30 32 L 50 26 L 70 18 L 90 8"
                        }
                        fill="none"
                        stroke="#c5a043"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-700"
                      />
                      <circle cx="10" cy="35" r="1.5" fill="#c5a043" />
                      {timelineYear >= 2020 && <circle cx="30" cy="32" r="1.5" fill="#c5a043" />}
                      {timelineYear >= 2022 && <circle cx="50" cy="26" r="1.5" fill="#c5a043" />}
                      {timelineYear >= 2024 && <circle cx="70" cy="18" r="1.5" fill="#c5a043" />}
                      {timelineYear >= 2026 && <circle cx="90" cy="8" r="1.5" fill="#cc3f3f" className="animate-ping" />}
                    </svg>
                  </div>

                  <div className="flex justify-between text-[9px] font-mono text-zinc-500 mt-2">
                    <span>2018</span>
                    <span>2022</span>
                    <span>2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BEFORE / AFTER VIEW - DRAGGABLE SPLIT VIEW */}
      <section className="py-24 px-6 bg-sentinel-charcoal border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-sans tracking-[0.2em] text-sentinel-gold uppercase block">
              TEMPORAL SPLIT MAPPING
            </span>
            <h3 className="font-serif text-3xl text-white tracking-wide">
              Temporal Difference Analysis
            </h3>
            <p className="text-xs text-zinc-400 font-sans">
              Drag the vertical handle to split comparison between the 2018 Archival Baseline and 2026 Scan anomalies.
            </p>
          </div>

          {/* Interactive Split Container */}
          <div 
            ref={sliderContainerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={() => { isDraggingRef.current = true; }}
            onMouseUp={() => { isDraggingRef.current = false; }}
            onMouseLeave={() => { isDraggingRef.current = false; }}
            className="w-full h-[350px] md:h-[450px] relative rounded-2xl overflow-hidden border border-white/10 select-none cursor-ew-resize"
          >
            {/* Left Image (Baseline) */}
            <div className="absolute inset-0 bg-zinc-900 flex flex-col justify-center items-center">
              <span className="text-8xl select-none filter opacity-35 filter blur-[1px]">🏛️</span>
              <div className="absolute bottom-4 left-4 text-[10px] font-sans tracking-widest text-zinc-500 uppercase bg-black/60 px-3 py-1 rounded border border-white/5">
                2018 ARCHIVAL BASELINE
              </div>
            </div>

            {/* Right Image (Current anomalies, overlays sliding in) */}
            <div 
              className="absolute inset-y-0 right-0 overflow-hidden bg-zinc-950 flex flex-col justify-center items-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div 
                className="absolute inset-0 bg-zinc-950 flex flex-col justify-center items-center"
                style={{ width: sliderContainerRef.current?.getBoundingClientRect().width || 600, transform: `translateX(-${sliderPosition}%)` }}
              >
                {/* Simulated crack lines & moisture zones */}
                <span className="text-8xl select-none relative filter drop-shadow-[0_0_15px_rgba(204,63,63,0.3)]">
                  🏛️
                  <div className="absolute inset-x-0 bottom-4 h-12 bg-sentinel-blue/20 border border-sentinel-blue/40 rounded filter blur-sm" />
                  <div className="absolute top-1/3 left-1/3 w-0.5 h-16 bg-red-600/70 rotate-12" />
                </span>
                
                <div className="absolute bottom-4 right-4 text-[10px] font-sans tracking-widest text-sentinel-gold uppercase bg-black/60 px-3 py-1 rounded border border-sentinel-gold/20">
                  2026 DETERIORATION DETECTED
                </div>
              </div>
            </div>

            {/* Sliding line handle */}
            <div 
              className="absolute inset-y-0 w-0.5 bg-sentinel-gold z-30"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-sentinel-gold text-black flex items-center justify-center font-mono font-bold text-xs shadow-lg border border-white">
                ↔
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. AI VISION SECTION */}
      <section id="ai-vision" className="py-24 md:py-32 px-6 bg-black border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Visual scan container */}
            <div className="relative h-[300px] md:h-[450px] rounded-2xl bg-sentinel-charcoal border border-white/10 p-6 overflow-hidden flex flex-col justify-center items-center">
              
              {/* Laser scanning bar */}
              <div className="absolute left-0 w-full h-1 bg-sentinel-gold/60 shadow-[0_0_15px_#c5a043] z-20 scanner-bar animate-scan" />
              
              {/* Visual representation of a monument detail scan */}
              <div className="text-center relative select-none">
                <span className="text-[140px] block opacity-40">🗿</span>
                
                {/* Crack box outline */}
                <div className="absolute top-10 right-4 p-1.5 border border-sentinel-red bg-sentinel-red/10 rounded flex flex-col items-start gap-1 font-mono text-[9px] text-sentinel-red animate-pulse">
                  <span>[ CRACK_A ]</span>
                  <span>CONFIDENCE: 96%</span>
                </div>

                {/* Moisture box outline */}
                <div className="absolute bottom-6 left-6 p-1.5 border border-sentinel-blue bg-sentinel-blue/10 rounded flex flex-col items-start gap-1 font-mono text-[9px] text-sentinel-blue">
                  <span>[ DAMPNESS_C ]</span>
                  <span>CONFIDENCE: 84%</span>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Vision Transformer (ViT) Segment active
              </div>
            </div>

            {/* Text description */}
            <div className="space-y-6">
              <span className="text-xs font-sans tracking-[0.3em] text-sentinel-gold uppercase block font-bold">
                COMPUTER VISION INTERFACE
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight">
                The Monument has Signals. <br />
                Can AI see them?
              </h2>
              <p className="text-sm font-sans text-zinc-400 leading-relaxed">
                By processing smartphone-acquired imagery, our custom network segments complex architectural textures. Convolutional networks align images across seasons, normalizing shadows and variable field lighting.
              </p>
              
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-sentinel-gold" />
                  <span className="text-xs font-sans text-zinc-300 uppercase tracking-wider">
                    Edge-enhanced crack propagation tracking
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-sentinel-gold" />
                  <span className="text-xs font-sans text-zinc-300 uppercase tracking-wider">
                    Deep texture moisture classification (ResNet / ViT)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-sentinel-gold" />
                  <span className="text-xs font-sans text-zinc-300 uppercase tracking-wider">
                    Biological growth & weed germination segmentations
                  </span>
                </div>
              </div>

              <div className="pt-6">
                <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-3 py-1.5 rounded uppercase">
                  DEMO AI ANALYSIS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. EVIDENCE-AWARE AI - KEY DIFFERENTIATOR */}
      <section id="evidence-engine" className="py-24 md:py-32 px-6 bg-sentinel-charcoal border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-sans tracking-[0.2em] text-sentinel-gold uppercase block font-bold">
              THE CONFIDENCE ENGINE
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight">
              AI should know when it is uncertain.
            </h2>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              We do not replace human experts; we equip them. AI classifications are sorted by confidence metrics to enforce rigorous data provenance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 space-y-6 flex flex-col justify-between hover:border-sentinel-green/30 transition-all duration-300">
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-sentinel-green bg-sentinel-green/10 border border-sentinel-green/20 px-2 py-0.5 rounded uppercase">
                  VERIFIED
                </span>
                <h3 className="font-serif text-2xl text-white">Documented</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Verified by archival logs, catalog entries, and past preservation team signs.
                </p>
              </div>
              <div className="pt-6 border-t border-white/5 flex justify-between items-center font-mono text-xs">
                <span className="text-zinc-500">Confidence</span>
                <span className="text-sentinel-green font-bold">100% (High)</span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 space-y-6 flex flex-col justify-between hover:border-sentinel-blue/30 transition-all duration-300">
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-sentinel-blue bg-sentinel-blue/10 border border-sentinel-blue/20 px-2 py-0.5 rounded uppercase">
                  AI ANALYSIS
                </span>
                <h3 className="font-serif text-2xl text-white">AI-Inferred</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Detected via automated computer vision texture scans of smartphone keyframes.
                </p>
              </div>
              <div className="pt-6 border-t border-white/5 flex justify-between items-center font-mono text-xs">
                <span className="text-zinc-500">Confidence</span>
                <span className="text-sentinel-blue font-bold">89% (Medium)</span>
              </div>
            </div>
            {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 space-y-6 flex flex-col justify-between hover:border-sentinel-orange/30 transition-all duration-300">
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-sentinel-orange bg-sentinel-orange/10 border border-sentinel-orange/20 px-2 py-0.5 rounded uppercase">
                  REVIEW REQUIRED
                </span>
                <h3 className="font-serif text-2xl text-white">Uncertain</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Flagged due to conflicting historical records or poor lighting conditions.
                </p>
              </div>
              <div className="pt-6 border-t border-white/5 flex justify-between items-center font-mono text-xs">
                <span className="text-zinc-500">Confidence</span>
                <span className="text-sentinel-orange font-bold">64% (Low)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FIELD SCAN WORKFLOW / MOBILE SIMULATOR */}
      <section className="py-24 px-6 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Smartphone Simulator */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-[280px] h-[520px] rounded-[36px] border-[6px] border-zinc-800 bg-sentinel-obsidian p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between font-sans">
              {/* Speaker notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-800 rounded-full" />
              
              {/* Phone Header */}
              <div className="pt-4 pb-2 border-b border-white/5 flex justify-between items-center text-[9px] text-zinc-500">
                <span>SENTINEL SCANNER</span>
                <span className="text-sentinel-green animate-pulse">● LIVE</span>
              </div>

              {/* Phone screen content */}
              <div className="flex-1 py-4 flex flex-col justify-center items-center text-center space-y-4 select-none">
                <Smartphone size={40} className="text-sentinel-gold animate-float" />
                <div className="space-y-1">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider">PILOT_TEMPLE_01</h4>
                  <p className="text-[10px] text-zinc-500">GPS: 20.1245 N, 85.8792 E</p>
                </div>
                
                {/* Upload status */}
                <div className="w-full p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex justify-between text-[9px] text-zinc-400">
                    <span>Keyframes captured</span>
                    <span className="text-white font-mono">24 / 40</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-400">
                    <span>Vibration sensor check</span>
                    <span className="text-sentinel-green font-bold">PASS</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-400">
                    <span>Lighting variance</span>
                    <span className="text-sentinel-gold font-bold">OK (NORMALIZED)</span>
                  </div>
                </div>

                <span className="text-[8px] font-mono text-zinc-600 block animate-pulse">
                  UPLOADING INCREMENTAL KEYFRAMES...
                </span>
              </div>

              {/* Phone Footer */}
              <div className="pb-2 border-t border-white/5 pt-2 text-center text-[9px] text-zinc-500">
                ASI FIELD MONITORING PORTAL
              </div>
            </div>
          </div>

          {/* Workflow Text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-sans tracking-[0.3em] text-sentinel-gold uppercase block font-bold">
              THE PRESERVATION WORKFLOW
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight leading-tight">
              From smartphone scan to preservation action.
            </h2>
            <h3 className="font-serif text-2xl text-sentinel-gold font-light">
              No heavy LiDAR or drones required for basic monitoring.
            </h3>
            <p className="text-sm font-sans text-zinc-400 leading-relaxed">
              Our edge-to-cloud architecture allows field officers to capture sequential monument photography via standard smartphones. The images undergo cloud photogrammetry reconstruction, registering changes directly to the 3D twin baseline.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <h4 className="text-sm font-serif text-white">01 / Scan & Capture</h4>
                <p className="text-xs text-zinc-500 font-sans leading-normal mt-1">
                  Field workers upload normal images. GPS coordinates align the location.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-serif text-white">02 / Cloud Alignment</h4>
                <p className="text-xs text-zinc-500 font-sans leading-normal mt-1">
                  COLMAP pipelines register keyframes without rebuilding meshes from scratch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. RISK OBSERVATORY & EXPLAINABLE RISK CALCULATOR */}
      <section id="risk-observatory" className="py-24 md:py-32 px-6 bg-sentinel-charcoal border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Observatory Info (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-sans tracking-[0.3em] text-sentinel-gold uppercase block font-bold mb-2">
                  CONSERVATION COMMAND CENTER
                </span>
                <h2 className="font-serif text-4xl text-white tracking-tight">
                  Where should experts look first?
                </h2>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed mt-4">
                  The Risk Observatory monitors monument network health scores, computing priority scores based on structural exposure, rate of change, and cultural significance.
                </p>
              </div>

              {/* Health Score metrics */}
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-sans text-white">PILOT TEMPLE HEALTH INDEX</span>
                  <span className="text-2xl font-serif text-sentinel-red font-bold animate-pulse">78 / 100</span>
                </div>
                
                <div className="space-y-3">
                  {/* Metric 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>Structural Integrity</span>
                      <span>82%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-sentinel-green" style={{ width: '82%' }} />
                    </div>
                  </div>
                  {/* Metric 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>Surface Condition</span>
                      <span>71%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-sentinel-gold" style={{ width: '71%' }} />
                    </div>
                  </div>
                  {/* Metric 3 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>Moisture Exposure</span>
                      <span>64%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-sentinel-orange" style={{ width: '64%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Score Calculator (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl glass border border-white/10 space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-white tracking-wide">
                  Explainable Risk Calculator
                </h3>
                <p className="text-xs text-zinc-500 font-sans mt-2">
                  Adjust metrics to simulate priority score calculations. Risk = Severity × Rate of Change × Significance × Exposure.
                </p>
              </div>

              {/* Sliders grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Slider 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Severity</span>
                    <span className="font-mono text-sentinel-gold font-bold">{severity}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={severity}
                    onChange={(e) => setSeverity(Number(e.target.value))}
                    className="w-full accent-sentinel-gold h-1 bg-zinc-800 rounded cursor-pointer"
                  />
                </div>
                {/* Slider 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Rate of Change</span>
                    <span className="font-mono text-sentinel-gold font-bold">{rateOfChange}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={rateOfChange}
                    onChange={(e) => setRateOfChange(Number(e.target.value))}
                    className="w-full accent-sentinel-gold h-1 bg-zinc-800 rounded cursor-pointer"
                  />
                </div>
                {/* Slider 3 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Significance</span>
                    <span className="font-mono text-sentinel-gold font-bold">{significance}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={significance}
                    onChange={(e) => setSignificance(Number(e.target.value))}
                    className="w-full accent-sentinel-gold h-1 bg-zinc-800 rounded cursor-pointer"
                  />
                </div>
                {/* Slider 4 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Exposure</span>
                    <span className="font-mono text-sentinel-gold font-bold">{exposure}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={exposure}
                    onChange={(e) => setExposure(Number(e.target.value))}
                    className="w-full accent-sentinel-gold h-1 bg-zinc-800 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Output Result */}
              <div className="p-4 rounded-xl border border-sentinel-gold/20 bg-sentinel-gold/[0.02] flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-[10px] font-sans text-zinc-400 uppercase tracking-widest">
                    COMPUTED RISK SCORE (PROTOTYPE)
                  </h4>
                  <span className="text-4xl font-serif text-white font-bold block mt-1">
                    {calculatedRisk.toFixed(2)}
                  </span>
                </div>
                
                <div className={`px-4 py-2 rounded border font-mono text-xs ${getRiskCategory(calculatedRisk).color}`}>
                  {getRiskCategory(calculatedRisk).label}
                </div>
              </div>
            </div>
          </div>

          {/* Clickable Priority Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {[
              { level: 'P1', name: 'IMMEDIATE INSPECTION', desc: 'Widening structural cracks or moisture anomalies detected on high-significance components under rapid deterioration.' },
              { level: 'P2', name: 'SCHEDULED ASSESSMENT', desc: 'Material weathering or minor biological growth requiring physical verification within the current inspection quarter.' },
              { level: 'P3', name: 'ACTIVE MONITORING', desc: 'Moisture zones stabilized but registered under ongoing vibration exposure near highways or railway loops.' },
              { level: 'P4', name: 'ROUTINE OBSERVATION', desc: 'Stabilized baseline structures showing no significant deterioration markers across temporal scans.' }
            ].map((p, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-xl border border-white/5 bg-white/[0.01] hover:border-sentinel-gold/20 hover:bg-white/[0.02] transition-colors duration-300 space-y-3 cursor-pointer"
              >
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  p.level === 'P1' ? 'text-sentinel-red bg-sentinel-red/10' :
                  p.level === 'P2' ? 'text-sentinel-orange bg-sentinel-orange/10' :
                  p.level === 'P3' ? 'text-sentinel-blue bg-sentinel-blue/10' :
                  'text-sentinel-green bg-sentinel-green/10'
                }`}>
                  {p.level}
                </span>
                <h4 className="font-serif text-base text-white">{p.name}</h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-normal">{p.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 12. NATIONAL HERITAGE GRID - MAP OF INDIA REPRESENTATION */}
      <section id="national-grid" className="py-24 md:py-32 px-6 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Info Grid left (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-sans tracking-[0.3em] text-sentinel-gold uppercase block font-bold">
                SCALABLE INFRASTRUCTURE
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight">
                One Digital Memory. <br />
                A National Heritage Grid.
              </h2>
              <p className="text-sm font-sans text-zinc-400 leading-relaxed">
                Heritage Sentinel is designed to scale hierarchically. Scans from local archaeological field workers register to the Pilot Monument page, sync with District Networks, aggregate at State Portals, and join a unified National Heritage Grid.
              </p>
              
              <div className="space-y-3 pt-4 border-t border-white/5">
                {[
                  { stage: 'PILOT MONUMENT', desc: 'Direct photogrammetry mapping at the structural level.' },
                  { stage: 'DISTRICT NETWORK', desc: 'Local hub aggregating nearby heritage anomalies.' },
                  { stage: 'STATE PORTAL', desc: 'State departments overviewing budgets and allocations.' },
                  { stage: 'NATIONAL HERITAGE GRID', desc: 'Nationwide dashboard tracking structural decay trends.' }
                ].map((s, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="font-mono text-sentinel-gold text-xs mt-0.5">0{idx + 1}</span>
                    <div>
                      <h4 className="text-xs text-white font-sans uppercase font-bold">{s.stage}</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive India Map SVG right (7 cols) */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-[320px] h-[400px] md:w-[420px] md:h-[500px] bg-sentinel-charcoal border border-white/10 rounded-2xl relative p-6 flex flex-col justify-between overflow-hidden">
                <span className="text-[10px] font-sans tracking-widest text-zinc-500 uppercase block">
                  NATIONAL REGISTRY OBSERVATORY
                </span>
                
                {/* Stylized SVG Map of India outline */}
                <div className="flex-1 flex justify-center items-center relative my-4">
                  <svg className="w-56 h-72 text-zinc-800" viewBox="0 0 100 120" fill="currentColor">
                    {/* Simplified India Map path coordinates */}
                    <path d="M 45 10 L 50 15 L 53 12 L 57 15 L 60 10 L 58 5 L 48 4 L 45 10 Z" />
                    <path d="M 45 10 L 40 18 L 35 25 L 30 30 L 25 35 L 20 40 L 15 45 L 18 50 L 25 45 L 35 48 L 45 42 L 55 45 L 60 48 L 70 42 L 80 45 L 85 40 L 80 30 L 75 25 L 70 18 L 60 10 Z" opacity="0.3"/>
                    <path d="M 18 50 L 22 55 L 20 60 L 25 65 L 30 70 L 35 75 L 40 85 L 45 95 L 48 105 L 50 115 L 52 105 L 55 95 L 60 85 L 65 75 L 70 70 L 75 65 L 72 60 L 75 55 L 78 50 Z" opacity="0.3"/>
                  </svg>

                  {/* Active Nodes overlays */}
                  {/* Node 1: Delhi / North */}
                  <div className="absolute top-1/4 left-1/2 w-3.5 h-3.5 rounded-full bg-sentinel-gold/20 border border-sentinel-gold flex items-center justify-center cursor-pointer hover:scale-125 transition-transform" title="Delhi National Grid Node">
                    <div className="w-1.5 h-1.5 rounded-full bg-sentinel-gold" />
                  </div>
                  {/* Node 2: Konark / East */}
                  <div className="absolute top-1/2 left-2/3 w-3.5 h-3.5 rounded-full bg-sentinel-red/25 border border-sentinel-red flex items-center justify-center cursor-pointer hover:scale-125 transition-transform animate-pulse" title="East Hub - Konark Spire">
                    <div className="w-1.5 h-1.5 rounded-full bg-sentinel-red" />
                  </div>
                  {/* Node 3: Hampi / South */}
                  <div className="absolute bottom-1/4 left-1/2 w-3.5 h-3.5 rounded-full bg-sentinel-green/20 border border-sentinel-green flex items-center justify-center cursor-pointer hover:scale-125 transition-transform" title="South Hub - Hampi Pillars">
                    <div className="w-1.5 h-1.5 rounded-full bg-sentinel-green" />
                  </div>
                  {/* Node 4: Ajanta / West */}
                  <div className="absolute top-1/2 left-2/5 w-3.5 h-3.5 rounded-full bg-sentinel-blue/20 border border-sentinel-blue flex items-center justify-center cursor-pointer hover:scale-125 transition-transform" title="West Hub - Ajanta Caves">
                    <div className="w-1.5 h-1.5 rounded-full bg-sentinel-blue" />
                  </div>
                </div>

                <div className="text-[9px] font-mono text-zinc-600 flex justify-between border-t border-white/5 pt-2">
                  <span>ACTIVE pilot HUBS: 4</span>
                  <span>SIMULATED MAP NETWORK</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 13. EDITORIAL IMPACT CARDS */}
      <section id="impact" className="py-24 md:py-32 px-6 bg-sentinel-charcoal border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-4">
            <div>
              <span className="text-xs font-sans tracking-[0.3em] text-sentinel-gold uppercase block mb-3 font-bold">
                THE VALUE METRIC
              </span>
              <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight">
                Preservation Impact
              </h2>
            </div>
            <p className="text-xs font-sans tracking-widest text-zinc-500 uppercase">
              SMART INDIA HACKATHON 2026 OUTCOMES
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Impact 1 */}
            <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
              <span className="text-sentinel-gold text-lg font-mono">01</span>
              <h3 className="font-serif text-2xl text-white">Social & Cultural preservation</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Prevents the irreversible loss of ancient structures by catching sub-surface mortar cracks before masonry collapse. Establishes an immutable chronological baseline of India&apos;s architectural wonders accessible for future generations.
              </p>
            </div>
            {/* Impact 2 */}
            <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
              <span className="text-sentinel-gold text-lg font-mono">02</span>
              <h3 className="font-serif text-2xl text-white">Operational & Budget optimization</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Maximized local conservation team efficiency by automatically routing specialists to structural anomalies marked as P1 priority, reducing manual survey cycles and optimizing state department allocations.
              </p>
            </div>
            {/* Impact 3 */}
            <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
              <span className="text-sentinel-gold text-lg font-mono">03</span>
              <h3 className="font-serif text-2xl text-white">Academic & Research datasets</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Compiles structured decay slope databases detailing sandstone deterioration velocities under variable micro-climatic humidity levels, providing materials science academics with precise time-series datasets.
              </p>
            </div>
            {/* Impact 4 */}
            <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
              <span className="text-sentinel-gold text-lg font-mono">04</span>
              <h3 className="font-serif text-2xl text-white">Governance & Disaster resilience</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Allows rapid post-earthquake or post-flood integrity scans by comparing post-event smartphone scans against baseline digital twins, identifying structural shifts within hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 14. TECH ARCHITECTURE & RESEARCH CREDIBILITY */}
      <section id="technology" className="py-24 md:py-32 px-6 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Pipeline flowchart representation */}
            <div className="p-6 rounded-2xl bg-sentinel-charcoal border border-white/10 space-y-6">
              <span className="text-[10px] font-sans tracking-widest text-zinc-500 uppercase">
                SYSTEM PIPELINE & TECH STACK
              </span>
              
              <div className="space-y-4">
                {/* Layer 1 */}
                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
                  <span className="text-[9px] font-mono text-sentinel-gold uppercase font-bold">1. INPUT LAYER</span>
                  <h4 className="text-xs text-white font-sans font-bold">Multi-Source Evidence Capture</h4>
                  <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                    RGB frames from standard smartphones, coordinates (GPS), historical catalog registries, and local moisture/humidity sensors.
                  </p>
                </div>

                {/* Layer 2 */}
                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
                  <span className="text-[9px] font-mono text-sentinel-gold uppercase font-bold">2. INTELLIGENCE LAYER</span>
                  <h4 className="text-xs text-white font-sans font-bold">Edge-to-Cloud Diagnostic Engines</h4>
                  <p className="text-[11px] text-zinc-500 font-sans leading-relaxed font-mono">
                    Structure-from-Motion (SfM / COLMAP) + Open3D alignment · Convolutional image registration · Vision Transformers (ViT) anomaly segmentation · OCR catalog matching.
                  </p>
                </div>

                {/* Layer 3 */}
                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
                  <span className="text-[9px] font-mono text-sentinel-gold uppercase font-bold">3. OUTPUT LAYER</span>
                  <h4 className="text-xs text-white font-sans font-bold">Actionable Diagnostic Dashboards</h4>
                  <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                    Three.js interactive digital twins, temporal erosion graphs, explainable risk calculations, and automated alerts.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between text-xs text-zinc-400 font-mono">
                <span>Stack</span>
                <span className="text-sentinel-gold">Python · PyTorch · FastAPI · Django · React · PostgreSQL</span>
              </div>
            </div>

            {/* Academic Credibility details */}
            <div className="space-y-8">
              <div>
                <span className="text-xs font-sans tracking-[0.3em] text-sentinel-gold uppercase block font-bold mb-2">
                  SCIENTIFIC VALDIATION
                </span>
                <h2 className="font-serif text-4xl text-white tracking-tight">
                  Built on established research.
                </h2>
                <p className="text-sm text-zinc-400 font-sans leading-relaxed mt-4">
                  The Heritage Sentinel framework integrates peer-reviewed methodologies in computer vision and photogrammetry:
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-sans font-bold text-sentinel-gold uppercase">PHOTOGRAMMETRY REFERENCES</h4>
                  <p className="text-xs text-zinc-400 font-sans leading-normal mt-1">
                    Uses Structure-from-Motion (SfM) algorithms (Westoby et al., 2012) and NeRF networks (Mildenhall et al., 2020) for edge-to-cloud mesh reconstruction.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-sans font-bold text-sentinel-gold uppercase">ANOMALY SEGMENTATION</h4>
                  <p className="text-xs text-zinc-400 font-sans leading-normal mt-1">
                    Employs custom convolutional neural architectures and Vision Transformers (ViT) to segment masonry fractures (Cha et al., 2017).
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-sans font-bold text-sentinel-gold uppercase">METADATA STANDARDS</h4>
                  <p className="text-xs text-zinc-400 font-sans leading-normal mt-1">
                    Aligns records with CIDOC-CRM (Conceptual Reference Model, ISO 21127) schemas to ensure interoperability.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 15. CHALLENGES AND STRATEGIC MITIGATIONS */}
      <section className="py-24 px-6 bg-sentinel-charcoal border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-sans tracking-[0.2em] text-sentinel-gold uppercase block font-bold">
              SYSTEMIC RELIABILITY
            </span>
            <h2 className="font-serif text-4xl text-white tracking-wide">
              Challenges & Strategic Mitigations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-white/[0.01] border border-white/5 space-y-4">
              <h4 className="font-serif text-lg text-white">AI Hallucinations</h4>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                **Challenge**: Computer vision models misidentifying complex masonry reliefs or shadows as fissures.
              </p>
              <p className="text-xs text-sentinel-gold font-sans leading-relaxed">
                **Mitigation**: Differentiating predictions into Documented, AI-Inferred, and Uncertain categories, locking verified logs only.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-white/[0.01] border border-white/5 space-y-4">
              <h4 className="font-serif text-lg text-white">Computational Complexity</h4>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                **Challenge**: Rebuilding dense 3D meshes from scratch daily requires massive cloud server workloads.
              </p>
              <p className="text-xs text-sentinel-gold font-sans leading-relaxed">
                **Mitigation**: Implementing incremental reconstruction, aligning new scan keyframes directly onto the baseline twin.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/[0.01] border border-white/5 space-y-4">
              <h4 className="font-serif text-lg text-white">Highly Variable Lighting</h4>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                **Challenge**: Changing shadows and weather patterns disrupt texture registration accuracy across seasons.
              </p>
              <p className="text-xs text-sentinel-gold font-sans leading-relaxed">
                **Mitigation**: Applying automated photometric normalization and texture color corrections before parsing models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 16. THE FINAL EMOTIONAL SCENE */}
      <section className="py-32 px-6 bg-black flex flex-col justify-center items-center text-center border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-8 select-none">
          <span className="text-[120px] block filter drop-shadow-[0_0_20px_rgba(255,255,255,0.05)] animate-float">
            🏛️
          </span>
          
          <blockquote className="font-serif text-2xl md:text-3xl text-zinc-400 leading-relaxed font-light italic">
            &ldquo;A monument can survive for centuries. <br />
            But the evidence of its condition can disappear in years.&rdquo;
          </blockquote>

          <h2 className="font-serif text-4xl md:text-6xl text-white font-light tracking-[0.2em]">
            HERITAGE <span className="text-sentinel-gold font-sans font-bold">SENTINELS</span>
          </h2>
          
          <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest leading-relaxed max-w-lg mx-auto">
            Giving India&apos;s heritage a digital memory — and a chance to survive its future.
          </p>

          <p className="text-[10px] font-sans text-sentinel-gold tracking-[0.3em] uppercase pt-4 font-bold">
            SMART INDIA HACKATHON 2026
          </p>
        </div>
      </section>

      {/* 17. FINAL CTA */}
      <section className="py-20 px-6 bg-sentinel-charcoal border-t border-white/5 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h3 className="font-serif text-2xl md:text-3xl text-white">Enter the Sentinel</h3>
          <p className="text-xs text-zinc-400 font-sans max-w-md mx-auto">
            Access active dashboards, trigger incremental cloud photogrammetry alignments, and inspect explainable risk maps.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => document.getElementById('digital-twin')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full md:w-auto px-6 py-3 bg-sentinel-gold hover:bg-sentinel-gold/90 text-black text-xs font-sans font-bold uppercase tracking-widest transition-all rounded cursor-pointer"
            >
              EXPLORE DIGITAL TWIN
            </button>
            <button 
              onClick={() => document.getElementById('core-concept')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full md:w-auto px-6 py-3 border border-white/10 hover:border-white/20 text-white text-xs font-sans font-bold uppercase tracking-widest transition-all rounded cursor-pointer"
            >
              VIEW PRESERVATION WORKFLOW
            </button>
            <button 
              onClick={() => document.getElementById('risk-observatory')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full md:w-auto px-6 py-3 border border-white/10 hover:border-white/20 text-white text-xs font-sans font-bold uppercase tracking-widest transition-all rounded cursor-pointer"
            >
              OPEN RISK OBSERVATORY
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-sentinel-obsidian border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="font-serif text-2xl tracking-[0.2em] text-white">
            HERITAGE <span className="text-sentinel-gold font-sans font-bold">SENTINELS</span>
          </div>
          <p className="text-[10px] text-zinc-600 font-sans tracking-widest leading-relaxed uppercase max-w-md mx-auto">
            PRODUCED BY TEAM HERITAGE SENTINELS FOR SIH 2026. PROBLEM STATEMENT: EVIDENCE-AWARE HERITAGE PRESERVATION INTELLIGENCE SYSTEM.
          </p>
        </div>
      </footer>
    </div>
  );
}
