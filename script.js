/* Portfolio Interaction Logic */

document.addEventListener('DOMContentLoaded', () => {
    initMeshMovement();
    initAnimations();
    initSmoothScroll();
    initContactForm();
    initStatCounters();
    initCardInteractions();
    initActiveNav();
    initMobileMenu();
    initFormValidation();
    initTypewriter();
    initProjectModals();
    initTerminal();
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

// Bento & Impact Cards Interactions (3D Tilt + Mouse-tracking Glow)
const initCardInteractions = () => {
    const cards = document.querySelectorAll('.bento-card, .impact-card');
    cards.forEach(card => {
        // Ensure card has a glow element
        let glow = card.querySelector('.card-glow');
        if (!glow) {
            glow = document.createElement('div');
            glow.className = 'card-glow';
            card.appendChild(glow);
        }

        card.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            // Apply 3D perspective tilt
            card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${y * -10}deg) translateY(-8px) scale(1.02)`;

            // Position card glow spotlight
            const mouseX = e.clientX - left;
            const mouseY = e.clientY - top;
            glow.style.setProperty('--mouse-x', `${mouseX}px`);
            glow.style.setProperty('--mouse-y', `${mouseY}px`);
            glow.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateY(0) rotateX(0) translateY(0) scale(1)`;
            glow.style.opacity = '0';
        });
    });
};

// Project Details Data
const projectData = {
    muzinda: {
        title: "Muzinda App",
        tag: "MOBILE APP / LOGISTICS",
        description: "A centralized platform for student accommodation and transport logistics. Streamlining essential student services through a unified, high-performance interface. Muzinda App connects students with verified housing near campus and matches them with logistics providers to simplify transit.",
        features: [
            "Real-time shuttle tracking with location telemetry.",
            "Verified student accommodation directory sorted by proximity.",
            "Secure, role-based login interfaces for students, landlords, and drivers.",
            "Integrated payment logging and instant confirmation receipts."
        ],
        security: [
            "Encrypted client-side storage for JWT access and refresh tokens.",
            "Strict input sanitization preventing injection attacks on form fields.",
            "SSL/TLS-only client-server communications with pinned endpoint URLs.",
            "Fine-grained Firebase / Supabase Row-Level Security (RLS) policies."
        ],
        techStack: ["React Native", "Expo", "Node.js", "Express", "Supabase", "PostgreSQL"],
        github: "https://github.com/Melusiii",
        demo: "#"
    },
    registration: {
        title: "Systems Reg",
        tag: "ENTERPRISE SYSTEM",
        description: "A robust enterprise-level application designed to manage complex educational user flows and multi-state data states with elite security standards. Systems Reg enables administrators and students to manage course registration processes synchronously, processing thousands of requests without database deadlocks.",
        features: [
            "Concurrent multi-user registration queue processing.",
            "Real-time academic prerequisite verification engines.",
            "Admin dashboard featuring enrollment data analytics and audit trail monitoring.",
            "Dynamic course capacity management with instant waitlist fallback."
        ],
        security: [
            "Implemented ASP.NET Core Identity with custom password hash algorithms.",
            "Strict Cross-Site Scripting (XSS) and SQL Injection prevention filters.",
            "Encrypted cookie policy with SameSite=Strict and HttpOnly parameters.",
            "Comprehensive server audit trail logs documenting registry state alterations."
        ],
        techStack: ["ASP.NET Core", "C#", "Entity Framework Core", "SQL Server", "Vanilla JS"],
        github: "https://github.com/Melusiii",
        demo: "#"
    }
};

