import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduced, finePointer } from './util.js';

// Aparición al entrar en pantalla (IntersectionObserver, sin GSAP): al terminar se quita la clase
// para que la transición no interfiera con las animaciones de hover.
export function initReveals() {
  const els = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in');
      io.unobserve(el);
      setTimeout(() => el.classList.remove('reveal', 'in'), 1500 + (parseFloat(el.style.getPropertyValue('--d')) || 0) * 1000);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  els.forEach((el) => io.observe(el));
}

// Parallax por scroll y contadores animados.
export function initScrollEffects() {
  const counters = document.querySelectorAll('[data-count]');
  if (reduced) {
    counters.forEach((el) => { el.textContent = Number(el.dataset.count).toLocaleString('en-US'); });
    return;
  }
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = Number.parseFloat(el.dataset.parallax) || 0.3;
    gsap.to(el, {
      yPercent: speed * 100, ease: 'none',
      scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
  counters.forEach((el) => {
    const counter = { value: 0 };
    gsap.to(counter, {
      value: Number.parseFloat(el.dataset.count) || 0, duration: 2.2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      onUpdate: () => { el.textContent = Math.floor(counter.value).toLocaleString('en-US'); },
    });
  });
}

// Botones magnéticos e inclinación 3D de las tarjetas (solo con mouse).
export function initMicroInteractions() {
  if (reduced || !finePointer) return;
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.25, duration: 0.4, ease: 'power3.out' });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' }));
  });
  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotateY: x * 8, rotateX: -y * 8, y: -6, transformPerspective: 800, duration: 0.4, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.6, ease: 'power3.out' }));
  });
}

export { ScrollTrigger };
