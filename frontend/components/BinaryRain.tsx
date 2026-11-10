import React, { useEffect, useRef } from 'react';

interface BinaryRainProps {
  className?: string;
  density?: number;
  speed?: number;
}

const BinaryRain: React.FC<BinaryRainProps> = ({
  className = '',
  speed = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const chars = '01010101010101010111001010100110101001010101ABCDEF#$@%&*<>{}[]~/\\|=+';
    const fontSize = 13;
    let columns = 0;
    let drops: number[] = [];

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || canvas.parentElement?.clientWidth || 500;
      canvas.height = rect.height || canvas.parentElement?.clientHeight || 450;
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -50);
      }
    };

    init();

    let lastTime = 0;
    const interval = 35 / speed;

    const render = (time: number) => {
      animationId = requestAnimationFrame(render);
      if (time - lastTime < interval) return;
      lastTime = time;

      // Subtle fade out for trailing rain effect
      ctx.fillStyle = 'rgba(11, 15, 20, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Leading char is bright cyan / white, stream is rust neon orange / cyber green
        if (Math.random() > 0.88) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 8;
        } else if (i % 5 === 0) {
          ctx.fillStyle = '#34d399'; // Terminal Green
          ctx.shadowColor = '#34d399';
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = 'rgba(255, 140, 90, 0.85)'; // Neon Rust Orange
          ctx.shadowColor = '#ff8c5a';
          ctx.shadowBlur = 4;
        }

        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animationId = requestAnimationFrame(render);

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [speed]);

  return (
    <div className={`relative overflow-hidden rounded-2xl glass-card ${className}`}>
      {/* Top telemetry bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-black/40 text-xs font-mono-code text-gray-400">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyber-green animate-pulse inline-block" />
          <span className="text-cyber-green font-bold">STREAM: LIVE</span>
          <span className="text-gray-600">|</span>
          <span className="hidden sm:inline text-gray-400">NODE: BIT-MESRA</span>
        </div>
        <div className="text-[11px] text-gray-400">
          <span className="text-primary font-bold">256-BIT</span> ENCRYPTED
        </div>
      </div>

      <div className="relative w-full h-[320px] md:h-[400px]">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
        
        {/* Subtle grid and vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14] via-transparent to-transparent pointer-events-none opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f14]/60 via-transparent to-[#0b0f14]/60 pointer-events-none" />

        {/* Center overlay badge */}
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between pointer-events-none bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <div className="text-xs font-mono-code text-gray-300">
              CORE SYSTEM: <span className="text-primary font-bold">ONLINE</span>
            </div>
          </div>
          <div className="text-[11px] font-mono-code text-gray-400">
            RATE: 104.8 KB/S
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinaryRain;
