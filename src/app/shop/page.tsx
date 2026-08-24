'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Star, ShieldCheck, Compass, Heart, Activity, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const REGISTRY_MONUMENTS = [
  {
    id: 'm1',
    name: 'Konark Sun Temple Spire',
    region: 'Puri District, Odisha',
    category: 'Sun Temples',
    sensors: '14 Active Nodes',
    rating: 7.8, // 78/100
    risk: 'P1 - CRITICAL',
    anomalies: '1 Crack (P1), 1 Moisture (P2)',
    description: '13th-century monument suffering from seawater salinity, moisture accumulation, and heavy railway vibrations.'
  },
  {
    id: 'm2',
    name: 'Hampi Stone Chariot Plinth',
    region: 'Bellary District, Karnataka',
    category: 'Stone Chariots',
    sensors: '8 Active Nodes',
    rating: 8.6,
    risk: 'P2 - SCHEDULED',
    anomalies: '1 Moss (P3), 1 Dampness (P2)',
    description: 'Intricate granite chariot plinth. Human foot traffic vibrations and seasonal biological moss growth tracked.'
  },
  {
    id: 'm3',
    name: 'Ajanta Caves - Cave 1 Entrance',
    region: 'Aurangabad District, Maharashtra',
    category: 'Cave Pillars',
    sensors: '12 Active Nodes',
    rating: 9.1,
    risk: 'P3 - MONITORING',
    anomalies: '1 Fissure (P3)',
    description: 'Basalt rock-cut caves. Micro-fissures monitored due to humidity shifts inside the primary chambers.'
  },
  {
    id: 'm4',
    name: 'Shore Temple East Wall',
    region: 'Mahabalipuram, Tamil Nadu',
    category: 'Sun Temples',
    sensors: '6 Active Nodes',
    rating: 8.3,
    risk: 'P2 - SCHEDULED',
    anomalies: '1 Salt Crystallization (P2)',
    description: 'Granite temples exposed to salt spray and tidal weathering, accelerating stone surface erosion.'
  }
];

export default function Shop() {
  const router = useRouter();
  const [filter, setFilter] = useState<'All' | 'Sun Temples' | 'Stone Chariots' | 'Cave Pillars'>('All');
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const { addToCart } = useCart();

  const filteredMonuments = REGISTRY_MONUMENTS.filter(m => filter === 'All' || m.category === filter);

  const toggleLike = (id: string) => {
    setLikedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleLoadTwin = () => {
    router.push('/');
    setTimeout(() => {
      document.getElementById('digital-twin')?.scrollIntoView({ behavior: 'smooth' });
    }, 400);
  };

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-sentinel-obsidian text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-sans tracking-[0.3em] text-sentinel-gold uppercase block font-bold">
            NATIONAL MONUMENT INDEX
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-white tracking-tight leading-tight">
            Heritage Registry
          </h1>
          <p className="text-sm font-sans text-zinc-500">
            Active pilot monuments integrated into the Hierarchical Scalability Grid.
          </p>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 border-b border-white/5 pb-8 max-w-lg mx-auto">
          {(['All', 'Sun Temples', 'Stone Chariots', 'Cave Pillars'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 rounded-full cursor-pointer ${
                filter === cat 
                  ? 'bg-sentinel-gold text-black' 
                  : 'bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Monuments Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredMonuments.map((m) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={m.id}
                className="group relative flex flex-col justify-between p-8 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-sentinel-gold/20 hover:bg-white/[0.02] transition-all duration-500"
              >
                {/* Watchlist button */}
                <button 
                  onClick={() => toggleLike(m.id)}
                  className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/40 border border-white/5 text-zinc-500 hover:text-sentinel-red hover:border-sentinel-red/20 transition-all duration-300 cursor-pointer"
                  aria-label="Pin to dashboard watch"
                >
                  <Heart size={14} fill={likedItems.includes(m.id) ? '#cc3f3f' : 'none'} className={likedItems.includes(m.id) ? 'text-sentinel-red' : ''} />
                </button>

                <div>
                  {/* Category / Rating */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-sans tracking-widest uppercase">{m.category}</span>
                    <span className="flex items-center gap-1 text-sentinel-gold font-mono font-medium">
                      <Star size={10} fill="#c5a043" /> Health: {m.rating * 10}/100
                    </span>
                  </div>

                  {/* Icon Representation */}
                  <div className="my-8 h-40 bg-zinc-900/40 border border-white/5 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group-hover:border-white/10 transition-colors duration-500">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_0_15px_rgba(197,160,67,0.2)]">
                      🏛️
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-widest mt-3 uppercase">
                      {m.sensors}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-white tracking-wide group-hover:text-sentinel-gold transition-colors duration-300">
                    {m.name}
                  </h3>
                  
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed mt-3">
                    {m.description}
                  </p>

                  {/* Diagnostic details */}
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-[10px] font-sans text-zinc-500 tracking-wider">
                    <div className="flex justify-between">
                      <span>LOCATION:</span>
                      <span className="text-zinc-300 font-mono flex items-center gap-1">
                        <MapPin size={10} /> {m.region}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ACTIVE ANOMALIES:</span>
                      <span className="text-sentinel-gold font-medium uppercase">{m.anomalies}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                    m.risk.includes('CRITICAL') ? 'text-sentinel-red bg-sentinel-red/10' : 'text-sentinel-orange bg-sentinel-orange/10'
                  }`}>
                    {m.risk}
                  </span>
                  
                  <button
                    onClick={handleLoadTwin}
                    className="px-4 py-2.5 bg-zinc-900 border border-white/10 hover:border-sentinel-gold hover:bg-sentinel-gold hover:text-black text-[10px] font-sans font-bold uppercase tracking-wider transition-all duration-300 rounded cursor-pointer"
                  >
                    LOAD DIGITAL TWIN
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Security badges */}
        <div className="mt-20 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <span className="text-sentinel-gold flex justify-center"><Activity size={24} /></span>
            <h4 className="font-serif text-lg text-white">Live Vibration Telemetry</h4>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              Monitors dynamic frequency changes and ground shifts near high-traffic railways.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-sentinel-gold flex justify-center"><Compass size={24} /></span>
            <h4 className="font-serif text-lg text-white">Spatial Coordinates Sync</h4>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              Registers new smartphone imagery keyframes instantly to localized GPS anchors.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-sentinel-gold flex justify-center"><ShieldCheck size={24} /></span>
            <h4 className="font-serif text-lg text-white">Verified Data Provenance</h4>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              Adheres strictly to the CIDOC-CRM schema, integrating historical excavation logs.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
