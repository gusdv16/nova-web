import { gsap } from 'gsap';
import { reduced } from './util.js';

// Parte el título del hero en palabras y letras recorriendo el DOM (respeta los <br>).
// Devuelve una función `play()` para lanzar la entrada cuando termina el preloader.
export function initHeroTitle() {
  const title = document.querySelector('.hero-title');
  if (!title) return () => {};
  title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());

  [...title.childNodes].forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE) return;
    const frag = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((token) => {
      if (!token) return;
      if (/^\s+$/.test(token)) { frag.append(' '); return; }
      const word = document.createElement('span');
      word.className = 'word';
      word.setAttribute('aria-hidden', 'true');
      [...token].forEach((ch) => {
        const c = document.createElement('span');
        c.className = 'char';
        c.textContent = ch;
        word.append(c);
      });
      frag.append(word);
    });
    node.replaceWith(frag);
  });

  if (reduced) return () => {};
  const chars = title.querySelectorAll('.char');
  gsap.set(chars, { opacity: 0, y: 60 });
  return () => gsap.to(chars, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.028 });
}
