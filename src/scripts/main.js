import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ *
 * Preloader
 * ------------------------------------------------------------------ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  const bar = preloader.querySelector('.preloader-bar span');
  let progress = 0;
  const timer = setInterval(() => {
    progress = Math.min(100, progress + Math.random() * 18 + 6);
    if (bar) bar.style.width = `${progress}%`;
    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        preloader.classList.add('done');
        document.body.classList.add('loaded');
      }, 250);
    }
  }, 110);
}

/* ------------------------------------------------------------------ *
 * Smooth scroll (Lenis) + scroll progress
 * ------------------------------------------------------------------ */
function initSmoothScroll() {
  const bar = document.getElementById('scrollProgress');
  if (bar) {
    const updateProgress = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = `${max > 0 ? (h.scrollTop / max) * 100 : 0}%`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  if (prefersReducedMotion) return;

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ------------------------------------------------------------------ *
 * Custom cursor
 * ------------------------------------------------------------------ */
function initCursor() {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  if (!cursor || !dot) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx;
  let cy = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  const loop = () => {
    cx += (mx - cx) * 0.14;
    cy += (my - cy) * 0.14;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  document.querySelectorAll('a, button, .card, .eco-card, .btn, .film-card').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '58px';
      cursor.style.height = '58px';
      cursor.style.background = 'rgba(180, 255, 58, 0.14)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '34px';
      cursor.style.height = '34px';
      cursor.style.background = 'transparent';
    });
  });
}

/* ------------------------------------------------------------------ *
 * Scroll reveals, parallax, counters
 * ------------------------------------------------------------------ */
function initScrollEffects() {
  if (prefersReducedMotion) {
    gsap.set('.reveal', { opacity: 1, y: 0 });
    document.querySelectorAll('[data-count]').forEach((el) => {
      el.textContent = Number(el.dataset.count).toLocaleString();
    });
    return;
  }

  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = Number.parseFloat(el.dataset.parallax) || 0.3;
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number.parseFloat(el.dataset.count) || 0;
    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      onUpdate: () => {
        el.textContent = Math.floor(counter.value).toLocaleString();
      },
    });
  });
}

/* ------------------------------------------------------------------ *
 * Hero title character reveal
 * ------------------------------------------------------------------ */
function initHeroTitle() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  if (prefersReducedMotion) {
    gsap.set('.hero-title .char', { opacity: 1, y: 0 });
    return;
  }

  title.innerHTML = title.innerHTML
    .split(/(<br[^>]*>)/i)
    .map((part) => {
      if (/^<br/i.test(part)) return part;
      return part
        .split('')
        .map((ch) =>
          ch === ' '
            ? ' '
            : `<span class="char" style="display:inline-block;opacity:0;transform:translateY(60px)">${ch}</span>`
        )
        .join('');
    })
    .join('');

  gsap.to('.hero-title .char', {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.028,
    delay: 0.25,
  });
}

/* ------------------------------------------------------------------ *
 * Magnetic buttons + 3D tilt cards
 * ------------------------------------------------------------------ */
function initMicroInteractions() {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.25;
      gsap.to(btn, { x, y, duration: 0.4, ease: 'power3.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });

  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, {
        rotateY: x * 8,
        rotateX: -y * 8,
        y: -6,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.6, ease: 'power3.out' });
    });
  });
}

/* ------------------------------------------------------------------ *
 * Text scramble on section titles
 * ------------------------------------------------------------------ */
function initTextScramble() {
  if (prefersReducedMotion) return;
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#';

  const scramble = (el) => {
    const original = el.textContent;
    let iteration = 0;
    const interval = setInterval(() => {
      el.textContent = original
        .split('')
        .map((c, i) => {
          if (c === ' ') return ' ';
          return i < iteration ? original[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');
      if (iteration >= original.length) {
        clearInterval(interval);
        el.textContent = original;
      }
      iteration += 0.6;
    }, 24);
  };

  document
    .querySelectorAll('.section-title, .rev-title, .dawn-title, .app-title, .merch-title')
    .forEach((el) => {
      if (el.querySelector('*')) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              scramble(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      observer.observe(el);
    });
}

/* ------------------------------------------------------------------ *
 * Starfield canvas
 * ------------------------------------------------------------------ */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas || prefersReducedMotion) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let stars = [];
  let nebulas = [];

  const resize = () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    stars = [];
    nebulas = [];

    const count = Math.min(420, Math.floor((width * height) / 4200));
    for (let i = 0; i < count; i += 1) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.28 + 0.04,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
    for (let i = 0; i < 4; i += 1) {
      nebulas.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 220 + 120,
        color: i % 2 === 0 ? '124, 58, 237' : '58, 240, 255',
        alpha: Math.random() * 0.16 + 0.05,
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    nebulas.forEach((n) => {
      const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      gradient.addColorStop(0, `rgba(${n.color}, ${n.alpha})`);
      gradient.addColorStop(1, `rgba(${n.color}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });
    stars.forEach((s) => {
      s.twinkle += s.speed;
      const alpha = s.a * (0.5 + 0.5 * Math.sin(s.twinkle));
      ctx.fillStyle = `rgba(244, 241, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* ------------------------------------------------------------------ *
 * Filmstrip: pause on hover
 * ------------------------------------------------------------------ */
function initFilmstrip() {
  document.querySelectorAll('.filmstrip-track').forEach((track) => {
    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  });
}

/* ------------------------------------------------------------------ */
function boot() {
  initPreloader();
  initSmoothScroll();
  initCursor();
  initScrollEffects();
  initHeroTitle();
  initMicroInteractions();
  initTextScramble();
  initStarfield();
  initFilmstrip();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
