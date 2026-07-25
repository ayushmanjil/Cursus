// Lightweight Canvas Confetti Generator

export function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const context = canvas.getContext('2d');
  if (!context) {
    document.body.removeChild(canvas);
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ['#B8863F', '#4B6B58', '#8B3A42', '#6B4C96', '#DDB479', '#C27B38'];

  interface Particle {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    vx: number;
    vy: number;
    rotation: number;
    vr: number;
    opacity: number;
  }

  const particles: Particle[] = [];
  const particleCount = 90;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height * 0.4 + (Math.random() - 0.5) * 100,
      w: Math.random() * 10 + 6,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -12 - 4,
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 10,
      opacity: 1,
    });
  }

  const startTime = performance.now();
  const duration = 3500; // 3.5 seconds

  function animate(now: number) {
    const elapsed = now - startTime;
    if (elapsed > duration) {
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
      return;
    }

    if (!context) return;
    context.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // drag
      p.rotation += p.vr;

      if (elapsed > duration - 1000) {
        p.opacity = Math.max(0, (duration - elapsed) / 1000);
      }

      context.save();
      context.globalAlpha = p.opacity;
      context.translate(p.x, p.y);
      context.rotate((p.rotation * Math.PI) / 180);
      context.fillStyle = p.color;
      context.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      context.restore();
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
