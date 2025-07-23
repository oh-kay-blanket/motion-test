import React, { useRef, useEffect, useState, useMemo } from 'react';
import img2 from '../assets/img/k/flat copy 2.png';
import img3 from '../assets/img/k/flat copy 3.png';
import img6 from '../assets/img/k/flat copy 6.png';
import img8 from '../assets/img/k/flat copy 8.png';
import img10 from '../assets/img/k/flat copy 10.png';
import img11 from '../assets/img/k/flat copy 11.png';
import img12 from '../assets/img/k/flat copy 12.png';
import img13 from '../assets/img/k/flat copy 13.png';
import img14 from '../assets/img/k/flat copy 14.png';
import img16 from '../assets/img/k/flat copy 16.png';
import img17 from '../assets/img/k/flat copy 17.png';
import img18 from '../assets/img/k/flat copy 18.png';
import img20 from '../assets/img/k/flat copy 20.png';
import img21 from '../assets/img/k/flat copy 21.png';
import img22 from '../assets/img/k/flat copy 22.png';
import img24 from '../assets/img/k/flat copy 24.png';
import img27 from '../assets/img/k/flat copy 27.png';

// Randomly sorted array of k images
const kImages = [
  img17,
  img3,
  img21,
  img10,
  img27,
  img6,
  img14,
  img22,
  img8,
  img16,
  img12,
  img20,
  img2,
  img24,
  img11,
  img18,
];

function JumbledImageGrid({ scrollProgress }) {
  // Shuffle images for a jumbled effect
  const shuffled = React.useMemo(() => {
    const arr = [...kImages];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // --- Local scroll progress logic ---
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

        // Calculate progress based on section center relative to viewport center
        // 0.5 when section center aligns with viewport center (images are centered)
        // 0 when section is below viewport, 1 when section is above viewport
        const sectionCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;

        // Distance from viewport center to section center, normalized
        const distanceFromCenter = (sectionCenter - viewportCenter) / windowHeight;

        // Convert to progress: 0.5 when centered, 0 when below, 1 when above
        let progress = 0.5 - distanceFromCenter;
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

  // AnimatedWord-style image animation function
  const getImageAnimationStyle = useMemo(() => {
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

      // Mobile scaling
      const isMobile = window.innerWidth < 768;
      const scaleFactor = isMobile ? 0.6 : 1;

      // Calculate scatter strength that goes from far to center to far in same direction
      // This creates a continuous trajectory that passes through the center
      const scatterStrength = Math.abs(progress - 0.5) * 2; // 0 at center, 1 at edges

      // Determine direction: negative when approaching center, positive when leaving
      const direction = progress < 0.5 ? -1 : 1;

      // Jitter for stop-motion authenticity - only when scattered, not when centered
      const jitterAmount = 1.5;
      const frameIndex = Math.floor(rawProgress * frameRate);
      const jitterX =
        (Math.sin(frameIndex * 2.4 + index) + Math.cos(frameIndex * 1.7 + index)) *
        jitterAmount *
        (scatterStrength > 0.1 ? 1 : 0);
      const jitterY =
        (Math.cos(frameIndex * 2.1 + index) + Math.sin(frameIndex * 1.9 + index)) *
        jitterAmount *
        (scatterStrength > 0.1 ? 1 : 0);

      // Explosion-style radial movement from center point
      // Each image gets a unique angle based on its index for consistent explosion pattern
      const explosionAngle = (index / kImages.length) * 2 * Math.PI + index * 17; // Added offset for more natural spread
      const explosionDistance = (250 + (index % 4) * 80) * scaleFactor; // Varied distances for depth

      // Additional slight angle variation based on grid position for more organic feel
      const gridCol = index % 8; // Assuming max 8 columns
      const gridRow = Math.floor(index / 8);
      const angleVariation = ((gridCol * 0.3 + gridRow * 0.5) * Math.PI) / 8;
      const finalAngle = explosionAngle + angleVariation;

      // Calculate explosion position with continuous trajectory
      const x = Math.cos(finalAngle) * explosionDistance * scatterStrength * direction;
      const y = Math.sin(finalAngle) * explosionDistance * scatterStrength * direction;

      // Rotation increases as images move outward, with some variation
      const rotate = scatterStrength * (180 + index * 20) * (index % 2 === 0 ? 1 : -1);

      // Check if off-screen for performance
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const buffer = 200;
      const isOffScreen =
        x < -viewportWidth - buffer ||
        x > viewportWidth + buffer ||
        y < -viewportHeight - buffer ||
        y > viewportHeight + buffer;

      return {
        transform: `translate(${x + jitterX}px, ${y + jitterY}px) rotate(${rotate}deg)`,
        opacity: isOffScreen ? 0 : 1,
        willChange: progress > 0 && !isOffScreen ? 'transform, opacity' : 'auto',
        visibility: isOffScreen ? 'hidden' : 'visible',
      };
    };
  }, [localProgress]);

  return (
    <div
      ref={sectionRef}
      className='max-w-[400px] mx-auto flex flex-col items-center mb-10 relative'
    >
      <div className='flex flex-wrap justify-center'>
        {shuffled.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Collection item ${i + 1}`}
            className='object-contain rounded max-w-full max-h-20 md:max-h-24 aspect-square will-change-transform'
            style={getImageAnimationStyle(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default JumbledImageGrid;
