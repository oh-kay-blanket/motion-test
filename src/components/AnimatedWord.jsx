import { useMemo } from 'react';

const AnimatedWord = ({ children, scrollProgress, animationType = 'default', className }) => {
  // Generate unique random values for this word instance
  const randomValues = useMemo(() => {
    const seed = children
      .toString()
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (offset = 0) => {
      const x = Math.sin(seed + offset) * 10000;
      return x - Math.floor(x);
    };

    return {
      timingOffset1: random(1) * 0.5 + 0.8, // 0.8-1.3x speed multiplier
      timingOffset2: random(2) * 0.5 + 0.8,
      timingOffset3: random(3) * 0.5 + 0.8,
      timingOffset4: random(4) * 0.5 + 0.8,
      intensityMultiplier: random(5) * 0.6 + 0.7, // 0.7-1.3x intensity
      directionOffset1: random(6) * Math.PI * 2, // Random phase offset
      directionOffset2: random(7) * Math.PI * 2,
      frameOffset: Math.floor(random(8) * 50), // Random frame offset for timing variation
      rotationTiming1: random(9) * 0.4 + 0.8, // 0.8-1.2x rotation speed
      rotationTiming2: random(10) * 0.4 + 0.8,
      rotationIntensity: random(11) * 3 + 1.5, // 1.5-4.5 degrees of jitter rotation
      rotationOffset: random(12) * Math.PI * 2, // Random rotation phase
      // Organic trajectory curve parameters
      curveIntensity: random(13) * 100 + 50, // 50-150px curve amplitude
      curveFrequency: random(14) * 2 + 1, // 1-3 curve cycles
      curvePhase: random(15) * Math.PI * 2, // Random curve phase
      doglegPoint: random(16) * 0.4 + 0.3, // 0.3-0.7 where the dogleg happens
      doglegIntensity: random(17) * 80 + 40, // 40-120px dogleg deviation
    };
  }, [children]);

  const animationStyles = useMemo(() => {
    const rawProgress = Math.min(Math.max(scrollProgress, 0), 1);

    // Create stuttered/stop-motion effect by quantizing progress into discrete steps
    const frameRate = 100; // Reduced for more immediate response while keeping stutter effect
    // Ensure even tiny movements register
    const progress = rawProgress < 0.001 ? 0 : Math.floor(rawProgress * frameRate) / frameRate;
    console.log(progress);

    // Add randomized jitter for more authentic stop-motion feel
    const baseJitterAmount = 2; // base pixels of random movement
    const jitterAmount = baseJitterAmount * randomValues.intensityMultiplier;
    const frameIndex = Math.floor(rawProgress * frameRate) + randomValues.frameOffset;

    const jitterX =
      (Math.sin(frameIndex * 2.4 * randomValues.timingOffset1 + randomValues.directionOffset1) +
        Math.cos(frameIndex * 1.7 * randomValues.timingOffset2 + randomValues.directionOffset2)) *
      jitterAmount *
      (progress > 0 ? 1 : 0);
    const jitterY =
      (Math.cos(frameIndex * 2.1 * randomValues.timingOffset3 + randomValues.directionOffset1) +
        Math.sin(frameIndex * 1.9 * randomValues.timingOffset4 + randomValues.directionOffset2)) *
      jitterAmount *
      (progress > 0 ? 1 : 0);

    // Add randomized rotation jitter
    const jitterRotation =
      (Math.sin(frameIndex * 3.2 * randomValues.rotationTiming1 + randomValues.rotationOffset) +
        Math.cos(frameIndex * 2.7 * randomValues.rotationTiming2 + randomValues.rotationOffset)) *
      randomValues.rotationIntensity *
      (progress > 0 ? 1 : 0);

    // Check if mobile device for scaled-down animations
    const isMobile = window.innerWidth < 768;
    const scaleFactor = isMobile ? 0.6 : 1;

    // Calculate viewport dimensions for off-screen detection
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Helper function to add organic curves to trajectories
    const addOrganicCurve = (baseX, baseY, progress) => {
      // Add smooth curves along the path
      const curveX =
        Math.sin(progress * Math.PI * randomValues.curveFrequency + randomValues.curvePhase) *
        randomValues.curveIntensity *
        Math.sin(progress * Math.PI); // Fade in/out curve
      const curveY =
        Math.cos(progress * Math.PI * randomValues.curveFrequency * 1.3 + randomValues.curvePhase) *
        randomValues.curveIntensity *
        0.7 *
        Math.sin(progress * Math.PI);

      // Add dogleg effect - sudden direction change at a specific point
      let doglegX = 0,
        doglegY = 0;
      if (progress > randomValues.doglegPoint) {
        const doglegProgress =
          (progress - randomValues.doglegPoint) / (1 - randomValues.doglegPoint);
        const doglegEasing = 1 - Math.pow(1 - doglegProgress, 3); // Smooth easing
        doglegX = Math.sin(randomValues.curvePhase) * randomValues.doglegIntensity * doglegEasing;
        doglegY =
          Math.cos(randomValues.curvePhase + Math.PI / 4) *
          randomValues.doglegIntensity *
          0.6 *
          doglegEasing;
      }

      return {
        x: baseX + curveX + doglegX,
        y: baseY + curveY + doglegY,
      };
    };

    // Calculate current positions for each animation type to check if off-screen
    const calculatePosition = (animationType) => {
      const baseCalculations = {
        leftScatter: {
          x: (-progress * 3500 + (Math.cos(progress * Math.PI * 3) - 1) * 120) * scaleFactor,
          y: Math.sin(progress * Math.PI * 3) * 120 * scaleFactor,
        },
        ulScatter: {
          x: (-progress * 4000 + (Math.cos(progress * Math.PI * 3) - 1) * 120) * scaleFactor,
          y: Math.sin(-progress * Math.PI * 3) * 220 * scaleFactor,
        },
        rightScatter: {
          x: (progress * 5700 + (Math.cos(-progress * Math.PI * 2.5) - 1) * 100) * scaleFactor,
          y: Math.sin(-progress * Math.PI * 2.5) * 10 * scaleFactor,
        },
        upScatter: {
          x: Math.sin(progress * Math.PI * 4) * 200 * scaleFactor,
          y: (-progress * 3000 + (Math.cos(progress * Math.PI * 2) - 1) * 80) * scaleFactor,
        },
        dlScatter: {
          x: (-progress * 4500 + (Math.cos(progress * Math.PI * 6) - 1) * 80) * scaleFactor,
          y: (progress * 1600 + Math.sin(progress * Math.PI * 6) * 80) * scaleFactor,
        },
        drScatter: {
          x: (progress * 3900 + (Math.cos(-progress * Math.PI * 2.5) - 1) * 80) * scaleFactor,
          y: (progress * 2000 + Math.sin(progress * Math.PI * 6) * 80) * scaleFactor,
        },
      };

      const basePos = baseCalculations[animationType] || baseCalculations.leftScatter;
      // Apply organic curves to the base trajectory
      return addOrganicCurve(basePos.x, basePos.y, progress);
    };

    const currentPos = calculatePosition(animationType);

    // Check if word is completely off-screen (with some buffer)
    const buffer = 200; // pixels
    const isOffScreen =
      currentPos.x < -viewportWidth - buffer ||
      currentPos.x > viewportWidth + buffer ||
      currentPos.y < -viewportHeight - buffer ||
      currentPos.y > viewportHeight + buffer;

    // Different animation patterns for each word - all start from 0,0 at progress=0
    const animations = {
      leftScatter: {
        // Moves left with clockwise circular motion - increased distance
        transform: `translate(${currentPos.x + jitterX}px, ${currentPos.y + jitterY}px) rotate(${
          progress * -45 + jitterRotation
        }deg)`,
        opacity: isOffScreen ? 0 : 1,
        willChange: progress > 0 && !isOffScreen ? 'transform, opacity' : 'auto',
        visibility: isOffScreen ? 'hidden' : 'visible',
      },
      rightScatter: {
        // Moves right with counter-clockwise circular motion - increased distance
        transform: `translate(${currentPos.x + jitterX}px, ${currentPos.y + jitterY}px) rotate(${
          progress * 60 + jitterRotation
        }deg)`,
        opacity: isOffScreen ? 0 : 1,
        willChange: progress > 0 && !isOffScreen ? 'transform, opacity' : 'auto',
        visibility: isOffScreen ? 'hidden' : 'visible',
      },
      upScatter: {
        // Moves up with figure-8 motion - increased distance
        transform: `translate(${currentPos.x + jitterX}px, ${currentPos.y + jitterY}px) rotate(${
          progress * 180 + jitterRotation
        }deg)`,
        opacity: isOffScreen ? 0 : 1,
        willChange: progress > 0 && !isOffScreen ? 'transform, opacity' : 'auto',
        visibility: isOffScreen ? 'hidden' : 'visible',
      },
      dlScatter: {
        // Moves down-left with consistent spiral motion - increased distance
        transform: `translate(${currentPos.x + jitterX}px, ${currentPos.y + jitterY}px) rotate(${
          progress * -120 + jitterRotation
        }deg)`,
        opacity: isOffScreen ? 0 : 1,
        willChange: progress > 0 && !isOffScreen ? 'transform, opacity' : 'auto',
        visibility: isOffScreen ? 'hidden' : 'visible',
      },
      circularScatter: {
        // Large circular orbit motion - increased radius
        transform: `translate(${currentPos.x + jitterX}px, ${currentPos.y + jitterY}px) rotate(${
          progress * 720 + jitterRotation
        }deg)`,
        opacity: isOffScreen ? 0 : 1,
        willChange: progress > 0 && !isOffScreen ? 'transform, opacity' : 'auto',
        visibility: isOffScreen ? 'hidden' : 'visible',
      },
    };

    return animations[animationType] || animations.leftScatter;
  }, [scrollProgress, animationType]);

  return (
    <span
      className={`inline-block border-2 border-gray-900 px-4 py-2 m-1 will-change-transform paper-texture ${
        className || ''
      }`}
      style={animationStyles}
    >
      {children}
    </span>
  );
};

export default AnimatedWord;
