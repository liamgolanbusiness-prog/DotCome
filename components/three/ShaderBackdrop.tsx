"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;

  // simplex-ish noise by IQ (cheap)
  vec3 hash3(vec2 p) {
    vec3 q = vec3( dot(p,vec2(127.1,311.7)),
                   dot(p,vec2(269.5,183.3)),
                   dot(p,vec2(419.2,371.9)) );
    return fract(sin(q)*43758.5453);
  }

  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( dot(hash3(i+vec2(0,0)).xy-0.5, f-vec2(0,0)),
                     dot(hash3(i+vec2(1,0)).xy-0.5, f-vec2(1,0)), u.x),
                mix( dot(hash3(i+vec2(0,1)).xy-0.5, f-vec2(0,1)),
                     dot(hash3(i+vec2(1,1)).xy-0.5, f-vec2(1,1)), u.x), u.y);
  }

  void main() {
    vec2 uv = vUv - 0.5;
    uv.x *= 1.6;
    float t = uTime * 0.08;

    float n = 0.0;
    n += noise(uv * 1.5 + vec2(t, -t*0.6));
    n += noise(uv * 3.0 - vec2(t*0.8, t)) * 0.5;
    n += noise(uv * 6.0 + vec2(-t*1.2, t*0.4)) * 0.25;
    n = n * 0.5 + 0.5;

    vec3 violet = vec3(0.486, 0.227, 0.929);
    vec3 cyan   = vec3(0.133, 0.827, 0.933);
    vec3 mag    = vec3(0.941, 0.671, 0.988);
    vec3 ink    = vec3(0.020, 0.024, 0.055);

    vec3 col = mix(violet, cyan, smoothstep(0.2, 0.8, n));
    col = mix(col, mag, smoothstep(0.5, 1.0, n + sin(uTime*0.2 + uv.y*3.0)*0.15));
    col = mix(ink, col, smoothstep(0.1, 0.9, n));

    // radial vignette for depth
    float r = length(vUv - 0.5);
    col *= smoothstep(0.95, 0.15, r);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function ShaderBackdrop() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((s) => {
    if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime;
  });

  return (
    <mesh position={[0, 0, -6]} scale={[30, 18, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}
