'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const STEP = 0.5;

interface PortfolioLightboxProps {
  src: string;
  alt: string;
  lang: string;
  onClose: () => void;
}

export function PortfolioLightbox({ src, alt, lang, onClose }: PortfolioLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);
  const pinchRef = useRef<{ startDist: number; startScale: number } | null>(null);

  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  const labels = lang === 'en'
    ? { close: 'Close', zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Reset zoom' }
    : { close: 'Fechar', zoomIn: 'Aumentar zoom', zoomOut: 'Reduzir zoom', reset: 'Repor zoom' };

  const reset = useCallback(() => {
    setScale(1);
    setTx(0);
    setTy(0);
  }, []);

  const clampedSetScale = useCallback((next: number) => {
    const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
    setScale(s);
    if (s === 1) {
      setTx(0);
      setTy(0);
    }
  }, []);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (!dlg.open) dlg.showModal();

    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dlg.addEventListener('cancel', onCancel);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      dlg.removeEventListener('cancel', onCancel);
      document.body.style.overflow = prevOverflow;
      if (dlg.open) dlg.close();
    };
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        clampedSetScale(scale + STEP);
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        clampedSetScale(scale - STEP);
      } else if (e.key === '0') {
        e.preventDefault();
        reset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [scale, clampedSetScale, reset]);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? STEP : -STEP;
    clampedSetScale(scale + delta);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: tx, baseY: ty };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setTx(dragRef.current.baseX + (e.clientX - dragRef.current.startX));
    setTy(dragRef.current.baseY + (e.clientY - dragRef.current.startY));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      // pointer already released
    }
  };

  const onImageClick = () => {
    if (scale === 1) clampedSetScale(2);
    else reset();
  };

  const onBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  const btn =
    'inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground border border-border shadow-sm hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <dialog
      ref={dialogRef}
      onClick={onBackdropClick}
      aria-label={alt}
      className="m-0 p-0 max-w-none max-h-none w-screen h-screen bg-background/95 backdrop-blur-sm text-foreground open:flex open:flex-col"
    >
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border bg-background/80">
        <span className="text-sm font-medium tabular-nums w-16">{Math.round(scale * 100)}%</span>
        <div className="flex items-center gap-2">
          <button type="button" className={btn} aria-label={labels.zoomOut} onClick={() => clampedSetScale(scale - STEP)} disabled={scale <= MIN_SCALE}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button type="button" className={btn} aria-label={labels.zoomIn} onClick={() => clampedSetScale(scale + STEP)} disabled={scale >= MAX_SCALE}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button type="button" className={btn} aria-label={labels.reset} onClick={reset} disabled={scale === 1 && tx === 0 && ty === 0}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <polyline points="3 4 3 10 9 10" />
            </svg>
          </button>
          <button type="button" className={btn} aria-label={labels.close} onClick={onClose}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={stageRef}
        className="relative flex-1 overflow-hidden select-none touch-none"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: scale > 1 ? (dragRef.current ? 'grabbing' : 'grab') : 'zoom-in' }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`,
            transition: dragRef.current ? 'none' : 'transform 150ms ease-out',
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={2400}
            height={3000}
            sizes="100vw"
            priority
            draggable={false}
            onClick={onImageClick}
            className="max-h-[85vh] w-auto h-auto object-contain pointer-events-auto"
          />
        </div>
      </div>
    </dialog>
  );
}
