import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useRef, memo } from "react";

interface WordItem {
  word: string;
  weight: number;
}

const Word = memo(function Word({ text, pos, size, color }: any) {
  const ref = useRef<THREE.Object3D>(null!);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.003;
    ref.current.position.y += Math.sin(Date.now() * 0.001) * 0.002;
  });

  return (
    <Text
      ref={ref}
      position={pos}
      fontSize={size}
      color={color}
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
});

export function WordCloud3D({ words }: { words: WordItem[] }) {
  const radius = 18;

  const maxWeight =
    Math.max(...words.map((w) => w.weight), 0.0001) || 0.0001;

  const positions = words.map((_, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / words.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

    return [
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi),
    ];
  });

  return (
    <Canvas camera={{ position: [0, 0, 45], fov: 55 }}>
      <color attach="background" args={["#020617"]} />
      <ambientLight intensity={0.7} />
      <OrbitControls autoRotate autoRotateSpeed={0.7} enablePan={false} />

      {words.map((w, i) => {
        const norm = w.weight / maxWeight;
        const size = 1 + norm * 2;
        const color = `hsl(${250 - norm * 140}, 90%, 60%)`;
        return <Word key={i} text={w.word} pos={positions[i]} size={size} color={color} />;
      })}
    </Canvas>
  );
}
