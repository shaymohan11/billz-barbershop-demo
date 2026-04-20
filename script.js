/* =========================================
   BILLZ BARBERSHOP — SCRIPT
   ========================================= */

// ── Navbar scroll ──────────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
function updateNav() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ── Mobile menu ────────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mob-menu');
const mobClose  = document.getElementById('mob-close');

hamburger.addEventListener('click', () => {
  mobMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});

mobClose.addEventListener('click', closeMob);
mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMob));

function closeMob() {
  mobMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Service category tabs ──────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const cat = tab.dataset.cat;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.food-grid').forEach(g => g.classList.remove('active'));
    tab.classList.add('active');
    const grid = document.getElementById('cat-' + cat);
    if (grid) grid.classList.add('active');
  });
});

// ── Smooth anchor scroll ───────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const el = document.querySelector(link.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: 'smooth' });
  });
});

// ── Scroll reveal ──────────────────────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Forms ──────────────────────────────────────────────────────────────────────
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = 'Request Sent ✓';
  btn.style.background = '#1a8c50';
  btn.style.color = '#fff';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; e.target.reset(); }, 3500);
}

function handleNewsletter(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const orig = btn.textContent;
  btn.textContent = 'Subscribed ✓';
  btn.style.color = '#1a8c50';
  setTimeout(() => { btn.textContent = orig; btn.style.color = ''; e.target.reset(); }, 3500);
}

// ═══════════════════════════════════════════════════════════
// 3D SCROLL IMMERSION
// ═══════════════════════════════════════════════════════════

const isMobile = window.matchMedia('(max-width: 768px)').matches;

const heroBgImg     = document.querySelector('.hero-bg img');
const heroBody      = document.querySelector('.hero-body');
const appBannerImg  = document.querySelector('.app-banner-img img');
const simgMain      = document.querySelector('.simg-main');
const simgSecondary = document.querySelector('.simg-secondary');

// ── 1. 3D scene entrance ──────────────────────────────────────────────────────
const sceneObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      sceneObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.scene-enter').forEach(el => sceneObs.observe(el));

// ── 2. Mouse tilt on cards ────────────────────────────────────────────────────
function addCardTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      if (isMobile) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-6px) scale(1.02) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}
addCardTilt('.food-card');
addCardTilt('.gallery-item');
addCardTilt('.review-card');

// ── 3. rAF scroll loop ────────────────────────────────────────────────────────
let ticking = false;

function progress(el) {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  return Math.max(0, Math.min(1, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const sy = window.scrollY;

    if (heroBgImg) {
      heroBgImg.style.transform = `translateY(${sy * -0.22}px)`;
    }
    if (heroBody) {
      heroBody.style.transform = `translateY(${sy * -0.08}px)`;
    }

    if (!isMobile) {
      if (simgMain) {
        const p = progress(simgMain.closest('section'));
        simgMain.style.transform = `translateY(${(p - 0.5) * -28}px)`;
      }
      if (simgSecondary) {
        const p = progress(simgSecondary.closest('section'));
        simgSecondary.style.transform = `translateY(${(p - 0.5) * 22}px)`;
      }
      if (appBannerImg) {
        const p = progress(appBannerImg.closest('section'));
        appBannerImg.style.transform = `translateY(${(p - 0.5) * -25}px)`;
      }
    }

    ticking = false;
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── 4. Ticker speeds up when scrolling fast ───────────────────────────────────
const tickerTrack = document.querySelector('.ticker-inner');
if (tickerTrack) {
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastY);
    tickerTrack.style.animationDuration = Math.max(10, 28 - delta * 0.4) + 's';
    lastY = window.scrollY;
  }, { passive: true });
}
