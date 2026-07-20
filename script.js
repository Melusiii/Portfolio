/* =============================================
   MTS Portfolio — JavaScript
   Features: scroll reveal, nav tracking, 3D tilt,
   mobile menu, contact form, project modals
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollReveal();
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initActiveNav();
  initProjectCardTilt();
  initServiceCardTilt();
  initProjectModals();
  initContactForm();
  initCursorGlow();
  initScrollProgress();
  initMagneticButtons();
  initHeroParallax();
});

/* =============================================
   SCROLL REVEAL
   ============================================= */
const initScrollReveal = () => {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
};

/* =============================================
   HEADER SCROLL STATE
   ============================================= */
const initHeader = () => {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
};

/* =============================================
   MOBILE MENU
   ============================================= */
const initMobileMenu = () => {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;

  const toggle = (open) => {
    hamburger.setAttribute('aria-expanded', open);
    mobileNav.classList.toggle('open', open);
    mobileNav.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';

    // Animate hamburger lines
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  };

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    toggle(!isOpen);
  });

  // Close on link click
  mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      toggle(false);
    }
  });
};

/* =============================================
   SMOOTH SCROLL
   ============================================= */
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: 'smooth'
      });
    });
  });
};

/* =============================================
   ACTIVE NAV TRACKING
   ============================================= */
const initActiveNav = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .bottom-nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', isActive);
          if (isActive) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(s => observer.observe(s));
};

/* =============================================
   3D TILT ON PROJECT CARDS
   ============================================= */
const initProjectCardTilt = () => {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length || window.innerWidth < 768) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `
        perspective(900px)
        rotateY(${x * 8}deg)
        rotateX(${y * -8}deg)
        translateY(-6px)
        scale(1.02)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
};

/* =============================================
   3D TILT ON SERVICE CARDS
   ============================================= */
const initServiceCardTilt = () => {
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length || window.innerWidth < 768) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `
        perspective(900px)
        rotateY(${x * 6}deg)
        rotateX(${y * -6}deg)
        translateY(-6px)
        scale(1.01)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
};

/* =============================================
   CUSTOM CURSOR
   ============================================= */
const initCursorGlow = () => {
  // Disable on touch/mobile
  const isMobile = window.innerWidth < 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isMobile) return;

  const dot   = document.getElementById('cursorDot');
  const ring  = document.getElementById('cursorRing');
  const trail = document.getElementById('cursorTrail');
  const glow  = document.getElementById('cursorGlow');

  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let trailX = 0, trailY = 0;
  let glowX  = 0, glowY  = 0;

  const lerp = (a, b, t) => a + (b - a) * t;

  const animate = () => {
    // Dot follows instantly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    // Ring follows with slight lag
    ringX = lerp(ringX, mouseX, 0.14);
    ringY = lerp(ringY, mouseY, 0.14);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    // Trail follows very lazily
    trailX = lerp(trailX, mouseX, 0.06);
    trailY = lerp(trailY, mouseY, 0.06);
    if (trail) {
      trail.style.left = trailX + 'px';
      trail.style.top  = trailY + 'px';
    }

    // Legacy glow — laziest
    glowX = lerp(glowX, mouseX, 0.07);
    glowY = lerp(glowY, mouseY, 0.07);
    if (glow) {
      glow.style.left = glowX + 'px';
      glow.style.top  = glowY + 'px';
    }

    requestAnimationFrame(animate);
  };

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.classList.add('visible');
    ring.classList.add('visible');
    if (trail) trail.classList.add('visible');
    if (glow)  glow.classList.add('active');
  });

  window.addEventListener('mouseleave', () => {
    dot.classList.remove('visible');
    ring.classList.remove('visible');
    if (trail) trail.classList.remove('visible');
    if (glow)  glow.classList.remove('active');
  });

  // Hover effect on interactive elements
  const interactiveEls = document.querySelectorAll(
    'a, button, [role="button"], input, textarea, select, label, .btn, .project-card, .service-card, .social-link, .nav-link, .logo'
  );
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    });
  });

  // Click burst effect
  window.addEventListener('mousedown', () => {
    dot.classList.add('clicking');
    ring.classList.add('clicking');
  });
  window.addEventListener('mouseup', () => {
    dot.classList.remove('clicking');
    ring.classList.remove('clicking');
  });

  animate();
};


/* =============================================
   SCROLL PROGRESS BAR
   ============================================= */
const initScrollProgress = () => {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
};



/* =============================================
   MAGNETIC BUTTONS
   ============================================= */
const initMagneticButtons = () => {
  if (window.innerWidth < 768) return;

  const buttons = document.querySelectorAll('.btn-primary, .btn-outline');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.22;
      const dy = (e.clientY - cy) * 0.22;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s var(--ease-spring)';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });
  });
};

/* =============================================
   HERO PHOTO MOUSE PARALLAX
   ============================================= */
