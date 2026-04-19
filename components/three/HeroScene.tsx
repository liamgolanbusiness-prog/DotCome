"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  MeshDistortMaterial,
  Environment,
  Float,
  Sparkles,
  Trail,
  Grid,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import ShaderBackdrop from "./ShaderBackdrop";

function MouseCamera() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.05;
    camera.position.y += (pointer.y * 0.8 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Orb() {
  const ref = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.22;
      ref.current.rotation.x = Math.sin(t * 0.3) * 0.25;
      ref.current.position.y = Math.sin(t * 0.5) * 0.2;
    }
    if (inner.current) {
      inner.current.rotation.y = -t * 0.4;
      inner.current.rotation.z = t * 0.25;
    }
  });
  return (
    <Float speed={1.6} rotationIntensity={0.5} floatIntensity={1.6}>
      <group ref={ref}>
        <mesh scale={2.6}>
          <icosahedronGeometry args={[1, 64]} />
          <MeshDistortMaterial
            color="#7C3AED"
            emissive="#22D3EE"
            emissiveIntensity={0.6}
            roughness={0.08}
            metalness={0.95}
            distort={0.6}
            speed={2.4}
          />
        </mesh>
        {/* Inner wireframe core */}
        <mesh ref={inner} scale={1.4}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#F0ABFC" wireframe transparent opacity={0.35} />
        </mesh>
      </group>
    </Float>
  );
}

function InfinityFloor() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.ShaderMaterial;
      if (mat && mat.uniforms) {
        // drei Grid handles its own, we use rotation
      }
      ref.current.rotation.y = s.clock.elapsedTime * 0.05;
    }
  });
  return (
    <group position={[0, -2.6, 0]}>
      <Grid
        ref={ref as unknown as React.Ref<THREE.Mesh>}
        args={[40, 40]}
        cellSize={0.6}
        cellThickness={0.8}
        cellColor="#22D3EE"
        sectionSize={3}
        sectionThickness={1.2}
        sectionColor="#7C3AED"
        fadeDistance={18}
        fadeStrength={1.5}
        infiniteGrid
      />
    </group>
  );
}

function WireSphere({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.x = s.clock.elapsedTime * 0.3;
    ref.current.rotation.y = s.clock.elapsedTime * 0.2;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[1, 2]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
    </mesh>
  );
}

function Knot({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.x = s.clock.elapsedTime * 0.4;
    ref.current.rotation.y = s.clock.elapsedTime * 0.3;
  });
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={ref} position={position} scale={0.35}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
}

function Orbit({
  radius,
  speed,
  color,
  tilt,
}: {
  radius: number;
  speed: number;
  color: string;
  tilt: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.z = s.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.01, 16, 220]} />
      <meshBasicMaterial color={color} transparent opacity={0.45} />
    </mesh>
  );
}

function Comet({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime * speed;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t * 0.6) * radius * 0.4;
    ref.current.position.z = Math.sin(t) * radius;
  });
  return (
    <Trail width={2.5} length={6} color={color} attenuation={(t) => t * t}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Trail>
  );
}

function Particles() {
  const points = useMemo(() => {
    const arr = new Float32Array(2500 * 3);
    for (let i = 0; i < 2500; i++) {
      const r = 4 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = s.clock.elapsedTime * 0.04;
      ref.current.rotation.x = s.clock.elapsedTime * 0.015;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
          count={points.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#F0ABFC" sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#05060E"]} />
      <ShaderBackdrop />
      <MouseCamera />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, -2]} intensity={2.5} color="#F0ABFC" />
      <pointLight position={[5, -3, 2]} intensity={2} color="#22D3EE" />
      <pointLight position={[0, 4, 3]} intensity={1.5} color="#7C3AED" />

      <InfinityFloor />
      <Orb />
      <Orbit radius={3} speed={0.2} color="#22D3EE" tilt={Math.PI / 2.5} />
      <Orbit radius={3.5} speed={-0.14} color="#7C3AED" tilt={Math.PI / 3} />
      <Orbit radius={4} speed={0.1} color="#F0ABFC" tilt={Math.PI / 2.2} />
      <Orbit radius={4.6} speed={-0.07} color="#22D3EE" tilt={Math.PI / 2.8} />

      <Knot position={[3.2, 1.3, 0]} color="#22D3EE" />
      <Knot position={[-3, -1.5, 1]} color="#F0ABFC" />
      <Knot position={[0, 2.6, -2]} color="#7C3AED" />
      <Knot position={[-3.5, 1.8, -1]} color="#22D3EE" />

      <WireSphere position={[4.2, -1.2, -1]} scale={0.5} color="#F0ABFC" />
      <WireSphere position={[-4, 2, 0]} scale={0.4} color="#22D3EE" />
      <WireSphere position={[2.5, -2.5, 1]} scale={0.35} color="#7C3AED" />

      <Comet radius={4.2} speed={0.8} color="#F0ABFC" />
      <Comet radius={3.8} speed={-0.6} color="#22D3EE" />
      <Comet radius={5} speed={0.5} color="#7C3AED" />

      <Particles />
      <Sparkles count={100} scale={12} size={2.5} speed={0.5} color="#ffffff" />

      <Environment preset="night" />

      <EffectComposer>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0012, 0.0012] as unknown as THREE.Vector2}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.2} darkness={0.7} />
        <Noise opacity={0.05} />
      </EffectComposer>
    </Canvas>
  );
}
