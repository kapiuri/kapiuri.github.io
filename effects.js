const btnTema = document.getElementById('btnTema');
const body = document.body;
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

// Variables globales
let W = window.innerWidth;
let H = window.innerHeight;

// ==========================
// EFECTO 1: CHISPAS (doom-eternal)
// ==========================
class Spark {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.length = 10 + Math.random() * 20;
    this.speed = 5 + Math.random() * 8;
    this.angle = Math.random() * 2 * Math.PI;
    this.size = 1 + Math.random() * 2;
    this.alpha = 0.2 + Math.random() * 0.8;
    this.color = `rgba(244, 67, 54, ${this.alpha})`;
    this.life = 40 + Math.random() * 60;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.life--;
    if (this.life <= 0 || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x - this.length * Math.cos(this.angle),
      this.y - this.length * Math.sin(this.angle)
    );
    ctx.stroke();
  }
}

// ==========================
// EFECTO 2: TORMENTA DE ARENA (dark-ages)
// ==========================
class Dust {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.speedX = 0.5 + Math.random();
    this.speedY = 0.2 + Math.random() * 0.3;
    this.size = 1 + Math.random() * 2;
    this.alpha = 0.05 + Math.random() * 0.1;
    this.color = `rgba(194, 178, 128, ${this.alpha})`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > W || this.y > H) {
      this.reset();
      this.x = 0;
      this.y = Math.random() * H;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Instancias
const sparks = [];
const dusts = [];
const maxSparks = 100;
const maxDust = 150;

for (let i = 0; i < maxSparks; i++) sparks.push(new Spark());
for (let i = 0; i < maxDust; i++) dusts.push(new Dust());

function animar() {
  ctx.clearRect(0, 0, width, height);

  if (body.classList.contains('doom-eternal')) {
    for (let spark of sparks) {
      spark.update();
      spark.draw(ctx);
    }
  } else if (body.classList.contains('dark-ages')) {
    for (let dust of dusts) {
      dust.update();
      dust.draw(ctx);
    }
  }

  requestAnimationFrame(animar);
}
animar();

// Tema toggle
btnTema.addEventListener('click', () => {
  if (body.classList.contains('dark-ages')) {
    body.classList.remove('dark-ages');
    body.classList.add('doom-eternal');
    btnTema.textContent = 'Cambiar a Dark Ages';
  } else {
    body.classList.remove('doom-eternal');
    body.classList.add('dark-ages');
    btnTema.textContent = 'Cambiar a Doom Eternal';
  }

  W = window.innerWidth;
  H = window.innerHeight;
});
