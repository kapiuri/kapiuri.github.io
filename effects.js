const btnTema = document.getElementById('btnTema');
const body = document.body;
const titulo = document.querySelector('.titulo');
const subtitulo = document.querySelector('.subtitulo');
const canvas = document.getElementById('fondo');
const ctx = canvas.getContext('2d');

let width, height;
function ajustarTamañoCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
ajustarTamañoCanvas();
window.addEventListener('resize', ajustarTamañoCanvas);

class Particula {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = height + Math.random() * 100;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = - (1 + Math.random() * 1.8);
    this.size = 1 + Math.random() * 3;
    this.life = 40 + Math.random() * 40;
    this.maxLife = this.life;
    this.alpha = 0;
    this.colorBase = this.randomColorBase();
    this.oscillation = Math.random() * 0.05 + 0.02;
    this.phase = Math.random() * Math.PI * 2;
  }
  randomColorBase() {
    if (body.classList.contains('dark-ages')) {
      // tonos fuego oscuro marrón/naranja
      const r = 190 + Math.floor(Math.random() * 60);
      const g = 60 + Math.floor(Math.random() * 50);
      const b = 20;
      return {r, g, b};
    } else {
      // tonos rojo fuego para Doom Eternal
      const r = 255;
      const g = 70 + Math.floor(Math.random() * 60);
      const b = 30;
      return {r, g, b};
    }
  }
  update() {
    this.x += this.vx + Math.sin(this.phase) * 0.5;
    this.y += this.vy;
    this.phase += this.oscillation;
    this.life--;
    this.alpha = Math.min(1, this.life / this.maxLife);
    if (this.life <= 0 || this.y < -10 || this.x < -10 || this.x > width + 10) {
      this.reset();
    }
  }
  draw(ctx) {
    const {r, g, b} = this.colorBase;
    const alpha = this.alpha * 0.7;
    const glowAlpha = this.alpha * 0.3;
    ctx.beginPath();
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.shadowColor = `rgba(${r},${g},${b},${glowAlpha})`;
    ctx.shadowBlur = this.size * 4;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

const particulas = [];
const maxParticulas = 150;

for (let i = 0; i < maxParticulas; i++) {
  particulas.push(new Particula());
}

function animar() {
  ctx.clearRect(0, 0, width, height);

  for (const p of particulas) {
    p.update();
    p.draw(ctx);
  }

  requestAnimationFrame(animar);
}
animar();

btnTema.addEventListener('click', () => {
  if (body.classList.contains('dark-ages')) {
    body.classList.remove('dark-ages');
    body.classList.add('doom-eternal');

    btnTema.textContent = 'Cambiar a Doom The Dark Ages';
    titulo.textContent = 'Galería Doom: Eternal';
    subtitulo.textContent = 'Furia, velocidad y caos infernal.';
  } else {
    body.classList.remove('doom-eternal');
    body.classList.add('dark-ages');

    btnTema.textContent = 'Cambiar a Doom Eternal';
    titulo.textContent = 'Galería Doom: The Dark Ages';
    subtitulo.textContent = 'Oscuridad, fuego y sombras del pasado.';
  }
});
