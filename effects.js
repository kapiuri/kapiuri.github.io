const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const lineas = [];

class Linea {
  constructor(y, amplitude, speed, phase, color) {
    this.y = y;
    this.amplitude = amplitude;
    this.speed = speed;
    this.phase = phase;
    this.color = color;
  }

  dibujar(t) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.color;
    let x0 = 0;
    ctx.moveTo(x0, this.y);

    for (let x = 0; x <= canvas.width; x += 5) {
      const y = this.y + this.amplitude * Math.sin((x * 0.02) + this.phase + t * this.speed);
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }
}

// Crear varias líneas con distintas propiedades
for (let i = 0; i < 12; i++) {
  lineas.push(new Linea(
    canvas.height / 2 + (i - 6) * 25,
    10 + Math.random() * 8,
    0.5 + Math.random() * 0.7,
    Math.random() * Math.PI * 2,
    `rgba(180, 180, 255, 0.1)`
  ));
}

function animar(t = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo semi-transparente para dejar rastro muy sutil
  ctx.fillStyle = 'rgba(10, 15, 28, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  lineas.forEach(linea => linea.dibujar(t / 1000));

  requestAnimationFrame(animar);
}

animar();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
