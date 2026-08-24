'use client';

import { motion } from 'framer-motion';
import { Activity, ShieldCheck, RefreshCw, Compass } from 'lucide-react';

export default function Sustainability() {
  const stats = [
    { value: '14', label: 'ACTIVE TELEMETRY NODES' },
    { value: '10.4 Hz', label: 'RESONANCE VIBRATION LIMIT' },
    { value: '84%', label: 'MICROCLIMATE EXPOSURE INDEX' },
    { value: '1.8 m²', label: 'ACTIVE MOISTURE PROPAGATION' }
  ];

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-sentinel-obsidian text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-sans tracking-[0.3em] text-sentinel-gold uppercase block font-bold">
            ENVIRONMENTAL ANALYSIS
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-white tracking-tight leading-tight">
            Climate & Vibration
          </h1>
          <p className="text-sm font-sans text-zinc-500">
            Mapping dynamic environmental stress metrics affecting structural baselines.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={index}
              className="text-center p-6 rounded-xl bg-white/[0.01] border border-white/5"
            >
              <div className="font-serif text-3xl md:text-4xl text-sentinel-gold font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-[9px] font-sans tracking-widest text-zinc-400 font-bold leading-normal">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pillar Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Pillar 1 */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl glass border border-white/5 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <span className="text-sentinel-gold"><Activity size={32} /></span>
              <h2 className="font-serif text-3xl text-white tracking-tight">
                Vibration Observatory
              </h2>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Dynamic ground stress from adjacent transit networks (such as regional railways or highway loops) is captured continuously by tri-axial accelerometers. The software correlates vibration amplitudes against structural shear limits to alert experts of risk.
              </p>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-t border-white/5 pt-4">
              ACTIVE SENSOR NODE: GROUND SEISMOMETER UNIT #4
            </div>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl glass border border-white/5 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <span className="text-sentinel-gold"><Compass size={32} /></span>
              <h2 className="font-serif text-3xl text-white tracking-tight">
                Microclimate Telemetry
              </h2>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Tracks temperature variance, relative humidity, solar radiation exposure, and airborne sulfur levels. These parameters compute chemical weathering indexes that estimate the erosion rate of sandstone faces across seasons.
              </p>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-t border-white/5 pt-4">
              ACTIVE SENSOR NODE: SATELLITE SOLAR RADIATION ALIGNMENT
            </div>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl glass border border-white/5 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <span className="text-sentinel-gold"><ShieldCheck size={32} /></span>
              <h2 className="font-serif text-3xl text-white tracking-tight">
                Capillary Moisture Maps
              </h2>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Dampness rising from foundations compromises binding mortar. The system monitors sub-surface water tables and maps capillary flow pathways, enabling teams to inject hydrophobic consolidants precisely where moisture gathers.
              </p>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-t border-white/5 pt-4">
              ACTIVE SENSOR NODE: HYDROPHOBIC SURFACE CONDENSATION RESISTANCE
            </div>
          </motion.div>

          {/* Pillar 4 */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl glass border border-white/5 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <span className="text-sentinel-gold"><RefreshCw size={32} /></span>
              <h2 className="font-serif text-3xl text-white tracking-tight">
                Incident Response Alerts
              </h2>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                If vibration limits or moisture indices cross safe parameters, the system triggers automated alerts in the registry, prompting inspections. This closes the gap between damage detection and intervention.
              </p>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-t border-white/5 pt-4">
              ACTIVE ENGINE: RISK THRESHOLD ALERTS DISPATCHER
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
