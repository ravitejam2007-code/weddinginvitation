import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import { fireGoldSparkles } from '../utils/confetti';
import { formatWeddingDate, getWeddingEvent, wedding } from '../data/wedding';

interface MehndiTraceRevealProps {
  onClose: () => void;
}

export const MehndiTraceReveal: React.FC<MehndiTraceRevealProps> = ({ onClose }) => {
  const event = getWeddingEvent('mehndi');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTraced, setIsTraced] = useState(false);
  const [tracePointsCount, setTracePointsCount] = useState(0);
  const isTracing = useRef(false);

  // Initialize canvas with overlay and dashed heart
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 520);

    // Warm ivory translucent veil
    ctx.fillStyle = '#faf3ea';
    ctx.fillRect(0, 0, width, height);

    // Heart geometry in center
    const cx = width / 2;
    const cy = height * 0.45;
    const size = width * 0.38;

    // Draw Dashed Guideline Heart
    ctx.save();
    ctx.strokeStyle = '#c48b71';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();

    const topCurveHeight = size * 0.3;
    ctx.moveTo(cx, cy + size * 0.75);
    // Left curve
    ctx.bezierCurveTo(cx - size, cy + size * 0.2, cx - size, cy - topCurveHeight, cx, cy - topCurveHeight * 0.4);
    // Right curve
    ctx.bezierCurveTo(cx + size, cy - topCurveHeight, cx + size, cy + size * 0.2, cx, cy + size * 0.75);
    ctx.stroke();
    ctx.restore();

    // Henna motif illustration in center of heart
    ctx.fillStyle = '#8b5a2b';
    ctx.font = "bold 15px 'Cinzel', serif";
    ctx.textAlign = 'center';
    ctx.fillText('MEHNDI CEREMONY', cx, cy);
    ctx.font = "12px 'Montserrat', sans-serif";
    ctx.fillStyle = '#7a3821';
    ctx.fillText('Follow the heart with henna', cx, cy + 24);
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Draw Henna trail on touch/drag
  const drawHenna = (clientX: number, clientY: number) => {
    if (isTraced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.save();
    ctx.fillStyle = '#5c2b16'; // Deep henna brown
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();

    // Henna paste drop flourish
    ctx.fillStyle = '#7a3b20';
    ctx.beginPath();
    ctx.arc(x + 2, y - 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    setTracePointsCount((prev) => {
      const next = prev + 1;
      if (next >= 28 && !isTraced) {
        handleCompleteReveal();
      }
      return next;
    });
  };

  const handleCompleteReveal = () => {
    setIsTraced(true);
    fireGoldSparkles(0.5, 0.45);
  };

  return (
    <div className="ceremony-modal-overlay" role="dialog" aria-modal="true">
      <div className="ceremony-modal-card deckled-paper">
        {/* Header */}
        <div className="modal-top-bar">
          <button
            type="button"
            className="btn-quick-reveal"
            onClick={handleCompleteReveal}
            disabled={isTraced}
          >
            <Sparkles size={14} />
            <span>{isTraced ? "Revealed!" : "Reveal >"}</span>
          </button>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Revealed Content Underneath */}
        <div className="revealed-content-frame">
          <img
            src={event.image}
            alt={`${event.title} with ${wedding.couple.brideName} & ${wedding.couple.groomName}`}
            className="ceremony-artwork-img"
          />

          <div className="ceremony-details-sheet">
            <span className="ceremony-date-badge">{formatWeddingDate(event.date).toUpperCase()}</span>
            <h3 className="ceremony-modal-title">{event.title}</h3>
            <p className="ceremony-tamil-title">Where henna meets hearts, our journey begins</p>
            <p className="ceremony-modal-time">{event.startTime} Onwards • {wedding.venue.name}</p>
            <blockquote className="ceremony-modal-quote">
              &ldquo;The deeper the mehndi, the deeper the love.&rdquo;
            </blockquote>
            <div className="ceremony-dress-hint">
              <span>Dress Code:</span> Pastel &amp; Floral Elegance
            </div>
          </div>
        </div>

        {/* Henna Tracing Layer */}
        {!isTraced && (
          <canvas
            ref={canvasRef}
            className="mehndi-trace-canvas"
            onMouseDown={(e) => {
              isTracing.current = true;
              drawHenna(e.clientX, e.clientY);
            }}
            onMouseMove={(e) => {
              if (isTracing.current) drawHenna(e.clientX, e.clientY);
            }}
            onMouseUp={() => (isTracing.current = false)}
            onMouseLeave={() => (isTracing.current = false)}
            onTouchStart={(e) => {
              isTracing.current = true;
              const touch = e.touches[0];
              drawHenna(touch.clientX, touch.clientY);
            }}
            onTouchMove={(e) => {
              if (isTracing.current) {
                const touch = e.touches[0];
                drawHenna(touch.clientX, touch.clientY);
              }
            }}
            onTouchEnd={() => (isTracing.current = false)}
          />
        )}

        {/* Interaction Prompt Footer */}
        <div className="modal-interaction-prompt">
          {!isTraced ? (
            <div className="prompt-turmeric-rub">
              <span className="prompt-finger-icon" aria-hidden="true">✍️</span>
              <span>TRACE THE HEART WITH HENNA ({Math.min(100, Math.round((tracePointsCount / 28) * 100))}%)</span>
            </div>
          ) : (
            <div className="prompt-turmeric-done">
              <CheckCircle2 size={16} />
              <span>{event.title} Revealed!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
