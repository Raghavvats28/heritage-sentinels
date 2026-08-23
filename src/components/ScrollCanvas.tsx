'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;

// Helper to pad numbers (e.g. 1 -> "00001")
const pad = (num: number, size: number) => {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
};

export default function ScrollCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameRef = useRef({ index: 0 });

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const loadImage = (index: number) => {
      const img = new Image();
      const paddedIndex = pad(index, 5);
      // Load PNG frames instead of webp
      img.src = `/images/sequence/${paddedIndex}.png`;
      img.onload = () => {
        loadedCount++;
        const progress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        setLoadingProgress(progress);
        
        if (loadedCount === TOTAL_FRAMES) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      };
      loadedImages[index - 1] = img;
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      loadImage(i);
    }
  }, []);

  // Set up GSAP Canvas Scrubbing
  useEffect(() => {
    if (!isLoaded || images.length === 0 || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Resize canvas to cover viewport
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(frameRef.current.index);
    };

    const renderFrame = (index: number) => {
      const img = images[index];
      if (!img || !canvas || !context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.width || 1920;
      const imgHeight = img.height || 1080;

      // Fit mode: Cover
      const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const w = imgWidth * ratio;
      const h = imgHeight * ratio;
      const x = (canvasWidth - w) / 2;
      const y = (canvasHeight - h) / 2;

      context.drawImage(img, x, y, w, h);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial layout

    // GSAP ScrollTrigger timeline to bind scroll percentage to canvas frames
    const scrollObj = frameRef.current;
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=350%', // Scrub space
      scrub: 0.8,    // Inertia
      pin: true,
      onUpdate: (self) => {
        const frameIndex = Math.floor(self.progress * (TOTAL_FRAMES - 1));
        scrollObj.index = frameIndex;
        renderFrame(frameIndex);
      },
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      trigger.kill();
    };
  }, [isLoaded, images]);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-black">
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
          <div className="text-3xl md:text-5xl font-serif text-sentinel-gold tracking-[0.2em] animate-pulse mb-6">
            HERITAGE SENTINELS
          </div>
          <div className="w-64 h-[1px] bg-zinc-800 relative overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-sentinel-gold transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="mt-4 text-xs font-sans tracking-widest text-zinc-500">
            PROCESSING SPATIAL REGISTRATION... {loadingProgress}%
          </div>
        </div>
      )}
      
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full object-cover pointer-events-none"
      />
      
      {/* Volumetric overlays and filters */}
      {isLoaded && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(8,8,9,0.9)_95%)] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-sentinel-obsidian to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-sentinel-obsidian/80 to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
}
