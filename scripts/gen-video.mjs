// Genera public/video/nova-loop.mp4 y su póster a partir del arte del proyecto.
// Cada imagen hace un zoom/pan lento y se funde con la siguiente; el último fotograma coincide con el primero,
// así que el bucle no da saltos. Requiere ffmpeg en el PATH.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const art = ['hero-cat', 'stronghold-1', 'guardian', 'emblem', 'nebula'];
const FPS = 24, HOLD = 2.4, FADE = 0.8, W = 1280, H = 720;
mkdirSync('public/video', { recursive: true });

const frames = Math.round((HOLD + FADE) * FPS);
// Cada clip hace un paneo suave; la dirección alterna para dar variedad.
const dirs = ['x=(iw-iw/zoom)*on/N:y=ih/2-ih/zoom/2', 'x=(iw-iw/zoom)*(1-on/N):y=ih/2-ih/zoom/2', 'x=iw/2-iw/zoom/2:y=(ih-ih/zoom)*on/N', 'x=iw/2-iw/zoom/2:y=(ih-ih/zoom)*(1-on/N)', 'x=iw/2-iw/zoom/2:y=ih/2-ih/zoom/2'];
const inputs = [...art, art[0]]; // el último clip repite el primero
const args = [];
inputs.forEach((n) => args.push('-i', `src/assets/art/${n}.jpg`));

const f = inputs.map((_, i) => {
  const d = dirs[i % dirs.length].replaceAll('N', String(frames));
  return `[${i}:v]scale=2200:-1,zoompan=z='1.10+0.05*on/${frames}':${d}:d=${frames}:s=${W}x${H}:fps=${FPS},setsar=1,format=yuv420p[c${i}]`;
});
// Fundidos encadenados: salida = c0 xfade c1 xfade c2 ...
let chain = 'c0';
inputs.slice(1).forEach((_, i) => {
  const out = i === inputs.length - 2 ? 'out' : `x${i}`;
  const offset = ((i + 1) * HOLD).toFixed(2);
  f.push(`[${chain}][c${i + 1}]xfade=transition=fade:duration=${FADE}:offset=${offset}[${out}]`);
  chain = out;
});
// Se recorta el tramo inicial para que el primer y el último fotograma coincidan (bucle sin salto).
f.push(`[out]trim=start=${FADE}:end=${((inputs.length - 1) * HOLD + FADE).toFixed(2)},setpts=PTS-STARTPTS,format=yuv420p[v]`);

args.push('-filter_complex', f.join(';'), '-map', '[v]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', '-y', 'public/video/nova-loop.mp4');
execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', ...args], { stdio: 'inherit' });
execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', 'public/video/nova-loop.mp4', '-frames:v', '1', '-vf', 'scale=960:-1', '-y', 'public/video/poster.png'], { stdio: 'inherit' });
console.log('ok');
// Después: sharp public/video/poster.png -> poster.webp (calidad 55) y borrar el png.
