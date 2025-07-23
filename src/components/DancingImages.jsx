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

  // Dancing animation function similar to AnimatedWord style
  const getDancingImageStyle = useMemo(() => {
    return (index) => {
      const rawProgress = Math.min(Math.max(localProgress, 0), 1);

      // Stop-motion effect with frame quantization
      const frameRate = 20;
      const progress =
        rawProgress < 0.001
          ? 0
          : Math.max(
              Math.floor(rawProgress * frameRate) / frameRate,
              rawProgress > 0 ? 1 / frameRate : 0
            );

      // Jitter for stop-motion authenticity
      const jitterAmount = 2;
      const frameIndex = Math.floor(rawProgress * frameRate);
      const jitterX =
        (Math.sin(frameIndex * 2.4 + index) + Math.cos(frameIndex * 1.7 + index)) *
        jitterAmount *
        (progress > 0 ? 1 : 0);
      const jitterY =
        (Math.cos(frameIndex * 2.1 + index) + Math.sin(frameIndex * 1.9 + index)) *
        jitterAmount *
        (progress > 0 ? 1 : 0);

      // Mobile scaling
      const isMobile = window.innerWidth < 768;
      const scaleFactor = isMobile ? 0.7 : 1;

      // Single file formation: images follow each other with spacing
      const spacing = 120 * scaleFactor; // Space between images in the line
      const baseDistance = 700 * scaleFactor; // Distance to travel across screen

      // Calculate which copy this is and position within that copy
      const copyIndex = Math.floor(index / dancingImages.length);
      const imageIndexInCopy = index % dancingImages.length;

      // Each copy is offset by the total length needed for one complete set
      const totalSetLength = dancingImages.length * spacing;
      const copyStartOffset = copyIndex * totalSetLength;

      // Position within the copy
      const positionInCopy = imageIndexInCopy * spacing;

      // Calculate raw position
      const rawX = progress * baseDistance - 300 - positionInCopy - copyStartOffset;

      // Create seamless looping: when an image goes off the right, it reappears on the left
      const loopWidth = totalSetLength * 2; // Loop every 2 complete sets to avoid gaps
      const x = (((rawX % loopWidth) + loopWidth) % loopWidth) - totalSetLength;

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

      // Rotation that follows the snake movement
      const rotate = Math.sin(wavePhase * 0.8) * 15;

      // Scale that pulses with the snake movement
      const scale = 1 + Math.abs(Math.sin(wavePhase * 1.5)) * 0.08;

      // Check if off-screen for performance
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const buffer = 200;
      const isOffScreen =
        x < -viewportWidth - buffer ||
        x > viewportWidth + buffer ||
        finalY < -viewportHeight - buffer ||
        finalY > viewportHeight + buffer;

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
