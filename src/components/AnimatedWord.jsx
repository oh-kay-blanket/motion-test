import { useMemo } from 'react';

const AnimatedWord = ({ children, scrollProgress, animationType = 'default', className }) => {
  const animationStyles = useMemo(() => {
    const rawProgress = Math.min(Math.max(scrollProgress, 0), 1);

    // Create stuttered/stop-motion effect by quantizing progress into discrete steps
    const frameRate = 70; // Reduced for more immediate response while keeping stutter effect
    // Ensure even tiny movements register
    const progress =
      rawProgress < 0.001
        ? 0
        : Math.max(
            Math.floor(rawProgress * frameRate) / frameRate,
            rawProgress > 0 ? 1 / frameRate : 0
          );

    // Add slight jitter for more authentic stop-motion feel - consistent throughout scroll
    const jitterAmount = 2; // pixels of random movement
    const frameIndex = Math.floor(rawProgress * frameRate);
    const jitterX =
      (Math.sin(frameIndex * 2.4) + Math.cos(frameIndex * 1.7)) *
      jitterAmount *
      (progress > 0 ? 1 : 0);
    const jitterY =
      (Math.cos(frameIndex * 2.1) + Math.sin(frameIndex * 1.9)) *
      jitterAmount *
      (progress > 0 ? 1 : 0);

    // Check if mobile device for scaled-down animations
    const isMobile = window.innerWidth < 768;
    const scaleFactor = isMobile ? 0.6 : 1;

    // Calculate viewport dimensions for off-screen detection
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate current positions for each animation type to check if off-screen
    const calculatePosition = (animationType) => {
      const baseCalculations = {
        leftScatter: {
          x: (-progress * 1500 + (Math.cos(progress * Math.PI * 3) - 1) * 120) * scaleFactor,
          y: Math.sin(progress * Math.PI * 3) * 120 * scaleFactor,
        },
        ulScatter: {
          x: (-progress * 1500 + (Math.cos(progress * Math.PI * 3) - 1) * 120) * scaleFactor,
          y: Math.sin(-progress * Math.PI * 3) * 220 * scaleFactor,
        },
        rightScatter: {
          x: (progress * 1700 + (Math.cos(-progress * Math.PI * 2.5) - 1) * 100) * scaleFactor,
          y: Math.sin(-progress * Math.PI * 2.5) * 10 * scaleFactor,
        },
        upScatter: {
          x: Math.sin(progress * Math.PI * 4) * 200 * scaleFactor,
          y: (-progress * 1000 + (Math.cos(progress * Math.PI * 2) - 1) * 80) * scaleFactor,
        },
        dlScatter: {
          x: (-progress * 2500 + (Math.cos(progress * Math.PI * 6) - 1) * 80) * scaleFactor,
          y: (progress * 1600 + Math.sin(progress * Math.PI * 6) * 80) * scaleFactor,
        },
        drScatter: {
          x: (progress * 2600 + (Math.cos(-progress * Math.PI * 2.5) - 1) * 80) * scaleFactor,
          y: (progress * 2000 + Math.sin(progress * Math.PI * 6) * 80) * scaleFactor,
        },
      };
      return baseCalculations[animationType] || baseCalculations.leftScatter;
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
          progress * -45
        }deg)`,
        opacity: isOffScreen ? 0 : 1,
        willChange: progress > 0 && !isOffScreen ? 'transform, opacity' : 'auto',
        visibility: isOffScreen ? 'hidden' : 'visible',
      },
      rightScatter: {
        // Moves right with counter-clockwise circular motion - increased distance
        transform: `translate(${currentPos.x + jitterX}px, ${currentPos.y + jitterY}px) rotate(${
          progress * 60
        }deg)`,
        opacity: isOffScreen ? 0 : 1,
        willChange: progress > 0 && !isOffScreen ? 'transform, opacity' : 'auto',
        visibility: isOffScreen ? 'hidden' : 'visible',
      },
      upScatter: {
        // Moves up with figure-8 motion - increased distance
        transform: `translate(${currentPos.x + jitterX}px, ${currentPos.y + jitterY}px) rotate(${
          progress * 180
        }deg)`,
        opacity: isOffScreen ? 0 : 1,
        willChange: progress > 0 && !isOffScreen ? 'transform, opacity' : 'auto',
        visibility: isOffScreen ? 'hidden' : 'visible',
      },
      dlScatter: {
        // Moves down-left with consistent spiral motion - increased distance
        transform: `translate(${currentPos.x + jitterX}px, ${currentPos.y + jitterY}px) rotate(${
          progress * -120
        }deg)`,
        opacity: isOffScreen ? 0 : 1,
        willChange: progress > 0 && !isOffScreen ? 'transform, opacity' : 'auto',
        visibility: isOffScreen ? 'hidden' : 'visible',
      },
      circularScatter: {
        // Large circular orbit motion - increased radius
        transform: `translate(${currentPos.x + jitterX}px, ${currentPos.y + jitterY}px) rotate(${
          progress * 720
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
