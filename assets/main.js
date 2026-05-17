// ── Nav scroll ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Active nav link ──
(function () {
  const path = window.location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '');
    if (href === path || (href !== '' && path.startsWith(href))) {
      a.classList.add('active');
    }
  });
})();

// ── Reveal on scroll ──
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(r => io.observe(r));

// ── Nav more dropdown ──
function toggleNavMore() {
  document.getElementById('nav-more').classList.toggle('open');
}
document.addEventListener('click', function (e) {
  const m = document.getElementById('nav-more');
  if (m && !m.contains(e.target)) m.classList.remove('open');
});
document.querySelectorAll('.nav-dropdown a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('nav-more').classList.remove('open'));
});

// ── Sticky bar ──
(function () {
  const bar = document.getElementById('sticky-bar');
  if (!bar) return;
  const hero = document.querySelector('.page-header') || document.querySelector('.hero');
  let dismissed = false;
  if (hero) {
    const ob = new IntersectionObserver(entries => {
      entries.forEach(e => { if (!dismissed) bar.classList.toggle('visible', !e.isIntersecting); });
    }, { threshold: 0 });
    ob.observe(hero);
  }
  const closeBtn = bar.querySelector('.sticky-close');
  if (closeBtn) closeBtn.addEventListener('click', () => {
    dismissed = true;
    bar.classList.remove('visible');
    bar.style.display = 'none';
  });
})();

// ── Custom cursor ──
(function () {
  const cursorRing = document.getElementById('cursor-ring');
  const cursorDot = document.getElementById('cursor-dot');
  if (!cursorRing || !cursorDot) return;
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  if (window.matchMedia('(hover:hover)').matches) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
      cursorRing.style.opacity = '1';
    });
    (function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();
    document.querySelectorAll('a,button,input,select,textarea,.cal-row,.stat-card,.track-card,.cal-filter,.vh-pkg,.tier-card,.sp-card').forEach(el => {
      el.addEventListener('mouseenter', () => { cursorRing.classList.add('hover'); cursorDot.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cursorRing.classList.remove('hover'); cursorDot.classList.remove('hover'); });
    });
    document.addEventListener('mouseleave', () => { cursorRing.style.opacity = '0'; });
  } else {
    cursorRing.style.display = 'none';
    cursorDot.style.display = 'none';
    document.body.style.cursor = 'auto';
  }
})();
