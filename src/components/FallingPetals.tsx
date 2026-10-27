import React, { useEffect, useRef } from 'react';

interface FallingPetalsProps {
  enabled?: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  swingProgress: number;
  swingSpeed: number;
  swingAmplitude: number;
  color: string;
  type: 'rose' | 'marigold' | 'jasmine';
  opacity: number;
}

export const FallingPetals: React.FC<FallingPetalsProps> = ({ enabled = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Color palettes for rose petals, marigold petals, and jasmine florets
    const petalColors = {
      rose: ['#e8959d', '#d97d86', '#f2b3ba', '#c9616d', '#f7c8ce'],
      marigold: ['#f59e0b', '#fbbf24', '#d97706', '#fcd34d', '#f3a41c'],
      jasmine: ['#fffdfa', '#faf5eb', '#fef3c7', '#fdf6e7'],
    };

    const petalCount = Math.min(32, Math.floor((width * height) / 32000));
    const petals: Petal[] = [];

    const createPetal = (startY?: number): Petal => {
      const types: ('rose' | 'marigold' | 'jasmine')[] = ['rose', 'rose', 'marigold', 'marigold', 'jasmine'];
      const type = types[Math.floor(Math.random() * types.length)];
      const colors = petalColors[type];

      return {
        x: Math.random() * width,
        y: startY !== undefined ? startY : Math.random() * height,
        size: Math.random() * 10 + (type === 'jasmine' ? 6 : 9),
        speedY: Math.random() * 0.9 + 0.6,
        speedX: Math.random() * 0.4 - 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.025,
        swingProgress: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.02 + 0.01,
        swingAmplitude: Math.random() * 1.5 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        type,
        opacity: Math.random() * 0.4 + 0.55,
      };
    };

    for (let i = 0; i < petalCount; i++) {
      petals.push(createPetal());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        p.swingProgress += p.swingSpeed;
        p.x += Math.sin(p.swingProgress) * p.swingAmplitude + p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Wrap around when falling off bottom or side
        if (p.y > height + 20) {
          petals[i] = createPetal(-20);
          continue;
        }
        if (p.x > width + 20) p.x = -15;
        if (p.x < -20) p.x = width + 15;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        // Draw organic petal shape
        ctx.fillStyle = p.color;
        ctx.beginPath();

        if (p.type === 'jasmine') {
          // Delicate 4-pointed or curved star/floret petal
          ctx.ellipse(0, 0, p.size * 0.4, p.size * 0.7, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Curved petal with tip
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.7, p.size * 0.6, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.6, -p.size * 0.8, -p.size * 0.6, 0, -p.size);
          ctx.fill();

          // Subtle central vein highlight
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.7);
          ctx.lineTo(0, p.size * 0.7);
          ctx.stroke();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="falling-petals-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 12,
        width: '100vw',
        height: '100vh',
      }}
    />
  );
};
