'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ProtectedImage: React.FC<ProtectedImageProps> = ({ src, alt, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    const drawToCanvas = (url: string) => {
      const img = new Image();
      img.onload = () => {
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const targetW = Math.max(Math.round((rect.width || 300) * dpr), 1);
        const targetH = Math.max(Math.round((rect.height || 400) * dpr), 1);

        canvas.width = targetW;
        canvas.height = targetH;

        const imgRatio = img.naturalWidth / Math.max(img.naturalHeight, 1);
        const boxRatio = targetW / targetH;
        let sx = 0;
        let sy = 0;
        let sWidth = img.naturalWidth;
        let sHeight = img.naturalHeight;

        if (imgRatio > boxRatio) {
          sWidth = img.naturalHeight * boxRatio;
          sx = (img.naturalWidth - sWidth) / 2;
        } else {
          sHeight = img.naturalWidth / boxRatio;
          sy = (img.naturalHeight - sHeight) / 2;
        }

        ctx.clearRect(0, 0, targetW, targetH);
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetW, targetH);
        setLoaded(true);
      };

      img.onerror = () => {
        if (active && url !== '/placeholder.svg') {
          drawToCanvas('/placeholder.svg');
        }
      };

      img.src = url;
    };

    setLoaded(false);
    drawToCanvas(src || '/placeholder.svg');

    return () => {
      active = false;
    };
  }, [src]);

  const blockEvent = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      role="img"
      aria-label={alt}
      onContextMenu={blockEvent}
      onDragStart={blockEvent}
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
      className={`relative w-full h-full select-none overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        onContextMenu={blockEvent}
        onDragStart={blockEvent}
        className={`w-full h-full block transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" aria-hidden="true" />
      )}
      <div
        aria-hidden="true"
        onContextMenu={blockEvent}
        onDragStart={blockEvent}
        className="absolute inset-0 z-[1]"
      />
    </div>
  );
};

export default ProtectedImage;
