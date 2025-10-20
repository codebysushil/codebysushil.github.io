const canvas2 = document.getElementById('anime');
const ctx2 = canvas.getContext('2d');
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = '-1';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.background = '#0f1720';

let snowflakes = [];
const numFlakes = 100;

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Snowflake {
  constructor(){
    this.reset();
  }
  reset(){
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 3 + 1;
    this.speedY = Math.random() * 1 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
  }
  update(){
    this.y += this.speedY;
    this.x += this.speedX;
    if(this.y > canvas.height){
      this.y = -this.radius;
      this.x = Math.random() * canvas.width;
    }
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fill();
  }
}

for(let i=0;i<numFlakes;i++) snowflakes.push(new Snowflake());

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let flake of snowflakes){
    flake.update();
    flake.draw();
  }
  requestAnimationFrame(animate);
}
animate();
