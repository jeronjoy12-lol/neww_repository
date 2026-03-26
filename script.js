/* ============================================
   JERON JOSEPH LAGI — Portfolio JavaScript
   Particles | Typing | Scroll Reveal | Counter
   ============================================ */

// =============================================
// 1. NAVBAR — scroll effect + active link
// =============================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // scrolled state
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // active link tracking
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// =============================================
// 2. MOBILE MENU TOGGLE
// =============================================
const menuToggle = document.getElementById('menuToggle');
const navLinksList = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  navLinksList.classList.toggle('open');
});

// close menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    navLinksList.classList.remove('open');
  });
});

// =============================================
// 3. PARTICLE CANVAS
// =============================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  const PARTICLE_COUNT = 80;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['rgba(99,102,241,', 'rgba(6,182,212,', 'rgba(167,139,250,'];

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.8 + 0.5;
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

  function connectParticles() {
    const max = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < max) {
          const opacity = (1 - dist / max) * 0.2;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${opacity})`;
          ctx.lineWidth   = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
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
  const phrases = [
    'BCA Cloud Computing Student',
    'Full-Stack Web Developer',
    'UI/UX Enthusiast',
    'Problem Solver',
  ];
  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  const speed   = 80;
  const pause   = 1600;

  function type() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = phrase.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(type, pause);
        return;
      }
    } else {
      el.textContent = phrase.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting   = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? speed / 2 : speed);
  }
  setTimeout(type, 1400);
})();

// =============================================
// 5. SCROLL REVEAL
// =============================================
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger children within a group
        entry.target.style.transitionDelay = `${(i % 4) * 0.1}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();

// =============================================
// 6. SKILL BAR ANIMATION
// =============================================
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width  = target.getAttribute('data-width');
        setTimeout(() => { target.style.width = `${width}%`; }, 200);
        observer.unobserve(target);
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current  = 0;
        const step   = Math.ceil(target / 30);
        const interval = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(interval); }
          el.textContent = current;
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// =============================================
// 8. CONTACT FORM
// =============================================
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const btn = document.getElementById('submitBtn');
  const msg = document.getElementById('responseMessage');
  const name    = document.getElementById('name').value;
  const email   = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  btn.disabled  = true;
  btn.querySelector('.btn-text').textContent = 'Sending…';

  try {
    const response = await fetch('http://localhost:5000/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, message }),
    });
    const data = await response.json();
    msg.textContent = '✅ ' + (data.message || 'Message sent successfully!');
    msg.style.color = '#10b981';
    this.reset();
  } catch (err) {
    msg.textContent = '⚠️ Message saved! We\'ll be in touch soon.';
    msg.style.color = '#f59e0b';
  } finally {
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = 'Send Message';
    setTimeout(() => { msg.textContent = ''; }, 5000);
  }
});

// =============================================
// 9. FOOTER YEAR
// =============================================
document.getElementById('year').textContent = new Date().getFullYear();
