/* ── NAV ───────────────────────────────────────────────────── */
const nav       = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const allLinks  = document.querySelectorAll('.nav__link');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  highlightActiveSection();
  toggleScrollTop();
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.addEventListener('click', e => {
  if (e.target.classList.contains('nav__link')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

function highlightActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  let active = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) active = s.id;
  });
  allLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + active);
  });
}

/* ── SCROLL TOP ────────────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTop');
function toggleScrollTop() {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── TYPING ANIMATION ──────────────────────────────────────── */
const roles = [
  'Data Science Student',
  'Python Developer',
  'Data Analyst',
  'SQL Enthusiast',
  'Final Year @ Sunderland',
];

let rIdx = 0, cIdx = 0, deleting = false;
const typingEl = document.getElementById('typingText');

function type() {
  const role = roles[rIdx];
  if (!deleting) {
    typingEl.textContent = role.slice(0, ++cIdx);
    if (cIdx === role.length) { deleting = true; setTimeout(type, 2000); return; }
  } else {
    typingEl.textContent = role.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 48 : 85);
}
type();

/* ── PARTICLE CANVAS ───────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, pts, mouse = { x: -9999, y: -9999 };

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };

  const mkParticle = () => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    vx: (Math.random() - .5) * .35,
    vy: (Math.random() - .5) * .35,
    r:  Math.random() * 1.4 + .4,
    a:  Math.random() * .45 + .1,
  });

  const init = () => {
    const n = Math.min(Math.floor(W * H / 11000), 130);
    pts = Array.from({ length: n }, mkParticle);
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,102,241,${p.a})`;
      ctx.fill();
    });

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${.1 * (1 - d / 110)})`;
          ctx.lineWidth   = .5;
          ctx.stroke();
        }
      }
      const dx = pts[i].x - mouse.x, dy = pts[i].y - mouse.y;
      const d  = Math.hypot(dx, dy);
      if (d < 150) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(6,182,212,${.28 * (1 - d / 150)})`;
        ctx.lineWidth   = .8;
        ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  };

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('resize',    () => { resize(); init(); });
  resize(); init(); draw();
})();

/* ── REVEAL ON SCROLL ──────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
    entry.target.style.transitionDelay = `${siblings.indexOf(entry.target) * 75}ms`;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── SKILL BARS ────────────────────────────────────────────── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-bar__fill').forEach(b => barObserver.observe(b));

/* ── PROJECT FILTER ────────────────────────────────────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = f === 'all' || card.dataset.category === f;
      card.classList.toggle('hidden', !show);
      if (show) {
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'fadeUp .4s ease both';
      }
    });
  });
});

/* ── CONTACT FORM ──────────────────────────────────────────── */
const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

const validate = (input, errId, msg) => {
  const errEl = document.getElementById(errId);
  if (!input.value.trim()) {
    input.classList.add('error');
    if (errEl) errEl.textContent = msg;
    return false;
  }
  if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    input.classList.add('error');
    if (errEl) errEl.textContent = 'Please enter a valid email.';
    return false;
  }
  input.classList.remove('error');
  if (errEl) errEl.textContent = '';
  return true;
};

form.addEventListener('submit', async e => {
  e.preventDefault();
  const name    = form.querySelector('#name');
  const email   = form.querySelector('#email');
  const message = form.querySelector('#message');

  const valid = [
    validate(name,    'nameError',    'Name is required.'),
    validate(email,   'emailError',   'Email is required.'),
    validate(message, 'messageError', 'Message is required.'),
  ].every(Boolean);

  if (!valid) return;

  const text   = submitBtn.querySelector('.btn__text');
  const loader = submitBtn.querySelector('.btn__loader');
  text.hidden  = true; loader.hidden = false; submitBtn.disabled = true;

  await new Promise(r => setTimeout(r, 1500));

  text.hidden = false; loader.hidden = true; submitBtn.disabled = false;
  formSuccess.hidden = false;
  form.reset();
  setTimeout(() => { formSuccess.hidden = true; }, 6000);
});

form.querySelectorAll('input, textarea').forEach(el =>
  el.addEventListener('input', () => el.classList.remove('error'))
);
