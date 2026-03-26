import React, { useState, useEffect, useRef } from 'react';

export default function Video360Viewer({ videoUrl }) {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);

  const isDragging = useRef(false);
  const lastX = useRef(0);

  // New refs for smooth animation
  const targetTime = useRef(0);
  const requestRef = useRef();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      // Initialize targetTime to start of video
      targetTime.current = video.currentTime;
      setLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoUrl]);

  // The Animation Loop: Syncs the video to the targetTime smoothly
  useEffect(() => {
    const updateVideoTime = () => {
      if (videoRef.current && duration) {
        // Only update if there's a meaningful difference to prevent unnecessary work
        if (Math.abs(videoRef.current.currentTime - targetTime.current) > 0.01) {
          videoRef.current.currentTime = targetTime.current;
        }
      }
      requestRef.current = requestAnimationFrame(updateVideoTime);
    };

    requestRef.current = requestAnimationFrame(updateVideoTime);
    return () => cancelAnimationFrame(requestRef.current);
  }, [duration]);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    lastX.current = e.clientX || (e.touches && e.touches[0].clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || !duration) return;

    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    const deltaX = currentX - lastX.current;

    const pixelsPerLoop = 1000;
    const timeDelta = (deltaX / pixelsPerLoop) * duration;

    let nextTime = targetTime.current - timeDelta;

    // Loop logic applied to targetTime instead of direct video manipulation
    if (nextTime < 0) nextTime = duration + nextTime;
    if (nextTime >= duration) nextTime = nextTime % duration;

    targetTime.current = nextTime;
    lastX.current = currentX;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e) => {
    if (e.cancelable) e.preventDefault();
    if (!duration) return;

    // Adjust the 2000 divisor if scrolling is too fast or slow
    const timeDelta = (e.deltaY / 2000) * duration;

    let nextTime = targetTime.current + timeDelta;

    if (nextTime < 0) nextTime = duration + nextTime;
    if (nextTime >= duration) nextTime = nextTime % duration;

    targetTime.current = nextTime;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Use an AbortController for cleaner event listener cleanup
    const controller = new AbortController();
    video.addEventListener('wheel', handleWheel, {
      passive: false,
      signal: controller.signal
    });

    return () => controller.abort();
  }, [duration]);

  return (
    <div className="w-full h-[500px] md:h-full relative bg-slate-50 overflow-hidden flex items-center justify-center touch-none">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-20">
          <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-black animate-pulse w-full" />
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Buffering 360° Video
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
        playsInline
        muted
        loop
        preload="auto"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerUp}
      />

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm text-xs text-slate-500 font-medium pointer-events-none border border-slate-100 uppercase tracking-widest z-10">
        Drag or Scroll to Explore
      </div>
    </div>
  );
}