const initHeroParallax = () => {
  const photo = document.querySelector('.hero-photo');
  if (!photo || window.innerWidth < 768) return;

  window.addEventListener('mousemove', (e) => {
    const xPct = (e.clientX / window.innerWidth  - 0.5) * 14;
    const yPct = (e.clientY / window.innerHeight - 0.5) * 10;
    photo.style.transform = `translate(${xPct}px, ${yPct}px)`;
  });

  window.addEventListener('mouseleave', () => {
    photo.style.transform = '';
  });
};


/* =============================================
   PROJECT MODALS
   ============================================= */
const projectData = {

  muzinda: {
    tag: 'Web Platform / Logistics',
    title: 'Muzinda App',
    description: 'A student housing and logistics platform that connects Zimbabwean university students with verified accommodation listings near campus and coordinates local transit services. Built to reduce the friction of finding safe, affordable housing.',
    features: [
      'Verified accommodation directory with proximity sorting',
      'Integrated transit coordination and scheduling',
      'Secure role-based login for students, landlords, and drivers',
      'Payment logging with instant confirmation',
      'Mobile-responsive design for on-the-go access',
    ],
    techStack: ['Next.js', 'React', 'Supabase', 'PostgreSQL', 'Tailwind CSS'],
    github: 'https://github.com/Melusiii',
    live: null,
  },
  placement: {
    tag: 'Web Platform / Recruitment',
    title: 'Work Placement Solutions',
    description: 'A high-performance, conversion-oriented landing page connecting Zimbabwean talent with vetted warehouse and logistics employers across 9 European countries. Features dynamic counters and secure resume upload integration.',
    features: [
      'Interactive drag-and-drop CV upload with real-time validation',
      'Netlify Forms integration with a honeypot spam filter',
      'Dynamic animating statistics counter for candidate placements',
      'Custom accordion-style interactive FAQ menu',
      'Responsive sticky navigation with smooth scroll alignment',
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Netlify Forms'],
    github: 'https://github.com/Melusiii',
    live: 'https://workplacementsolutions.co.zw/',
  },
  bridgeway: {
    tag: 'Educational Platform',
    title: 'Bridgeway College',
    description: 'A fast, modern website for Bridgeway Vocational College built to help students discover courses, contact the college, and access key information quickly. Designed with performance and accessibility as top priorities.',
    features: [
      'Fully responsive layout across all screen sizes',
      'Optimised asset delivery for sub-2s load times',
      'Structured course listing and navigation',
      'Secure contact and inquiry forms',
      'Deployed globally via Vercel CDN',
    ],
    techStack: ['Next.js', 'TypeScript', 'React', 'Vercel'],
    github: 'https://github.com/Melusiii',
    live: null,
  },
};

const initProjectModals = () => {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalCloseBtn');
  const content = document.getElementById('modalContent');
  if (!overlay || !closeBtn || !content) return;

  const openModal = (projectId) => {
    const data = projectData[projectId];
    if (!data) return;

    const featuresHtml = data.features.map(f => `<li>${f}</li>`).join('');
    const tagsHtml = data.techStack.map(t => `<span class="tag">${t}</span>`).join('');

    content.innerHTML = `
      <p class="modal-eyebrow">${data.tag}</p>
      <h2 class="modal-title">${data.title}</h2>

      <p class="modal-section-label">Overview</p>
      <p class="modal-desc">${data.description}</p>

      <p class="modal-section-label">Key Features</p>
      <ul class="modal-feature-list">${featuresHtml}</ul>

      <p class="modal-section-label">Tech Stack</p>
      <div class="modal-tags">${tagsHtml}</div>

      <div class="modal-actions">
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
          <i class="fa-brands fa-github"></i> View Source Code
        </a>
        ${data.live ? `<a href="${data.live}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          Live Demo <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>` : `<span class="btn btn-ghost" style="cursor:default;opacity:0.5" title="Private / Internal deployment">
          <i class="fa-solid fa-lock"></i> Private Deploy
        </span>`}
      </div>
    `;

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeModal = () => {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Bind trigger buttons
  document.querySelectorAll('.project-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectId = btn.getAttribute('data-project');
      openModal(projectId);
    });
  });

  // Bind whole project card click to trigger its primary action (modal or link)
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      const modalBtn = card.querySelector('.project-modal-btn');
      const linkBtn = card.querySelector('.project-link-btn');
      if (modalBtn) {
        modalBtn.click();
      } else if (linkBtn) {
        linkBtn.click();
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
};

/* =============================================
   CONTACT FORM
   ============================================= */
const initContactForm = () => {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');
  if (!form || !submitBtn || !feedback) return;

  const originalBtnHtml = submitBtn.innerHTML;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate
    const name    = form.querySelector('#fname').value.trim();
    const email   = form.querySelector('#femail').value.trim();
    const message = form.querySelector('#fmessage').value.trim();

    if (!name || !email || !message) {
      showFeedback('Please fill in all fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    try {
      const formData = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        showFeedback('Message sent! I\'ll get back to you shortly.', 'success');
        form.reset();
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
        setTimeout(() => {
          submitBtn.innerHTML = originalBtnHtml;
          submitBtn.disabled = false;
          feedback.textContent = '';
          feedback.className = 'form-feedback';
        }, 5000);
      } else {
        throw new Error('Server error');
      }
    } catch {
      showFeedback('Something went wrong. Please email me directly.', 'error');
      submitBtn.innerHTML = originalBtnHtml;
      submitBtn.disabled = false;
    }
  });

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className = `form-feedback ${type}`;
  }
};

