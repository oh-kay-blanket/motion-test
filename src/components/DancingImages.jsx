import React, { useRef, useEffect, useState, useMemo } from 'react';
import img2 from '../assets/img/l/flat2 copy 2.png';
import img3 from '../assets/img/l/flat2 copy 3.png';
import img4 from '../assets/img/l/flat2 copy 4.png';
import img5 from '../assets/img/l/flat2 copy 5.png';
import img6 from '../assets/img/l/flat2 copy 6.png';
import img7 from '../assets/img/l/flat2 copy 7.png';
import img8 from '../assets/img/l/flat2 copy 8.png';
import img9 from '../assets/img/l/flat2 copy 9.png';
import img10 from '../assets/img/l/flat2 copy 10.png';
import img11 from '../assets/img/l/flat2 copy 11.png';
import img12 from '../assets/img/l/flat2 copy 12.png';
import img13 from '../assets/img/l/flat2 copy 13.png';

// Randomly sorted array of dancing images
const dancingImages = [img8, img3, img11, img6, img13, img2, img9, img5, img12, img4, img10, img7];

function DancingImages({ scrollProgress }) {
  const sectionRef = useRef();
  const [localProgress, setLocalProgress] = useState(0);

  useEffect(() => {
    let rafId;

    function handleScroll() {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        if (!sectionRef.current) {
          rafId = null;
          return;
        }

        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate progress based on section position relative to viewport
        // 0 when section is below viewport, 1 when section is above viewport
        const sectionTop = rect.top;
        const sectionHeight = rect.height;

        let progress;
        if (sectionTop > windowHeight) {
          // Section below viewport
          progress = 0;
        } else if (sectionTop + sectionHeight < 0) {
          // Section above viewport
          progress = 1;
        } else {
          // Section intersecting viewport
          progress = (windowHeight - sectionTop) / (windowHeight + sectionHeight);
        }

        progress = Math.max(0, Math.min(1, progress));
        setLocalProgress(progress);
        rafId = null;
      });
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Generate randomized values for each image index
  const getRandomValues = useMemo(() => {
    const cache = {};
    return (index) => {
      if (cache[index]) return cache[index];

      const seed = index * 137 + 42; // Unique seed for each image
      const random = (offset = 0) => {
        const x = Math.sin(seed + offset) * 10000;
        return x - Math.floor(x);
      };

      cache[index] = {
        rotationTiming1: random(1) * 0.4 + 0.8, // 0.8-1.2x rotation speed
        rotationTiming2: random(2) * 0.4 + 0.8,
        rotationIntensity: random(3) * 3 + 1.5, // 1.5-4.5 degrees of jitter rotation
        rotationOffset: random(4) * Math.PI * 2, // Random rotation phase
        jitterTiming1: random(5) * 0.5 + 0.8, // Randomize existing jitter timing too
        jitterTiming2: random(6) * 0.5 + 0.8,
        jitterTiming3: random(7) * 0.5 + 0.8,
        jitterTiming4: random(8) * 0.5 + 0.8,
      };

      return cache[index];
    };
  }, []);

  // Dancing animation function similar to AnimatedWord style
  const getDancingImageStyle = useMemo(() => {
    return (index) => {
      const rawProgress = Math.min(Math.max(localProgress, 0), 1);

      // Stop-motion effect with frame quantization
      const frameRate = 15;
      const progress =
        rawProgress < 0.001
          ? 0
          : Math.max(
              Math.floor(rawProgress * frameRate) / frameRate,
              rawProgress > 0 ? 1 / frameRate : 0
            );

      // Get randomized values for this image
      const randomValues = getRandomValues(index);

      // Jitter for stop-motion authenticity with randomization
      const jitterAmount = 2;
      const frameIndex = Math.floor(rawProgress * frameRate);
      const jitterX =
        (Math.sin(frameIndex * 2.4 * randomValues.jitterTiming1 + index) +
          Math.cos(frameIndex * 1.7 * randomValues.jitterTiming2 + index)) *
        jitterAmount *
        (progress > 0 ? 1 : 0);
      const jitterY =
        (Math.cos(frameIndex * 2.1 * randomValues.jitterTiming3 + index) +
          Math.sin(frameIndex * 1.9 * randomValues.jitterTiming4 + index)) *
        jitterAmount *
        (progress > 0 ? 1 : 0);

      // Add randomized rotation jitter
      const jitterRotation =
        (Math.sin(frameIndex * 3.2 * randomValues.rotationTiming1 + randomValues.rotationOffset) +
          Math.cos(frameIndex * 2.7 * randomValues.rotationTiming2 + randomValues.rotationOffset)) *
        randomValues.rotationIntensity *
        (progress > 0 ? 1 : 0);

      // Mobile scaling
      const isMobile = window.innerWidth < 768;
      const scaleFactor = isMobile ? 0.7 : 1;

      // Single file formation: images follow each other with spacing
      const spacing = 150 * scaleFactor; // Increased space between images in the line
      const baseDistance = 800 * scaleFactor; // Distance to travel across screen

      // Calculate which copy this is and position within that copy
      const copyIndex = Math.floor(index / dancingImages.length);
      const imageIndexInCopy = index % dancingImages.length;

      // Each copy is offset by the total length needed for one complete set
      const totalSetLength = dancingImages.length * spacing;
      const copyStartOffset = copyIndex * totalSetLength;

      // Position within the copy
      const positionInCopy = imageIndexInCopy * spacing;

      // Calculate raw position for this specific copy and image
      const baseX = progress * baseDistance - 300;
      const rawX = baseX - positionInCopy - copyStartOffset;

      // Create seamless looping with simple wrapping
      let x = rawX;

      // Simple looping: wrap images when they go off screen
      const loopWidth = totalSetLength * 1.5; // Width to wrap around
      
      // Wrap images for continuous loop
      while (x < -window.innerWidth - 300) {
        x += loopWidth;
      }
      while (x > window.innerWidth + 300) {
        x -= loopWidth;
      }

      // Final check for completely off-screen images
      const viewportWidth = window.innerWidth;
      const buffer = 250;
      const isCompletelyOffScreen = x < -viewportWidth - buffer || x > viewportWidth + buffer;

      // Snake-like motion: each image follows the path of the one before it
      const snakeAmplitude = 40 * scaleFactor; // How much the snake waves up and down
      const snakeFrequency = 0.01; // How tight the snake curves are
      const phaseOffset = imageIndexInCopy * 1.8; // Offset between images in the snake

      // Create wave motion based on x position with phase offset for snake effect
      const wavePhase = x * snakeFrequency + phaseOffset;
      const y = Math.sin(wavePhase) * snakeAmplitude;

      // Add secondary wave for more organic snake movement
      const secondaryWave = Math.sin(wavePhase * 1.3 + phaseOffset * 0.5) * (snakeAmplitude * 0.3);
      const finalY = y + secondaryWave;

      // Slight wiggle for more organic movement
      const wiggleX = Math.cos(wavePhase * 2) * 3 * scaleFactor;
      const wiggleY = Math.sin(wavePhase * 2.3) * 2 * scaleFactor;

      // Rotation that follows the snake movement with jitter
      const baseRotate = Math.sin(wavePhase * 0.8) * 15;
      const rotate = baseRotate + jitterRotation;

      // Scale that pulses with the snake movement
      const scale = 1 + Math.abs(Math.sin(wavePhase * 1.5)) * 0.08;

      // Early return for completely off-screen images to prevent stacking
      if (isCompletelyOffScreen) {
        return {
          transform: `translate(${x}px, ${finalY}px) rotate(0deg) scale(0)`,
          opacity: 0,
          visibility: 'hidden',
          willChange: 'auto',
        };
      }

      return {
        transform: `translate(${x + jitterX + wiggleX}px, ${
          finalY + jitterY + wiggleY
        }px) rotate(${rotate}deg) scale(${scale})`,
        opacity: 1, // Always visible for debugging
        willChange: progress > 0 ? 'transform, opacity' : 'auto',
        visibility: 'visible', // Always visible for debugging
      };
    };
  }, [localProgress]);

  return (
    <div ref={sectionRef} className='w-full h-30 relative'>
      {/* Render 3 copies of the image set for seamless looping */}
      {Array.from({ length: 3 }).map((_, copyIndex) =>
        dancingImages.map((src, i) => {
          const globalIndex = copyIndex * dancingImages.length + i;
          return (
            <img
              key={`${copyIndex}-${i}`}
              src={src}
              alt={`Dancing item ${globalIndex + 1}`}
              className='absolute object-contain max-h-16 md:max-h-20 will-change-transform'
              style={{
                ...getDancingImageStyle(globalIndex),
                top: '50%', // All images at same vertical level for single file
                transform: `${getDancingImageStyle(globalIndex).transform} translateY(-50%)`, // Center vertically
                zIndex: dancingImages.length - i, // Layering effect
              }}
            />
          );
        })
      )}
    </div>
  );
}

export default DancingImages;
