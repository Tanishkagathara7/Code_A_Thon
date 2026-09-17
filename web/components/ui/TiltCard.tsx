'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt degrees (default 16)
  perspective?: number; // perspective depth px (default 1000)
  glare?: boolean;
  enableScrollFlip?: boolean; // 360 flip when scrolled into/through viewport
  flipOnLoad?: boolean; // flips 360 degrees once on initial page load
  loadFlipDurationMs?: number; // duration of the load flip in ms (default 1200)
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 16,
  perspective = 1000,
  glare = true,
  enableScrollFlip = true,
  flipOnLoad = false,
  loadFlipDurationMs = 1300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [tilt, setTilt] = useState<{ x: number; y: number; glareX: number; glareY: number }>({
    x: 0,
    y: 0,
    glareX: 50,
    glareY: 50,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [scrollFlip, setScrollFlip] = useState<{ rotateY: number; rotateX: number }>({
    rotateY: 0,
    rotateX: 0,
  });
  const [isLoadFlipping, setIsLoadFlipping] = useState(flipOnLoad);

  // Trigger one-time 360 load flip if requested
  useEffect(() => {
    if (!flipOnLoad) return;
    
    // Allow initial paint, then trigger 360 flip
    const timer = setTimeout(() => {
      setIsLoadFlipping(false);
    }, loadFlipDurationMs + 100);

    return () => clearTimeout(timer);
  }, [flipOnLoad, loadFlipDurationMs]);

  // Calculate scroll-driven 3D flip rotation as the element enters and moves through viewport
  useEffect(() => {
    if (!enableScrollFlip) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const el = containerRef.current;
          if (!el) {
            ticking = false;
            return;
          }

          const rect = el.getBoundingClientRect();
          const windowHeight = window.innerHeight || document.documentElement.clientHeight;

          // Compute relative progress through the viewport:
          // 0 = bottom edge entering bottom of screen
          // 0.5 = vertically centered in screen
          // 1 = top edge exiting top of screen
          const totalDistance = windowHeight + rect.height;
          const currentDistance = windowHeight - rect.top;
          const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));

          // Full 360 degree 3D rotation flip on scroll (centered at 0 rotation when directly in viewport center)
          // Progress goes from 0 -> 0.5 -> 1, rotation goes from -180deg -> 0deg -> +180deg (full 360 flip round)
          const angleY = (progress - 0.5) * 360;
          const angleX = Math.sin((progress - 0.5) * Math.PI) * 15; // gentle natural arch tilt

          setScrollFlip({
            rotateY: angleY,
            rotateX: angleX,
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial trigger

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enableScrollFlip]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Mouse position relative to the element (from 0 to 1)
      const mouseX = (e.clientX - rect.left) / width;
      const mouseY = (e.clientY - rect.top) / height;

      // Cursor-relative tilt:
      const rotateY = (mouseX - 0.5) * (maxTilt * 2);
      const rotateX = -(mouseY - 0.5) * (maxTilt * 2);

      setTilt({
        x: rotateX,
        y: rotateY,
        glareX: mouseX * 100,
        glareY: mouseY * 100,
      });
    },
    [maxTilt]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  // Combine scroll flip rotation with relative mouse hover tilt
  const currentRotateY = isHovered ? tilt.y : scrollFlip.rotateY;
  const currentRotateX = isHovered ? tilt.x : scrollFlip.rotateX;
  const currentScale = isHovered ? 1.03 : 1;

  return (
    <div
      ref={containerRef}
      style={{ perspective: `${perspective}px` }}
      className="inline-block w-full"
    >
      {/* Keyframes for one-time 360 flip on load */}
      {flipOnLoad && (
        <style>{`
          @keyframes loadFlip360 {
            0% {
              transform: rotateY(-360deg) scale(0.92);
              opacity: 0.3;
            }
            70% {
              transform: rotateY(15deg) scale(1.02);
              opacity: 1;
            }
            100% {
              transform: rotateY(0deg) scale(1);
              opacity: 1;
            }
          }
        `}</style>
      )}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative transition-transform ease-out will-change-transform ${className}`}
        style={{
          transform: isLoadFlipping
            ? undefined
            : `rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) scale3d(${currentScale}, ${currentScale}, ${currentScale})`,
          animation: isLoadFlipping
            ? `loadFlip360 ${loadFlipDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
            : undefined,
          transitionDuration: isHovered ? '120ms' : '220ms',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}

        {/* Dynamic reflective specular glare highlight based on cursor position */}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-30 overflow-hidden"
            style={{
              opacity: isHovered ? 0.35 : 0,
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 65%)`,
            }}
          />
        )}
      </div>
    </div>
  );
};
