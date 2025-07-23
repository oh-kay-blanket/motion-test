import React, { useRef, useEffect, useState } from 'react';
import conesVideo from '../assets/video/cones.mp4';

function ScrollVideo() {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoPosition, setVideoPosition] = useState('before'); // 'before', 'sticky', 'after'

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Load video metadata
    const handleLoadedMetadata = () => {
      setIsVideoLoaded(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Ensure video is loaded
    if (video.readyState >= 1) {
      setIsVideoLoaded(true);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);


  useEffect(() => {
    if (!isVideoLoaded) return;

    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    let rafId;

    function handleScroll() {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const videoDuration = video.duration;
        const videoScrollDistance = windowHeight * 2; // Distance to scroll through entire video

        let progress = 0;
        let targetTime = 0;
        let position = 'before';

        if (rect.top > 0) {
          // Phase 1: Video not yet in sticky position - show first frame
          progress = 0;
          targetTime = 0;
          position = 'before';
        } else if (rect.top <= 0 && rect.top > -videoScrollDistance) {
          // Phase 2: Video is sticky and playing
          const scrolledDistance = Math.abs(rect.top);
          progress = scrolledDistance / videoScrollDistance;
          progress = Math.max(0, Math.min(1, progress));
          targetTime = progress * videoDuration;
          position = 'sticky';
        } else {
          // Phase 3: Video finished playing - show last frame
          progress = 1;
          targetTime = videoDuration;
          position = 'after';
        }

        // Update video position state
        setVideoPosition(position);

        // Set video current time to match scroll position
        if (Math.abs(video.currentTime - targetTime) > 0.1) {
          video.currentTime = targetTime;
        }

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
  }, [isVideoLoaded]);

  const getVideoStyle = () => {
    const baseStyle = {
      width: '400px',
      height: '100vh',
      objectFit: 'cover',
      left: '50%',
      transform: 'translateX(-50%)',
    };

    switch (videoPosition) {
      case 'before':
        return {
          ...baseStyle,
          position: 'absolute',
          top: 0,
        };
      case 'sticky':
        return {
          ...baseStyle,
          position: 'fixed',
          top: 0,
          zIndex: 50,
        };
      case 'after':
        return {
          ...baseStyle,
          position: 'absolute',
          bottom: 0,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <>
      <div
        ref={sectionRef}
        className='max-w-[400px] mx-auto bg-black relative'
        style={{ height: `${typeof window !== 'undefined' ? window.innerHeight * 3 : 2000}px` }}
      >
        {/* Single video that handles all states */}
        <video
          ref={videoRef}
          src={conesVideo}
          muted
          playsInline
          preload='metadata'
          className='max-w-[400px] h-screen bg-neutral-900'
          style={getVideoStyle()}
        />
      </div>
    </>
  );
}

export default ScrollVideo;
