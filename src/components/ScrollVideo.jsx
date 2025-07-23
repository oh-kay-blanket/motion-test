import React, { useRef, useEffect, useState } from 'react';
import conesVideo from '../assets/video/cones.mp4';

function ScrollVideo() {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const firstFrameVideoRef = useRef(null);
  const lastFrameVideoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showFirstFrame, setShowFirstFrame] = useState(false);
  const [showLastFrame, setShowLastFrame] = useState(false);

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

  // Set up first and last frame videos
  useEffect(() => {
    const firstFrameVideo = firstFrameVideoRef.current;
    const lastFrameVideo = lastFrameVideoRef.current;
    let setFirstFrame, setLastFrame;

    if (firstFrameVideo) {
      setFirstFrame = () => {
        firstFrameVideo.currentTime = 0;
      };
      firstFrameVideo.addEventListener('loadedmetadata', setFirstFrame);
      if (firstFrameVideo.readyState >= 1) setFirstFrame();
    }

    if (lastFrameVideo) {
      setLastFrame = () => {
        lastFrameVideo.currentTime = Math.max(0, lastFrameVideo.duration - 0.1);
      };
      lastFrameVideo.addEventListener('loadedmetadata', setLastFrame);
      if (lastFrameVideo.readyState >= 1) setLastFrame();
    }

    return () => {
      if (firstFrameVideo && setFirstFrame) {
        firstFrameVideo.removeEventListener('loadedmetadata', setFirstFrame);
      }
      if (lastFrameVideo && setLastFrame) {
        lastFrameVideo.removeEventListener('loadedmetadata', setLastFrame);
      }
    };
  }, [showFirstFrame, showLastFrame]);

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
        let shouldBeSticky = false;

        if (rect.top > 0) {
          // Phase 1: Video not yet in sticky position - show first frame
          progress = 0;
          targetTime = 0;
          shouldBeSticky = false;
          setShowFirstFrame(true);
          setShowLastFrame(false);
        } else if (rect.top <= 0 && rect.top > -videoScrollDistance) {
          // Phase 2: Video is sticky and playing
          const scrolledDistance = Math.abs(rect.top);
          progress = scrolledDistance / videoScrollDistance;
          progress = Math.max(0, Math.min(1, progress));
          targetTime = progress * videoDuration;
          shouldBeSticky = true;
          setShowFirstFrame(false);
          setShowLastFrame(false);
        } else {
          // Phase 3: Video finished playing - show last frame
          progress = 1;
          targetTime = videoDuration;
          shouldBeSticky = false;
          setShowFirstFrame(false);
          setShowLastFrame(true);
        }

        // Update sticky state
        setIsSticky(shouldBeSticky);

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

  return (
    <>
      <div
        ref={sectionRef}
        className='w-full bg-black relative'
        style={{ height: `${typeof window !== 'undefined' ? window.innerHeight * 3 : 2000}px` }}
      >
        {/* First frame thumbnail - shows when approaching video */}
        {showFirstFrame && (
          <video
            ref={firstFrameVideoRef}
            src={conesVideo}
            muted
            playsInline
            preload='auto'
            className='absolute top-0 left-0 w-full h-screen object-cover'
            style={{
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Last frame thumbnail - shows when past video */}
        {showLastFrame && (
          <video
            ref={lastFrameVideoRef}
            src={conesVideo}
            muted
            playsInline
            preload='auto'
            className='absolute bottom-0 left-0 w-full h-screen object-cover'
            style={{
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
            }}
          />
        )}
      </div>

      {/* Main sticky video */}
      <video
        ref={videoRef}
        src={conesVideo}
        muted
        playsInline
        preload='metadata'
        className={`w-full h-screen bg-black z-50 ${isSticky ? 'fixed' : 'absolute'}`}
        style={{
          position: isSticky ? 'fixed' : 'absolute',
          top: isSticky ? 0 : 'auto',
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          visibility: isSticky ? 'visible' : 'hidden',
        }}
      />
    </>
  );
}

export default ScrollVideo;
