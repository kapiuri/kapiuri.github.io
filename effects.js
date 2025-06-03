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

// Partículas chisporroteantes estilo Doom Eternal, con colores marrones/óxido

class Chispa {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * W;
    this.y = H + Math.random() * 50;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = - (1 + Math.random() * 2);
    this.size = 1 + Math.random() * 2;
    this.life = 30 + Math.random() * 30;
    this.color = `rgba(${150 + Math.floor(Math.random() * 100)}, ${80 + Math.floor(Math.random() * 50)}, 30, 1)`; // marrones fuego
    this.alpha = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.alpha = this.life / 60;
    if (this.life <= 0 || this.y < -10 || this.x < -10 || this.x > W + 10) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();

    // Línea chispeante
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.vx * 5, this.y + this.vy * 5);
    ctx.stroke();
    ctx.restore();
  }
}

const chispas = [];
const maxChispas = 120;

for (let i = 0; i < maxChispas; i++) {
  chispas.push(new Chispa());
}

function loop() {
  // Fondo semitransparente para efecto de niebla oscura y atardecer marrón
  ctx.fillStyle = 'rgba(26, 16, 7, 0.8)';
  ctx.fillRect(0, 0, W, H);

  chispas.forEach(chispa => {
    chispa.update();
    chispa.draw();
  });

  requestAnimationFrame(loop);
}

loop();
