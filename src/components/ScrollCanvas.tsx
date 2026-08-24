'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;
const INITIAL_FRAMES = 8;
const CHUNK_SIZE = 12;
const pad = (num: number, size: number) => String(num).padStart(size, '0');

type ImageMap = Record<number, HTMLImageElement>;

export default function ScrollCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<ImageMap>({});
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const frameRef = useRef({ index: 0 });

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const load = (index: number) => new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = `/images/sequence/${pad(index, 5)}.webp`;
      img.onload = () => { imagesRef.current[index - 1] = img; loadedCount += 1; if (!cancelled) setLoadingProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100)); resolve(); };
      img.onerror = () => { loadedCount += 1; if (!cancelled) setLoadingProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100)); resolve(); };
    });

    const bootstrap = async () => {
      await Promise.all(Array.from({ length: INITIAL_FRAMES }, (_, i) => load(i + 1)));
      if (cancelled) return;
      setIsReady(true);
      // Progressive background preload: do not block first paint or issue 240 requests at once.
      for (let start = INITIAL_FRAMES + 1; start <= TOTAL_FRAMES && !cancelled; start += CHUNK_SIZE) {
        await Promise.all(Array.from({ length: Math.min(CHUNK_SIZE, TOTAL_FRAMES - start + 1) }, (_, i) => load(start + i)));
      }
    };
    bootstrap();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!isReady || !canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const nearestLoaded = (index: number) => {
      if (imagesRef.current[index]) return imagesRef.current[index];
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (imagesRef.current[index - offset]) return imagesRef.current[index - offset];
        if (imagesRef.current[index + offset]) return imagesRef.current[index + offset];
      }
      return imagesRef.current[0];
    };
    const renderFrame = (index: number) => {
      const img = nearestLoaded(index);
      if (!img) return;
      const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    };
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; renderFrame(frameRef.current.index); };
    window.addEventListener('resize', handleResize); handleResize();
    const trigger = ScrollTrigger.create({ trigger: containerRef.current, start: 'top top', end: '+=350%', scrub: 0.8, pin: true, onUpdate: self => { frameRef.current.index = Math.floor(self.progress * (TOTAL_FRAMES - 1)); renderFrame(frameRef.current.index); } });
    return () => { window.removeEventListener('resize', handleResize); trigger.kill(); };
  }, [isReady]);

  return <div ref={containerRef} className="relative w-full min-h-screen bg-black">
    {!isReady && <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black"><div className="mb-6 font-serif text-3xl tracking-[0.2em] text-sentinel-gold md:text-5xl">HERITAGE SENTINELS</div><div className="relative h-[1px] w-64 overflow-hidden bg-zinc-800"><div className="absolute left-0 top-0 h-full bg-sentinel-gold transition-all duration-300" style={{ width: `${Math.max(8, loadingProgress)}%` }}/></div><div className="mt-4 text-xs font-sans tracking-widest text-zinc-500">REGISTERING SPATIAL MEMORY... {loadingProgress}%</div><div className="mt-2 text-[9px] uppercase tracking-widest text-zinc-700">First frame loads immediately; remaining frames continue in background</div></div>}
    <canvas ref={canvasRef} className="block h-full w-full object-cover pointer-events-none"/>
    {isReady && <div className="pointer-events-none absolute inset-0 z-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(8,8,9,0.9)_95%)]"/><div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-sentinel-obsidian to-transparent"/><div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-sentinel-obsidian/80 to-transparent"/></div>}
  </div>;
}
