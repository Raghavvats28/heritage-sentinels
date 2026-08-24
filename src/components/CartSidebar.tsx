'use client';

import { useEvidence } from '../context/CartContext';
import { X, ShieldAlert, BadgeCheck, FileText, MapPin, Cpu, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import confetti from 'canvas-confetti';

export default function CartSidebar() {
  const {
    reports,
    selectedReport,
    setSelectedReport,
    isDrawerOpen,
    setIsDrawerOpen,
    verifyReport,
    flagReport
  } = useEvidence();

  const [actionStatus, setActionStatus] = useState<'idle' | 'verifying' | 'flagging'>('idle');

  const handleVerify = (id: string) => {
    setActionStatus('verifying');
    setTimeout(() => {
      verifyReport(id);
      setActionStatus('idle');
      
      // Golden architectural confetti for verification confirmation
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { x: 0.8, y: 0.5 },
        colors: ['#c5a043', '#8c6a46', '#ffffff', '#3d7fb8'],
      });
    }, 800);
  };

  const handleFlag = (id: string) => {
    setActionStatus('flagging');
    setTimeout(() => {
      flagReport(id);
      setActionStatus('idle');
    }, 600);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Evidence Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-sentinel-charcoal border-l border-white/10 z-50 flex flex-col p-6 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <span className="text-[10px] font-sans tracking-[0.2em] text-sentinel-gold uppercase block mb-1">
                  HERITAGE SENTINEL
                </span>
                <h2 className="font-serif text-lg tracking-wider text-white">
                  EVIDENCE CONSOLE
                </h2>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5 hover:border-white/20 rounded"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6 no-scrollbar">
              {selectedReport ? (
                // Detailed View of Selected Anomaly
                <div className="space-y-6">
                  {/* Visual Category Badge & Severity */}
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-sans tracking-widest px-2.5 py-1 rounded font-bold uppercase ${
                      selectedReport.severity === 'P1' 
                        ? 'bg-sentinel-red/10 text-sentinel-red border border-sentinel-red/20 animate-pulse' 
                        : 'bg-sentinel-orange/10 text-sentinel-orange border border-sentinel-orange/20'
                    }`}>
                      {selectedReport.severity} • {selectedReport.severity === 'P1' ? 'IMMEDIATE' : 'SCHEDULED'}
                    </span>
                    
                    <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded ${
                      selectedReport.status === 'Documented' 
                        ? 'bg-sentinel-green/20 text-sentinel-green'
                        : selectedReport.status === 'AI-Inferred' 
                        ? 'bg-sentinel-blue/20 text-sentinel-blue'
                        : 'bg-sentinel-orange/20 text-sentinel-orange'
                    }`}>
                      {selectedReport.status}
                    </span>
                  </div>

                  {/* Anomaly Location / Title */}
                  <div>
                    <h3 className="font-serif text-2xl text-white tracking-wide leading-tight">
                      {selectedReport.location}
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans mt-2">
                      Anomaly type: <span className="text-white capitalize">{selectedReport.type} detected</span>
                    </p>
                  </div>

                  {/* Confidences Meter */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-sans">Evidence Confidence</span>
                      <span className={`font-mono font-bold ${
                        selectedReport.confidence === 100 
                          ? 'text-sentinel-green' 
                          : selectedReport.confidence >= 80 
                          ? 'text-sentinel-blue' 
                          : 'text-sentinel-orange'
                      }`}>
                        {selectedReport.confidence}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          selectedReport.confidence === 100 
                            ? 'bg-sentinel-green' 
                            : selectedReport.confidence >= 80 
                            ? 'bg-sentinel-blue' 
                            : 'bg-sentinel-orange'
                        }`}
                        style={{ width: `${selectedReport.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Anomaly Metadata Attributes */}
                  <div className="space-y-4 pt-2">
                    <div className="flex gap-3">
                      <MapPin size={16} className="text-sentinel-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[10px] font-sans text-zinc-500 uppercase tracking-wider">Coordinates (GPS)</h4>
                        <p className="text-xs text-zinc-300 font-mono mt-0.5">{selectedReport.gps}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Cpu size={16} className="text-sentinel-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[10px] font-sans text-zinc-500 uppercase tracking-wider">Detection Engine</h4>
                        <p className="text-xs text-zinc-300 font-sans mt-0.5">{selectedReport.source}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Clock size={16} className="text-sentinel-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[10px] font-sans text-zinc-500 uppercase tracking-wider">Timestamp Registered</h4>
                        <p className="text-xs text-zinc-300 font-mono mt-0.5">{selectedReport.dateDetected}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <FileText size={16} className="text-sentinel-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[10px] font-sans text-zinc-500 uppercase tracking-wider">Historical Context</h4>
                        <p className="text-xs text-zinc-400 font-sans leading-relaxed mt-0.5">
                          {selectedReport.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Evidence Provenance Box */}
                  <div className="p-4 rounded-xl border border-sentinel-gold/20 bg-sentinel-gold/[0.02] space-y-2">
                    <span className="text-[9px] font-sans font-bold tracking-widest text-sentinel-gold uppercase flex items-center gap-1.5">
                      <BadgeCheck size={12} /> PROVENANCE DATA
                    </span>
                    <p className="text-xs text-sentinel-sandstone font-sans leading-relaxed">
                      {selectedReport.provenance}
                    </p>
                  </div>

                  {/* Observation Report */}
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
                    <span className="text-[9px] font-sans font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
                      <ShieldAlert size={12} /> FIELD OBSERVER REMARKS
                    </span>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      {selectedReport.observation}
                    </p>
                  </div>

                  {/* Human-in-the-loop actions */}
                  {selectedReport.status !== 'Documented' && (
                    <div className="pt-6 border-t border-white/10 space-y-3">
                      <button
                        onClick={() => handleVerify(selectedReport.id)}
                        disabled={actionStatus !== 'idle'}
                        className="w-full py-3.5 bg-sentinel-gold hover:bg-sentinel-gold/90 disabled:opacity-50 text-black font-sans font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {actionStatus === 'verifying' ? (
                          <span className="animate-pulse">Updating Registry...</span>
                        ) : (
                          <>
                            <CheckCircle size={14} />
                            <span>Verify & Document Record</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleFlag(selectedReport.id)}
                        disabled={actionStatus !== 'idle'}
                        className="w-full py-3 border border-white/10 hover:border-white/30 text-white font-sans font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded cursor-pointer"
                      >
                        {actionStatus === 'flagging' ? (
                          <span className="animate-pulse">Flagging...</span>
                        ) : (
                          <span>Flag for Expert Review</span>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Back button to list */}
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="w-full py-2.5 text-zinc-500 hover:text-white transition-colors text-xs font-sans tracking-wider"
                  >
                    ← Back to Anomaly Registry
                  </button>
                </div>
              ) : (
                // Default view: list all active reports
                <div className="space-y-4">
                  <p className="text-zinc-500 font-sans tracking-widest text-xs uppercase">
                    ACTIVE ANOMALY INBOX ({reports.length})
                  </p>
                  
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        onClick={() => setSelectedReport(report)}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-sentinel-gold/30 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer flex justify-between items-start gap-4"
                      >
                        <div className="space-y-2">
                          <span className={`text-[8px] font-mono tracking-widest px-2 py-0.5 rounded ${
                            report.severity === 'P1' ? 'bg-sentinel-red/10 text-sentinel-red' : 'bg-sentinel-orange/10 text-sentinel-orange'
                          }`}>
                            {report.severity}
                          </span>
                          <h4 className="font-serif text-base text-white tracking-wide mt-1">
                            {report.location}
                          </h4>
                          <p className="text-[10px] text-zinc-500 font-sans">
                            {report.source.slice(0, 45)}...
                          </p>
                        </div>
                        
                        <div className="text-right space-y-2 flex-shrink-0">
                          <span className="text-[10px] font-mono text-sentinel-gold">
                            {report.confidence}%
                          </span>
                          <p className="text-[9px] text-zinc-600 block">{report.dateDetected}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-white/10 text-center">
              <p className="text-[9px] text-zinc-600 font-sans tracking-widest leading-relaxed uppercase">
                SMART INDIA HACKATHON 2026 • EVIDENCE TRUST LEVEL HIGH
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
