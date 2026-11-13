import { reduced } from './util.js';

// Pantalla de carga: se cierra cuando están listas la imagen principal y las fuentes
// (con un mínimo para que se vea y un máximo para que nunca quede trabada).
export function initPreloader() {
  return new Promise((resolve) => {
    const pre = document.getElementById('preloader');
    const bar = pre?.querySelector('.preloader-bar span');
    const setBar = (v) => { if (bar) bar.style.width = `${v}%`; };

    const hero = document.querySelector('.hero-bg img');
    const heroReady = !hero || hero.complete
      ? Promise.resolve()
      : new Promise((r) => { hero.addEventListener('load', r, { once: true }); hero.addEventListener('error', r, { once: true }); });
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    const min = new Promise((r) => setTimeout(r, reduced ? 0 : 300));
    const max = new Promise((r) => setTimeout(r, 2500));

    let p = 0;
    const tick = setInterval(() => { p = Math.min(90, p + 8 + Math.random() * 6); setBar(p); }, 90);

    Promise.race([Promise.all([heroReady, fonts, min]), max]).then(() => {
      clearInterval(tick);
      setBar(100);
      setTimeout(() => {
        pre?.classList.add('done');
        document.body.classList.add('loaded');
        document.documentElement.classList.remove('js-pre');
        resolve();
      }, 200);
    });
  });
}
