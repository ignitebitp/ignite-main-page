'use client';

import React, { useEffect, useRef, useState } from 'react';
import { API_URL } from '@/lib/api';

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
}

// Shared client-side bundle cache so all cards on a page make 1 single /api/media/bundle request
const bundlePromises = new Map<string, Promise<Record<string, string>>>();

const getPrefix = (cleanKey: string): string | null => {
  if (!cleanKey.startsWith('team/') && !cleanKey.startsWith('alumni/')) return null;
  const slashIdx = cleanKey.lastIndexOf('/');
  return slashIdx !== -1 ? cleanKey.slice(0, slashIdx + 1) : null;
};

const fetchBundle = (prefix: string): Promise<Record<string, string>> => {
  if (!bundlePromises.has(prefix)) {
    const promise = (async () => {
      let lastErr: unknown;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const res = await fetch(
            `${API_URL}/api/media/bundle?prefix=${encodeURIComponent(prefix)}`,
            { credentials: 'same-origin' }
          );
          if (res.ok) {
            const json = await res.json();
            return (json?.assets as Record<string, string>) || {};
          }
          if (res.status < 500) {
            throw new Error(`Bundle fetch failed (${res.status})`);
          }
          lastErr = new Error(`Bundle fetch failed (${res.status})`);
        } catch (err) {
          lastErr = err;
        }
        await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
      }
      bundlePromises.delete(prefix);
      throw lastErr || new Error('Bundle fetch failed');
    })();
    bundlePromises.set(prefix, promise);
  }
  return bundlePromises.get(prefix)!;
};

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

    const load = async () => {
      setLoaded(false);
      const targetSrc = src || '/placeholder.svg';

      if (targetSrc === '/placeholder.svg') {
        drawToCanvas('/placeholder.svg');
        return;
      }

      const cleanKey = targetSrc.replace(/^\/+/, '');
      const prefix = getPrefix(cleanKey);

      if (!prefix) {
        drawToCanvas(targetSrc);
        return;
      }

      try {
        const assets = await fetchBundle(prefix);
        if (!active) return;
        const dataUri = assets[cleanKey];
        if (dataUri) {
          drawToCanvas(dataUri);
        } else {
          drawToCanvas('/placeholder.svg');
        }
      } catch (err) {
        console.warn('ProtectedImage fallback to placeholder for:', targetSrc, err);
        if (active) {
          drawToCanvas('/placeholder.svg');
        }
      }
    };

    load();

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
