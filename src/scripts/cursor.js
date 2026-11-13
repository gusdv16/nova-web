import { reduced, finePointer } from './util.js';

// Cursor propio: anillo con retraso + punto. Crece sobre elementos interactivos y muestra
// una etiqueta (DRAG / PLAY) sobre los que tienen data-cursor.
export function initCursor() {
  if (reduced || !finePointer) return;
  const ring = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  const label = document.getElementById('cursorLabel');
  if (!ring || !dot) return;

  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, raf = 0;
  const loop = () => {
    cx += (mx - cx) * 0.16;
    cy += (my - cy) * 0.16;
    ring.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    raf = Math.abs(mx - cx) + Math.abs(my - cy) > 0.3 ? requestAnimationFrame(loop) : 0;
  };
  addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });

  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest('[data-cursor], a, button, .card');
    ring.classList.toggle('hover', !!t);
    const text = t?.dataset?.cursor;
    ring.classList.toggle('has-label', !!text);
    if (label) label.textContent = text || '';
  });
}
