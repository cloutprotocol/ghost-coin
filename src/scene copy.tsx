import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { throttle } from 'lodash'; // Make sure lodash is installed and @types/lodash for TypeScript
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';

interface ModelProps {
  scrollProgress: number;
  setScrollProgress: React.Dispatch<React.SetStateAction<number>>;
}

function Model({ scrollProgress, setScrollProgress }: ModelProps) {
  const { scene, animations } = useGLTF('/ghostanim.gltf');
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (scene && animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(scene);
      const action = mixer.current.clipAction(animations[0]);
      action.play();
      action.loop = THREE.LoopOnce; // Ensure animation stops at the end
      action.clampWhenFinished = true; // Clamp animation to last frame when finished
    }
  }, [scene, animations]);

  useEffect(() => {
    if (mixer.current && animations[0] && isAnimating) {
      const animationDuration = animations[0].duration;
      const adjustedDuration = animationDuration + (animationDuration * 0.01 * (1 - scrollProgress)); // Adjust duration based on scroll speed
      const time = scrollProgress * adjustedDuration;
      mixer.current.setTime(time % adjustedDuration);
    }
  }, [scrollProgress, animations, isAnimating]);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setScrollProgress(scrollPercentage);
      if (scrollPercentage >= 1) setIsAnimating(false); // Stop animation when at the bottom
      else setIsAnimating(true);
    }, 20); // Adjust throttle duration for smoother animation

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress]);

  return <primitive object={scene} position={[0, 0, 0]} scale={[40, 40, 40]} />;
}

function SceneComponent() {
  const [scrollProgress, setScrollProgress] = useState(0);

  return (
    <div>
      {/* <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={scrollProgress}
        onChange={(e) => setScrollProgress(parseFloat(e.target.value))}
        style={{ width: '99%', position: 'fixed', bottom: 0, left: 0, zIndex: 10 }}
      /> */}
      <Canvas style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <ambientLight intensity={2} color={new THREE.Color('#008080')} /> {/* Change color here */}
        <pointLight intensity={10} position={[0, 4, 1]} />
        <pointLight intensity={10} position={[0, -4, 1]} />
        <Model scrollProgress={scrollProgress} setScrollProgress={setScrollProgress} />
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
          <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={300} />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export default SceneComponent;
