/* CURSOR */
const dot=document.getElementById('dot'),ring=document.getElementById('ring');
let mx=0,my=0,rx=0,ry=0;
if(window.matchMedia('(hover:hover)').matches){
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    dot.style.left=mx+'px';dot.style.top=my+'px';
  });
  (function tr(){rx+=(mx-rx)*.11;ry+=(my-ry)*.11;
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    requestAnimationFrame(tr);
  })();
}

/* LOADER */
let p=0;
const lp=document.getElementById('lprog'),lpc=document.getElementById('lpct'),ld=document.getElementById('loader');
const li=setInterval(()=>{
  p+=Math.random()*8+2;
  if(p>=100){p=100;clearInterval(li);setTimeout(()=>ld.classList.add('out'),500)}
  lp.style.width=Math.min(p,100)+'%';
  lpc.textContent=Math.floor(Math.min(p,100))+'%';
},65);

/* CANVAS PARTICLES */
const cvs=document.getElementById('cvs'),cx=cvs.getContext('2d');
let W,H,pts=[];
const resize=()=>{W=cvs.width=innerWidth;H=cvs.height=innerHeight;
  pts=Array.from({length:60},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*.8+.2}));
};
resize();window.addEventListener('resize',resize);
(function draw(){
  cx.clearRect(0,0,W,H);
  pts.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0)p.x=W;if(p.x>W)p.x=0;
    if(p.y<0)p.y=H;if(p.y>H)p.y=0;
    cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);
    cx.fillStyle='rgba(79,255,176,.35)';cx.fill();
  });
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
    const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
    if(d<100){cx.beginPath();cx.moveTo(pts[i].x,pts[i].y);cx.lineTo(pts[j].x,pts[j].y);
      cx.strokeStyle=`rgba(0,180,255,${(1-d/100)*.07})`;cx.lineWidth=.5;cx.stroke()}
  }
  requestAnimationFrame(draw);
})();

/* NAV */
const nav=document.getElementById('nav');
let lastY=0;
window.addEventListener('scroll',()=>{
  const y=scrollY;
  nav.classList.toggle('solid',y>40);
  if(y>lastY+8&&y>100)nav.classList.add('up');
  else if(y<lastY)nav.classList.remove('up');
  lastY=y;
},{passive:true});

/* DRAWER */
const hbg=document.getElementById('hbg'),drawer=document.getElementById('drawer');
let open=false;
const tog=v=>{open=v;hbg.classList.toggle('x',v);drawer.classList.toggle('open',v);hbg.setAttribute('aria-expanded',v);document.body.style.overflow=v?'hidden':''};
hbg.addEventListener('click',()=>tog(!open));
drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>tog(false)));

/* TYPED */
const words=['Python Developer','Problem Solver','CS Student','Future Engineer','Data Explorer'];
let wi=0,ci=0,del=false;
const tel=document.getElementById('typed');
(function type(){
  const w=words[wi];
  tel.textContent=del?w.slice(0,--ci):w.slice(0,++ci);
  if(!del&&ci===w.length){del=true;setTimeout(type,1500);return}
  if(del&&ci===0){del=false;wi=(wi+1)%words.length}
  setTimeout(type,del?50:95);
})();

/* REVEAL */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.classList.add('in');
    e.target.querySelectorAll('.sk-fill').forEach(b=>b.style.width=b.dataset.w+'%');
    e.target.querySelectorAll('[data-target]').forEach(el=>{
      const tgt=+el.dataset.target,dur=1300;let s=null;
      (function cnt(ts){if(!s)s=ts;const prog=Math.min((ts-s)/dur,1);
        el.textContent=Math.floor(prog*tgt);if(prog<1)requestAnimationFrame(cnt);else el.textContent=tgt;
      })(performance.now());
    });
    obs.unobserve(e.target);
  });
},{threshold:.1,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.rv').forEach(el=>obs.observe(el));

/* PROFILE CARD TILT — desktop only */
const card=document.querySelector('.profile-card');
if(card&&window.matchMedia('(hover:hover)').matches){
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(700px) rotateY(${x*8}deg) rotateX(${-y*8}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave',()=>card.style.transform='');
}