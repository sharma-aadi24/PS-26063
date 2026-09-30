import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function Globe() {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial
        color="#1a6fa8"
        roughness={0.6}
        metalness={0.1}
        emissive="#0a3d6b"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.56, 64, 64]} />
      <meshStandardMaterial
        color="#00d1ff"
        transparent
        opacity={0.08}
        side={THREE.FrontSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function AtmosphereGlow() {
  return (
    <mesh>
      <sphereGeometry args={[1.62, 64, 64]} />
      <meshStandardMaterial
        color="#00a8d4"
        transparent
        opacity={0.04}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function IceCap() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.12;
    }
  });

  return (
    <group>
      {/* North pole ice cap */}
      <mesh ref={ref} position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.45, 48]} />
        <meshStandardMaterial
          color="#e0f7ff"
          roughness={0.2}
          metalness={0.0}
          emissive="#b0e8ff"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* South pole ice cap */}
      <mesh position={[0, -1.5, 0]} rotation={[Math.PI, 0, 0]}>
        <circleGeometry args={[0.55, 48]} />
        <meshStandardMaterial
          color="#e0f7ff"
          roughness={0.2}
          metalness={0.0}
          emissive="#b0e8ff"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

function EquatorRing() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.52, 0.008, 16, 128]} />
      <meshStandardMaterial
        color="#00d1ff"
        emissive="#00d1ff"
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-3, -2, -4]} intensity={0.3} color="#4488ff" />
      <pointLight position={[0, 0, 4]} intensity={0.4} color="#00d1ff" />

      <Stars
        radius={80}
        depth={50}
        count={5000}
        factor={4}
        saturation={0.5}
        fade
        speed={0.5}
      />

      <Globe />
      <Atmosphere />
      <AtmosphereGlow />
      <IceCap />
      <EquatorRing />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />
    </>
  );
}

export default function HeroGlobe() {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
