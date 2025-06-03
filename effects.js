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

// --- Clase que define cada partícula (spark) ---
class Spark {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * W;                // Posición inicial aleatoria X
    this.y = Math.random() * H;                // Posición inicial aleatoria Y
    this.length = 10 + Math.random() * 20;    // Longitud de la línea
    this.speed = 5 + Math.random() * 8;       // Velocidad de movimiento
    this.angle = Math.random() * 2 * Math.PI; // Ángulo de dirección (0 a 360 grados en radianes)
    this.size = 1 + Math.random() * 2;        // Grosor de línea
    this.alpha = 0.2 + Math.random() * 0.8;   // Transparencia
    this.color = `rgba(244, 67, 54, ${this.alpha})`;
    this.life = 40 + Math.random() * 60;      // Vida útil (cuánto dura antes de reiniciarse)
  }

  update() {
    // Actualiza posición en base al ángulo y velocidad
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.life--;  // Reduce vida

    // Si se sale de pantalla o muere, se reinicia
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H || this.life <= 0) {
      this.reset();
      this.y = H + 10;
    }
  }

  draw() {
    ctx.strokeStyle = this.color;      // Color de la línea
    ctx.lineWidth = this.size;         // Grosor de línea
    ctx.shadowColor = '#f44336';       // Sombra roja
    ctx.shadowBlur = 10;               // Difuminado sombra
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);        // Punto inicio línea (posición actual)
    ctx.lineTo(
      this.x - Math.cos(this.angle) * this.length,  // Punto final línea (detrás en dirección opuesta)
      this.y - Math.sin(this.angle) * this.length
    );
    ctx.stroke();                      // Dibuja la línea
  }
}

// --- Creación de todas las partículas ---
const sparks = [];
const maxSparks = 120;
for (let i = 0; i < maxSparks; i++) {
  sparks.push(new Spark());
}

// --- En el loop principal, actualizar y dibujar cada partícula ---
function loop() {
  ctx.clearRect(0, 0, W, H);

  // Fondo con degradado
  let gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, '#100000');
  gradient.addColorStop(1, '#000000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // Actualiza y dibuja cada partícula
  sparks.forEach((spark) => {
    spark.update();
    spark.draw();
  });

  requestAnimationFrame(loop);
}

loop();


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
