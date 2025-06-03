const canvas = document.getElementById('fondo');
const ctx = canvas.getContext('2d');

let W, H;
function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
}
resize();
window.addEventListener('resize', resize);

class Particula {
  constructor() {
    this.reset();
  }

  reset() {
    // Partículas nacen en la parte baja central o dispersas en la mitad inferior
    this.x = W / 2 + (Math.random() - 0.5) * 200;
    this.y = H * 0.8 + (Math.random() - 0.5) * 50;
    const speed = 0.5 + Math.random() * 2.5;
    const angle = Math.random() * 2 * Math.PI; // dirección aleatoria
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = 1 + Math.random() * 3;
    this.life = 60 + Math.random() * 40;
    this.color = `rgba(${180 + Math.floor(Math.random() * 75)}, ${90 + Math.floor(Math.random() * 60)}, 40, 1)`; // marrones naranjas
    this.alpha = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.alpha = this.life / 100;
    if (
      this.life <= 0 || 
      this.x < -50 || this.x > W + 50 || 
      this.y < -50 || this.y > H + 50
    ) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }
}

const particulas = [];
const maxParticulas = 150;

for (let i = 0; i < maxParticulas; i++) {
  particulas.push(new Particula());
}

function loop() {
  // Fondo con transparencia marrón oscuro para ambiente tétrico
  ctx.fillStyle = 'rgba(30, 18, 8, 0.85)';
  ctx.fillRect(0, 0, W, H);

  particulas.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(loop);
}

loop();
