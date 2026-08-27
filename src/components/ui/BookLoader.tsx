import React from 'react';

/**
 * BookLoader — stencil/outline open-book page-flip animation.
 *
 * The book is tilted so the bottom spine edge faces the viewer
 * (matching the "open book on a table, viewed from slightly above" angle).
 *
 * Props:
 *   size   — 'sm' | 'md' | 'lg'
 *   color  — 'brass' | 'brown' | 'auto' | any CSS colour string
 *              'brass' → #C89A54  warm gold    (good on dark backgrounds)
 *              'brown' → #7A5330  leather brown (good on light/paper backgrounds)
 *              'auto'  → 'brown' (default; use 'brass' explicitly on dark screens)
 */

interface BookLoaderProps {
  size?:  'sm' | 'md' | 'lg';
  color?: 'brass' | 'brown' | 'auto' | string;
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  brass: '#C89A54',
  brown: '#7A5330',
  auto:  '#7A5330',
};

const BookLoader: React.FC<BookLoaderProps> = ({
  size  = 'md',
  color = 'auto',
  className = '',
}) => {
  const resolvedColor = COLOR_MAP[color] ?? color;
  const scale = size === 'sm' ? 0.7 : size === 'lg' ? 1.4 : 1;

  const BW  = Math.round(72  * scale); // total book width (both pages + spine)
  const BH  = Math.round(52  * scale); // total book height
  const pw  = Math.round(31  * scale); // single page half-width
  const sw  = Math.round(10  * scale); // spine gap width
  const br  = Math.round(4   * scale); // border-radius
  const bw  = Math.max(1.5, Math.round(1.5 * scale)); // stroke width

  // Outer container — extra height to show the tilted book fully
  const outerW = Math.round(88 * scale);
  const outerH = Math.round(72 * scale);

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      aria-label="Loading..."
      role="status"
      style={{ width: outerW, height: outerH }}
    >
      {/*
        Perspective container — origin at bottom-center so rotateX(32deg)
        pushes the top edge away and brings the bottom spine forward.
      */}
      <div style={{
        width: outerW,
        height: outerH,
        perspective: `${Math.round(320 * scale)}px`,
        perspectiveOrigin: '50% 100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div
          className="ob-book"
          style={{
            position: 'relative',
            width: BW,
            height: BH,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Drop shadow */}
          <div style={{
            position: 'absolute',
            bottom: Math.round(-8 * scale),
            left: '50%',
            transform: 'translateX(-50%)',
            width: Math.round(BW * 0.85),
            height: Math.round(6 * scale),
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${resolvedColor}44 0%, transparent 70%)`,
          }} />

          {/* Left page (static) */}
          <div style={{
            position: 'absolute',
            left: 0, top: 0,
            width: pw, height: BH,
            border: `${bw}px solid ${resolvedColor}`,
            borderRight: 'none',
            borderRadius: `${br}px 0 0 ${br}px`,
            boxSizing: 'border-box',
            background: 'transparent',
          }}>
            {[0.22, 0.38, 0.55, 0.72].map((t, i) => (
              <div key={t} style={{
                position: 'absolute',
                left: Math.round(5 * scale),
                top: Math.round(t * BH),
                width: i % 2 === 0 ? '68%' : '52%',
                height: Math.max(1, Math.round(scale)),
                background: resolvedColor,
                opacity: 0.4,
                borderRadius: 2,
              }} />
            ))}
          </div>

          {/* Spine line */}
          <div style={{
            position: 'absolute',
            left: pw + Math.round(sw / 2) - Math.round(bw / 2),
            top: 0,
            width: Math.round(bw),
            height: BH,
            background: resolvedColor,
            borderRadius: bw,
            zIndex: 5,
          }} />

          {/* Right page (static) */}
          <div style={{
            position: 'absolute',
            right: 0, top: 0,
            width: pw, height: BH,
            border: `${bw}px solid ${resolvedColor}`,
            borderLeft: 'none',
            borderRadius: `0 ${br}px ${br}px 0`,
            boxSizing: 'border-box',
            background: 'transparent',
          }}>
            {[0.22, 0.38, 0.55, 0.72].map((t, i) => (
              <div key={t} style={{
                position: 'absolute',
                right: Math.round(5 * scale),
                top: Math.round(t * BH),
                width: i % 2 === 0 ? '68%' : '52%',
                height: Math.max(1, Math.round(scale)),
                background: resolvedColor,
                opacity: 0.4,
                borderRadius: 2,
              }} />
            ))}
          </div>

          {/*
            Flipping pages — anchored at right half, pivot at left edge (spine).
            rotateY sweeps right (0°) → over the top → left (−180°).
          */}
          <div style={{
            position: 'absolute',
            left: pw + sw,
            top: 0,
            width: pw,
            height: BH,
            perspective: `${Math.round(280 * scale)}px`,
            perspectiveOrigin: 'left center',
            overflow: 'visible',
            zIndex: 4,
            transformStyle: 'preserve-3d',
          }}>
            {[
              { cls: 'ob-pd1', opacity: 1    },
              { cls: 'ob-pd2', opacity: 0.65 },
              { cls: 'ob-pd3', opacity: 0.38 },
            ].map(({ cls, opacity }) => (
              <div
                key={cls}
                className={`ob-page ${cls}`}
                style={{
                  position: 'absolute',
                  left: 0, top: 0,
                  width: pw, height: BH,
                  border: `${bw}px solid ${resolvedColor}`,
                  borderLeft: 'none',
                  borderRadius: `0 ${br}px ${br}px 0`,
                  boxSizing: 'border-box',
                  background: 'transparent',
                  transformOrigin: 'left center',
                  backfaceVisibility: 'hidden',
                  opacity,
                }}
              >
                {[0.28, 0.52, 0.74].map((t) => (
                  <div key={t} style={{
                    position: 'absolute',
                    left: Math.round(5 * scale),
                    top: Math.round(t * BH),
                    width: '60%',
                    height: Math.max(1, Math.round(scale)),
                    background: resolvedColor,
                    opacity: 0.45,
                    borderRadius: 2,
                  }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </span>
  );
};

export default BookLoader;
