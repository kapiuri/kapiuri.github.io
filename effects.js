const canvas = document.getElementById('fondo');
const ctx = canvas.getContext('2d');

let W, H;
function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
}
window.addEventListener('resize', resize);
resize();

// Simple fire effect example (you can improve this)
function draw() {
  ctx.clearRect(0, 0, W, H);
  // (For demo, just draw some flickering orange-red rectangles)
  const flameCount = 30;
  for(let i=0; i < flameCount; i++){
    const x = Math.random()*W;
    const y = H - Math.random()*100;
    const size = Math.random()*30 + 10;
    const r = 255;
    const g = Math.floor(50 + Math.random()*150);
    const b = 0;
    ctx.fillStyle = `rgba(${r},${g},${b},${Math.random()})`;
    ctx.beginPath();
    ctx.ellipse(x, y, size/2, size, 0, 0, Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
draw();

// Cambiar tema con botón
const btnTema = document.getElementById('btnTema');
const body = document.body;

btnTema.addEventListener('click', () => {
  if(body.classList.contains('dark-ages')) {
    body.classList.remove('dark-ages');
    body.classList.add('doom-eternal');
    btnTema.textContent = 'Cambiar a The Dark Ages';
    // Cambiar título y subtitulo
    document.querySelector('.titulo').textContent = 'Galería Doom: Eternal';
    document.querySelector('.subtitulo').textContent = 'Furia, sangre y fuego del infierno moderno.';
  } else {
    body.classList.remove('doom-eternal');
    body.classList.add('dark-ages');
    btnTema.textContent = 'Cambiar a Doom Eternal';
    document.querySelector('.titulo').textContent = 'Galería Doom: The Dark Ages';
    document.querySelector('.subtitulo').textContent = 'Oscuridad, fuego y sombras del pasado.';
  }
});
