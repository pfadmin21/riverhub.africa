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

// ── Base here side tab ──
(function () {
  // Don't show on the base page itself
  if (window.location.pathname.startsWith('/base')) return;

  const styles = `
    #rh-base-tab {
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      z-index: 900;
      display: flex;
      align-items: stretch;
      pointer-events: auto;
    }
    #rh-base-label {
      writing-mode: vertical-rl;
      text-orientation: mixed;
      transform: rotate(180deg);
      background: #c9a84c;
      color: #0d1117;
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      font-weight: 500;
      letter-spacing: .14em;
      text-transform: uppercase;
      padding: 18px 8px;
      cursor: pointer;
      user-select: none;
      transition: background .2s;
      border-radius: 3px 0 0 3px;
      white-space: nowrap;
    }
    #rh-base-label:hover { background: #d4b24a; }
    #rh-base-panel {
      width: 0;
      overflow: hidden;
      transition: width .3s ease;
      background: #0d1117;
      border-left: .5px solid rgba(201,168,76,.3);
      border-top: .5px solid rgba(201,168,76,.3);
      border-bottom: .5px solid rgba(201,168,76,.3);
      border-radius: 4px 0 0 4px;
      display: flex;
      flex-direction: column;
    }
    #rh-base-tab.open #rh-base-panel { width: 260px; }
    .rh-bp-inner {
      padding: 22px 20px;
      width: 260px;
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .rh-bp-close {
      position: absolute;
      top: 10px;
      left: 12px;
      background: none;
      border: none;
      color: rgba(232,228,217,.35);
      font-size: 16px;
      cursor: pointer;
      line-height: 1;
      padding: 2px;
      transition: color .15s;
      font-family: 'Inter', sans-serif;
    }
    .rh-bp-close:hover { color: rgba(232,228,217,.8); }
    .rh-bp-eyebrow {
      font-family: 'Inter', sans-serif;
      font-size: 8px;
      font-weight: 500;
      letter-spacing: .14em;
      text-transform: uppercase;
      color: #c9a84c;
      margin-bottom: 8px;
      margin-top: 18px;
    }
    .rh-bp-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px;
      font-weight: 300;
      color: #e8e4d9;
      line-height: 1.2;
      margin-bottom: 14px;
    }
    .rh-bp-title em { font-style: italic; color: #c9a84c; }
    .rh-bp-pkg {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      padding: 8px 0;
      border-top: .5px solid rgba(255,255,255,.07);
    }
    .rh-bp-pkg:last-of-type { border-bottom: .5px solid rgba(255,255,255,.07); margin-bottom: 14px; }
    .rh-bp-pkg-name {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 300;
      color: rgba(232,228,217,.6);
    }
    .rh-bp-pkg-price {
      font-family: 'Cormorant Garamond', serif;
      font-size: 15px;
      font-weight: 300;
      color: #c9a84c;
    }
    .rh-bp-network {
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      font-weight: 300;
      color: rgba(94,196,144,.8);
      line-height: 1.6;
      background: rgba(61,138,98,.08);
      border: .5px solid rgba(61,138,98,.2);
      padding: 8px 10px;
      margin-bottom: 14px;
      border-radius: 2px;
    }
    .rh-bp-btn {
      display: block;
      width: 100%;
      padding: 10px;
      background: #c9a84c;
      border: none;
      color: #0d1117;
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      font-weight: 500;
      letter-spacing: .12em;
      text-transform: uppercase;
      text-align: center;
      text-decoration: none;
      border-radius: 2px;
      cursor: pointer;
      transition: background .15s;
      margin-bottom: 6px;
    }
    .rh-bp-btn:hover { background: #d4b24a; }
    .rh-bp-btn-ghost {
      display: block;
      width: 100%;
      padding: 9px;
      background: transparent;
      border: .5px solid rgba(201,168,76,.3);
      color: #c9a84c;
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      letter-spacing: .1em;
      text-transform: uppercase;
      text-align: center;
      text-decoration: none;
      border-radius: 2px;
      cursor: pointer;
      transition: all .15s;
    }
    .rh-bp-btn-ghost:hover { border-color: #c9a84c; background: rgba(201,168,76,.06); }
    @media (max-width: 768px) {
      #rh-base-tab { top: auto; bottom: 80px; transform: none; }
      #rh-base-tab.open #rh-base-panel { width: 220px; }
      .rh-bp-inner { width: 220px; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  const tab = document.createElement('div');
  tab.id = 'rh-base-tab';
  tab.innerHTML = `
    <div id="rh-base-panel">
      <div class="rh-bp-inner">
        <button class="rh-bp-close" id="rh-bp-close" aria-label="Close">×</button>
        <div class="rh-bp-eyebrow">Base at River Hub</div>
        <div class="rh-bp-title">Your African<br>capital <em>base.</em></div>
        <div class="rh-bp-pkg"><span class="rh-bp-pkg-name">Virtual office</span><span class="rh-bp-pkg-price">Rs 8,000/mo</span></div>
        <div class="rh-bp-pkg"><span class="rh-bp-pkg-name">Dedicated desk</span><span class="rh-bp-pkg-price">Rs 20,000/mo</span></div>
        <div class="rh-bp-pkg"><span class="rh-bp-pkg-name">Private office</span><span class="rh-bp-pkg-price">Rs 45,000/mo</span></div>
        <div class="rh-bp-network">Mauritius IFC address · DFI &amp; LP network · HRDC-eligible training included</div>
        <a href="mailto:admin@philanthropicfoundation.net?subject=Base%20at%20River%20Hub%20Enquiry" class="rh-bp-btn">Enquire now →</a>
        <a href="/base/" class="rh-bp-btn-ghost">See full details</a>
      </div>
    </div>
    <div id="rh-base-label" role="button" aria-label="Base at River Hub — office packages">Base at River Hub</div>
  `;
  document.body.appendChild(tab);

  const label = document.getElementById('rh-base-label');
  const closeBtn = document.getElementById('rh-bp-close');

  label.addEventListener('click', () => tab.classList.toggle('open'));
  closeBtn.addEventListener('click', () => tab.classList.remove('open'));

  // Close if clicking outside
  document.addEventListener('click', function (e) {
    if (tab.classList.contains('open') && !tab.contains(e.target)) {
      tab.classList.remove('open');
    }
  });

  // Add to cursor hover targets so custom cursor activates on it
  tab.querySelectorAll('a, button, #rh-base-label').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const ring = document.getElementById('cursor-ring');
      const dot = document.getElementById('cursor-dot');
      if (ring) ring.classList.add('hover');
      if (dot) dot.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      const ring = document.getElementById('cursor-ring');
      const dot = document.getElementById('cursor-dot');
      if (ring) ring.classList.remove('hover');
      if (dot) dot.classList.remove('hover');
    });
  });
})();

