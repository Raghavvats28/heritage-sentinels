'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Compass, Smartphone, Cpu, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formState, setFormState] = useState<'form' | 'processing' | 'success'>('form');
  const [processingStep, setProcessingStep] = useState(0);
  const [inspectorId, setInspectorId] = useState('ASI-2026-088');
  const [monument, setMonument] = useState('Konark Sun Temple - Main Spire');
  const [coordinates, setCoordinates] = useState('20.1245° N, 85.8792° E');
  const [notes, setNotes] = useState('');

  const steps = [
    'Normalizing photogrammetry lighting parameters...',
    'Registering captured keyframes to baseline 3D digital twin...',
    'Sweeping surface textures using Vision Transformers (ViTs)...',
    'Assessing evidence confidence metrics...',
    'Anomaly registry write finalized.'
  ];

  const handleLogCoordinates = () => {
    // Simulating locking GPS coordinates
    setCoordinates('20.1245° N, 85.8792° E (LOCKED)');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('processing');
    setProcessingStep(0);

    // Run a timed sequence to simulate cloud processing
    const interval = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => setFormState('success'), 600);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const locations = [
    {
      city: 'Delhi HQ (Central Monitoring Grid)',
      address: 'ASI Head Office, Janpath, New Delhi, 110011',
      hours: 'Grid Active: 24/7 Monitoring',
      phone: '+91 (11) 2301-4621'
    },
    {
      city: 'East Hub (Konark Station)',
      address: 'Tasting & Conservation Site Office, Puri, Odisha',
      hours: 'Field Hours: 7:00 AM - 6:00 PM',
      phone: '+91 (675) 2555-088'
    },
    {
      city: 'South Hub (Hampi Station)',
      address: 'ASI Site Office, Bellary District, Karnataka',
      hours: 'Field Hours: 7:00 AM - 6:00 PM',
      phone: '+91 (839) 4555-122'
    }
  ];

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-sentinel-obsidian text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-sans tracking-[0.3em] text-sentinel-gold uppercase block font-bold">
            FIELD SCANNERS PORTAL
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-white tracking-tight leading-tight">
            Report An Anomaly
          </h1>
          <p className="text-sm font-sans text-zinc-500">
            Submit smartphone image sequences, log active coordinates, and queue point cloud alignment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Interaction Panel (7 cols) */}
          <div className="lg:col-span-7 p-8 md:p-12 rounded-2xl glass border border-white/10 relative overflow-hidden">
            <AnimatePresence mode="wait">
              
              {/* Form State */}
              {formState === 'form' && (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <span className="text-[10px] font-sans tracking-widest text-zinc-500 uppercase block border-b border-white/5 pb-2">
                    ANOMALY REPORT TRANSMISSION
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-sans tracking-widest text-zinc-400 uppercase font-bold">FIELD OFFICER ID</label>
                      <input 
                        type="text" 
                        required 
                        value={inspectorId}
                        onChange={(e) => setInspectorId(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/10 rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-sentinel-gold transition-colors tracking-wide"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-sans tracking-widest text-zinc-400 uppercase font-bold">MONUMENT SITE</label>
                      <select 
                        value={monument}
                        onChange={(e) => setMonument(e.target.value)}
                        className="w-full bg-sentinel-obsidian border border-white/10 rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-sentinel-gold transition-colors tracking-wide cursor-pointer"
                      >
                        <option>Konark Sun Temple - Main Spire</option>
                        <option>Hampi Stone Chariot - Plinth Base</option>
                        <option>Ajanta Caves - Cave 1 Entrance Pillar</option>
                        <option>Shore Temple Mahabalipuram - East Wall</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-sans tracking-widest text-zinc-400 uppercase font-bold">GPS COORDINATES</label>
                      <button 
                        type="button" 
                        onClick={handleLogCoordinates}
                        className="text-[9px] font-sans tracking-wider text-sentinel-gold uppercase font-bold hover:underline"
                      >
                        [ LOG DEVICE COORDINATES ]
                      </button>
                    </div>
                    <input 
                      type="text" 
                      required 
                      value={coordinates}
                      onChange={(e) => setCoordinates(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/10 rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-sentinel-gold transition-colors tracking-wide font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-sans tracking-widest text-zinc-400 uppercase font-bold">SMARTPHONE CAPTURE FILES</label>
                    <div className="w-full border border-dashed border-white/10 hover:border-sentinel-gold/50 rounded-lg p-6 text-center cursor-pointer transition-colors bg-white/[0.01]">
                      <Smartphone className="mx-auto text-zinc-500 mb-2" size={24} />
                      <span className="text-xs text-zinc-400 font-sans block">Select captured RGB sequence</span>
                      <span className="text-[9px] text-zinc-600 font-mono mt-1 block">MOCKED UPLOAD (24 / 40 keyframes matched)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-sans tracking-widest text-zinc-400 uppercase font-bold">OBSERVATION DETAILS / CRITICAL MARKERS</label>
                    <textarea 
                      rows={4} 
                      required 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Specify material indicators, moisture signs, or micro-cracks details..."
                      className="w-full bg-white/[0.02] border border-white/10 rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-sentinel-gold transition-colors tracking-wide placeholder-zinc-700"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-sentinel-gold hover:bg-sentinel-gold/90 text-black text-xs font-bold font-sans uppercase tracking-widest transition-all duration-300 rounded shadow-[0_0_15px_rgba(197,160,67,0.2)] cursor-pointer"
                  >
                    DISPATCH SCAN TO CLOUD
                  </button>
                </motion.form>
              )}

              {/* Processing State */}
              {formState === 'processing' && (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col justify-center py-12 space-y-8"
                >
                  <div className="space-y-2 text-center">
                    <Cpu size={40} className="mx-auto text-sentinel-gold animate-spin" />
                    <h3 className="font-serif text-2xl text-white font-light tracking-wide">
                      AI RECONSTRUCTION ENGINES ACTIVE
                    </h3>
                    <p className="text-[10px] font-sans text-zinc-500 uppercase tracking-widest">
                      Incremental SfM registration sequence
                    </p>
                  </div>
                  
                  {/* Processing steps list */}
                  <div className="space-y-3 max-w-sm mx-auto">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs font-sans">
                        <div className={`w-2 h-2 rounded-full ${
                          idx < processingStep 
                            ? 'bg-sentinel-green' 
                            : idx === processingStep 
                            ? 'bg-sentinel-gold animate-ping' 
                            : 'bg-zinc-800'
                        }`} />
                        <span className={idx === processingStep ? 'text-white font-bold' : idx < processingStep ? 'text-zinc-500' : 'text-zinc-700'}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Success State */}
              {formState === 'success' && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12 space-y-6"
                >
                  <CheckCircle size={56} className="text-sentinel-green animate-bounce" />
                  <div className="space-y-2">
                    <h3 className="font-serif text-3xl text-white tracking-wide">
                      SCAN REGISTERED
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-xs mx-auto">
                      Reconstruction processed. Anomaly registration added to inbox registry and flagged for verification.
                    </p>
                  </div>
                  <button
                    onClick={() => setFormState('form')}
                    className="px-6 py-2.5 border border-white/10 hover:border-sentinel-gold text-[10px] font-sans font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all duration-300 rounded cursor-pointer"
                  >
                    SUBMIT NEW SCAN
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Physical grid centers (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <span className="text-[10px] font-sans tracking-widest text-zinc-500 uppercase block border-b border-white/5 pb-2">
              GRID COMMAND CENTERS
            </span>
            
            <div className="space-y-6">
              {locations.map((loc, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  key={idx}
                  className="p-6 rounded-xl bg-white/[0.01] border border-white/5 flex gap-4 hover:border-white/10 transition-colors"
                >
                  <span className="text-sentinel-gold mt-1"><MapPin size={18} /></span>
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg text-white tracking-wide font-bold">
                      {loc.city}
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      {loc.address}
                    </p>
                    <div className="text-[10px] font-sans text-zinc-500 uppercase space-y-1 tracking-wider pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-sentinel-gold" />
                        <span>{loc.hours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-sentinel-gold" />
                        <span>{loc.phone}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Helpline credentials */}
            <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4 text-xs font-sans text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="text-sentinel-gold"><Mail size={16} /></span>
                <span>sentinel@asi.gov.in</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sentinel-gold"><Phone size={16} /></span>
                <span>+91 (1800) 11-4600</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
