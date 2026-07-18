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
  const navLinks = document.querySelectorAll('.nav-link');
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
   CURSOR GLOW FOLLOWER
   ============================================= */
const initCursorGlow = () => {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  // Optimize mobile speed by disabling cursor glow animation loop on mobile viewports/touch devices
  const isMobile = window.innerWidth < 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isMobile) return;

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let rafId;

  const lerp = (a, b, t) => a + (b - a) * t;

  const animate = () => {
    glowX = lerp(glowX, mouseX, 0.1);
    glowY = lerp(glowY, mouseY, 0.1);
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    rafId = requestAnimationFrame(animate);
  };

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.classList.add('active');
  });

  window.addEventListener('mouseleave', () => {
    glow.classList.remove('active');
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
const initParticles = () => {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  // Optimize mobile speed by disabling CPU-heavy canvas particles on mobile viewports/touch devices
  const isMobile = window.innerWidth < 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isMobile) return;

  const ctx = canvas.getContext('2d');
  const DOT_COUNT   = 90;
  const CONNECT_DIST = 130;
  const REPEL_DIST   = 110;
  const REPEL_FORCE  = 2.8;
  const BASE_SPEED   = 0.35;

  let W, H, particles;
  let mouse = { x: -9999, y: -9999 };

  // Resize handler
  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  // Mouse tracking
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Particle factory
  const createParticle = () => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    vx: (Math.random() - 0.5) * BASE_SPEED,
    vy: (Math.random() - 0.5) * BASE_SPEED,
    r:  Math.random() * 1.8 + 0.8,
    // vary between emerald, violet, and white-ish
    hue: Math.random() < 0.55 ? 162 : Math.random() < 0.6 ? 265 : 200,
  });

  particles = Array.from({ length: DOT_COUNT }, createParticle);

  // Animation loop
  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    // Update + draw particles
    particles.forEach(p => {
      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);

      if (dist < REPEL_DIST && dist > 0) {
        const force = (REPEL_DIST - dist) / REPEL_DIST;
        p.vx += (dx / dist) * force * REPEL_FORCE * 0.06;
        p.vy += (dy / dist) * force * REPEL_FORCE * 0.06;
      }

      // Friction / damping
      p.vx *= 0.97;
      p.vy *= 0.97;

      // Enforce min speed so they keep drifting
      const speed = Math.hypot(p.vx, p.vy);
      if (speed < BASE_SPEED * 0.4) {
        p.vx += (Math.random() - 0.5) * 0.04;
        p.vy += (Math.random() - 0.5) * 0.04;
      }

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, 0.75)`;
      ctx.fill();
    });

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.hypot(dx, dy);

        if (d < CONNECT_DIST) {
          const alpha = (1 - d / CONNECT_DIST) * 0.22;
          const hue   = (a.hue + b.hue) / 2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `hsla(${hue}, 60%, 60%, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw mouse glow ring
    if (mouse.x !== -9999) {
      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, REPEL_DIST
      );
      gradient.addColorStop(0,   'rgba(16, 185, 129, 0.06)');
      gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.02)');
      gradient.addColorStop(1,   'rgba(16, 185, 129, 0)');
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, REPEL_DIST, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  };

  draw();
};
