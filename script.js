// Mobile Navigation
const nav = document.querySelector('#primary-navigation');
const navToggle = document.querySelector('.mobile-nav-toggle');
const overlay = Object.assign(document.createElement('div'), { className: 'mobile-menu-overlay' });
document.body.appendChild(overlay);

const toggleMenu = (open) => {
    nav.setAttribute('data-visible', open);
    navToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    overlay.classList.toggle('active', open);
    overlay.setAttribute('aria-hidden', !open);
    navToggle.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
};

navToggle?.addEventListener('click', () => toggleMenu(nav.getAttribute('data-visible') !== 'true'));
overlay.addEventListener('click', () => toggleMenu(false));
document.addEventListener('keydown', (e) => e.key === 'Escape' && nav.getAttribute('data-visible') === 'true' && toggleMenu(false));
window.addEventListener('resize', () => window.innerWidth > 768 && nav.getAttribute('data-visible') === 'true' && toggleMenu(false));
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => window.innerWidth <= 768 && toggleMenu(false)));

// Form Validation
const form = document.getElementById('contact-form');
if (form) {
    const fields = {
        name: { el: document.getElementById('name'), err: document.getElementById('name-error'), validate: v => !v.trim() ? 'Name is required' : v.trim().length < 2 ? 'Name must be at least 2 characters' : '' },
        email: { el: document.getElementById('email'), err: document.getElementById('email-error'), validate: v => !v.trim() ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Please enter a valid email address' : '' },
        message: { el: document.getElementById('message'), err: document.getElementById('message-error'), validate: v => !v.trim() ? 'Message is required' : v.trim().length < 10 ? 'Message must be at least 10 characters' : '' }
    };

    Object.values(fields).forEach(({ el, err, validate }) => {
        el?.addEventListener('blur', () => {
            const error = validate(el.value);
            err.textContent = error;
            el.setAttribute('aria-invalid', error ? 'true' : 'false');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const errors = Object.entries(fields).map(([key, { el, err, validate }]) => {
            const error = validate(el.value);
            err.textContent = error;
            el.setAttribute('aria-invalid', error ? 'true' : 'false');
            return error;
        });

        if (errors.some(e => e)) return;

        console.log('Form submitted:', Object.fromEntries(new FormData(form)));
        showNotification('Thank you for your message! I will get back to you soon.', 'success');
        form.reset();
        Object.values(fields).forEach(({ el }) => el.setAttribute('aria-invalid', 'false'));
    });
}

// Utilities
const debounce = (fn, wait) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); }; };
const showNotification = (msg, type = 'success') => {
    const notif = Object.assign(document.createElement('div'), { className: `notification notification-${type}`, textContent: msg, role: 'alert' });
    document.body.appendChild(notif);
    requestAnimationFrame(() => notif.classList.add('show'));
    setTimeout(() => { notif.classList.remove('show'); setTimeout(() => notif.remove(), 300); }, 3000);
};

// Header scroll effect
window.addEventListener('scroll', debounce(() => document.querySelector('header')?.classList.toggle('scrolled', window.scrollY > 50), 10), { passive: true });

// Stats counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        statsObserver.unobserve(target);
        target.querySelectorAll('.stat-number').forEach(stat => {
            const target = parseInt(stat.dataset.count);
            const start = performance.now();
            const animate = (now) => {
                const progress = Math.min((now - start) / 2000, 1);
                stat.textContent = Math.floor((1 - Math.pow(1 - progress, 4)) * target);
                if (progress < 1) requestAnimationFrame(animate);
                else stat.textContent = target;
            };
            requestAnimationFrame(animate);
        });
    });
}, { threshold: 0.1 });
document.querySelector('.about') && statsObserver.observe(document.querySelector('.about'));

// Text rotation
const initTextRotation = () => {
    document.querySelectorAll('.text-rotate').forEach(el => {
        if (el.dataset.initialized) return;
        el.dataset.initialized = 'true';
        try {
            const words = JSON.parse(el.getAttribute('data-rotate'));
            if (!Array.isArray(words) || !words.length) { el.textContent = 'Developer'; return; }
            let idx = 0, animating = false;
            el.textContent = words[0];
            Object.assign(el.style, { opacity: '1', visibility: 'visible', display: 'inline-block', transition: 'opacity 0.3s' });
            setTimeout(() => setInterval(() => {
                if (animating) return;
                animating = true;
                el.style.opacity = '0';
                setTimeout(() => { idx = (idx + 1) % words.length; el.textContent = words[idx]; el.style.opacity = '1'; animating = false; }, 300);
            }, 3000), 1000);
        } catch { el.textContent = 'Developer'; Object.assign(el.style, { opacity: '1', visibility: 'visible' }); }
    });
};

// Dark mode toggle
const initDarkMode = () => {
    let toggle = document.querySelector('.dark-mode-toggle');
    if (!toggle) {
        toggle = Object.assign(document.createElement('button'), {
            className: 'dark-mode-toggle',
            innerHTML: '<i class="fas fa-moon"></i>',
            ariaLabel: 'Toggle dark mode'
        });
        Object.assign(toggle.style, { display: 'flex', zIndex: '999' });
        document.body.appendChild(toggle);
    }
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        toggle.querySelector('i').className = 'fas fa-sun';
    }
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = toggle.querySelector('i');
        icon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
    });
};

// Smooth scrolling
const initSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target && window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }));
};

// Scroll animations
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) { target.classList.add('animate'); scrollObserver.unobserve(target); }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.about-content, .projects-grid, .contact-container, .project-card').forEach(el => scrollObserver.observe(el));

// Active nav highlighting
window.addEventListener('scroll', debounce(() => {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('nav a[href^="#"]');
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
    links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}, 100), { passive: true });

// Initialize
const init = () => {
    document.querySelector('#current-year').textContent = new Date().getFullYear();
    initTextRotation();
    initDarkMode();
    initSmoothScrolling();
};

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
