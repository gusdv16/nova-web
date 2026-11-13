import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initPreloader } from './preloader.js';
import { initSmooth } from './smooth.js';
import { initHeroTitle } from './hero-title.js';
import { initReveals, initScrollEffects, initMicroInteractions } from './effects.js';
import { initStarfield } from './starfield.js';
import { initCursor } from './cursor.js';
import { initMenu } from './menu.js';

gsap.registerPlugin(ScrollTrigger);

// Lo que se ve al cargar arranca enseguida; lo demás se prepara cuando el navegador está en reposo.
function boot() {
  const playTitle = initHeroTitle();
  const loaded = initPreloader();

  initSmooth();
  initCursor();
  initMenu();
  initReveals();
  initScrollEffects();
  initMicroInteractions();
  initStarfield();

  loaded.then(() => {
    playTitle();
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
    idle(async () => {
      const lazy = await import('./lazy.js');
      lazy.initMarquee();
      lazy.initScrubText();
      lazy.initSlider();
      lazy.initVideo();
      lazy.initFx();
      ScrollTrigger.refresh();
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
