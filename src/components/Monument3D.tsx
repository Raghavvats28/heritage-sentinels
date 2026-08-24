'use client';

import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useEvidence } from '../context/CartContext';

interface MonumentProps {
  layer: 'normal' | 'cracks' | 'moisture' | 'damage' | 'historical' | 'risk';
  timelineYear: number;
}

// Procedural Sandstone Temple Spire
function SpireModel({ layer, timelineYear }: MonumentProps) {
  const groupRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Mesh>(null);
  const crackRef = useRef<THREE.Group>(null);
  const moistureRef = useRef<THREE.Mesh>(null);

  const { setSelectedReport, reports } = useEvidence();

  // Slow rotation if not hovered
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08;
    }
  });

  // Calculate deterioration metrics based on year (2018 -> 2026)
  const progressRatio = (timelineYear - 2018) / 8; // 0 to 1
  const crackScaleY = 0.2 + progressRatio * 0.8;
  const moistureScaleY = 0.1 + progressRatio * 0.9;
  const moistureOpacity = 0.2 + progressRatio * 0.65;

  // Custom textures colors
  const stoneColor = '#a89475';
  const wetColor = '#1f3e5c';
  const crackColor = '#1b1b1b';
  const spallingColor = '#cc3f3f';
  const historicalColor = '#c5a043';

  // Open evidence drawer for a specific anomaly
  const handleHotspotClick = (e: ThreeEvent<MouseEvent>, reportId: string) => {
    e.stopPropagation();
    const report = reports.find(r => r.id === reportId) || null;
    setSelectedReport(report);
  };

  return (
    <group ref={groupRef}>
      {/* 1. Base Platform (Stone Plinth) */}
      <mesh ref={baseRef} position={[0, -1.2, 0]}>
        <boxGeometry args={[3.2, 0.4, 3.2]} />
        <meshStandardMaterial 
          color={layer === 'historical' ? '#222' : stoneColor}
          roughness={0.9} 
          metalness={0.1}
          wireframe={layer === 'historical'}
        />
      </mesh>

      {/* 2. Tiered Shikhara Structure (Stepped Spire Layers) */}
      {/* Stacked boxes scaling down to represent structural tiers */}
      {Array.from({ length: 8 }).map((_, i) => {
        const height = 0.35;
        const width = 2.4 - i * 0.25;
        const posY = -1.0 + (i * height) + height/2;
        
        // Color layers based on analytical filter
        let tierColor = stoneColor;
        let tierOpacity = 1.0;
        let isWireframe = false;

        if (layer === 'historical') {
          tierColor = historicalColor;
          isWireframe = i % 2 === 0;
        } else if (layer === 'damage' && (i === 2 || i === 4)) {
          tierColor = spallingColor; // show damaged areas
        } else if (layer === 'risk') {
          if (i === 2) tierColor = '#cc3f3f'; // P1 zone
          else if (i === 0) tierColor = '#d97706'; // P2 zone
        }

        return (
          <mesh key={i} position={[0, posY, 0]}>
            <boxGeometry args={[width, height, width]} />
            <meshStandardMaterial 
              color={tierColor}
              roughness={0.9}
              metalness={0.05}
              wireframe={isWireframe}
              transparent={layer === 'historical'}
              opacity={tierOpacity}
            />
          </mesh>
        );
      })}

      {/* 3. Amalaka Crowning (Cylinder cap) */}
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
        <meshStandardMaterial 
          color={layer === 'historical' ? historicalColor : stoneColor} 
          roughness={0.8}
        />
      </mesh>

      {/* 4. Kalasha Pot (Spindle top) */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={stoneColor} roughness={0.7} />
      </mesh>

      {/* 5. Pillars (Structural Columns around base) */}
      {[-1.3, 1.3].map((x, xi) => 
        [-1.3, 1.3].map((z, zi) => {
          let pillarColor = stoneColor;
          if (layer === 'risk' && xi === 0 && zi === 0) {
            pillarColor = '#cc3f3f'; // P1 pillar
          }
          return (
            <mesh key={`${xi}-${zi}`} position={[x, -0.6, z]}>
              <cylinderGeometry args={[0.15, 0.15, 0.8, 12]} />
              <meshStandardMaterial color={pillarColor} roughness={0.9} />
            </mesh>
          );
        })
      )}

      {/* 6. Dynamic Crack Overlay (Grows with timelineYear) */}
      {(layer === 'cracks' || layer === 'risk') && (
        <group ref={crackRef} position={[1.05, -0.5, 1.05]} scale={[1, crackScaleY, 1]}>
          {/* Main Crack Line */}
          <mesh>
            <cylinderGeometry args={[0.015, 0.008, 0.6, 6]} />
            <meshBasicMaterial color={crackColor} />
          </mesh>
          {/* Crack Branch 1 */}
          <mesh position={[0.05, 0.15, 0.05]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.008, 0.003, 0.2, 6]} />
            <meshBasicMaterial color={crackColor} />
          </mesh>
        </group>
      )}

      {/* 7. Dynamic Moisture Rising Dampness Map */}
      {(layer === 'moisture' || layer === 'risk') && (
        <mesh 
          ref={moistureRef} 
          position={[0, -1.19, 0]} 
          scale={[1.01, moistureScaleY, 1.01]}
        >
          {/* Semi-transparent dampness envelope wrapping the base */}
          <boxGeometry args={[3.22, 0.42, 3.22]} />
          <meshPhysicalMaterial 
            color={wetColor}
            transparent
            opacity={moistureOpacity}
            roughness={0.1}
            transmission={0.4}
            ior={1.33}
            thickness={0.1}
          />
        </mesh>
      )}

      {/* 8. Interactive Clickable Hotspots (Anomalies) */}
      {/* Hotspot 1: Crack on Pillar (NW Pillar) */}
      <mesh 
        position={[1.1, -0.5, 1.1]} 
        onClick={(e) => handleHotspotClick(e, 'an-001')}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial 
          color="#cc3f3f" 
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Hotspot 2: Moisture on base */}
      <mesh 
        position={[-1.2, -1.0, 1.2]} 
        onClick={(e) => handleHotspotClick(e, 'an-002')}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial 
          color="#3d7fb8" 
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Hotspot 3: Crown moss/biological growth */}
      <mesh 
        position={[0, 1.8, 0]} 
        onClick={(e) => handleHotspotClick(e, 'an-003')}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial 
          color="#d97706" 
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

