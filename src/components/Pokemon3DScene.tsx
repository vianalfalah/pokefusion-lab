import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, Suspense } from "react";
import { Float, MeshDistortMaterial, Sphere, Environment } from "@react-three/drei";
import * as THREE from "three";

interface Pokemon3DSceneProps {
  color?: string;
  secondaryColor?: string;
}

function RotatingOrb({ color, secondaryColor }: { color: string; secondaryColor: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere
        ref={meshRef}
        args={[1.5, 64, 64]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <MeshDistortMaterial
          color={color}
          emissive={secondaryColor}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
          distort={hovered ? 0.5 : 0.3}
          speed={2}
        />
      </Sphere>
    </Float>
  );
}

function ParticleRing() {
  const groupRef = useRef<THREE.Group>(null);
  const count = 60;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const radius = 2.5;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={2} />
          </mesh>
        );
      })}
    </group>
  );
}

const Pokemon3DScene = ({ color = "#3b82f6", secondaryColor = "#8b5cf6" }: Pokemon3DSceneProps) => {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color={color} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color={secondaryColor} />
          <spotLight position={[0, 5, 0]} intensity={0.5} penumbra={1} />
          <RotatingOrb color={color} secondaryColor={secondaryColor} />
          <ParticleRing />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Pokemon3DScene;
