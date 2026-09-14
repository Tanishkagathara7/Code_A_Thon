'use client';

import React, { useEffect, useRef } from 'react';

interface InteractiveGridTilesProps {
  tileSize?: number;
  className?: string;
}

export const InteractiveGridTiles: React.FC<InteractiveGridTilesProps> = ({
  tileSize = 40,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates and smoothing tracking
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 175,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Render loop
    const render = () => {
      // Smooth lerp mouse movement
      mouse.x += (mouse.targetX - mouse.x) * 0.16;
      mouse.y += (mouse.targetY - mouse.y) * 0.16;

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / tileSize);
      const rows = Math.ceil(height / tileSize);

      // Base grid lines: extremely faint architectural lines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.035)';
      ctx.lineWidth = 1;

      // Draw neutral grid lines
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const x = c * tileSize;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * tileSize;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Interactive cursor tile reaction with Code-A-Thon Neon/Electric Magenta & Cyan-Violet vibe
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tileX = c * tileSize;
          const tileY = r * tileSize;
          const centerX = tileX + tileSize / 2;
          const centerY = tileY + tileSize / 2;

          const dx = mouse.x - centerX;
          const dy = mouse.y - centerY;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const factor = 1 - dist / mouse.radius;
            const easedFactor = Math.pow(factor, 2);

            // Angle from mouse center gives a gradient hue cycle between Code-A-Thon Electric Pink/Magenta and Cyber Blue
            const angle = Math.atan2(dy, dx);
            // Interpolate color: Pink/Crimson (#E11D48 / #EC4899) to Electric Cyan/Violet (#0284C7 / #8B5CF6)
            const isMagentaSide = Math.sin(angle) > 0;

            const rVal = isMagentaSide ? 225 : 99;
            const gVal = isMagentaSide ? 29 : 102;
            const bVal = isMagentaSide ? 100 : 241;

            // Subtle luminous tile fill
            ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${0.075 * easedFactor})`;
            ctx.fillRect(tileX + 1, tileY + 1, tileSize - 2, tileSize - 2);

            // Highlighted tile border with crisp neon tone
            ctx.strokeStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${0.42 * easedFactor})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(tileX + 0.5, tileY + 0.5, tileSize - 1, tileSize - 1);

            // Precision tech crosshairs at the grid intersections
            if (factor > 0.4) {
              const crossSize = 3.5;
              ctx.strokeStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${0.75 * factor})`;
              ctx.beginPath();
              // Intersection point crosshair
              ctx.moveTo(tileX - crossSize, tileY);
              ctx.lineTo(tileX + crossSize, tileY);
              ctx.moveTo(tileX, tileY - crossSize);
              ctx.lineTo(tileX, tileY + crossSize);
              ctx.stroke();
            }
          }
        }
      }

      // Cursor dual-chromatic ambient radial glow matching Code-A-Thon lighting
      if (mouse.x > 0 && mouse.y > 0) {
        const radialGradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius
        );
        // Vibrant Code-A-Thon center aura (electric magenta fading to cyber blue)
        radialGradient.addColorStop(0, 'rgba(236, 72, 153, 0.09)');
        radialGradient.addColorStop(0.45, 'rgba(124, 58, 237, 0.05)');
        radialGradient.addColorStop(0.85, 'rgba(14, 165, 233, 0.03)');
        radialGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = radialGradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [tileSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};
