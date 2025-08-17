document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  if (window.gsap) {
    gsap.from('header', {y:-40, opacity:0, duration:0.6});
    gsap.from('main', {opacity:0, y:40, duration:0.8});
  }
});
