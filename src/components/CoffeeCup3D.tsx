'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

// 3D Glass Coffee Cup Mesh Component
function CupModel() {
  const groupRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.Mesh>(null);
  
  // Rotate the cup group slowly
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
    }
    // Ripple liquid surface slightly
    if (liquidRef.current) {
      liquidRef.current.scale.x = 0.98 + Math.sin(t * 2) * 0.005;
      liquidRef.current.scale.z = 0.98 + Math.cos(t * 2) * 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Torus Glass Handle */}
      <mesh position={[-1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.5, 0.12, 16, 100, Math.PI]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0.1}
          transmission={0.9}
          ior={1.5}
          thickness={0.2}
          clearcoat={1.0}
        />
      </mesh>

      {/* Outer Glass Cup Body (Cylinder Open at Top) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 0.9, 2.2, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          roughness={0.08}
          metalness={0.15}
          transmission={0.9}
          ior={1.5}
          thickness={0.25}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glass Cup Base */}
      <mesh position={[0, -1.08, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.05, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.2}
          roughness={0.05}
          transmission={0.9}
          ior={1.5}
          thickness={0.5}
        />
      </mesh>

      {/* Rich Espresso Liquid */}
      <mesh ref={liquidRef} position={[0, -0.1, 0]}>
        <cylinderGeometry args={[1.15, 0.88, 1.8, 32]} />
        <meshPhysicalMaterial
          color="#2B150A" // Espresso brown
          roughness={0.1}
          metalness={0.1}
          transmission={0.4}
          ior={1.33}
          thickness={1.0}
        />
      </mesh>

      {/* Coffee Crema Surface */}
      <mesh position={[0, 0.81, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 1.14, 32]} />
        <meshStandardMaterial
          color="#855B32" // Crema gold/brown
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Orbiting Coffee Beans */}
      <OrbitingBeans />
    </group>
  );
}

// Orbiting Coffee Beans around the Cup
function OrbitingBeans() {
  const beansRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (beansRef.current) {
      beansRef.current.rotation.y = -t * 0.25;
      // Make beans float up and down gently
      const childCount = beansRef.current.children.length;
      for (let i = 0; i < childCount; i++) {
        const child = beansRef.current.children[i] as THREE.Mesh;
        child.position.y = Math.sin(t * 1.5 + i) * 0.15 + (i - 1) * 0.5;
      }
    }
  });

  return (
    <group ref={beansRef}>
      {/* Bean 1 */}
      <mesh position={[2.0, 0, 0]} rotation={[0.5, 0.2, 0.8]} scale={[0.2, 0.12, 0.15]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#4A2F1D" roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Bean 2 */}
      <mesh position={[-1.7, 0.5, 1.5]} rotation={[0.2, 1.1, -0.4]} scale={[0.18, 0.1, 0.13]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#3C2212" roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Bean 3 */}
      <mesh position={[0.5, -0.6, -1.9]} rotation={[-0.6, -0.5, 1.2]} scale={[0.22, 0.14, 0.17]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#2B150A" roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  );
}

export default function CoffeeCup3D() {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="w-full h-[400px] md:h-[600px] cursor-grab active:cursor-grabbing relative"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Ambient radial gold glow behind the cup */}
      <div 
        className="absolute inset-0 m-auto w-72 h-72 rounded-full filter blur-[100px] transition-all duration-700 pointer-events-none opacity-30"
        style={{
          background: hovered 
            ? 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(140,98,57,0) 70%)'
            : 'radial-gradient(circle, rgba(140,98,57,0.3) 0%, rgba(61,35,20,0) 70%)'
        }}
      />
      
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1.2, 4]} fov={50} />
        
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#e5d5c5" />
        
        {/* Golden spotlight that intensifies on hover */}
        <spotLight 
          position={[5, 8, 5]} 
          angle={0.3} 
          penumbra={1} 
          intensity={hovered ? 2.5 : 1.5} 
          color="#d4af37" 
          castShadow
        />
        
        <directionalLight position={[0, -2, 5]} intensity={0.3} color="#ffffff" />
        
        <CupModel />

        <Environment preset="studio" />

        <OrbitControls 
          enableZoom={false} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 1.8} 
          autoRotate={!hovered}
          autoRotateSpeed={1.0}
        />
      </Canvas>

      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <span className="text-[10px] font-sans tracking-widest text-zinc-500 uppercase">
          DRAG TO ROTATE • HOVER TO ILLUMINATE
        </span>
      </div>
    </div>
  );
}
