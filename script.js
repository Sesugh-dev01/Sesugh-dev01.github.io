/* ── NAV ───────────────────────────────────────────────────── */
const nav        = document.getElementById('nav');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const allLinks   = document.querySelectorAll('.nav__link');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
  updateActiveLink();
  toggleScrollTop();
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav__link')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  allLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}

/* ── SCROLL-TOP ────────────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTop');

function toggleScrollTop() {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── TYPING ANIMATION ──────────────────────────────────────── */
const roles = [
  'MSc Data Scientist',
  'ML Engineer',
  'NLP Practitioner',
  'Data Analyst',
  'Python Developer',
];

let rIndex = 0, cIndex = 0, deleting = false;
const typingEl = document.getElementById('typingText');

function type() {
  const role = roles[rIndex];
  if (!deleting) {
    typingEl.textContent = role.slice(0, ++cIndex);
    if (cIndex === role.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typingEl.textContent = role.slice(0, --cIndex);
    if (cIndex === 0) {
      deleting = false;
      rIndex = (rIndex + 1) % roles.length;
    }
  }
  setTimeout(type, deleting ? 55 : 90);
}
type();

/* ── PARTICLE CANVAS ───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles, mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - .5) * .4;
    this.vy = (Math.random() - .5) * .4;
    this.r  = Math.random() * 1.5 + .5;
    this.alpha = Math.random() * .5 + .15;
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  function initParticleArr() {
    const count = Math.floor(W * H / 12000);
    particles = Array.from({ length: Math.min(count, 120) }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108,99,255,${p.alpha})`;
      ctx.fill();
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${.12 * (1 - dist / 120)})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
      // Connect to mouse
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 160) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(62,207,207,${.3 * (1 - dist / 160)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('resize', () => { resize(); initParticleArr(); });
  resize();
  initParticleArr();
  draw();
})();

/* ── REVEAL ON SCROLL ──────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 80}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── SKILL BAR ANIMATION ───────────────────────────────────── */
const skillBars = document.querySelectorAll('.skill-bar__fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => barObserver.observe(bar));

/* ── PROJECT FILTER ────────────────────────────────────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) {
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeUp .4s ease both';
      }
    });
  });
});

/* ── CONTACT FORM ──────────────────────────────────────────── */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function validateField(input, errorId, message) {
  const el = document.getElementById(errorId);
  if (!input.value.trim()) {
    input.classList.add('error');
    if (el) el.textContent = message;
    return false;
  }
  if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    input.classList.add('error');
    if (el) el.textContent = 'Please enter a valid email address.';
    return false;
  }
  input.classList.remove('error');
  if (el) el.textContent = '';
  return true;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name    = form.querySelector('#name');
  const email   = form.querySelector('#email');
  const message = form.querySelector('#message');

  const ok = [
    validateField(name,    'nameError',    'Name is required.'),
    validateField(email,   'emailError',   'Email is required.'),
    validateField(message, 'messageError', 'Message is required.'),
  ].every(Boolean);

  if (!ok) return;

  // Simulate async send
  const btnText   = submitBtn.querySelector('.btn__text');
  const btnLoader = submitBtn.querySelector('.btn__loader');
  btnText.hidden  = true;
  btnLoader.hidden = false;
  submitBtn.disabled = true;

  await new Promise(r => setTimeout(r, 1600));

  btnText.hidden   = false;
  btnLoader.hidden = true;
  submitBtn.disabled = false;
  formSuccess.hidden = false;
  form.reset();

  setTimeout(() => { formSuccess.hidden = true; }, 5000);
});

// Clear error on input
form.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', () => el.classList.remove('error'));
});
