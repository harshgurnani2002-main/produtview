import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function Image360Viewer({ images }) {
  const canvasRef = useRef(null);
  const [frames, setFrames] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const isDragging = useRef(false);
  const startX = useRef(0);

  // Preload images
  useEffect(() => {
    if (!images || images.length === 0) return;

    setLoading(true);
    setImagesLoaded(0);

    // Make sure we sort the images by order from the API
    const sortedImages = [...images].sort((a, b) => a.order - b.order);

    const loadedFrames = [];
    let loadedCount = 0;

    sortedImages.forEach((imgData, index) => {
      const img = new Image();
      // Add crossOrigin to avoid potential canvas taint issues if media is on different port/domain
      img.crossOrigin = "anonymous";
      img.src = imgData.image;

      img.onload = () => {
        loadedFrames[index] = img;
        loadedCount++;
        setImagesLoaded(loadedCount);

        if (loadedCount === sortedImages.length) {
          setFrames(loadedFrames);
          setLoading(false);
        }
      };

      img.onerror = () => {
        console.error("Failed to load image:", imgData.image);
        loadedCount++;
        if (loadedCount === sortedImages.length) {
          setFrames(loadedFrames.filter(Boolean)); // Filter out failed loads
          setLoading(false);
        }
      };
    });
  }, [images]);

  // Draw frame
  const drawFrame = useCallback((frameIndex) => {
    if (!canvasRef.current || frames.length === 0 || !frames[frameIndex]) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = frames[frameIndex];

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image maintaining aspect ratio and centering
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;

    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }, [frames]);

  // Handle frame change and drawing
  useEffect(() => {
    if (!loading && frames.length > 0) {
      drawFrame(currentFrame);
    }
  }, [currentFrame, loading, frames, drawFrame]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      // Re-draw on resize to keep it crisp if container changes
      if (!loading && frames.length > 0) {
        drawFrame(currentFrame);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loading, frames, currentFrame, drawFrame]);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX || (e.touches && e.touches[0].clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;

    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    const delta = currentX - startX.current;

    // Adjust sensitivity by changing the threshold (e.g., 8)
    if (Math.abs(delta) > 8) {
      const direction = delta > 0 ? -1 : 1; // Negative direction for dragging right to rotate left
      const nextFrame = (currentFrame + direction + frames.length) % frames.length;

      setCurrentFrame(nextFrame);
      startX.current = currentX;
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e) => {
    // Prevent page scroll when interacting with the viewer
    if (e.cancelable) e.preventDefault();

    const delta = e.deltaY;
    // Sensitivity threshold for wheel
    if (Math.abs(delta) > 0) {
      const direction = delta > 0 ? 1 : -1;
      const nextFrame = (currentFrame + direction + frames.length) % frames.length;
      setCurrentFrame(nextFrame);
    }
  };

  // Prevent default drag behaviors and handle wheel event with passive: false
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventDefault = (e) => e.preventDefault();
    document.addEventListener('dragstart', preventDefault);

    // Wheel event must be non-passive to allow preventDefault()
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('dragstart', preventDefault);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [currentFrame, frames.length]); // Re-bind when frame state changes to keep handleWheel closure fresh

  if (loading) {
    const progress = images.length > 0 ? Math.round((imagesLoaded / images.length) * 100) : 0;
    return (
      <div className="w-full h-[500px] md:h-full relative bg-slate-50 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-black transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Loading 360° Assets • {progress}%
        </div>
      </div>
    );
  }

  if (frames.length === 0) {
    return (
      <div className="w-full h-full min-h-[500px] bg-slate-50 flex items-center justify-center">
        <span className="text-slate-400 uppercase tracking-widest text-xs font-bold">Failed to load media</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] md:h-full relative bg-slate-50 overflow-hidden flex items-center justify-center touch-none">
      <canvas
        ref={canvasRef}
        width={1000} // High internal resolution
        height={1000}
        className="w-full h-full object-contain cursor-grab active:cursor-grabbing max-h-full"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerUp}
      />

      {/* Interaction Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm text-xs text-slate-500 font-medium pointer-events-none border border-slate-100 uppercase tracking-widest z-10 transition-opacity duration-500">
        Drag or Scroll to Rotate
      </div>
    </div>
  );
}
