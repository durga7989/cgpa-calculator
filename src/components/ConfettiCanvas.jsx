import React, { useEffect, useRef } from 'react';

export default function ConfettiCanvas({ trigger }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const colors = [
      '#a855f7', // purple-500
      '#ec4899', // pink-500
      '#06b6d4', // cyan-500
      '#3b82f6', // blue-500
      '#eab308', // yellow-500
      '#10b981', // emerald-500
    ];

    // Handle canvas sizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Seed particles
    const createParticles = () => {
      const count = 150;
      for (let i = 0; i < count; i++) {
        // Emitters around the left/right bottom sides pointing upwards and inwards
        const side = Math.random() < 0.5 ? 'left' : 'right';
        const startX = side === 'left' ? 0 : canvas.width;
        const startY = canvas.height * 0.8;

        const baseAngle = side === 'left' ? -Math.PI / 6 : -Math.PI * 5 / 6;
        const spread = (Math.random() - 0.5) * (Math.PI / 4); // 45 deg spread
        const angle = baseAngle + spread;
        const speed = 15 + Math.random() * 15;

        particles.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 4 + Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          opacity: 1,
          gravity: 0.4,
          friction: 0.98,
          shape: Math.random() < 0.4 ? 'circle' : Math.random() < 0.7 ? 'square' : 'triangle'
        });
      }
    };

    createParticles();

    // Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;

      particles.forEach((p) => {
        if (p.opacity <= 0) return;

        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.006; // fade over ~3 seconds

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);

        ctx.beginPath();
        if (p.shape === 'circle') {
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        } else if (p.shape === 'square') {
          ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          // triangle
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      if (alive) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}
