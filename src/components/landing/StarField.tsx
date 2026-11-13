"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
  twinkleSpeed: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Star colors: deep white, ice blue, cyan, starlight amber
    const starPalette = ["#ffffff", "#e0f2fe", "#bae6fd", "#7dd3fc", "#fed7aa"];

    // Initialize regular twinkling stars
    const starCount = Math.floor((width * height) / 4500);
    const stars: Star[] = Array.from({ length: Math.min(starCount, 300) }, () => {
      const alpha = Math.random() * 0.8 + 0.2;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() < 0.8 ? Math.random() * 1.2 + 0.4 : Math.random() * 1.8 + 1.2,
        alpha,
        targetAlpha: alpha,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: starPalette[Math.floor(Math.random() * starPalette.length)],
      };
    });

    // Shooting star state
    let shootingStar: ShootingStar | null = null;
    let lastShootingStarTime = Date.now();
    let nextShootingStarDelay = Math.random() * 4000 + 3000;

    const createShootingStar = () => {
      const angle = (Math.PI / 180) * (Math.random() * 25 + 25); // 25-50 deg angle
      shootingStar = {
        x: Math.random() * (width * 0.8),
        y: Math.random() * (height * 0.3),
        length: Math.random() * 80 + 70,
        speed: Math.random() * 10 + 14,
        angle,
        opacity: 1,
        active: true,
      };
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars.forEach((star) => {
        if (star.x > width) star.x = Math.random() * width;
        if (star.y > height) star.y = Math.random() * height;
      });
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw & animate stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Twinkle update
        if (Math.abs(star.alpha - star.targetAlpha) < 0.02) {
          star.targetAlpha = Math.random() * 0.85 + 0.15;
        } else {
          star.alpha += (star.targetAlpha - star.alpha) * star.twinkleSpeed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();

        // Subtle glow for larger stars
        if (star.radius > 1.4) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha * 0.25;
          ctx.fill();
        }
      }

      // Check shooting star trigger
      const now = Date.now();
      if (!shootingStar && now - lastShootingStarTime > nextShootingStarDelay) {
        createShootingStar();
        lastShootingStarTime = now;
        nextShootingStarDelay = Math.random() * 5000 + 4000;
      }

      // Draw & animate shooting star
      if (shootingStar && shootingStar.active) {
        const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

        const grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
        grad.addColorStop(0.3, `rgba(125, 211, 252, ${shootingStar.opacity * 0.7})`);
        grad.addColorStop(1, "rgba(56, 189, 248, 0)");

        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Head sparkle
        ctx.beginPath();
        ctx.arc(shootingStar.x, shootingStar.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${shootingStar.opacity})`;
        ctx.fill();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.012;

        if (
          shootingStar.x > width + 100 ||
          shootingStar.y > height + 100 ||
          shootingStar.opacity <= 0
        ) {
          shootingStar = null;
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Dynamic Canvas Stars and Shooting Meteors */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-90" />

      {/* Atmospheric Nebula Gradients */}
      <div className="absolute -top-40 -left-40 h-[550px] w-[550px] rounded-full bg-cyan-600/10 blur-[140px]" />
      <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-indigo-600/12 blur-[150px]" />
      <div className="absolute bottom-10 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-700/10 blur-[130px]" />

      {/* Subtle Orbital Scan Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
