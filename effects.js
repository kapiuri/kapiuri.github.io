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

// Partículas rápidas tipo chispas y líneas

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

    if (
      this.x < 0 || this.x > W ||
      this.y < 0 || this.y > H ||
      this.life <= 0
    ) {
      this.reset();
      this.y = H + 10;
    }
  }

  draw() {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size;
    ctx.shadowColor = '#f44336';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x - Math.cos(this.angle) * this.length,
      this.y - Math.sin(this.angle) * this.length
    );
    ctx.stroke();
  }
}

const sparks = [];
const maxSparks = 120;
for (let i = 0; i < maxSparks; i++) {
  sparks.push(new Spark());
}

function loop() {
  ctx.clearRect(0, 0, W, H);

  // Fondo con gradiente oscuro intenso
  let gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, '#100000');
  gradient.addColorStop(1, '#000000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  sparks.forEach((spark) => {
    spark.update();
    spark.draw();
  });

  requestAnimationFrame(loop);
}

loop();