export default function Monument3D({ layer = 'normal', timelineYear = 2026 }: MonumentProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="w-full h-[400px] md:h-[550px] cursor-grab active:cursor-grabbing relative bg-sentinel-charcoal/[0.4] border border-white/5 rounded-2xl overflow-hidden"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Background glow adapts to layer selection */}
      <div 
        className="absolute inset-0 m-auto w-80 h-80 rounded-full filter blur-[120px] transition-all duration-700 pointer-events-none opacity-20"
        style={{
          background: layer === 'risk' 
            ? 'radial-gradient(circle, rgba(204,63,63,0.5) 0%, rgba(0,0,0,0) 70%)'
            : layer === 'moisture'
            ? 'radial-gradient(circle, rgba(61,127,184,0.5) 0%, rgba(0,0,0,0) 70%)'
            : layer === 'cracks'
            ? 'radial-gradient(circle, rgba(197,160,67,0.3) 0%, rgba(0,0,0,0) 70%)'
            : 'radial-gradient(circle, rgba(140,106,70,0.4) 0%, rgba(0,0,0,0) 70%)'
        }}
      />
      
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1.0, 4.2]} fov={45} />
        
        {/* Lights */}
        <ambientLight intensity={layer === 'historical' ? 0.3 : 0.45} />
        <directionalLight position={[-4, 4, -4]} intensity={0.4} color="#e6d5be" />
        
        {/* Golden spotlight */}
        <spotLight 
          position={[5, 10, 5]} 
          angle={0.3} 
          penumbra={1} 
          intensity={hovered ? 2.5 : 1.8} 
          color="#c5a043" 
          castShadow
        />
        
        <directionalLight position={[0, -2, 5]} intensity={0.25} color="#ffffff" />
        
        <SpireModel layer={layer} timelineYear={timelineYear} />

        <Environment preset="studio" />

        <OrbitControls 
          enableZoom={true} 
          minZoom={2.0}
          maxZoom={10.0}
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 1.7} 
          autoRotate={!hovered}
          autoRotateSpeed={0.8}
        />
      </Canvas>

      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
        <span className="text-[10px] font-sans tracking-widest text-zinc-500 bg-sentinel-obsidian/60 px-4 py-1.5 rounded-full border border-white/5 uppercase">
          DRAG TO ROTATE • HOVER TO ILLUMINATE • CLICK HOTSPOTS FOR EVIDENCE
        </span>
      </div>
    </div>
  );
}
