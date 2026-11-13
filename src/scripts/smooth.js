import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { reduced } from './util.js';

// Barra de progreso + scroll suave (Lenis) + anclas que usan el mismo scroll suave.
export function initSmooth() {
  const bar = document.getElementById('scrollProgress');
  if (bar) {
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = `${max > 0 ? (h.scrollTop / max) * 100 : 0}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
  if (reduced) return null;

  const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)), smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -72 });
    history.replaceState(null, '', a.getAttribute('href'));
  });
  return lenis;
}
