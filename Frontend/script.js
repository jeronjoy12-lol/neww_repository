/* ============================================
   JERON JOSEPH LAGI — Portfolio script.js
   Particles | Typing | Scroll Reveal | Counters
   Contact Form → POST /contact
   ============================================ */

'use strict';

// =============================================
// 1. NAVBAR — scroll effect + active link
// =============================================
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

// =============================================
// 2. MOBILE MENU TOGGLE
// =============================================
const menuToggle  = document.getElementById('menuToggle');
const navLinkList = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.classList.toggle('open');
  navLinkList.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    navLinkList.classList.remove('open');
  });
});

// =============================================
// 3. PARTICLE CANVAS
// =============================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const PARTICLE_COUNT = 80;
  const CONNECT_DIST   = 120;
  const colors = ['rgba(99,102,241,', 'rgba(6,182,212,', 'rgba(167,139,250,'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x     = Math.random() * canvas.width;
      this.y     = Math.random() * canvas.height;
      this.vx    = (Math.random() - 0.5) * 0.4;
      this.vy    = (Math.random() - 0.5) * 0.4;
      this.r     = Math.random() * 1.8 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${(1 - dist / CONNECT_DIST) * 0.2})`;
          ctx.lineWidth   = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
})();

// =============================================
// 4. TYPING EFFECT
// =============================================
(function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'BCA Cloud Computing Student',
    'Full-Stack Web Developer',
    'UI/UX Enthusiast',
    'Problem Solver',
  ];
  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  const SPEED   = 80;
  const PAUSE   = 1600;

  function type() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = phrase.substring(0, ++charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        return setTimeout(type, PAUSE);
      }
    } else {
      el.textContent = phrase.substring(0, --charIdx);
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? SPEED / 2 : SPEED);
  }
  setTimeout(type, 1400);
})();

// =============================================
// 5. SCROLL REVEAL
// =============================================
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${(i % 5) * 0.08}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();

// =============================================
// 6. SKILL BAR ANIMATION
// =============================================
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const width = el.getAttribute('data-width');
        setTimeout(() => { el.style.width = `${width}%`; }, 200);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
})();

// =============================================
// 7. COUNTER ANIMATION
// =============================================
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        let   cur    = 0;
        const step   = Math.max(1, Math.ceil(target / 30));
        const timer  = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(timer); }
          el.textContent = cur;
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// =============================================
// 8. CONTACT FORM — POST to /contact
// =============================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const msg = document.getElementById('responseMessage');
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Sending…';
    msg.textContent = '';

    try {
      const response = await fetch('http://localhost:5000/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        msg.textContent = '✅ ' + (data.message || 'Message sent successfully!');
        msg.style.color = '#10b981';
        this.reset();
      } else {
        throw new Error(data.message || 'Server error');
      }
    } catch (err) {
      msg.textContent = '⚠️ Could not reach the server. Try emailing directly!';
      msg.style.color = '#f59e0b';
    } finally {
      btn.disabled = false;
      btn.querySelector('.btn-text').textContent = 'Send Message';
      setTimeout(() => { msg.textContent = ''; }, 6000);
    }
  });
}

// =============================================
// 9. FOOTER YEAR
// =============================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
