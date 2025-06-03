const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particulas = [];

for (let i = 0; i < 60; i++) {
  particulas.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 40 + 20,
    dx: (Math.random() - 0.5) * 0.2,
    dy: (Math.random() - 0.5) * 0.2,
    alpha: Math.random() * 0.5 + 0.2
  });
}

function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo semi-transparente para efecto de "persistencia"
  ctx.fillStyle = 'rgba(10, 15, 28, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particulas.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 210, 255, ${p.alpha})`;
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < -p.r) p.x = canvas.width + p.r;
    else if (p.x > canvas.width + p.r) p.x = -p.r;

    if (p.y < -p.r) p.y = canvas.height + p.r;
    else if (p.y > canvas.height + p.r) p.y = -p.r;
  });

  requestAnimationFrame(animar);
}

animar();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
