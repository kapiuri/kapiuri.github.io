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

// Variables globales para ancho y alto
let W = window.innerWidth;
let H = window.innerHeight;

// Clase que define cada partícula (spark)
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
    ctx.lineTo(this.x - this.length * Math.cos(this.angle), this.y - this.length * Math.sin(this.angle));
    ctx.stroke();
  }
}

const sparks = [];
const maxSparks = 100;
for (let i = 0; i < maxSparks; i++) {
  sparks.push(new Spark());
}

function animar() {
  ctx.clearRect(0, 0, width, height);

  for (let spark of sparks) {
    spark.update();
    spark.draw(ctx);
  }

  requestAnimationFrame(animar);
}
animar();

// Función para cambiar tema
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

  // Actualizar variables de tamaño para las partículas al cambiar tema (opcional)
  W = window.innerWidth;
  H = window.innerHeight;
});


// === Menú desplegable para móviles ===
const btn = document.getElementById('menuToggle');
const menu = document.getElementById('menuLinks');

btn.addEventListener('click', () => {
  menu.classList.toggle('mostrar');
});