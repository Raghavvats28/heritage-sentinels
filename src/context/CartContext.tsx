'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AnomalyReport {
  id: string;
  type: 'crack' | 'moisture' | 'spalling' | 'growth' | 'erosion';
  location: string;
  confidence: number;
  status: 'Documented' | 'AI-Inferred' | 'Uncertain';
  severity: 'P1' | 'P2' | 'P3' | 'P4';
  dateDetected: string;
  source: string;
  description: string;
  gps: string;
  image: string;
  provenance: string;
  observation: string;
}

interface EvidenceContextType {
  reports: AnomalyReport[];
  selectedReport: AnomalyReport | null;
  setSelectedReport: (report: AnomalyReport | null) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  verifyReport: (id: string) => void;
  flagReport: (id: string) => void;
  judgeMode: boolean;
  setJudgeMode: (active: boolean) => void;
  judgeStep: number;
  setJudgeStep: (step: number) => void;
  // Backwards compatibility aliases for layout compiling
  cart: any[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (item: any) => void;
  setIsCartOpen: (open: boolean) => void;
}

const EvidenceContext = createContext<EvidenceContextType | undefined>(undefined);

const INITIAL_REPORTS: AnomalyReport[] = [
  {
    id: 'an-001',
    type: 'crack',
    location: 'Shikhara Pillar - North East elevation',
    confidence: 100,
    status: 'Documented',
    severity: 'P1',
    dateDetected: '2026-08-10',
    source: 'Historical archives + ASI 2024 inspection logs',
    description: 'Structural fissure extending along the vertical joint of the stone pillar. Prior records indicate a depth of 2.1cm.',
    gps: '20.1245° N, 85.8792° E',
    image: '00001.png',
    provenance: 'ASI Inspection Log #108A, approved by conservation head J. Mehta.',
    observation: 'Major stress fracture showing structural slip. Exposure to local railway vibration accelerates widening.'
  },
  {
    id: 'an-002',
    type: 'moisture',
    location: 'Base Plinth - South-East outer wall',
    confidence: 89,
    status: 'AI-Inferred',
    severity: 'P2',
    dateDetected: '2026-08-21',
    source: 'Vision Transformer (ViT) scan from smartphone sequence #088',
    description: 'Sub-surface rising dampness covering approximately 1.8 square meters. Elevated moisture index detected via texture color analysis.',
    gps: '20.1246° N, 85.8793° E',
    image: '00002.png',
    provenance: 'Cloud photogrammetry texture registration (Epoch 240, CNN align).',
    observation: 'Rising dampness and salt efflorescence weakening the binding mortar of the outer sandstones.'
  },
  {
    id: 'an-003',
    type: 'growth',
    location: 'Amalaka crowning - upper tiers',
    confidence: 64,
    status: 'Uncertain',
    severity: 'P3',
    dateDetected: '2026-08-23',
    source: 'Drone image capture (low resolution, variable light)',
    description: 'Possible micro-vegetation and biological moss growth in the deep grooves. Visual confidence low due to shadows.',
    gps: '20.1245° N, 85.8791° E',
    image: '00003.png',
    provenance: 'Automated CNN sweep. Conflict with manual 2025 inspection logs (which reported dry mortar).',
    observation: 'Potential seed germination in mortar gaps. Requires physical verification and manual weeding.'
  }
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<AnomalyReport[]>(INITIAL_REPORTS);
  const [selectedReport, setSelectedReportState] = useState<AnomalyReport | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Judge Mode states
  const [judgeMode, setJudgeMode] = useState(false);
  const [judgeStep, setJudgeStep] = useState(1);

  const setSelectedReport = (report: AnomalyReport | null) => {
    setSelectedReportState(report);
    if (report) {
      setIsDrawerOpen(true);
    }
  };

  const verifyReport = (id: string) => {
    setReports(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'Documented', confidence: 100 } : r))
    );
    // Update active report in viewer if it's selected
    if (selectedReport && selectedReport.id === id) {
      setSelectedReportState(prev => prev ? { ...prev, status: 'Documented', confidence: 100 } : null);
    }
  };

  const flagReport = (id: string) => {
    setReports(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'Uncertain', confidence: 50 } : r))
    );
    if (selectedReport && selectedReport.id === id) {
      setSelectedReportState(prev => prev ? { ...prev, status: 'Uncertain', confidence: 50 } : null);
    }
  };

  // Backwards compatibility aliases to avoid compilation errors before we edit all views
  const cart: any[] = [];
  const cartCount = reports.filter(r => r.severity === 'P1').length; // P1 reports acts as "cart count"
  const cartSubtotal = 0;
  const addToCart = (item: any) => {
    const report = reports.find(r => r.id === item.id) || null;
    setSelectedReport(report);
  };
  const setIsCartOpen = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  return (
    <EvidenceContext.Provider
      value={{
        reports,
        selectedReport,
        setSelectedReport,
        isDrawerOpen,
        setIsDrawerOpen,
        verifyReport,
        flagReport,
        judgeMode,
        setJudgeMode,
        judgeStep,
        setJudgeStep,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        setIsCartOpen
      }}
    >
      {children}
    </EvidenceContext.Provider>
  );
}

export function useCart() {
  const context = useContext(EvidenceContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function useEvidence() {
  return useCart();
}
