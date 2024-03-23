import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { throttle } from 'lodash'; // Make sure lodash is installed and @types/lodash for TypeScript
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import DatGui, { DatNumber, DatColor } from 'react-dat-gui';

interface ModelProps {
  scrollProgress: number;
  setScrollProgress: React.Dispatch<React.SetStateAction<number>>;
}

interface GuiParams {
  ambientLightIntensity: number;
  ambientLightColor: string;
  pointLightTopIntensity: number;
  pointLightTopColor: string;
  pointLightBottomIntensity: number;
  pointLightBottomColor: string;
  bloomThreshold: number;
  bloomSmoothing: number;
  depthOfFieldFocusDistance: number;
  depthOfFieldFocalLength: number;
  depthOfFieldBokehScale: number;
  noiseOpacity: number;
  vignetteOffset: number;
  vignetteDarkness: number;
  throttleValue: number;
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
  const [guiParams, setGuiParams] = useState<GuiParams>({
    ambientLightIntensity: 10,
    ambientLightColor: '#2fe0e0',
    pointLightTopIntensity: 10,
    pointLightTopColor: '#ffffff',
    pointLightBottomIntensity: 30,
    pointLightBottomColor: '#ffffff',
    bloomThreshold: 0,
    bloomSmoothing: 0.9,
    depthOfFieldFocusDistance: 0,
    depthOfFieldFocalLength: 0.02,
    depthOfFieldBokehScale: 0,
    noiseOpacity: 0.02,
    vignetteOffset: 0.1,
    vignetteDarkness: 1.1,
    throttleValue: 20
  });

  const handleGuiChange = (newGuiParams: Partial<GuiParams>) => {
    setGuiParams({ ...guiParams, ...newGuiParams });
  };

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setScrollProgress(scrollPercentage);
    }, guiParams.throttleValue);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [guiParams]);
  return (
    <div>
<DatGui data={guiParams} onUpdate={handleGuiChange}>
  <DatNumber path="ambientLightIntensity" label="Ambient Light Intensity" min={0} max={100} step={0.1} />
  <DatColor path="ambientLightColor" label="Ambient Light Color" />
  <DatNumber path="pointLightTopIntensity" label="Top Point Light Intensity" min={0} max={100} step={0.1} />
  <DatColor path="pointLightTopColor" label="Top Point Light Color" />
  <DatNumber path="pointLightBottomIntensity" label="Bottom Point Light Intensity" min={0} max={100} step={0.1} />
  <DatColor path="pointLightBottomColor" label="Bottom Point Light Color" />
  <DatNumber path="bloomThreshold" label="Bloom Threshold" min={0} max={1} step={0.01} />
  <DatNumber path="bloomSmoothing" label="Bloom Smoothing" min={0} max={1} step={0.01} />
  <DatNumber path="depthOfFieldFocusDistance" label="Depth of Field Focus Distance" min={0} max={1} step={0.01} />
  <DatNumber path="depthOfFieldFocalLength" label="Depth of Field Focal Length" min={0} max={0.1} step={0.001} />
  <DatNumber path="depthOfFieldBokehScale" label="Depth of Field Bokeh Scale" min={0} max={10} step={0.1} />
  <DatNumber path="noiseOpacity" label="Noise Opacity" min={0} max={1} step={0.01} />
  <DatNumber path="vignetteOffset" label="Vignette Offset" min={0} max={1} step={0.01} />
  <DatNumber path="vignetteDarkness" label="Vignette Darkness" min={0} max={10} step={0.1} />
  {/* <DatNumber path="throttleValue" label="Throttle Value" min={.01} max={10} step={.1} /> */}
</DatGui>
      <Canvas style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
        <ambientLight intensity={guiParams.ambientLightIntensity} color={new THREE.Color(guiParams.ambientLightColor)} />
        <pointLight intensity={guiParams.pointLightTopIntensity} color={new THREE.Color(guiParams.pointLightTopColor)} position={[0, 4, 1]} />
        <pointLight intensity={guiParams.pointLightBottomIntensity} color={new THREE.Color(guiParams.pointLightBottomColor)} position={[0, -4, 1]} />
        <Model scrollProgress={scrollProgress} setScrollProgress={setScrollProgress} />
        <EffectComposer>
          <Bloom luminanceThreshold={guiParams.bloomThreshold} luminanceSmoothing={guiParams.bloomSmoothing} height={300} />
          <DepthOfField focusDistance={guiParams.depthOfFieldFocusDistance} focalLength={guiParams.depthOfFieldFocalLength} bokehScale={guiParams.depthOfFieldBokehScale} height={300} />
          <Noise opacity={guiParams.noiseOpacity} />
          <Vignette eskil={false} offset={guiParams.vignetteOffset} darkness={guiParams.vignetteDarkness} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export default SceneComponent;

