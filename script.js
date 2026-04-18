/* Portfolio Interaction Logic */

document.addEventListener('DOMContentLoaded', () => {
    initMeshMovement();
    initAnimations();
    initSmoothScroll();
    initContactForm();
    initStatCounters();
    initBentoTilt();
    initActiveNav();
    initMobileMenu();
    initFormValidation();
    initTypewriter();
});

// Enhanced Mesh Movement with Parallax
const initMeshMovement = () => {
    const blobs = document.querySelectorAll('.glow-blob');
    if (!blobs.length) return;

    // Disable heavy animation loop on mobile to prevent Safari WebKit crashes
    if (window.innerWidth <= 768) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    const dotGrid = document.querySelector('.dot-grid');

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 80;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 80;
        
        // Spotlight effect on dot grid
        if (dotGrid) {
            dotGrid.style.setProperty('--mouse-x', `${e.clientX}px`);
            dotGrid.style.setProperty('--mouse-y', `${e.clientY}px`);
        }
    });

    const animate = () => {
        // Smooth lerp for organic movement
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        blobs.forEach((blob, index) => {
            const factor = (index + 1) * 0.25;
            const rotateFactor = index * 0.5;
            blob.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px) rotate(${currentX * rotateFactor * 0.02}deg)`;
        });

        requestAnimationFrame(animate);
    };

    animate();
};

// Typewriter Effect for Hero Subtitle
const initTypewriter = () => {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.minHeight = subtitle.offsetHeight + 'px';

    let i = 0;
    const type = () => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(type, 40);
        }
    };

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(type, 300);
            observer.disconnect();
        }
    }, { threshold: 0.5 });

    observer.observe(subtitle);
};

// Contact Form Logic with Better Error Handling
const initContactForm = () => {
    const form = document.getElementById('cyber-contact');
    const formStatus = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        const isLocalFile = window.location.protocol === 'file:';

        if (isLocalFile) {
            e.preventDefault();
        } else {
            e.preventDefault();
        }

        const submitBtn = document.getElementById('submitBtn');
        const originalBtnText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span><i class="fa-solid fa-spinner fa-spin"></i>';

        if (isLocalFile) {
            // For local files: redirect the whole page to the service provider
            setTimeout(() => {
                form.submit();
            }, 1000);
        } else {
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showSuccess(form, submitBtn, formStatus);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (err) {
                showError(submitBtn, formStatus, originalBtnText);
            }
        }
    });
};

const showSuccess = (form, submitBtn, formStatus) => {
    formStatus.innerHTML = '<div class="text-emerald text-sm"><i class="fa-solid fa-check-circle"></i> Message sent! I\'ll get back to you soon.</div>';
    form.reset();
    submitBtn.innerHTML = '<span>Message Sent</span><i class="fa-solid fa-check"></i>';
    submitBtn.disabled = true;

    // Reset button after 5 seconds
    setTimeout(() => {
        submitBtn.innerHTML = '<span>Send Message</span><i class="fa-solid fa-paper-plane"></i>';
        submitBtn.disabled = false;
        formStatus.innerHTML = '';
    }, 5000);
};

const showError = (submitBtn, formStatus, originalBtnText) => {
    formStatus.innerHTML = '<div class="text-sm" style="color: #f87171;"><i class="fa-solid fa-triangle-exclamation"></i> Something went wrong. Please email me directly at melushanzi32@gmail.com</div>';
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
};

// Real-time Form Validation
const initFormValidation = () => {
    const form = document.getElementById('cyber-contact');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        // Add validation styling on input
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                if (input.checkValidity()) {
                    input.style.borderColor = 'var(--primary)';
                    input.style.backgroundColor = 'rgba(16, 185, 129, 0.04)';
                } else {
                    input.style.borderColor = '#ef4444';
                    input.style.backgroundColor = 'rgba(239, 68, 68, 0.04)';
                }
            } else {
                input.style.borderColor = 'var(--border-glass)';
                input.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
            }
        });

        // Clear validation on blur if empty
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.style.borderColor = 'var(--border-glass)';
                input.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
            }
        });
    });

    // Email specific validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() !== '' && !emailRegex.test(emailInput.value)) {
                emailInput.style.borderColor = '#ef4444';
                emailInput.style.backgroundColor = 'rgba(239, 68, 68, 0.04)';
            }
        });
    }
};

// Mobile Menu Toggle
const initMobileMenu = () => {
    const toggle = document.getElementById('menuToggle');
    const dock = document.querySelector('.nav-dock');

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        dock.classList.toggle('mobile-visible');
        const icon = toggle.querySelector('i');
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

        toggle.setAttribute('aria-expanded', !isExpanded);

        if (icon.classList.contains('fa-bars-staggered')) {
            icon.classList.remove('fa-bars-staggered');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars-staggered');
        }
    });

    // Close menu when a link is clicked
    dock.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            dock.classList.remove('mobile-visible');
            const icon = toggle.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars-staggered');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
};

// Bento Tilt Effect
const initBentoTilt = () => {
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${y * -10}deg) translateY(-8px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateY(0) rotateX(0) translateY(0) scale(1)`;
        });
    });
};

// Active Nav Logic
const initActiveNav = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-dock a');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
};

// Stat Counter Logic
const initStatCounters = () => {
    const stats = document.querySelectorAll('.stat-value');
    if (!stats.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(s => observer.observe(s));
};

const animateValue = (obj, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// Entrance Animations
const initAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-go');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-ready').forEach(el => observer.observe(el));
};

// Smooth Scroll with Offset for Fixed Header
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};
