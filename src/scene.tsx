import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { throttle } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faTelegram, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import BackToTopButton from './components/backtotop'; // Adjust the path based on your file structure

interface ModelProps {
  scrollProgress: number;
}

function Model({ scrollProgress }: ModelProps) {
  const { scene, animations } = useGLTF('/ghostanim.gltf');
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (scene && animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(scene);
      const action = mixer.current.clipAction(animations[0]);
      action.play();
      action.loop = THREE.LoopOnce;
      action.clampWhenFinished = true;
    }
  }, [scene, animations]);

  useEffect(() => {
    if (mixer.current && animations[0]) {
      const animationDuration = animations[0].duration;
      // Stretch the animation progress over a larger scroll distance
      const time = (scrollProgress * 5) % animationDuration; // The 0.5 here slows the progression
      mixer.current.setTime(time);
    }
  }, [scrollProgress, animations, isAnimating]);

  return <primitive object={scene} position={[0, 0, 0]} scale={[40, 40, 40]} />;
}

function SceneComponent() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contentVisibility, setContentVisibility] = useState({
    welcomeMessage: false,
    section1: false,
    section2: false,
    section3: false, // Added an extra section
    section4: false, // Added an extra section
  });

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setScrollProgress(scrollPercentage);

      // Update content visibility based on scroll progress
      setContentVisibility({
        welcomeMessage: scrollPercentage >= 0.1 && scrollPercentage < 0.25, // Starts appearing slightly after scrolling begins
        section1: scrollPercentage >= 0.25 && scrollPercentage < 0.45, // Evenly spaced
        section2: scrollPercentage >= 0.45 && scrollPercentage < 0.65, // Evenly spaced
        section3: scrollPercentage >= 0.65 && scrollPercentage < 0.85, // Evenly spaced
        section4: scrollPercentage >= 0.85 && scrollPercentage <= 1.0, // Takes the remaining space to the end
      });
    }, 20);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <Canvas style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
        <ambientLight intensity={2} color={new THREE.Color('#008080')} />
        <pointLight intensity={10} position={[0, 4, 1]} />
        <pointLight intensity={10} position={[0, -4, 1]} />
        <Model scrollProgress={scrollProgress} />
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
          <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={300} />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
        <Html position={[0, 0, -5]}transform>
  {contentVisibility.welcomeMessage && (
    <div className="content center">
      <h1>Welcome to GH0ST LABS</h1>
      <h2>Hybrid DeFi Incubator</h2>
      <p>Our mission is to continually explore the uncharted territories at the bleeding edge of the Solana ecosystem from Inscription Meta Protocols, to Digital Artifacts, On-chain Generative Art, Public Fair Mints, Hybrid DeFi & beyond. Our Incubator and Accelerator programs aim to help launch the most innovative new hybrid projects including SPL22, SPL404, or even entirely novel custom builds catered to your specific needs.</p>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center' }}>
      <a target="_blank" href="https://docs.gh0stlabs.io/gh0stc0in/our-legacy-spl22" style={{ color: 'white' }}>
        <FontAwesomeIcon icon={faBook} size="1x" />
      </a>
      <a target="_blank" href="https://twitter.com/GH0STC0IN" style={{ color: 'white' }}>
        <FontAwesomeIcon icon={faTwitter} size="1x" />
      </a>
      <a target="_blank" href="https://t.me/GH0STC0IN" style={{ color: 'white' }}> {/* Corrected Telegram URL */}
        <FontAwesomeIcon icon={faTelegram} size="1x" />
      </a>
      <a target="_blank" href="https://discord.com/invite/RgtFus49A2" style={{ color: 'white' }}>
        <FontAwesomeIcon icon={faDiscord} size="1x" />
      </a>
    </div>
      <nav>
        <a href="#about">Next Page <i className="fa-solid fa-angle-right"></i></a>
      </nav>
    </div>
  )}
  {contentVisibility.section1 && (
    <div className="content center">
      <h1>What is Hybrid DeFi?</h1>
      <h2></h2>
      <div id="videoLoader" className="loader">
      <iframe src="https://drive.google.com/file/d/1KADGp4p_9uiFfaMcY67MlQR-Ofuws9bm/preview" width="300" height="180" allow="autoplay"></iframe>
      </div>
      <h2>INFOGRAPHIC</h2>
      <img width={300} src="https://docs.gh0stlabs.io/~gitbook/image?url=https:%2F%2F1244097569-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FsfMfBheZZUz1xt4DF9fv%252Fuploads%252FeoqOMkQHhoATxE9OnSJ2%252FHybridDeFiInfographic.png%3Falt=media%26token=1fdc9fe1-ecd5-40ba-9fd1-144d994e2aef&width=768&dpr=2&quality=100&sign=8ee8549f26600d34a447a7bec3891a89d59349ec413b9a172304387368aac8ff"></img>
      <nav>
        <a href="#welcome"><i className="fa-solid fa-angle-left"></i> Previous Page</a> &bull; <a href="#contact">Next Page <i className="fa-solid fa-angle-right"></i></a>
      </nav>
    </div>
  )}
  {contentVisibility.section2 && (
    <div className="content center">
      <h1>Our Legacy:SPL22</h1>
      <p>GH0ST LABS grew out of the need to scale and expand the GH0STC0IN ecosystem, which originally launched as a free mint with no utility, no roadmap, just the first SPL22 proof of concept. 
      <br></br>
SPL22 is a Hybrid DeFi meta-protocol built on top of SPL20 & Token Extensions (formerly known as Token2022) powered by LibrePlex. 
<br></br>
Unlike SPL20, SPL22 does not rely on any centralized 3rd party entities and is 100% free of protocol level fees to mint NFTs by utilizing Token Extension Metadata. This eliminates the 0.023 SOL mint fee that was associated with SPL20 Metaplex NFTs. For a 21,000 supply collection, that's ~480 SOL saved. This allows us to frictionlessly introduce a 0.02 SOL LP mint fee to crowdfund a liquidity pool enabling immediate DEX trading upon launch without the need for startup capital or pre-sale.  </p>
<div className="flex-container">
      <h3>Tokenomics:<br></br>
Total Supply: 21,000,000<br></br>
NFT Supply: 21,000<br></br>
Tokens per NFT: 1,000<br></br>
Mint Distribution: 90% Public | 10% LP</h3><br></br>
<img width={250} src="https://docs.gh0stlabs.io/~gitbook/image?url=https:%2F%2F1244097569-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FsfMfBheZZUz1xt4DF9fv%252Fuploads%252F5nyUA2hhx4t59QL9lGyL%252Fgh0stpiechart.png%3Falt=media%26token=4789b641-1cd1-414a-869d-30b84281bffd&width=768&dpr=2&quality=100&sign=f254c1eb18142650d499b525a1a24a0fb6b14213c5410ce32200b89dc36de760"></img>
      <nav>
        <a href="#about"><i className="fa-solid fa-angle-left"></i> Previous Page</a> &bull; <a href="#other">Next Page <i className="fa-solid fa-angle-right"></i></a>
      </nav>
    </div></div>
  )}
  {contentVisibility.section3 && (
    <div className="content center">
      <h1>Incubator</h1>
      <h2>Our Incubator Program</h2>
      <p>is aimed at teams and individuals looking to launch their Hybrid DeFi project who do not have a pre-built product. We can help you from every step of the process including developing & deploying the on-chain framework for your hybrid asset, advisory on the Tokenomics, Mint pricing, Branding & Go-To Market Strategy in addition to ongoing advisory for the continued growth of your project beyond the launch. Founders do not need any startup capital or developers to launch their project with our Incubator program, just an innovative idea & a full-time schedule they can dedicate.

There is no up-front cost for project founders and the specific structure of each partnership will be negotiated on a case by case basis so we can best cater to your needs. An airdrop allocation for $GH0ST holders and a percentage of mint raise should be expected.</p>
      <nav>
        <a href="#contact"><i className="fa-solid fa-angle-left"></i> Previous Page</a> &bull; <a href="#welcome">Start Over <i className="fa-solid fa-arrow-rotate-left"></i></a>
      </nav>
    </div>
  )}
  {/* Assuming you add a visibility control for the accelerator section */}
  {contentVisibility.section4 && (
    <div className="content center">
      <h1>Accelerator</h1>
      <h2>Our Accelerator Program</h2>
      <p>is aimed at teams looking to launch their Hybrid DeFi project who have a pre-built product that is 80% or more of the way ready to launch. We can help you to fine tune nearly every aspect of your project including advisory on the Tokenomics, Mint pricing, Branding & Go-To Market Strategy in addition to ongoing advisory for the continued growth of your project beyond the launch. Founders do not need any startup capital to launch their project with our Accelerator program, just an innovative product that is nearly ready to launch and the team dedicated to its success. 

There is no up-front cost for project founders and the specific structure of each partnership will be negotiated on a case by case basis so we can best cater to your needs. An airdrop allocation for $GH0ST holders and a percentage of mint raise should be expected.</p>
      <h2>Hybrid Migrations</h2>
      <p>Our accelerator program also includes legacy projects that are either NFT collections or Tokens looking to migrate to a Hybrid standard. For example, if a memecoin would like to introduce a PFP in a non-dilutionary manner, or if an illiquid NFT collection would like to introduce a token with LP that their NFTs can be swapped for, we can assist with both of these Hybrid Migration scenarios.</p>
      <nav>
        <a href="#other"><i className="fa-solid fa-angle-left"></i> Previous Page</a>
      </nav>
      <BackToTopButton />
    </div>
  )}
</Html>

      </Canvas>
    </div>
  );
}

export default SceneComponent;
