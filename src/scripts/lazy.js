import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduced, finePointer } from './util.js';

// Marquesina que acelera con la velocidad del scroll y vuelve a su ritmo al frenar.
export function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track || reduced) return;
  track.classList.add('is-js');
  const tween = gsap.to(track, { xPercent: -50, duration: 24, ease: 'none', repeat: -1 });
  ScrollTrigger.create({
    onUpdate: (self) => {
      tween.timeScale(1 + Math.min(Math.abs(self.getVelocity()) / 250, 8));
      gsap.to(tween, { timeScale: 1, duration: 1, overwrite: true });
    },
  });
}

// El texto se ilumina palabra por palabra a medida que se hace scroll.
export function initScrubText() {
  if (reduced) return;
  document.querySelectorAll('[data-scrub] p').forEach((p) => {
    const words = p.textContent.trim().split(/\s+/);
    p.textContent = '';
    const spans = words.map((word) => {
      const s = document.createElement('span');
      s.className = 'w';
      s.textContent = word;
      p.append(s, ' ');
      return s;
    });
    // De un gris-violeta legible (contraste > 4,5:1) a blanco: el efecto se nota sin dejar texto ilegible
    gsap.fromTo(spans, { color: '#8d84ab' }, {
      color: '#ffffff', ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 50%', scrub: true },
    });
  });
}

// Carrusel horizontal: scroll-snap nativo + arrastre con mouse + botones + barra de progreso.
export function initSlider() {
  document.querySelectorAll('[data-slider]').forEach((root) => {
    const track = root.querySelector('.slider-track');
    const bar = root.querySelector('.slider-bar span');
    if (!track) return;
    const step = () => {
      const card = track.querySelector('.tale-card');
      return (card ? card.getBoundingClientRect().width : 300) + parseFloat(getComputedStyle(track).columnGap || 16);
    };
    root.querySelector('[data-prev]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    root.querySelector('[data-next]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const visible = track.clientWidth / track.scrollWidth;
      const ratio = max > 0 ? track.scrollLeft / max : 0;
      if (bar) bar.style.transform = `scaleX(${visible + (1 - visible) * ratio})`;
    };
    track.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();

    let down = false, startX = 0, startLeft = 0;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      down = true; startX = e.clientX; startLeft = track.scrollLeft;
    });
    addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) track.classList.add('dragging');
      track.scrollLeft = startLeft - dx;
    });
    addEventListener('pointerup', () => { down = false; track.classList.remove('dragging'); });
  });
}

// Video en bucle (solo reproduce mientras se ve) y diálogo para reproducirlo desde las tarjetas de media.
export function initVideo() {
  const loop = document.getElementById('loopVideo');
  const toggle = document.getElementById('filmToggle');
  const src = loop?.querySelector('source')?.src;

  if (loop && toggle) {
    let userPaused = reduced;
    const ui = () => toggle.setAttribute('aria-pressed', String(loop.paused)); // true = pausado (muestra "play")
    const play = () => { loop.preload = 'auto'; loop.play().catch(() => {}); };
    loop.addEventListener('play', ui);
    loop.addEventListener('pause', ui);
    toggle.addEventListener('click', () => { if (loop.paused) { userPaused = false; play(); } else { userPaused = true; loop.pause(); } });
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!userPaused) play(); } else loop.pause();
    }, { threshold: 0.35 }).observe(loop);
    ui();
  }

  const dialog = document.getElementById('player');
  const pv = document.getElementById('playerVideo');
  if (!dialog || !pv || !src) return;
  const close = () => { pv.pause(); pv.removeAttribute('src'); pv.load(); if (dialog.open) dialog.close(); };
  document.querySelectorAll('[data-play]').forEach((btn) => btn.addEventListener('click', () => {
    pv.src = src;
    dialog.showModal();
    pv.play().catch(() => {});
  }));
  document.getElementById('playerClose')?.addEventListener('click', close);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  dialog.addEventListener('close', () => { pv.pause(); });
}

// Partículas: estela suave con el mouse y estallido al hacer clic. El canvas solo se redibuja mientras hay partículas.
export function initFx() {
  const canvas = document.getElementById('fx');
  if (!canvas || reduced || !finePointer) return;
  const ctx = canvas.getContext('2d');
  const colors = ['#b4ff3a', '#ff3ad4', '#3af0ff', '#ffd84a'];
  let parts = [], raf = 0, last = 0;

  const size = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  const spawn = (x, y, n, speed) => {
    for (let i = 0; i < n; i += 1) {
      parts.push({ x, y, vx: (Math.random() - 0.5) * speed, vy: (Math.random() - 0.5) * speed - 0.5, life: 1, r: 1.5 + Math.random() * 2.5, c: colors[(Math.random() * colors.length) | 0] });
    }
    if (!raf) raf = requestAnimationFrame(frame);
  };
  const frame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts = parts.filter((p) => p.life > 0);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life -= 0.022;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, p.r, p.r);
    }
    raf = parts.length ? requestAnimationFrame(frame) : 0;
    if (!raf) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  size();
  addEventListener('resize', size);
  addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - last < 45) return;
    last = now;
    spawn(e.clientX, e.clientY, 1, 1.6);
  }, { passive: true });
  addEventListener('pointerdown', (e) => spawn(e.clientX, e.clientY, 18, 7));
}
