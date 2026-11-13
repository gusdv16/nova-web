import { reduced } from './util.js';

// Estrellas titilantes en canvas. Solo dibuja mientras el hero está a la vista y la pestaña activa.
export function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas || reduced) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w = 0, h = 0, stars = [], raf = 0, inView = false;

  const resize = () => {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    const n = Math.min(260, Math.floor((w * h) / 6500));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.2 + 0.4,
      a: Math.random() * 0.8 + 0.2, s: Math.random() * 0.03 + 0.005, t: Math.random() * Math.PI * 2,
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f4f1ff';
    for (const s of stars) {
      s.t += s.s;
      ctx.globalAlpha = s.a * (0.5 + 0.5 * Math.sin(s.t));
      ctx.fillRect(s.x, s.y, s.r, s.r);
    }
    raf = requestAnimationFrame(draw);
  };
  const sync = () => {
    cancelAnimationFrame(raf);
    if (inView && !document.hidden) raf = requestAnimationFrame(draw);
  };

  let timer;
  window.addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(resize, 150); });
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }).observe(canvas);
  resize();
}
