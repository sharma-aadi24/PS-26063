import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { useRef, useState, Suspense } from 'react';
import * as THREE from 'three';

interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
}

interface PolarGlobe3DProps {
  stations?: Station[];
  onStationClick?: (id: string) => void;
}

function latLngTo3D(lat: number, lng: number, radius = 1.5): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}

function GlobeBase() {
  const ref = useRef<THREE.Mesh>(null);
  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#1a6fa8"
          roughness={0.5}
          metalness={0.15}
          emissive="#0a3d6b"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Atmosphere */}
      <mesh>
        <sphereGeometry args={[1.56, 64, 64]} />
        <meshStandardMaterial
          color="#00d1ff"
          transparent
          opacity={0.07}
          depthWrite={false}
        />
      </mesh>
      {/* North ice cap */}
      <mesh position={[0, 1.5, 0]}>
        <circleGeometry args={[0.42, 48]} />
        <meshStandardMaterial color="#e0f7ff" emissive="#b0e8ff" emissiveIntensity={0.2} />
      </mesh>
      {/* South ice cap */}
      <mesh position={[0, -1.5, 0]} rotation={[Math.PI, 0, 0]}>
        <circleGeometry args={[0.52, 48]} />
        <meshStandardMaterial color="#e0f7ff" emissive="#b0e8ff" emissiveIntensity={0.2} />
      </mesh>
    </>
  );
}

interface StationMarkerProps {
  station: Station;
  onClick: (id: string) => void;
}

function StationMarker({ station, onClick }: StationMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const markerRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  const pos = latLngTo3D(station.lat, station.lng, 1.52);

  useFrame(({ clock }) => {
    if (pulseRef.current) {
      const t = clock.getElapsedTime();
      const scale = 1 + 0.4 * Math.sin(t * 2 + station.lat);
      pulseRef.current.scale.setScalar(scale);
      (pulseRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.4 - 0.3 * Math.abs(Math.sin(t * 2 + station.lat));
    }
    if (markerRef.current) {
      const scale = hovered ? 1.5 : 1.0;
      markerRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(station.id);
  };

  return (
    <group position={pos}>
      {/* Pulse ring */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color="#ff4444"
          transparent
          opacity={0.4}
          emissive="#ff4444"
          emissiveIntensity={1}
        />
      </mesh>
      {/* Core dot */}
      <mesh
        ref={markerRef}
        onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? '#ffff00' : '#ff3333'}
          emissive={hovered ? '#ffff00' : '#ff2222'}
          emissiveIntensity={1.5}
        />
      </mesh>
      {/* Label on hover */}
      {hovered && (
        <Html distanceFactor={6} center>
          <div className="px-2 py-1 text-xs font-semibold text-white bg-[#0a0e27]/90 border border-[#00d1ff] rounded whitespace-nowrap pointer-events-none">
            {station.name}
            <div className="text-[#00d1ff] font-normal">{station.region}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function Scene({ stations, onStationClick }: PolarGlobe3DProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <directionalLight position={[-3, -2, -4]} intensity={0.25} color="#4488ff" />
      <pointLight position={[0, 0, 4]} intensity={0.4} color="#00d1ff" />

      <Stars radius={80} depth={50} count={4000} factor={4} saturation={0.4} fade speed={0.3} />

      <GlobeBase />

      {stations?.map((s) => (
        <StationMarker
          key={s.id}
          station={s}
          onClick={onStationClick ?? (() => {})}
        />
      ))}

      <OrbitControls
        enableZoom
        enablePan={false}
        autoRotate={false}
        minDistance={2.5}
        maxDistance={6}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
    </>
  );
}

export default function PolarGlobe3D({ stations = [], onStationClick }: PolarGlobe3DProps) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <Scene stations={stations} onStationClick={onStationClick} />
      </Suspense>
    </Canvas>
  );
}
