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
