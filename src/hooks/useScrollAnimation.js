import { useEffect, useState, useRef } from 'react';

export const useScrollAnimation = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef();
  const lastScrollTop = useRef(0);
  const isTouch = useRef(false);

  useEffect(() => {
    // Detect touch device
    isTouch.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight > 0) {
        const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
        setScrollProgress(progress);
      } else if (scrollTop > 0) {
        // Fallback for cases where scrollHeight calculation might be 0
        // Use a direct pixel-based approach for immediate responsiveness
        const progress = Math.min(scrollTop / 1000, 1); // Animate over first 1000px of scroll
        setScrollProgress(progress);
      }
      
      lastScrollTop.current = scrollTop;
    };

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // On touch devices, reduce animation frequency for better performance
      if (isTouch.current) {
        // Direct update for touch devices to reduce lag
        updateScrollProgress();
      } else {
        rafRef.current = requestAnimationFrame(updateScrollProgress);
      }
    };

    // Add both scroll and touchmove for mobile compatibility
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (isTouch.current) {
      window.addEventListener('touchmove', handleScroll, { passive: true });
    }
    
    updateScrollProgress(); // Initial calculation
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (isTouch.current) {
        window.removeEventListener('touchmove', handleScroll);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return scrollProgress;
};