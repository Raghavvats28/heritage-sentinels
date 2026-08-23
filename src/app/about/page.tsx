'use client';

import { motion } from 'framer-motion';
import { Compass, Flame, ShieldCheck, Database, BookOpen, User } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-sentinel-obsidian text-white">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-sans tracking-[0.3em] text-sentinel-gold uppercase block font-bold">
            SIH 2026 PROJECT CREDENTIALS
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-white tracking-tight leading-tight">
            Team & Backing
          </h1>
          <p className="text-sm font-sans text-zinc-500">
            Heritage Sentinels: Engineering a digital memory for India&apos;s monuments.
          </p>
        </div>

        {/* Project Context Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
            <span className="text-[9px] font-mono text-sentinel-gold uppercase">PROBLEM STATEMENT</span>
            <h4 className="text-sm font-bold text-white font-sans">Evidence-Aware Heritage Intelligence</h4>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              Preservation Intelligence software to consolidate photogrammetry, logs, and sensor telemetry.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
            <span className="text-[9px] font-mono text-sentinel-gold uppercase">CATEGORY & THEME</span>
            <h4 className="text-sm font-bold text-white font-sans">Software / Heritage & Tourism</h4>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              Focusing on low-cost entry barriers for field officers using smartphone-based photogrammetry.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
            <span className="text-[9px] font-mono text-sentinel-gold uppercase">TEAM IDENTITY</span>
            <h4 className="text-sm font-bold text-white font-sans">Team Heritage Sentinels</h4>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              A collaborative engineering squad designing scalable heritage diagnostic tools.
            </p>
          </div>
        </div>

        {/* Research Backing Section */}
        <div className="space-y-16">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <span className="text-[10px] font-sans tracking-widest text-sentinel-gold uppercase block font-bold">
                01 / PHOTOGRAMMETRY & NERFS
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-white tracking-wide">
                Reconstruction & SfM
              </h2>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Our pipeline relies on Structure-from-Motion (SfM) algorithms (Westoby et al., 2012) combined with Neural Radiance Fields (NeRFs) (Mildenhall et al., 2020) to compute highly detailed point clouds and structural meshes from basic RGB smartphone captures.
              </p>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                By aligning sequential keyframes incrementally, we update the existing mesh without rebuilding the monument model from scratch, reducing processing footprints.
              </p>
            </div>
            
            <div className="h-64 rounded-2xl glass p-8 border border-white/10 flex flex-col justify-between hover:border-sentinel-gold/30 transition-colors duration-500">
              <span className="text-sentinel-gold"><Compass size={32} /></span>
              <div>
                <h3 className="font-serif text-2xl text-white">Open3D Registration</h3>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed mt-2">
                  Standardized ICP algorithms align multi-temporal point clouds to map material loss down to the millimeter level.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse"
          >
            <div className="order-2 md:order-1 h-64 rounded-2xl glass p-8 border border-white/10 flex flex-col justify-between hover:border-sentinel-gold/30 transition-colors duration-500">
              <span className="text-sentinel-gold"><Flame size={32} /></span>
              <div>
                <h3 className="font-serif text-2xl text-white">Vision Transformers</h3>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed mt-2">
                  ViTs segment high-resolution texture details to isolate dry sandstone cracks, biological moss growth, and dampness.
                </p>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-6">
              <span className="text-[10px] font-sans tracking-widest text-sentinel-gold uppercase block font-bold">
                02 / ARTIFICIAL INTELLIGENCE
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-white tracking-wide">
                Deep Texture Diagnostics
              </h2>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                We employ Convolutional Neural Networks (CNNs) for image registration and crack segmentations (Cha et al., 2017). Photometric normalization filters varying sunlight angles and weather overcast conditions before texture checks.
              </p>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                By segmenting inputs into trust layers (Documented, Inferred, Uncertain), the platform mitigates model hallucination risks and enforces human validation.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <span className="text-[10px] font-sans tracking-widest text-sentinel-gold uppercase block font-bold">
                03 / STANDARDIZATION & AUDITING
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-white tracking-wide">
                Metadata & CIDOC-CRM
              </h2>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                To guarantee interoperability with international bodies (such as CyArk or Iconem), our spatial data models inherit the CIDOC-CRM (ISO 21127) schema, providing semantic integration of cultural heritage records.
              </p>
            </div>
            
            <div className="h-64 rounded-2xl glass p-8 border border-white/10 flex flex-col justify-between hover:border-sentinel-gold/30 transition-colors duration-500">
              <span className="text-sentinel-gold"><Database size={32} /></span>
              <div>
                <h3 className="font-serif text-2xl text-white">Immutable Provenance</h3>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed mt-2">
                  Condition logging utilizes secure verification paths, ensuring diagnostic history cannot be altered or falsified.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Team Section */}
        <div className="mt-32 pt-16 border-t border-white/5">
          <div className="text-center max-w-lg mx-auto mb-16">
            <span className="text-xs font-sans tracking-[0.2em] text-zinc-500 uppercase block mb-2">
              HERITAGE SENTINELS
            </span>
            <h3 className="font-serif text-3xl text-white tracking-tight">
              Our SIH 2026 Team
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Member 1 */}
            <div className="space-y-3">
              <span className="text-5xl block filter drop-shadow-[0_0_15px_rgba(197,160,67,0.15)]">🧔</span>
              <div>
                <h4 className="font-serif text-lg text-white">Vipul Jain</h4>
                <p className="text-[10px] text-sentinel-gold font-sans tracking-widest uppercase font-bold">Team Leader</p>
              </div>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed px-4">
                Manages system pipeline architecture, incremental reconstruction designs, and cloud Fast-API endpoints.
              </p>
            </div>
            {/* Member 2 */}
            <div className="space-y-3">
              <span className="text-5xl block filter drop-shadow-[0_0_15px_rgba(197,160,67,0.15)]">👩</span>
              <div>
                <h4 className="font-serif text-lg text-white">Prisha Sen</h4>
                <p className="text-[10px] text-sentinel-gold font-sans tracking-widest uppercase">ML Specialist</p>
              </div>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed px-4">
                Trains Vision Transformers (ViTs) and segmentation models to accurately isolate masonry crack parameters.
              </p>
            </div>
            {/* Member 3 */}
            <div className="space-y-3">
              <span className="text-5xl block filter drop-shadow-[0_0_15px_rgba(197,160,67,0.15)]">👨</span>
              <div>
                <h4 className="font-serif text-lg text-white">Kabir Mehta</h4>
                <p className="text-[10px] text-sentinel-gold font-sans tracking-widest uppercase">3D & WebGL Dev</p>
              </div>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed px-4">
                Builds Three.js / React Three Fiber interactive rendering workspaces and temporal timeline interpolations.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
