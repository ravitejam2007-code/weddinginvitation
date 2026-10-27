import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import { fireGoldSparkles } from '../utils/confetti';
import { formatWeddingDate, getWeddingEvent, wedding } from '../data/wedding';

interface HaldiScratchRevealProps {
  onClose: () => void;
}

export const HaldiScratchReveal: React.FC<HaldiScratchRevealProps> = ({ onClose }) => {
  const event = getWeddingEvent('haldi');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPointerDown = useRef(false);
  const lastCoord = useRef<{ x: number; y: number } | null>(null);
  const [revealedPercent, setRevealedPercent] = useState(0);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);

  // Initialize turmeric paste coating on canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 520);

    // Warm Turmeric Yellow Gradient
    const grad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width);
    grad.addColorStop(0, '#fec31c');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(1, '#d97706');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle paste texture & marigold speckles
    for (let i = 0; i < 180; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 230, 100, 0.35)' : 'rgba(180, 83, 9, 0.2)';
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 6 + 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer decorative border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // Center Haldi Badge Graphic
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 18px 'Cinzel', serif";
    ctx.textAlign = 'center';
    ctx.fillText('✨ HALDI CEREMONY ✨', width / 2, height / 2 - 20);

    ctx.font = "14px 'Montserrat', sans-serif";
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText('Manjal Neerattu Vizha', width / 2, height / 2 + 10);

    ctx.font = "11px 'Montserrat', sans-serif";
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Rub with mouse, touch or stylus to reveal', width / 2, height / 2 + 36);
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Scratch rub function supporting mouse, touch, and stylus/pen with pressure
  const scratchStroke = (clientX: number, clientY: number, pressure: number = 0.5) => {
    if (isFullyRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    // Radius dynamically adapts to pressure if stylus is used
    const baseRadius = 32;
    const radius = Math.max(20, Math.min(50, baseRadius * (pressure > 0 ? pressure * 1.6 : 1)));

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = radius * 2;

    if (lastCoord.current) {
      ctx.beginPath();
      ctx.moveTo(lastCoord.current.x, lastCoord.current.y);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(currentX, currentY, radius, 0, Math.PI * 2);
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
        const index = (y * width + x) * 4 + 3; // Alpha channel
        if (imgData[index] < 128) {
          transparentCount++;
        }
        totalSamples++;
      }
    }

    const percent = Math.round((transparentCount / totalSamples) * 100);
    setRevealedPercent(percent);

    if (percent > 40 && !isFullyRevealed) {
      handleCompleteReveal();
    }
  };

  const handleCompleteReveal = () => {
    setIsFullyRevealed(true);
    fireGoldSparkles(0.5, 0.5);
  };

  // Pointer event handlers for unified Mouse, Touch, and Stylus/Pen support
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPointerDown.current = true;
    lastCoord.current = null;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored if capture unsupported
    }
    scratchStroke(e.clientX, e.clientY, e.pressure);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDown.current) return;
    scratchStroke(e.clientX, e.clientY, e.pressure);
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
    <div className="ceremony-modal-overlay" role="dialog" aria-modal="true">
      <div className="ceremony-modal-card deckled-paper">
        {/* Header Actions */}
        <div className="modal-top-bar">
          <button
            type="button"
            className="btn-quick-reveal"
            onClick={handleCompleteReveal}
            disabled={isFullyRevealed}
          >
            <Sparkles size={14} />
            <span>{isFullyRevealed ? "Revealed!" : "Reveal >"}</span>
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
            <p className="ceremony-tamil-title">Manjal Neerattu Vizha</p>
            <p className="ceremony-modal-time">{event.startTime} Onwards • {wedding.venue.name}</p>
            <blockquote className="ceremony-modal-quote">
              &ldquo;Turmeric, laughter, and the very first blessings of our union.&rdquo;
            </blockquote>
            <div className="ceremony-dress-hint">
              <span>Dress Code:</span> Bright Yellows &amp; Sunny Shades
            </div>
          </div>
        </div>

        {/* Genuine Turmeric Scratch-Off Layer (Mouse, Touch & Stylus support) */}
        {!isFullyRevealed && (
          <canvas
            ref={canvasRef}
            className="turmeric-scratch-canvas"
            style={{ touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        )}

        {/* Interaction Prompt Footer */}
        <div className="modal-interaction-prompt">
          {!isFullyRevealed ? (
            <div className="prompt-turmeric-rub">
              <span className="prompt-finger-icon" aria-hidden="true">✨</span>
              <span>SCRATCH WITH FINGER, MOUSE OR STYLUS ({revealedPercent}%)</span>
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