// Project Modal Controller
const initProjectModals = () => {
    const modal = document.getElementById('projectModal');
    const backdrop = document.getElementById('modalBackdrop');
    const closeBtn = document.getElementById('modalClose');
    const modalContent = modal ? modal.querySelector('.modal-body-content') : null;
    const projectOverlays = document.querySelectorAll('.project-link-overlay');

    if (!modal || !backdrop || !closeBtn || !modalContent) return;

    // Attach project type identifiers to overlays
    const overlays = Array.from(projectOverlays);
    if (overlays[0]) overlays[0].setAttribute('data-project', 'muzinda');
    if (overlays[1]) overlays[1].setAttribute('data-project', 'registration');

    const openModal = (projectId) => {
        const data = projectData[projectId];
        if (!data) return;

        // Build HTML lists
        const featuresHtml = data.features.map(f => `<li>${f}</li>`).join('');
        const securityHtml = data.security.map(s => `<li>${s}</li>`).join('');
        const techHtml = data.techStack.map(t => `<span class="modal-tech-tag">${t}</span>`).join('');

        modalContent.innerHTML = `
            <div class="modal-details-grid">
                <div>
                    <span class="modal-project-tag">${data.tag}</span>
                    <h2 class="modal-project-title">${data.title}</h2>
                </div>

                <div>
                    <h3 class="modal-section-title">Overview</h3>
                    <p class="text-sm text-secondary" style="line-height: 1.6;">${data.description}</p>
                </div>

                <div class="form-row two-col" style="margin-top: 0.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    <div>
                        <h3 class="modal-section-title">Key Features</h3>
                        <ul class="text-sm text-secondary" style="padding-left: 1.25rem; line-height: 1.6; list-style-type: square;">
                            ${featuresHtml}
                        </ul>
                    </div>
                    <div>
                        <h3 class="modal-section-title">Security Focus</h3>
                        <ul class="text-sm text-secondary" style="padding-left: 1.25rem; line-height: 1.6; list-style-type: square;">
                            ${securityHtml}
                        </ul>
                    </div>
                </div>

                <div>
                    <h3 class="modal-section-title">Technologies</h3>
                    <div class="modal-tech-list">
                        ${techHtml}
                    </div>
                </div>

                <div class="modal-actions">
                    <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn-cyber">
                        <span>View Source Code</span>
                        <i class="fa-brands fa-github"></i>
                    </a>
                    ${data.demo !== '#' ? `
                    <a href="${data.demo}" target="_blank" rel="noopener noreferrer" class="btn-cyber btn-outline">
                        <span>Live Demo</span>
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                    ` : `
                    <span class="btn-cyber btn-outline" style="opacity: 0.5; cursor: not-allowed;" title="Private Client/Academic Registry System">
                        <span>Internal Deploy Only</span>
                        <i class="fa-solid fa-lock"></i>
                    </span>
                    `}
                </div>
            </div>
        `;

        modal.classList.add('modal-active');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();

        modal.addEventListener('keydown', trapFocus);
    };

    const closeModal = () => {
        modal.classList.remove('modal-active');
        document.body.style.overflow = '';
        modal.removeEventListener('keydown', trapFocus);
    };

    projectOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = overlay.getAttribute('data-project');
            openModal(projectId);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal-active')) {
            closeModal();
        }
    });

    const trapFocus = (e) => {
        if (e.key !== 'Tab') return;

        const focusables = modal.querySelectorAll('button, a, input, [tabindex="0"]');
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                last.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    };
};

