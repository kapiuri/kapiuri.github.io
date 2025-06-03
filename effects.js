const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const PARTICULAS = 100;
const particulas = [];

class Particula {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = 1 + Math.random() * 2;
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.speedY = (Math.random() - 0.5) * 0.2;
    this.alpha = 0.1 + Math.random() * 0.3;
    this.alphaChange = (Math.random() * 0.005) + 0.001;
    this.alphaIncreasing = true;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;

    // Oscilar alpha para efecto de brillo
    if (this.alphaIncreasing) {
      this.alpha += this.alphaChange;
      if (this.alpha >= 0.4) this.alphaIncreasing = false;
    } else {
      this.alpha -= this.alphaChange;
      if (this.alpha <= 0.1) this.alphaIncreasing = true;
    }
  }

  dibujar() {
    ctx.beginPath();
    ctx.fillStyle = `rgba(180, 180, 255, ${this.alpha})`;
    ctx.shadowColor = `rgba(180, 180, 255, ${this.alpha})`;
    ctx.shadowBlur = 8;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Crear partículas
for (let i = 0; i < PARTICULAS; i++) {
  particulas.push(new Particula());
}

function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(10, 15, 28, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particulas.forEach(p => {
    p.update();
    p.dibujar();
  });

  requestAnimationFrame(animar);
}

animar();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
