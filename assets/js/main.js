document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  if (window.gsap) {
    gsap.from('header', {y:-40, opacity:0, duration:0.6});
    gsap.from('main', {opacity:0, y:40, duration:0.8});
  }
});


// ==== Stay Real: local darkening logo reveal (GSAP-powered) ====
document.addEventListener('DOMContentLoaded', () => {
  const svg = document.getElementById('stayreal-logo');
  const circle = document.getElementById('revealCore');
  const darkGroup = document.getElementById('logo-dark');
  const wrap = document.getElementById('logo-reveal');
  if (!svg || !circle || !darkGroup || !wrap || !window.gsap) return;

  // viewBox helpers (uniform scaling due to preserveAspectRatio="meet")
  const vb = svg.viewBox.baseVal; // {x,y,width,height}

  // Quick animators (GSAP only)
  const moveCX = gsap.quickTo(circle, 'cx', { duration: 0.35, ease: 'expo.out' });
  const moveCY = gsap.quickTo(circle, 'cy', { duration: 0.35, ease: 'expo.out' });
  const growR  = gsap.quickTo(circle, 'r',  { duration: 0.35, ease: 'expo.out' });
  const fadeLogo = gsap.quickTo(darkGroup, 'opacity', { duration: 0.25, ease: 'power2.out' });

  let rect = svg.getBoundingClientRect();

  function updateRect(){ rect = svg.getBoundingClientRect(); }
  window.addEventListener('resize', updateRect);
  window.addEventListener('scroll', updateRect, { passive: true });

  // Convert client (px) -> SVG user space (viewBox units)
  function clientToSVG(cx, cy){
    const scale = vb.width / rect.width; // uniform for meet
    const x = (cx - rect.left) * scale + vb.x;
    const y = (cy - rect.top)  * scale + vb.y;
    return { x, y, scale };
  }

  // Distance from pointer to the SVG rect (0 if inside)
  function distToRect(px, py){
    const dx = Math.max(rect.left - px, 0, px - rect.right);
    const dy = Math.max(rect.top  - py, 0, py - rect.bottom);
    return Math.hypot(dx, dy);
  }

  // Config knobs
  const REVEAL_RANGE = 260; // px around the logo where reveal starts
  const MIN_R_PX = 70;      // px (mapped to viewBox)
  const MAX_R_PX = 180;     // px (mapped to viewBox)
  const MAX_OPACITY = 1;    // cap the darkness

  // Track pointer and animate on move (GSAP does the easing)
  function handlePointer(e){
    const clientX = ('touches' in e && e.touches.length) ? e.touches[0].clientX : e.clientX;
    const clientY = ('touches' in e && e.touches.length) ? e.touches[0].clientY : e.clientY;

    const d = distToRect(clientX, clientY);
    const intensity = gsap.utils.clamp(0, 1, 1 - d / REVEAL_RANGE);

    // Convert to SVG coords
    const { x, y, scale } = clientToSVG(clientX, clientY);

    // Animate mask center to follow pointer
    moveCX(x);
    moveCY(y);

    // Animate radius and overall darkness based on proximity
    const rPx = gsap.utils.mapRange(0, 1, MIN_R_PX, MAX_R_PX, intensity);
    growR(rPx * scale);

    // Fade in/out the whole dark group (the mask feathers edges for partial reveal)
    fadeLogo(intensity * MAX_OPACITY);
  }

  // Idle: fade out if the pointer leaves the vicinity
  function handleLeave(){
    fadeLogo(0);
  }

  // Bind listeners globally so "coming closer" works even if not directly over the logo
  window.addEventListener('pointermove', handlePointer, { passive: true });
  window.addEventListener('pointerdown', handlePointer, { passive: true });
  window.addEventListener('pointerup', handlePointer, { passive: true });
  window.addEventListener('pointerleave', handleLeave, { passive: true });

  // Initial geometry & subtle intro
  updateRect();
  // Put the mask at the center initially and keep it hidden
  const center = clientToSVG(rect.left + rect.width / 2, rect.top + rect.height / 2);
  gsap.set(circle, { cx: center.x, cy: center.y, r: (MIN_R_PX * center.scale) });
  gsap.set(darkGroup, { opacity: 0 });
});