// Cyber Terminal Simulator
const initTerminal = () => {
    const terminal = document.querySelector('.about-terminal-card');
    const input = document.getElementById('terminalInput');
    const output = document.getElementById('terminalOutput');
    if (!terminal || !input || !output) return;

    terminal.addEventListener('click', () => {
        input.focus();
    });

    let matrixInterval = null;
    let matrixCanvas = null;

    input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const val = input.value.trim();
            input.value = '';
            if (val === '') return;

            const cmdRow = document.createElement('div');
            cmdRow.className = 'cmd-line';
            cmdRow.innerHTML = `<span class="terminal-prompt">guest@melusi-cyber:~$</span> ${escapeHTML(val)}`;
            output.appendChild(cmdRow);

            await handleCommand(val.toLowerCase());
            output.scrollTop = output.scrollHeight;
        }
    });

    const escapeHTML = (str) => {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    };

    const writeLine = (text, className = 'output-line') => {
        const line = document.createElement('div');
        line.className = className;
        line.innerHTML = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
        return line;
    };

    const handleCommand = async (cmd) => {
        const parts = cmd.split(' ');
        const command = parts[0];

        switch (command) {
            case 'help':
                writeLine('Available commands:', 'system-line');
                writeLine('  <span class="text-emerald">about</span>    - Who is Melusi?');
                writeLine('  <span class="text-emerald">skills</span>   - View technical skillset & credentials');
                writeLine('  <span class="text-emerald">scan</span>     - Run cybersecurity analysis on portfolio');
                writeLine('  <span class="text-emerald">matrix</span>   - Toggle falling code matrix effect');
                writeLine('  <span class="text-emerald">social</span>   - Get social media & contact info');
                writeLine('  <span class="text-emerald">clear</span>    - Clear terminal history');
                writeLine('  <span class="text-emerald">help</span>     - Show list of commands');
                break;
            case 'about':
                writeLine('Melusi Shanzi is a CS student, Full Stack Developer, and Cisco Certified Cyber Specialist.', 'output-line');
                writeLine('He is focused on bridging secure application development with modern protective architecture.', 'output-line');
                writeLine('Passionate about practical problem-solving and building robust web and mobile applications.', 'output-line');
                break;
            case 'skills':
                writeLine('=========================================', 'system-line');
                writeLine('TECHNICAL INVENTORY', 'success-line');
                writeLine('=========================================', 'system-line');
                writeLine('<strong>Languages:</strong>    Python, C#, JavaScript, SQL');
                writeLine('<strong>Frontend:</strong>     React, Next.js, HTML5, CSS3');
                writeLine('<strong>Backend:</strong>      Supabase, Firebase, SQLite');
                writeLine('<strong>Cyber Sec:</strong>    Cisco Network Security & Defender');
                writeLine('=========================================', 'system-line');
                break;
            case 'scan':
                input.disabled = true;
                writeLine('[INIT] Commencing network scan on portfolio environment...', 'system-line');
                await sleep(600);
                writeLine('[INFO] Resolving Host: melusi-portfolio.secure', 'system-line');
                await sleep(500);
                writeLine('[INFO] Scanning ports...', 'system-line');
                await sleep(700);
                writeLine('[PORT] Port 80 (HTTP) -> Closed. Port 443 (HTTPS) -> <span class="success-line">OPEN (Secured)</span>', 'output-line');
                await sleep(400);
                writeLine('[INFO] Checking SSL/TLS protocol support...', 'system-line');
                await sleep(500);
                writeLine('[OK] TLS 1.3 Handshake established. Encryption: AES_256_GCM.', 'success-line');
                await sleep(400);
                writeLine('[INFO] Auditing SQL injection & XSS parameters...', 'system-line');
                await sleep(600);
                writeLine('[OK] Input sanitization verified. No active vectors found.', 'success-line');
                await sleep(500);
                writeLine('[SCAN COMPLETE] Threat Level: 0%. Security Posture: <span class="success-line">OPTIMIZED (A+)</span>', 'success-line');
                input.disabled = false;
                input.focus();
                break;
            case 'matrix':
                toggleMatrix();
                break;
            case 'social':
                writeLine('GitHub:   <a href="https://github.com/Melusiii" target="_blank" class="text-emerald">github.com/Melusiii</a>');
                writeLine('LinkedIn: <a href="https://www.linkedin.com/in/melusi-shanzi-1875b3350/" target="_blank" class="text-emerald">linkedin.com/in/melusi-shanzi-1875b3350</a>');
                writeLine('Email:    <a href="mailto:melushanzi32@gmail.com" class="text-emerald">melushanzi32@gmail.com</a>');
                break;
            case 'clear':
                output.innerHTML = '';
                break;
            default:
                writeLine(`Command not found: '${command}'. Type 'help' for assistance.`, 'error-line');
        }
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const toggleMatrix = () => {
        if (!matrixCanvas) {
            matrixCanvas = document.createElement('canvas');
            matrixCanvas.id = 'terminalMatrixCanvas';
            matrixCanvas.style.position = 'absolute';
            matrixCanvas.style.top = '0';
            matrixCanvas.style.left = '0';
            matrixCanvas.style.width = '100%';
            matrixCanvas.style.height = '100%';
            matrixCanvas.style.zIndex = '1';
            matrixCanvas.style.pointerEvents = 'none';
            matrixCanvas.style.opacity = '0.08';
            terminal.appendChild(matrixCanvas);
        }

        if (matrixInterval) {
            clearInterval(matrixInterval);
            matrixInterval = null;
            matrixCanvas.style.display = 'none';
            writeLine('Matrix effect: DISABLED', 'system-line');
        } else {
            matrixCanvas.style.display = 'block';
            startMatrix(matrixCanvas);
            writeLine('Matrix effect: ENABLED (type "matrix" to disable)', 'success-line');
        }
    };

    const startMatrix = (canvas) => {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = terminal.clientWidth;
        let height = canvas.height = terminal.clientHeight;

        window.addEventListener('resize', () => {
            if (matrixInterval && canvas.style.display !== 'none') {
                width = canvas.width = terminal.clientWidth;
                height = canvas.height = terminal.clientHeight;
            }
        });

        const columns = Math.floor(width / 14) + 1;
        const yPositions = Array(columns).fill(0);

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#10b981';
            ctx.font = '10pt monospace';

            yPositions.forEach((y, index) => {
                const text = String.fromCharCode(33 + Math.random() * 93);
                const x = index * 14;
                ctx.fillText(text, x, y);

                if (y > 100 + Math.random() * 10000) {
                    yPositions[index] = 0;
                } else {
                    yPositions[index] = y + 14;
                }
            });
        };

        matrixInterval = setInterval(draw, 33);
    };
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
