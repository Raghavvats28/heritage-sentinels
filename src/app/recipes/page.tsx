'use client';

import { Flame, Clock, RefreshCw, Cpu, Layers, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const ALGORITHMS = [
  {
    id: 'alg1',
    title: 'Structure-from-Motion (SfM) Pipeline',
    difficulty: 'Mathematical',
    time: 'Fast (Incremental)',
    ratio: 'COLMAP + Open3D Dense Reconstruction',
    temp: 'SIFT Feature Matching',
    grind: 'Point Cloud Registration',
    steps: [
      'Extract SIFT keypoints from smartphone RGB frames, computing descriptor tensors.',
      'Run spatial mapping using a RAN-SAC geometric estimation model to filter outliers.',
      'Perform bundle adjustment minimizing the reprojection error function: \\(E(R, T, X) = \\sum_{i,j} d(P(R_i, T_i, X_j), x_{ij})^2\\).',
      'Generate dense point clouds using multi-view stereo triangulation matching.',
      'Output normalized mesh boundaries registered to coordinates.'
    ]
  },
  {
    id: 'alg2',
    title: 'Vision Transformer Anomaly Segmentation',
    difficulty: 'Neural Network',
    time: 'Fast API (200ms)',
    ratio: 'ViT-Base-Patch16 Model',
    temp: 'Softmax Classifier',
    grind: '16x16 Pixel Patches',
    steps: [
      'Flatten sandstone texture frame inputs into sequence of 16x16 pixel patches.',
      'Inject positional embeddings and pass vectors through multi-head self-attention layers.',
      'Map attention weights to segment dry sandstone cracks, biological moss growth, and dampness.',
      'Filter output predictions through a confidence threshold (Uncertain threshold: < 70%).',
      'Convert segmented masks into localized geometric polygons.'
    ]
  },
  {
    id: 'alg3',
    title: 'Photometric Normalization & Shadow Correction',
    difficulty: 'Image Processing',
    time: 'Edge Pre-processing',
    ratio: 'Histogram Normalization',
    temp: 'Luminance Alignment',
    grind: 'Convoluted Matrix Filter',
    steps: [
      'Convert image pixels to HSV space to isolate luminance channel from chromatic sandstone tones.',
      'Estimate global ambient illumination using a low-pass Gaussian kernel filter.',
      'Apply photometric normalization: \\(I_{norm} = \\frac{I - \\mu_L}{\\sigma_L}\\) where \\(\\mu\\) and \\(\\sigma\\) represent localized luminance factors.',
      'Neutralize shadows cast by deep reliefs and variable overcast conditions.',
      'Re-project texture files into standard RGB coordinate structures.'
    ]
  },
  {
    id: 'alg4',
    title: 'Temporal Registration & ICP Alignment',
    difficulty: 'Geometric Alignment',
    time: 'Incremental',
    ratio: 'Point-to-Plane Alignment',
    temp: 'Rigid Transformation Matrix',
    grind: 'Millimeter Scale Delta',
    steps: [
      'Load archival baseline point cloud from SQLite and register new scan points.',
      'Compute normal vectors for each point and run Point-to-Plane Iterative Closest Point (ICP).',
      'Compute rigid transformation matrix (Rotation R, Translation T) minimizing distance offsets.',
      'Register point deviations, mapping crack propagation and surface spalling depth over time.',
      'Write the computed decay metrics to the postgres chronological health ledger.'
    ]
  }
];

export default function Recipes() {
  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-sentinel-obsidian text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-sans tracking-[0.3em] text-sentinel-gold uppercase block font-bold">
            DIAGNOSTIC PIPELINES
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-white tracking-tight leading-tight">
            Preservation Algorithms
          </h1>
          <p className="text-sm font-sans text-zinc-500">
            Reconstruction and neural networks mapping structural deterioration chronologically.
          </p>
        </div>

        {/* Algorithms Stack */}
        <div className="space-y-16">
          {ALGORITHMS.map((alg, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={alg.id}
              className="p-8 md:p-12 rounded-2xl glass border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12"
            >
              {/* Left Column: Metadata */}
              <div className="space-y-6">
                <span className="text-[10px] font-mono text-sentinel-gold border border-sentinel-gold/20 px-3 py-1 rounded bg-sentinel-gold/5 inline-block font-bold">
                  PIPELINE MODULE 0{index + 1}
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-white tracking-wide leading-tight">
                  {alg.title}
                </h2>
                
                {/* Metrics */}
                <div className="space-y-4 pt-4 border-t border-white/5 text-xs font-sans text-zinc-400">
                  <div className="flex items-center gap-3">
                    <span className="text-sentinel-gold"><Clock size={16} /></span>
                    <div>
                      <span className="text-zinc-600 block uppercase text-[9px] tracking-widest font-bold">Execution Complexity</span>
                      <span className="text-zinc-200">{alg.difficulty}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sentinel-gold"><RefreshCw size={16} /></span>
                    <div>
                      <span className="text-zinc-600 block uppercase text-[9px] tracking-widest font-bold">Processing Profile</span>
                      <span className="text-zinc-200">{alg.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sentinel-gold"><Cpu size={16} /></span>
                    <div>
                      <span className="text-zinc-600 block uppercase text-[9px] tracking-widest font-bold">Primary Engine</span>
                      <span className="text-zinc-200">{alg.ratio}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sentinel-gold"><Layers size={16} /></span>
                    <div>
                      <span className="text-zinc-600 block uppercase text-[9px] tracking-widest font-bold">Geometric Target</span>
                      <span className="text-zinc-200">{alg.grind}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Columns: Steps */}
              <div className="md:col-span-2 space-y-6 md:border-l md:border-white/5 md:pl-12">
                <span className="text-[10px] font-sans tracking-widest text-zinc-500 uppercase block font-bold">
                  ALGORITHMIC EXECUTION STEPS
                </span>
                <ol className="space-y-6 font-sans text-sm text-zinc-300 leading-relaxed list-decimal list-inside marker:text-sentinel-gold marker:font-mono">
                  {alg.steps.map((step, sIdx) => (
                    <li key={sIdx} className="pl-2">
                      <span className="inline-block mt-[-2px] align-top text-zinc-300 max-w-[95%]">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