/* =============================================
   INTERACTIVE PARTICLE BACKGROUND
   - Floating dots that react to mouse cursor
   - Dots repel away from mouse position
   - Lines drawn between nearby dots
   ============================================= */
/* =============================================
   UNIFIED CYBER-SAKURA & SPIRIT PARTICLES 🌸
   Hell's Paradise × MTS Brand Palette
   ============================================= */
const initParticles = () => {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const isMobile = window.innerWidth < 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isMobile) return;

  const ctx = canvas.getContext('2d');
  const PARTICLE_COUNT = 65;
  const CONNECT_DIST   = 110;
  const REPEL_DIST     = 120;
  const REPEL_FORCE    = 2.2;

  let W, H, particles;
  let mouse = { x: -9999, y: -9999 };

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  const rand = (min, max) => Math.random() * (max - min) + min;

  // Particle types: 'petal' (sakura) or 'ember' (glowing spirit orb)
  class CyberParticle {
    constructor(initial = false) {
      this.reset(initial);
    }

    reset(initial = false) {
      this.x     = rand(0, W);
      this.y     = initial ? rand(0, H) : rand(-60, -10);
      this.isPetal = Math.random() < 0.65; // 65% petals, 35% spirit embers
      this.r     = this.isPetal ? rand(3.5, 6.5) : rand(1.2, 2.5);
      this.vx    = rand(-0.4, 0.4);
      this.vy    = rand(0.35, 0.95);     // downward wind flow
      this.rot   = rand(0, Math.PI * 2);
      this.vrot  = rand(-0.02, 0.02);
      this.alpha = rand(0.3, 0.75);
      this.sway  = rand(0.008, 0.02);
      this.phase = rand(0, Math.PI * 2);

      // Color palette: 40% Sakura Pink (335°), 30% Emerald (160°), 20% Teal (195°), 10% Violet (270°)
      const randColor = Math.random();
      if (randColor < 0.40)      this.hue = rand(330, 355); // Sakura Pink
      else if (randColor < 0.70) this.hue = rand(155, 170); // Emerald
      else if (randColor < 0.90) this.hue = rand(190, 205); // Teal
      else                       this.hue = rand(265, 280); // Violet
    }

    update() {
      // Wind sway
      this.phase += this.sway;
      this.x += this.vx + Math.sin(this.phase) * 0.45;
      this.y += this.vy;
      this.rot += this.vrot;

      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.hypot(dx, dy);

      if (dist < REPEL_DIST && dist > 0) {
        const force = (REPEL_DIST - dist) / REPEL_DIST;
        this.x += (dx / dist) * force * REPEL_FORCE;
        this.y += (dy / dist) * force * REPEL_FORCE;
      }

      // Recycle when drifting off screen bottom or sides
      if (this.y > H + 20 || this.x < -40 || this.x > W + 40) {
        this.reset(false);
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha;

      if (this.isPetal) {
        // Draw delicate sakura petal
        ctx.fillStyle = `hsla(${this.hue}, 75%, 75%, 0.85)`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.r, this.r * 1.75, 0, 0, Math.PI * 2);
        ctx.fill();

        // Inner glowing core line
        ctx.strokeStyle = `hsla(${this.hue}, 90%, 90%, 0.5)`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(0, -this.r * 1.2);
        ctx.lineTo(0, this.r * 1.2);
        ctx.stroke();
      } else {
        // Draw spirit ember orb with glow
        ctx.fillStyle = `hsla(${this.hue}, 85%, 70%, 0.9)`;
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        ctx.fill();

        // Outer aura
        ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, 0.25)`;
        ctx.beginPath();
        ctx.arc(0, 0, this.r * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  particles = Array.from({ length: PARTICLE_COUNT }, () => new CyberParticle(true));

  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    // Update & draw particles
    particles.forEach(p => {
      p.update();
      p.draw(ctx);
    });

    // Draw delicate glowing spirit connection lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.hypot(dx, dy);

        if (d < CONNECT_DIST) {
          const alpha = (1 - d / CONNECT_DIST) * 0.18;
          const hue   = (a.hue + b.hue) / 2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `hsla(${hue}, 70%, 75%, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    // Interactive mouse aura ring (Sakura & Emerald blend)
    if (mouse.x !== -9999) {
      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, REPEL_DIST
      );
      gradient.addColorStop(0,   'rgba(249, 168, 212, 0.08)'); // Sakura pink
      gradient.addColorStop(0.5, 'rgba(16, 217, 138, 0.03)');  // Emerald
      gradient.addColorStop(1,   'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, REPEL_DIST, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  };

  draw();
};



