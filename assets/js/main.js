document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  if (window.gsap) {
    gsap.from('header', {y:-40, opacity:0, duration:0.6});
    gsap.from('main', {opacity:0, y:40, duration:0.8});
  }
});


// ==== Homepage logo intro (static) ====
document.addEventListener('DOMContentLoaded', () => {
  const darkGroup = document.getElementById('logo-dark');
  if (!darkGroup || !window.gsap) return;
  gsap.fromTo(darkGroup,
    { opacity: 0, scale: 0.95, transformOrigin: '50% 50%' },
    { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }
  );
});

// (Removed interactive cursor reveal; logo remains static after intro)

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
