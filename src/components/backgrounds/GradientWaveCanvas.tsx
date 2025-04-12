import React, { useEffect, useRef } from 'react';

export function GradientWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const scrollPos = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleScroll = () => {
      scrollPos.current = window.scrollY;
    };

    const drawWave = (time: number) => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradients
      const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient1.addColorStop(0, 'rgba(191, 219, 254, 0.12)'); // Light blue, darker and more opaque
      gradient1.addColorStop(0.5, 'rgba(147, 197, 253, 0.15)'); // Medium blue, darker and more opaque
      gradient1.addColorStop(1, 'rgba(96, 165, 250, 0.12)'); // Darker blue, more opaque

      const gradient2 = ctx.createLinearGradient(canvas.width, 0, 0, canvas.height);
      gradient2.addColorStop(0, 'rgba(219, 234, 254, 0.11)'); // Very light blue, more opaque
      gradient2.addColorStop(0.5, 'rgba(191, 219, 254, 0.13)'); // Light blue, more opaque
      gradient2.addColorStop(1, 'rgba(147, 197, 253, 0.11)'); // Medium blue, more opaque

      // Draw waves
      const drawGradientWave = (
        gradient: CanvasGradient,
        amplitude: number,
        frequency: number,
        speed: number,
        offset: number
      ) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        for (let x = 0; x < canvas.width; x++) {
          const y =
            canvas.height / 2 +
            Math.sin((x * frequency + time * speed + offset) / 1000) * amplitude +
            (scrollPos.current * 0.1);

          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        ctx.fillStyle = gradient;
        ctx.fill();
      };

      // Draw multiple waves with different parameters
      drawGradientWave(gradient1, 200, 0.3, 0.15, 0); // Increased amplitude, reduced frequency
      drawGradientWave(gradient2, 180, 0.2, 0.1, Math.PI); // Increased amplitude, reduced frequency
      drawGradientWave(gradient1, 160, 0.25, 0.12, Math.PI / 2); // Increased amplitude, reduced frequency

      animationFrameRef.current = requestAnimationFrame(drawWave);
    };

    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', handleScroll);
    animationFrameRef.current = requestAnimationFrame(drawWave);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
} 