// ==== Background Starfield (GSAP) ====
document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap) return;

  const cvs = document.getElementById('bg-stars');
  if (!cvs) return;

  const ctx = cvs.getContext('2d', { alpha: true });
  let DPR = Math.min(window.devicePixelRatio || 1, 2);

  let W = 0, H = 0;
  let stars = [];
  let shooters = [];
  let rafAttached = false;

  function sizeCanvas(){
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    W = Math.floor(cssW * DPR);
    H = Math.floor(cssH * DPR);
    cvs.width = W;
    cvs.height = H;
    cvs.style.width = cssW + 'px';
    cvs.style.height = cssH + 'px';
  }

  function makeStars(){
    // Clean old tweens
    stars.forEach(s => s._tw && s._tw.kill());
    stars.length = 0;

    // Density scales with viewport size (bounded)
    const count = Math.round(
      gsap.utils.clamp(80, 220, (window.innerWidth * window.innerHeight) / 15000)
    );

    for (let i = 0; i < count; i++){
      const s = {
        x: Math.random() * W,
        y: Math.random() * H,
        r: (Math.random() * 1.2 + 0.4) * DPR,      // radius in device px
        alpha: gsap.utils.random(0.25, 0.9, 0.01), // initial brightness
      };
      // Twinkle tween (yoyo forever)
      s._tw = gsap.to(s, {
        alpha: () => gsap.utils.random(0.15, 0.95),
        duration: () => gsap.utils.random(1.2, 3.2),
        yoyo: true,
        repeat: -1,
        repeatDelay: () => gsap.utils.random(0, 1.5),
        ease: 'sine.inOut'
      });
      stars.push(s);
    }
  }

  function spawnShootingStar(){
    // Start near the top-left quadrant and fly to bottom-right
    const marginX = 0.1 * W;
    const marginY = 0.1 * H;

    const sx = gsap.utils.random(-marginX, 0.4 * W);
    const sy = gsap.utils.random(-marginY, 0.35 * H);

    // Direction: 20–35 degrees
    const deg = gsap.utils.random(20, 35);
    const theta = deg * Math.PI / 180;
    const dirx = Math.cos(theta);
    const diry = Math.sin(theta);

    // Compute how far to travel to exit the screen
    const targetX = W + marginX;
    const targetY = H + marginY;
    const fx = (targetX - sx) / dirx;     // distance needed to cross X bound
    const fy = (targetY - sy) / diry;     // distance needed to cross Y bound
    const pathLen = Math.max(fx, fy);     // enough to go offscreen

    const s = {
      sx, sy, dirx, diry, pathLen,
      t: 0,            // progress 0->1
      alpha: 0,
      width: gsap.utils.random(1, 2) * DPR,
      tail: gsap.utils.random(90, 180) * DPR
    };

    // Animate progress + alpha with a small ease-in/out
    s._tl = gsap.timeline({
      onComplete: () => {
        // remove from active shooters
        const idx = shooters.indexOf(s);
        if (idx >= 0) shooters.splice(idx, 1);
      }
    });
    const dur = gsap.utils.random(1.2, 2.0);
    s._tl
      .to(s, { t: 0.7, alpha: 1, duration: dur * 0.6, ease: 'power2.out' }, 0)
      .to(s, { t: 1.0, alpha: 0, duration: dur * 0.4, ease: 'power1.in'  }, 0);

    shooters.push(s);
  }

  function scheduleShooter(){
    // Spawn at random intervals
    gsap.delayedCall(gsap.utils.random(0.8, 2.6), () => {
      spawnShootingStar();
      scheduleShooter();
    });
  }

  function drawStars(){
    // Clear
    ctx.clearRect(0, 0, W, H);

    // Static stars (twinkling)
    ctx.fillStyle = '#000';
    for (let i = 0; i < stars.length; i++){
      const s = stars[i];
      // minor parallax drift could be added here if you want
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Shooting stars
    ctx.lineCap = 'round';
    for (let i = 0; i < shooters.length; i++){
      const sh = shooters[i];
      const headX = sh.sx + sh.dirx * sh.pathLen * sh.t;
      const headY = sh.sy + sh.diry * sh.pathLen * sh.t;
      const tailX = headX - sh.dirx * sh.tail;
      const tailY = headY - sh.diry * sh.tail;

      const grad = ctx.createLinearGradient(headX, headY, tailX, tailY);
      // Head brighter, tail fades out
      grad.addColorStop(0.0, `rgba(0,0,0,${Math.min(0.9, sh.alpha)})`);
      grad.addColorStop(1.0, `rgba(0,0,0,0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = sh.width;

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();

      // Small head dot
      ctx.fillStyle = `rgba(0,0,0,${Math.min(0.9, sh.alpha)})`;
      ctx.beginPath();
      ctx.arc(headX, headY, sh.width * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function rebuild(){
    sizeCanvas();
    makeStars();
  }

  // Attach to GSAP ticker once
  if (!rafAttached){
    gsap.ticker.add(drawStars);
    rafAttached = true;
  }

  // Initialize
  rebuild();
  scheduleShooter();

  // Handle resize / DPR changes
  let resizeId;
  window.addEventListener('resize', () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(rebuild, 150); // debounce for perf
  });

  // (Optional) also listen for zoom/DPR changes on some browsers
  matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`).addEventListener?.('change', rebuild);
});
// ==== Stay Real: local darkening logo reveal (GSAP-powered) ====
document.addEventListener('DOMContentLoaded', () => {
  const svg = document.getElementById('stayreal-logo');
  const circle = document.getElementById('revealCore');
  const darkGroup = document.getElementById('logo-dark');
  const wrap = document.getElementById('logo-reveal');
  if (!svg || !circle || !darkGroup || !wrap || !window.gsap) return;

  // viewBox helpers (uniform scaling due to preserveAspectRatio="meet")
  const vb = svg.viewBox.baseVal; // {x,y,width,height}

  // Quick animators (GSAP only)
  const moveCX = gsap.quickTo(circle, 'cx', { duration: 0.35, ease: 'expo.out' });
  const moveCY = gsap.quickTo(circle, 'cy', { duration: 0.35, ease: 'expo.out' });
  const growR  = gsap.quickTo(circle, 'r',  { duration: 0.35, ease: 'expo.out' });
  const fadeLogo = gsap.quickTo(darkGroup, 'opacity', { duration: 0.25, ease: 'power2.out' });

  let rect = svg.getBoundingClientRect();

  function updateRect(){ rect = svg.getBoundingClientRect(); }
  window.addEventListener('resize', updateRect);
  window.addEventListener('scroll', updateRect, { passive: true });

  // Convert client (px) -> SVG user space (viewBox units)
  function clientToSVG(cx, cy){
    const scale = vb.width / rect.width; // uniform for meet
    const x = (cx - rect.left) * scale + vb.x;
    const y = (cy - rect.top)  * scale + vb.y;
    return { x, y, scale };
  }

  // Distance from pointer to the SVG rect (0 if inside)
  function distToRect(px, py){
    const dx = Math.max(rect.left - px, 0, px - rect.right);
    const dy = Math.max(rect.top  - py, 0, py - rect.bottom);
    return Math.hypot(dx, dy);
  }

  // Config knobs
  const REVEAL_RANGE = 260; // px around the logo where reveal starts
  const MIN_R_PX = 70;      // px (mapped to viewBox)
  const MAX_R_PX = 180;     // px (mapped to viewBox)
  const MAX_OPACITY = 1;    // cap the darkness

  // Track pointer and animate on move (GSAP does the easing)
  function handlePointer(e){
    const clientX = ('touches' in e && e.touches.length) ? e.touches[0].clientX : e.clientX;
    const clientY = ('touches' in e && e.touches.length) ? e.touches[0].clientY : e.clientY;

    const d = distToRect(clientX, clientY);
    const intensity = gsap.utils.clamp(0, 1, 1 - d / REVEAL_RANGE);

    // Convert to SVG coords
    const { x, y, scale } = clientToSVG(clientX, clientY);

    // Animate mask center to follow pointer
    moveCX(x);
    moveCY(y);

    // Animate radius and overall darkness based on proximity
    const rPx = gsap.utils.mapRange(0, 1, MIN_R_PX, MAX_R_PX, intensity);
    growR(rPx * scale);

    // Fade in/out the whole dark group (the mask feathers edges for partial reveal)
    fadeLogo(intensity * MAX_OPACITY);
  }

  // Idle: fade out if the pointer leaves the vicinity
  function handleLeave(){
    fadeLogo(0);
  }

  // Bind listeners globally so "coming closer" works even if not directly over the logo
  window.addEventListener('pointermove', handlePointer, { passive: true });
  window.addEventListener('pointerdown', handlePointer, { passive: true });
  window.addEventListener('pointerup', handlePointer, { passive: true });
  window.addEventListener('pointerleave', handleLeave, { passive: true });

  // Initial geometry & subtle intro
  updateRect();
  // Put the mask at the center initially and keep it hidden
  const center = clientToSVG(rect.left + rect.width / 2, rect.top + rect.height / 2);
  gsap.set(circle, { cx: center.x, cy: center.y, r: (MIN_R_PX * center.scale) });
  gsap.set(darkGroup, { opacity: 0 });
});

function positionPhrase(){
  const cxCSS = CX / DPR;

  // was: Math.max(60, SIZE*0.16) and Math.max(72, SIZE*0.18)
  const offsetTop    = Math.max(110, SIZE * 0.26) / DPR;   // farther above the cube
  const offsetBottom = Math.max(130, SIZE * 0.30) / DPR;   // farther below the cube

  const topY = (CY - SIZE/2) / DPR - offsetTop;
  const bottomY = (CY + SIZE/2) / DPR + offsetBottom;

  // keep on-screen (optional safety)
  const topYSafe = Math.max(12, topY);
  const bottomYSafe = Math.min((H / DPR) - 24, bottomY);

  phraseTop.style.top = `${topYSafe}px`;
  phraseBottom.style.top = `${bottomYSafe}px`;
  phraseTop.style.left = `${cxCSS}px`;
  phraseBottom.style.left = `${cxCSS}px`;
}
