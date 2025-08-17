
// ======= Ripple + Magnetic nav =======
(function(){
  const pills = Array.from(document.querySelectorAll('.pill'));
  function ripple(e){
    const el = e.currentTarget; const rect = el.getBoundingClientRect();
    const s = Math.max(rect.width, rect.height); const span = document.createElement('span');
    span.style.position='absolute'; span.style.left=(e.clientX-rect.left-s/2)+'px'; span.style.top=(e.clientY-rect.top-s/2)+'px';
    span.style.width=span.style.height=s+'px'; span.style.borderRadius='50%'; span.style.pointerEvents='none';
    span.style.background='radial-gradient(circle, rgba(255,210,120,.5) 0%, rgba(255,160,60,.35) 40%, rgba(16,20,50,0) 70%)';
    span.style.transform='scale(.2)'; span.style.opacity='0.9'; span.style.transition='transform .6s ease, opacity .7s ease';
    el.style.position='relative'; el.style.overflow='hidden'; el.appendChild(span);
    requestAnimationFrame(()=>{ span.style.transform='scale(1.8)'; span.style.opacity='0'; });
    setTimeout(()=>span.remove(), 700);
  }
  pills.forEach(el=> el.addEventListener('click', ripple));

  let mx=0,my=0; let raf=0;
  function onMove(e){ mx = e.clientX|| (e.touches&&e.touches[0].clientX)||mx; my = e.clientY||(e.touches&&e.touches[0].clientY)||my; if(!raf) raf=requestAnimationFrame(applyMagnet); }
  function applyMagnet(){
    raf=0;
    pills.forEach(el=>{
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width*0.5; const cy = r.top + r.height*0.5;
      const dx = mx - cx, dy = my - cy; const d = Math.hypot(dx,dy) || 1;
      const influence = Math.max(0, 1 - d/260);
      const tx = dx * 0.06 * influence; const ty = dy * 0.06 * influence;
      el.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  }
  window.addEventListener('mousemove', onMove, {passive:true});
  window.addEventListener('touchmove', onMove, {passive:true});
  window.addEventListener('mouseleave', ()=>{ pills.forEach(el=> el.style.transform=''); });
})();

// ======= STARFIELD + STARFALL (heavier meteors in background) =======
(function(){
  const canvas = document.getElementById('bg');
  if(!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let W=0, H=0, last=performance.now();
  let stars=[]; let fallers=[];
  const mouse = {x:0, y:0, active:false};

  function resize(){
    W = canvas.width = Math.floor(window.innerWidth*DPR);
    H = canvas.height= Math.floor(window.innerHeight*DPR);
    canvas.style.width = window.innerWidth+'px';
    canvas.style.height= window.innerHeight+'px';

    const area = (W*H)/(1920*1080);
    const starCount = Math.max(420, Math.min(1200, Math.floor(720*area))); // denser
    stars = new Array(starCount).fill(0).map(()=>makeStar());
    fallers = []; // reset meteors
    // seed a few meteors
    for(let i=0;i<Math.floor(3+6*area);i++) spawnFaller(true);
  }

  function makeStar(){
    const z = Math.random()*1 + 0.3; // depth
    return {
      x: Math.random()*W, y: Math.random()*H, z,
      r: (Math.random()*1.0 + 0.4)*DPR*z*0.55,
      tw: Math.random()*Math.PI*2,
      spx: (Math.random()*0.06 + 0.02)*z, // drift
      spy: (Math.random()*0.06 + 0.02)*z
    };
  }

  function spawnFaller(seed){
    // spawn near top-left area for a diagonal "rain"
    const x = (Math.random()*W*0.7 - 40*DPR);
    const y = (-20 - Math.random()*200) * DPR;
    const speed = (1.5 + Math.random()*2.5) * DPR;
    const ang = Math.PI/2 + Math.PI/6; // mostly downward-right
    const vx = Math.cos(ang) * speed * (0.7+Math.random()*0.6);
    const vy = Math.sin(ang) * speed;
    const len = (20 + Math.random()*40) * DPR;
    const life = seed? (0.4+Math.random()*0.6) : 1;
    fallers.push({x,y,vx,vy,len,life});
  }

  function onMove(e){
    const x = (e.clientX || (e.touches && e.touches[0].clientX) || 0) * DPR;
    const y = (e.clientY || (e.touches && e.touches[0].clientY) || 0) * DPR;
    mouse.x = x; mouse.y = y; mouse.active = true;
  }
  window.addEventListener('mousemove', onMove, {passive:true});
  window.addEventListener('touchmove', onMove, {passive:true});
  window.addEventListener('mouseleave', ()=>mouse.active=false);
  window.addEventListener('resize', resize);

  function step(dt){
    for(let s of stars){ s.tw += 0.02 + s.z*0.015; s.x += s.spx*0.16; s.y += s.spy*0.08; if(s.x > W) s.x -= W; if(s.y > H) s.y -= H; }
    // spawn more fallers proportional to time step
    const chance = 0.028 * (dt/16);
    if(Math.random() < chance) spawnFaller(false);
    // update fallers
    fallers.forEach(f=>{ f.x += f.vx*dt*0.06; f.y += f.vy*dt*0.06; f.life *= 0.992; });
    fallers = fallers.filter(f=> f.life>0.06 && f.x>-100 && f.x<W+100 && f.y< H+120);
  }

  function render(){
    ctx.globalCompositeOperation='source-over';
    ctx.fillStyle = 'rgba(0,0,0,0.74)';
    ctx.fillRect(0,0,W,H);

    ctx.globalCompositeOperation='screen';
    // stars
    for(let s of stars){
      const parX = ((mouse.x/W)-0.5) * 6 * s.z;
      const parY = ((mouse.y/H)-0.5) * 6 * s.z;
      const x = s.x + parX; const y = s.y + parY;
      const a = 0.4 + 0.6*Math.sin(s.tw);
      ctx.fillStyle = `rgba(255,255,255,${0.16+0.32*a})`;
      ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI*2); ctx.fill();
    }

    // meteors
    ctx.lineCap='round';
    for(const f of fallers){
      const ang = Math.atan2(f.vy, f.vx);
      const x2 = f.x - Math.cos(ang)*f.len;
      const y2 = f.y - Math.sin(ang)*f.len;
      const grad = ctx.createLinearGradient(f.x, f.y, x2, y2);
      grad.addColorStop(0, `rgba(255,255,255,${0.95*f.life})`);
      grad.addColorStop(1, 'rgba(180,200,255,0)');
      ctx.lineWidth = 1.6*DPR;
      ctx.strokeStyle = grad;
      ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(x2, y2); ctx.stroke();
    }
  }

  function frame(now){ const dt = Math.min(60, now-last); last = now; step(dt); render(); requestAnimationFrame(frame); }
  resize(); requestAnimationFrame(frame);
})();

// ======= Warm Spotlight + Comet Trail (foreground) =======
(function(){
  const canvas = document.getElementById('fx');
  if(!canvas) return;
  const ctx = canvas.getContext('2d', { alpha:true });
  const DPR = Math.min(window.devicePixelRatio||1, 2);
  let W=0, H=0, last=performance.now();
  const mouse = {x:0, y:0, vx:0, vy:0, active:false};
  let trail=[]; const TRAIL_MAX=26;

  function resize(){ W = canvas.width = Math.floor(window.innerWidth*DPR); H = canvas.height= Math.floor(window.innerHeight*DPR); canvas.style.width = window.innerWidth+'px'; canvas.style.height= window.innerHeight+'px'; }

  function onMove(e){
    const x = (e.clientX || (e.touches&&e.touches[0].clientX) || mouse.x) * DPR;
    const y = (e.clientY || (e.touches&&e.touches[0].clientY) || mouse.y) * DPR;
    mouse.vx = x - mouse.x; mouse.vy = y - mouse.y; mouse.x = x; mouse.y = y; mouse.active=true;
    trail.push({x, y, life:1}); if(trail.length>TRAIL_MAX) trail.shift();
  }
  window.addEventListener('mousemove', onMove, {passive:true});
  window.addEventListener('touchmove', onMove, {passive:true});
  window.addEventListener('mouseleave', ()=> mouse.active=false);
  window.addEventListener('resize', resize);

  function step(dt){ for(const t of trail){ t.life *= 0.94; } trail = trail.filter(t=> t.life>0.04); }

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.globalCompositeOperation='screen';

    // warm spotlight around cursor
    const speed = Math.hypot(mouse.vx, mouse.vy);
    const baseR = Math.min(W,H) * 0.18;
    const r = baseR + Math.min(320*DPR, speed*1.1);
    const gx = mouse.active ? mouse.x : W*0.5;
    const gy = mouse.active ? mouse.y : H*0.5;

    const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
    g.addColorStop(0.0, 'rgba(255,242,195,0.95)');   // warm core
    g.addColorStop(0.35,'rgba(255,214,140,0.65)');   // amber
    g.addColorStop(0.7, 'rgba(255,170,80,0.20)');    // soft orange
    g.addColorStop(1.0, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(gx, gy, r, 0, Math.PI*2); ctx.fill();

    // comet trail on cursor
    for(const t of trail){
      const rr = 10*DPR * t.life * 2.2;
      const gt = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, rr);
      gt.addColorStop(0, 'rgba(255,230,160,'+(0.55*t.life)+')');
      gt.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gt; ctx.beginPath(); ctx.arc(t.x, t.y, rr, 0, Math.PI*2); ctx.fill();
    }
  }

  function frame(now){ const dt = Math.min(60, now-last); last = now; step(dt); draw(); requestAnimationFrame(frame); }
  resize(); requestAnimationFrame(frame);
})();

// ======= 2D LOGO Canvas (pure white; page-wide control; elongated reveal) =======
(function(){
  const canvas = document.getElementById('logo');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio||1, 2);

  let W=0, H=0, fontSize=160; const TEXT='Stay Real';
  const mouseWin = {x: null, y: null, active:false};

  function resize(){
    const cssW = Math.min(1100, window.innerWidth*0.92);
    const cssH = Math.max(160, Math.min(260, cssW*0.24));
    W = canvas.width = Math.floor(cssW*DPR);
    H = canvas.height= Math.floor(cssH*DPR);
    canvas.style.width = cssW+'px';
    canvas.style.height= cssH+'px';
    fontSize = Math.floor(H*0.62);
  }

  function onMove(e){ const t=e.touches&&e.touches[0]; mouseWin.x=(t?t.clientX:e.clientX); mouseWin.y=(t?t.clientY:e.clientY); mouseWin.active=true; }
  window.addEventListener('mousemove', onMove, {passive:true});
  window.addEventListener('touchmove', onMove, {passive:true});
  window.addEventListener('mouseleave', ()=>{ mouseWin.active=false; });
  window.addEventListener('resize', resize);

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.save();
    ctx.font = `900 ${fontSize}px Orbitron, Outfit, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const cx = W/2, cy = H/2 + fontSize*0.08;

    // map window cursor to logo canvas coords
    const rect = canvas.getBoundingClientRect();
    let lx = -9999, ly = -9999;
    if(mouseWin.active && mouseWin.x!=null){ lx = (mouseWin.x - rect.left) * DPR; ly = (mouseWin.y - rect.top) * DPR; }

    // elongated reveal
    const dx = lx - cx, dy = ly - cy; const rx = W*0.65, ry = H*0.85; const nd = Math.sqrt((dx*dx)/(rx*rx) + (dy*dy)/(ry*ry));
    let alpha = Math.max(0, 1 - nd); alpha = Math.pow(alpha, 1.6);

    // 2D face only
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = `rgba(255,255,255,${0.25*alpha})`;
    ctx.lineWidth = 1.2*DPR;
    ctx.fillText(TEXT, cx, cy);
    ctx.strokeText(TEXT, cx, cy);

    // warm specular glow overlay (flat, no depth)
    if(alpha>0){
      const glint = ctx.createRadialGradient(lx, ly, 0, lx, ly, fontSize*0.42);
      glint.addColorStop(0, `rgba(255,240,190,${0.38*alpha})`);
      glint.addColorStop(1, 'rgba(255,240,190,0)');
      ctx.fillStyle = glint; ctx.beginPath(); ctx.arc(lx, ly, fontSize*0.46, 0, Math.PI*2); ctx.fill();
    }

    ctx.restore();
  }

  function frame(){ draw(); requestAnimationFrame(frame); }
  resize(); requestAnimationFrame(frame);
})();

// Year
(document.getElementById('year')||{}).textContent = new Date().getFullYear();
