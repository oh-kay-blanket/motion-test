import React, { useRef, useEffect, useState } from 'react';
import img15 from '../assets/img/k/flat copy 15.png';
import img16 from '../assets/img/k/flat copy 16.png';
import img17 from '../assets/img/k/flat copy 17.png';
import img18 from '../assets/img/k/flat copy 18.png';
import img19 from '../assets/img/k/flat copy 19.png';
import img20 from '../assets/img/k/flat copy 20.png';
import img21 from '../assets/img/k/flat copy 21.png';
import img22 from '../assets/img/k/flat copy 22.png';
import img23 from '../assets/img/k/flat copy 23.png';
import img24 from '../assets/img/k/flat copy 24.png';
import img25 from '../assets/img/k/flat copy 25.png';
import img26 from '../assets/img/k/flat copy 26.png';
import img27 from '../assets/img/k/flat copy 27.png';
import img28 from '../assets/img/k/flat copy 28.png';

const kImages = [
  // img2,
  // img3,
  // img4,
  // img5,
  // img6,
  // img8,
  // img9,
  // img10,
  // img11,
  // img12,
  // img13,
  // img14,
  img15,
  img16,
  img17,
  img18,
  img19,
  img20,
  img21,
  img22,
  img23,
  img24,
  img25,
  img26,
  img27,
  img28,
];

function getImageScatterStyle(scrollProgress, index) {
  // Centered at scrollProgress = 0.5
  const centerProgress = 0.5;
  const scatterStrength = Math.abs(scrollProgress - centerProgress) * 2; // 0 at center, 1 at edges
  const angle = (index / kImages.length) * 2 * Math.PI;
  const distance = 400 + (index % 3) * 60; // px, base distance + some variation
  const frameRate = 40;
  const frameIndex = Math.floor(scrollProgress * frameRate);
  const jitter =
    (Math.sin(frameIndex + index) + Math.cos(frameIndex * 1.3 + index)) *
    2 *
    (scatterStrength > 0 ? 1 : 0);
  // Scatter outward radially from grid position
  const x = Math.cos(angle) * distance * scatterStrength + jitter;
  const y = Math.sin(angle) * distance * scatterStrength + jitter;
  // Rotate more as it moves out
  const rotate = (Math.random() - 0.5) * 8 + scatterStrength * 90 * (index % 2 === 0 ? 1 : -1);
  return {
    transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
  };
}

function JumbledImageGrid() {
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
  const [localProgress, setLocalProgress] = useState(0.5); // 0.5 = centered

  useEffect(() => {
    function handleScroll() {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // 0 when section top at bottom of viewport, 1 when section bottom at top, 0.5 when centered
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      // Range: 0 (section bottom at viewport bottom) to 1 (section top at viewport top)
      let progress = 0.5 - (sectionCenter - viewportCenter) / windowHeight;
      progress = Math.max(0, Math.min(1, progress));
      setLocalProgress(progress);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div ref={sectionRef} className='w-full flex flex-col items-center mb-10'>
      <div className='grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 md:gap-4 max-w-5xl mx-auto'>
        {shuffled.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Collection item ${i + 1}`}
            className='object-contain rounded shadow-lg max-w-full max-h-16 md:max-h-20 aspect-square transition-transform duration-300'
            style={getImageScatterStyle(localProgress, i)}
          />
        ))}
      </div>
    </div>
  );
}

export default JumbledImageGrid;
