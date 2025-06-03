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

// Partículas (fuego oscuro para Dark Ages, fuego rojo para Doom Eternal)
class Particula {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = height + Math.random() * 100;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = - (1 + Math.random() * 1.5);
    this.size = 1 + Math.random() * 2;
    this.life = 30 + Math.random() * 30;
    this.color = this.randomColor();
  }
  randomColor() {
    if (body.classList.contains('dark-ages')) {
      // tonos fuego oscuro marrón/naranja
      const r = 180 + Math.floor(Math.random() * 75);
      const g = 50 + Math.floor(Math.random() * 40);
      const b = 20;
      return `rgba(${r},${g},${b},`;
    } else {
      // tonos rojo fuego para Doom Eternal
      const r = 255;
      const g = 50 + Math.floor(Math.random() * 50);
      const b = 20;
      return `rgba(${r},${g},${b},`;
    }
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    if (this.life <= 0 || this.y < 0 || this.x < 0 || this.x > width) {
      this.reset();
    }
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color + (this.life / 60) + ')';
    ctx.shadowColor = this.color + (this.life / 60) + ')';
    ctx.shadowBlur = 10;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

const particulas = [];
const maxParticulas = 120;

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
    // Cambiar a Doom Eternal
    body.classList.remove('dark-ages');
    body.classList.add('doom-eternal');

    btnTema.textContent = 'Cambiar a Doom The Dark Ages';
    titulo.textContent = 'Galería Doom: Eternal';
    subtitulo.textContent = 'Furia, velocidad y caos infernal.';
  } else {
    // Cambiar a Doom The Dark Ages
    body.classList.remove('doom-eternal');
    body.classList.add('dark-ages');

    btnTema.textContent = 'Cambiar a Doom Eternal';
    titulo.textContent = 'Galería Doom: The Dark Ages';
    subtitulo.textContent = 'Oscuridad, fuego y sombras del pasado.';
  }
});
