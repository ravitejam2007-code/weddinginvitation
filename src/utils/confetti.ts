import confetti from 'canvas-confetti';

export const fireGoldSparkles = (x = 0.5, y = 0.5) => {
  // Check for reduced motion preference
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Tasteful micro-burst of gold dust and pale cream sparkles
  confetti({
    particleCount: 38,
    angle: 90,
    spread: 60,
    origin: { x, y },
    colors: ['#fad674', '#d4af37', '#ffffff', '#e8c468', '#fdf6e2'],
    shapes: ['circle'],
    scalar: 0.65,
    ticks: 80,
    gravity: 0.8,
    drift: 0,
    startVelocity: 16,
    disableForReducedMotion: true,
  });
};
