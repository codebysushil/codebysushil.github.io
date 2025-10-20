const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = '-1';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.background = '#0f1720';

let stars = [];
const numStars = 150;

// Resize
function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Star class
class Star {
  constructor(){
    this.reset();
  }
  reset(){
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5;
    this.alpha = Math.random();
    this.speed = 0.002 + Math.random() * 0.02;
  }
  twinkle(){
    this.alpha += this.speed;
    if(this.alpha >= 1 || this.alpha <= 0){
      this.speed *= -1;
    }
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
}

// Create stars
for(let i=0;i<numStars;i++) stars.push(new Star());

// Animate
function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let s of stars){
    s.twinkle();
    s.draw();
  }
  requestAnimationFrame(animate);
}
animate();
