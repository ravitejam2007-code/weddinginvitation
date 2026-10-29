import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { fireGoldSparkles } from '../utils/confetti';
import { formatWeddingDate, getWeddingEvent, wedding } from '../data/wedding';

interface MehndiTraceRevealProps {
  onClose: () => void;
}

export const MehndiTraceReveal: React.FC<MehndiTraceRevealProps> = ({ onClose }) => {
  const event = getWeddingEvent('mehndi');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTraced, setIsTraced] = useState(false);
  const isPointerDown = useRef(false);
  const lastCoord = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas matching reference video frame_22 (clean ivory card with dashed heart outline)
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 520);

    // Warm ivory stationery coating matching video
    ctx.fillStyle = '#faf6ed';
    ctx.fillRect(0, 0, width, height);

    // Thin traditional gold hairline frame
    ctx.strokeStyle = 'rgba(197, 155, 39, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    // Heart geometry in center
    const cx = width / 2;
    const cy = height * 0.46;
    const size = width * 0.36;

    // Draw Dashed Guideline Heart from Reference Video
    ctx.save();
    ctx.strokeStyle = '#c47151';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();

    const topCurveHeight = size * 0.32;
    ctx.moveTo(cx, cy + size * 0.78);
    // Left curve
    ctx.bezierCurveTo(cx - size, cy + size * 0.22, cx - size, cy - topCurveHeight, cx, cy - topCurveHeight * 0.35);
    // Right curve
    ctx.bezierCurveTo(cx + size, cy - topCurveHeight, cx + size, cy + size * 0.22, cx, cy + size * 0.78);
    ctx.stroke();
    ctx.restore();

    // Clean, understated bottom instruction text matching reference video
    ctx.font = "600 11px 'Montserrat', sans-serif";
    ctx.fillStyle = '#b36243';
    ctx.textAlign = 'center';
    ctx.fillText('TRACE THE HEART WITH HENNA', cx, height - 34);
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Scratch / Trace stroke using destination-out to peel veil and reveal artwork
  const traceStroke = (clientX: number, clientY: number) => {
    if (isTraced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 50; // Finger rub width

    if (lastCoord.current) {
      ctx.beginPath();
      ctx.moveTo(lastCoord.current.x, lastCoord.current.y);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(currentX, currentY, 25, 0, Math.PI * 2);
      ctx.fill();
    }

    lastCoord.current = { x: currentX, y: currentY };
    checkProgress();
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const sampleSize = 16;
    let transparentCount = 0;
    let totalSamples = 0;

    const imgData = ctx.getImageData(0, 0, width, height).data;

    for (let y = 0; y < height; y += sampleSize) {
      for (let x = 0; x < width; x += sampleSize) {
        const index = (y * width + x) * 4 + 3;
        if (imgData[index] < 128) {
          transparentCount++;
        }
        totalSamples++;
      }
    }

    const percent = Math.round((transparentCount / totalSamples) * 100);

    if (percent > 30 && !isTraced) {
      handleCompleteReveal();
    }
  };

  const handleCompleteReveal = () => {
    setIsTraced(true);
    fireGoldSparkles(0.5, 0.45);
  };

  // Pointer events for smooth touch and mouse interaction
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPointerDown.current = true;
    lastCoord.current = null;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    traceStroke(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDown.current) return;
    traceStroke(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPointerDown.current = false;
    lastCoord.current = null;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignored
    }
  };

  return (
    <div className="ceremony-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="mehndi-modal-title">
      <div className="ceremony-modal-card deckled-paper">
        {/* Minimal Modal Close Button */}
        <div className="modal-top-bar">
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
            <h3 id="mehndi-modal-title" className="ceremony-modal-title">{event.title}</h3>
            <p className="ceremony-tamil-title">Where henna meets hearts</p>
            <p className="ceremony-modal-time">{event.startTime} Onwards • {wedding.venue.name}</p>
            <blockquote className="ceremony-modal-quote">
              &ldquo;The deeper the mehndi, the deeper the love.&rdquo;
            </blockquote>
            <div className="ceremony-dress-hint">
              <span>Dress Code:</span> Pastel &amp; Floral Elegance
            </div>
          </div>
        </div>

        {/* Canvas Scratch/Trace Veil Layer */}
        {!isTraced && (
          <canvas
            ref={canvasRef}
            className="turmeric-scratch-canvas mehndi-heart-canvas"
            style={{ touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        )}
      </div>
    </div>
  );
};
