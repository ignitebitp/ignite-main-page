'use client';

import React, { useEffect, useRef, useState } from 'react';
import { API_URL } from '@/lib/api';

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
}

const getMediaEndpoint = (src: string): string => {
  const clean = src.replace(/^\/+/, '');
  if (clean.startsWith('team/') || clean.startsWith('alumni/')) {
    return `${API_URL}/api/media?key=${encodeURIComponent(clean)}`;
  }
  return src;
};

const ProtectedImage: React.FC<ProtectedImageProps> = ({ src, alt, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    const drawToCanvas = (url: string, isBlob: boolean) => {
      const img = new Image();
      img.onload = () => {
        if (isBlob && objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
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

        // Object-cover crop calculation
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
        if (isBlob && objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
        if (active && url !== '/placeholder.svg') {
          drawToCanvas('/placeholder.svg', false);
        }
      };

      img.src = url;
    };

    const load = async () => {
      setLoaded(false);
      const targetSrc = src || '/placeholder.svg';

      if (targetSrc === '/placeholder.svg') {
        drawToCanvas('/placeholder.svg', false);
        return;
      }

      try {
        const endpoint = getMediaEndpoint(targetSrc);
        let res: Response | null = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          res = await fetch(endpoint, {
            credentials: 'same-origin',
            cache: 'no-store',
          });
          if (res.ok || res.status < 500) break;
          await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
        }
        if (!res || !res.ok) throw new Error(`Media fetch failed (${res?.status ?? 'network'})`);
        const blob = await res.blob();
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        drawToCanvas(objectUrl, true);
      } catch (err) {
        console.warn('ProtectedImage fallback to placeholder for:', targetSrc, err);
        if (active) {
          drawToCanvas('/placeholder.svg', false);
        }
      }
    };

    load();

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
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
      {/* Transparent interaction shield prevents direct canvas/image save actions */}
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

