import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';

export interface ConfettiHandle {
  fire: () => void;
}

interface ConfettiProps {
  active?: boolean;
  duration?: number;
}

export const ConfettiCanvas = forwardRef<ConfettiHandle, ConfettiProps>(
  ({ active = false, duration = 3500 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(active);

    useImperativeHandle(ref, () => ({
      fire: () => {
        setIsPlaying(true);
      },
    }));

    useEffect(() => {
      if (active) {
        setIsPlaying(true);
      }
    }, [active]);

    useEffect(() => {
      if (!isPlaying) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationFrameId: number;
      const particles: {
        x: number;
        y: number;
        size: number;
        color: string;
        vx: number;
        vy: number;
        rotation: number;
        vRot: number;
      }[] = [];

      const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#FBBF24'];

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener('resize', resize);

      // Spawn 100 particles
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 300,
          y: canvas.height * 0.4 + (Math.random() - 0.5) * 120,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 16,
          vy: Math.random() * -14 - 4,
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 10,
        });
      }

      const startTime = Date.now();

      const loop = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed > duration) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          setIsPlaying(false);
          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35; // gravity
          p.rotation += p.vRot;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        });

        animationFrameId = requestAnimationFrame(loop);
      };

      loop();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resize);
      };
    }, [isPlaying, duration]);

    if (!isPlaying) return null;

    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />
    );
  }
);

ConfettiCanvas.displayName = 'ConfettiCanvas';
