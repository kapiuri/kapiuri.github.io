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

// Partículas tipo ceniza / chispas de fuego lenta y humo

class Particula {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * W;
    this.y = H + 10 + Math.random() * 50;
    this.size = 1 + Math.random() * 3;
    this.speedY = 0.3 + Math.random() * 0.7;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.alpha = 0.3 + Math.random() * 0.6;
    this.life = 100 + Math.random() * 100;
    this.color = `rgba(210, 140, 75, ${this.alpha})`; // tonos ceniza/dorado
    this.smoke = Math.random() > 0.7; // si es humo o chispa
  }

  update() {
    this.x += this.speedX;
    this.y -= this.speedY;
    this.life--;

    if (this.y < -10 || this.life <= 0 || this.x < -10 || this.x > W + 10) {
      this.reset();
    }
  }

  draw() {
    if (this.smoke) {
      // Humo difuso
      let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 8);
      grad.addColorStop(0, `rgba(150, 120, 90, ${this.alpha * 0.15})`);
      grad.addColorStop(1, 'rgba(20, 15, 10, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.size * 8, this.size * 5, 0, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      // Chispa fuego pequeña
      ctx.fillStyle = this.color;
      ctx.shadowColor = 'rgba(210,140,75,0.7)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
}

const particulas = [];
const maxParticulas = 80;
for (let i = 0; i < maxParticulas; i++) {
  particulas.push(new Particula());
}

function loop() {
  // Fondo con tono oscuro rojizo opaco para efecto medieval
  ctx.fillStyle = 'rgba(26,16,7,0.7)';
  ctx.fillRect(0, 0, W, H);

  particulas.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(loop);
}

loop();
