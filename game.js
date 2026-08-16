const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

canvas.width=innerWidth;
canvas.height=innerHeight;

let carColor="red";
let x=canvas.width/2;
let y=canvas.height-180;
let road=0;
let nitro=100;
let speed=0;
let timer=0;
let playing=false;
let boost=false;
let left=false;
let right=false;
let night=false;

const audio=new(window.AudioContext||window.webkitAudioContext)();
let osc;

document.querySelectorAll("#garage button").forEach(b=>{
b.onclick=()=>{
document.querySelectorAll("#garage button")
.forEach(x=>x.classList.remove("active"));
b.classList.add("active");
carColor=b.dataset.car;
};
});

document.getElementById("play").onclick=()=>{
document.getElementById("menu").style.display="none";
canvas.style.display="block";
document.getElementById("hud").style.display="flex";

if(innerWidth<700)
document.getElementById("mobile").style.display="flex";

playing=true;
audio.resume();
};

function engineStart(){

if(osc)return;

osc=audio.createOscillator();
const g=audio.createGain();

osc.type="sawtooth";
osc.frequency.value=120;

osc.connect(g);
g.connect(audio.destination);

g.gain.value=.04;

osc.start();

}

function engineStop(){

if(!osc)return;

osc.stop();
osc=null;

}

document.addEventListener("keydown",e=>{

if(e.key==="ArrowLeft")left=true;
if(e.key==="ArrowRight")right=true;
if(e.key==="Shift")boost=true;
if(e.key==="p")playing=!playing;
if(e.key==="n")night=!night;

engineStart();

});

document.addEventListener("keyup",e=>{

if(e.key==="ArrowLeft")left=false;
if(e.key==="ArrowRight")right=false;
if(e.key==="Shift")boost=false;

if(!left&&!right&&!boost)
engineStop();

});

document.getElementById("left").ontouchstart=()=>left=true;
document.getElementById("left").ontouchend=()=>left=false;

document.getElementById("right").ontouchstart=()=>right=true;
document.getElementById("right").ontouchend=()=>right=false;

document.getElementById("boost").ontouchstart=()=>boost=true;
document.getElementById("boost").ontouchend=()=>boost=false;

function drawCar(){

ctx.save();

ctx.translate(x,y);

ctx.fillStyle=carColor;
ctx.beginPath();
ctx.roundRect(-22,-45,44,90,12);
ctx.fill();

ctx.fillStyle="#87ceeb";
ctx.roundRect(-15,-22,30,22,6);
ctx.fill();

ctx.fillStyle="black";

ctx.beginPath();
ctx.arc(-22,-25,6,0,6.28);
ctx.arc(22,-25,6,0,6.28);
ctx.arc(-22,25,6,0,6.28);
ctx.arc(22,25,6,0,6.28);
ctx.fill();

if(boost&&nitro>0){

ctx.fillStyle="#00e5ff";

ctx.beginPath();
ctx.moveTo(-8,45);
ctx.lineTo(0,72);
ctx.lineTo(8,45);
ctx.fill();

}

ctx.restore();

}

function drawRoad(){

road+=boost?16:8;

ctx.fillStyle=night?"#111":"#444";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="white";
ctx.fillRect(90,0,8,canvas.height);
ctx.fillRect(canvas.width-98,0,8,canvas.height);

ctx.fillStyle="yellow";

for(let i=-40;i<canvas.height+40;i+=40)
ctx.fillRect(canvas.width/2-4,i+road%40,8,20);

}

function loop(){

requestAnimationFrame(loop);

if(!playing)return;

drawRoad();

if(left)x-=boost?9:6;
if(right)x+=boost?9:6;

x=Math.max(120,Math.min(canvas.width-120,x));

if(boost&&nitro>0){

speed=240;
nitro-=0.7;

}else{

speed=160;
nitro=Math.min(100,nitro+.15);

}

timer+=1/60;

drawCar();

document.getElementById("speed").textContent=Math.round(speed);
document.getElementById("nitro").textContent=Math.round(nitro);
document.getElementById("timer").textContent=timer.toFixed(1);

}

loop();