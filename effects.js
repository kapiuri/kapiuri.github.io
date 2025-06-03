const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const PARTICULAS = 120;
const particulas = [];

class Particula {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = 1 + Math.random() * 3;
    this.speedX = (Math.random() - 0.5) * 1.5;
    this.speedY = -(1 + Math.random() * 1.5);
    this.alpha = 0.2 + Math.random() * 0.5;
    this.alphaChange = 0.005 + Math.random() * 0.01;
    this.alphaIncreasing = Math.random() > 0.5;
    this.color = `rgba(${200 + Math.floor(Math.random() * 55)}, 0, 0, ${this.alpha})`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.alphaIncreasing) {
      this.alpha += this.alphaChange;
      if (this.alpha >= 0.8) this.alphaIncreasing = false;
    } else {
      this.alpha -= this.alphaChange;
      if (this.alpha <= 0.2) this.alphaIncreasing = true;
    }

    if (this.y < -this.size || this.x < -this.size || this.x > canvas.width + this.size) {
      this.reset();
      this.y = canvas.height + Math.random() * 50;
    }
  }

  dibujar() {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
    gradient.addColorStop(0, `rgba(255, 60, 60, ${this.alpha})`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.shadowColor = `rgba(255, 50, 50, ${this.alpha})`;
    ctx.shadowBlur = 10;
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
  ctx.fillStyle = 'rgba(18, 0, 0, 0.3)';
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
