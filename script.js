/* ============================================================
   EDLAWIT DAMANA TESFAYE — Portfolio JS
   Theme: VS Code / Terminal / Hacker
   ============================================================ */

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ============================================================
   BOOT SEQUENCE
   ============================================================ */
const bootScreen = document.getElementById('bootScreen');
const bootText   = document.getElementById('bootText');
const bootBar    = document.getElementById('bootBar');

const bootLines = [
  '> initializing edlawit.dev...',
  '> loading modules: [HTML5, CSS3, JavaScript]',
  '> loading modules: [Node.js, Java, Python]',
  '> connecting to Addis Ababa, Ethiopia 🇪🇹',
  '> status: open_to_work = true',
  '> mounting portfolio...',
  '',
  '✓ all systems operational. welcome.',
];

let lineIdx = 0, charIdx = 0;
function typeBoot() {
  if (lineIdx >= bootLines.length) {
    bootBar.style.width = '100%';
    setTimeout(() => {
      bootScreen.classList.add('hide');
      setTimeout(() => bootScreen.remove(), 700);
    }, 400);
    return;
  }
  const line = bootLines[lineIdx];
  if (charIdx <= line.length) {
    bootText.textContent = bootLines.slice(0, lineIdx).join('\n') + '\n' + line.slice(0, charIdx);
    bootBar.style.width = ((lineIdx / bootLines.length) * 100) + '%';
    charIdx++;
    setTimeout(typeBoot, charIdx === 1 ? 120 : 22);
  } else {
    lineIdx++; charIdx = 0;
    setTimeout(typeBoot, 80);
  }
}
typeBoot();

/* ============================================================
   CUSTOM CURSOR + TRAIL
   ============================================================ */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mx = 0, my = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  setTimeout(() => {
    cursorTrail.style.left = mx + 'px';
    cursorTrail.style.top  = my + 'px';
  }, 80);
});

/* ============================================================
   NAV SCROLL
   ============================================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ============================================================
   MOBILE HAMBURGER
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ============================================================
   ACTIVE NAV ON SCROLL
   ============================================================ */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

/* ============================================================
   HERO TYPEWRITER
   ============================================================ */
const heroLine1 = document.getElementById('heroLine1');
const words = ['Full Stack', 'Frontend', 'Backend', 'Full Stack'];
let wIdx = 0, cIdx = 0, deleting = false;

function typeWriter() {
  const word = words[wIdx];
  if (!deleting) {
    heroLine1.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) { deleting = true; setTimeout(typeWriter, 1800); return; }
  } else {
    heroLine1.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; }
  }
  setTimeout(typeWriter, deleting ? 55 : 95);
}
typeWriter();

/* ============================================================
   MATRIX RAIN
   ============================================================ */
const canvas = document.getElementById('matrixCanvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); resetDrops(); });

const chars   = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF{}[]<>/\\;:=+-*&^%$#@!'.split('');
const fontSize = 13;
let drops = [];

function resetDrops() {
  const cols = Math.floor(canvas.width / fontSize);
  drops = Array(cols).fill(1);
}
resetDrops();

function drawMatrix() {
  ctx.fillStyle = 'rgba(13,17,23,0.04)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drops.forEach((y, i) => {
    // bright head
    ctx.fillStyle = '#aaffaa';
    ctx.font = fontSize + 'px "Fira Code", monospace';
    ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, y * fontSize);
    // trail
    ctx.fillStyle = '#3fb950';
    if (y > 1) ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, (y - 1) * fontSize);
    if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(drawMatrix, 45);

/* ============================================================
   SKILL TABS
   ============================================================ */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('tab-btn--active'));
    btn.classList.add('tab-btn--active');
    document.querySelectorAll('.skills__panel').forEach(p => p.classList.add('hidden'));
    const panel = document.getElementById('tab-' + btn.dataset.tab);
    panel.classList.remove('hidden');
    panel.querySelectorAll('.skill-bar').forEach(bar => {
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 80);
    });
  });
});

/* ============================================================
   INTERSECTION OBSERVER — fade + bars + counters
   ============================================================ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('visible');
    el.querySelectorAll('.skill-bar').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
    el.querySelectorAll('.stat__num').forEach(num => {
      const target = parseInt(num.dataset.target);
      let current = 0;
      const step = Math.ceil(target / 50);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        num.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 28);
    });
    io.unobserve(el);
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.fade-in, .skill-card, .project-card, .service-card, .testimonial-card, .pricing-card, .process__step, .about__left, .about__right, .about__stats'
).forEach(el => io.observe(el));

window.addEventListener('load', () => {
  document.querySelectorAll('#tab-frontend .skill-bar').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
});

/* ============================================================
   3D TILT ON PROJECT CARDS
   ============================================================ */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) *  8;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
  });
});

/* ============================================================
   COMMAND PALETTE  (Ctrl+K)
   ============================================================ */
const cmdPalette = document.getElementById('cmdPalette');
const cmdInput   = document.getElementById('cmdInput');
const cmdItems   = document.querySelectorAll('.cmd-item');
let selectedCmd  = -1;

function openPalette() {
  cmdPalette.classList.add('open');
  cmdInput.value = '';
  cmdInput.focus();
  selectedCmd = -1;
  filterCmds('');
}
function closePalette() {
  cmdPalette.classList.remove('open');
  selectedCmd = -1;
}
function filterCmds(q) {
  cmdItems.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
}
function selectCmd(dir) {
  const visible = [...cmdItems].filter(i => i.style.display !== 'none');
  if (!visible.length) return;
  visible.forEach(i => i.classList.remove('selected'));
  selectedCmd = (selectedCmd + dir + visible.length) % visible.length;
  visible[selectedCmd].classList.add('selected');
}
function executeCmd() {
  const visible = [...cmdItems].filter(i => i.style.display !== 'none');
  const target  = selectedCmd >= 0 ? visible[selectedCmd] : visible[0];
  if (!target) return;
  const href = target.dataset.href;
  closePalette();
  document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openPalette(); return; }
  if (!cmdPalette.classList.contains('open')) return;
  if (e.key === 'Escape')    { closePalette(); return; }
  if (e.key === 'ArrowDown') { e.preventDefault(); selectCmd(1); return; }
  if (e.key === 'ArrowUp')   { e.preventDefault(); selectCmd(-1); return; }
  if (e.key === 'Enter')     { e.preventDefault(); executeCmd(); return; }
});
cmdInput.addEventListener('input', () => { filterCmds(cmdInput.value); selectedCmd = -1; });
cmdPalette.addEventListener('click', e => { if (e.target === cmdPalette) closePalette(); });
cmdItems.forEach(item => {
  item.addEventListener('click', () => {
    const href = item.dataset.href;
    closePalette();
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
  });
});

/* ============================================================
   LIVE UPTIME COUNTER
   ============================================================ */
const uptimeEl = document.getElementById('uptime');
const startTime = Date.now();
function updateUptime() {
  const s = Math.floor((Date.now() - startTime) / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  if (uptimeEl) uptimeEl.textContent = h + ':' + m + ':' + sec;
}
setInterval(updateUptime, 1000);

/* ============================================================
   KONAMI CODE EASTER EGG
   ============================================================ */
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
const toast = document.createElement('div');
toast.className = 'konami-toast';
toast.textContent = '🎉 CHEAT CODE ACTIVATED — you found the easter egg!';
document.body.appendChild(toast);

document.addEventListener('keydown', e => {
  if (cmdPalette && cmdPalette.classList.contains('open')) return;
  if (e.key === konami[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === konami.length) {
      konamiIdx = 0;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }
  } else { konamiIdx = 0; }
});

/* ============================================================
   CONTACT FORM
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const contactBtn  = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name    = this.elements['name'].value.trim();
    const email   = this.elements['email'].value.trim();
    const subject = this.elements['subject'].value.trim();
    const message = this.elements['message'].value.trim();

    // Show sending state
    if (contactBtn) {
      contactBtn.textContent = '$ sending...';
      contactBtn.disabled = true;
    }

    const to  = 'etes2533@gmail.com';
    const sub = encodeURIComponent(subject + ' — from ' + name);
    const bod = encodeURIComponent(
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n\n' +
      message
    );

    // Open Gmail compose in new tab — works for everyone, no email client needed
    const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1' +
      '&to=' + encodeURIComponent(to) +
      '&su=' + sub +
      '&body=' + bod;

    window.open(gmailUrl, '_blank', 'noopener');

    // Show success feedback then reset
    setTimeout(() => {
      if (contactBtn) {
        contactBtn.textContent = '✓ opened in Gmail';
        contactBtn.style.background = 'var(--green)';
        contactBtn.style.color = 'var(--bg)';
      }
      setTimeout(() => {
        contactForm.reset();
        if (contactBtn) {
          contactBtn.textContent = '$ send --message';
          contactBtn.style.background = '';
          contactBtn.style.color = '';
          contactBtn.disabled = false;
        }
      }, 3000);
    }, 500);
  });
}

/* ============================================================
   CUSTOM PACKAGE BUILDER
   ============================================================ */
(function () {
  const checks   = document.querySelectorAll('.pkg-check');
  const totalEl  = document.getElementById('pkgTotal');
  const linesEl  = document.getElementById('resultLines');
  const pkgCta   = document.getElementById('pkgCta');

  if (!checks.length || !totalEl) return;

  const labels = {
    landing:    'landing_page',
    responsive: 'responsive_design',
    seo:        'seo_optimization',
    contact_form:'contact_form',
    backend:    'backend_api',
    database:   'database_integration',
    auth:       'user_authentication',
    ecommerce:  'ecommerce_module',
    admin:      'admin_dashboard',
    deploy:     'cloud_deployment',
    support:    'one_month_support',
    source:     'full_source_code',
  };

  function fmt(n) {
    return n.toLocaleString('en-ET');
  }

  function update() {
    let total = 0;
    const selected = [];

    checks.forEach(cb => {
      // sync the bool value in the label text
      const labelSpan = cb.closest('.pkg-item').querySelector('.pkg-item__label .bool');
      if (labelSpan) labelSpan.textContent = cb.checked ? 'true' : 'false';

      if (cb.checked) {
        total += parseInt(cb.dataset.price);
        selected.push({ key: cb.dataset.key, price: parseInt(cb.dataset.price) });
      }
    });

    // Animate total
    totalEl.classList.remove('pop');
    void totalEl.offsetWidth; // reflow
    totalEl.textContent = fmt(total);
    totalEl.classList.add('pop');

    // Rebuild output lines
    linesEl.innerHTML = '';
    if (selected.length === 0) {
      linesEl.innerHTML = '<p><span class="text--muted">// no features selected</span></p>';
    } else {
      selected.forEach(item => {
        const p = document.createElement('p');
        p.className = 'result__line--added';
        p.innerHTML = `<span class="text--green">+</span> <span class="text--cyan">${labels[item.key] || item.key}</span> <span class="text--muted">// ETB ${fmt(item.price)}</span>`;
        linesEl.appendChild(p);
      });
    }

    // Update CTA href to pre-fill contact subject
    const names = selected.map(s => labels[s.key] || s.key).join(', ');
    const subject = encodeURIComponent(`Custom Package Inquiry — ETB ${fmt(total)}`);
    const body    = encodeURIComponent(`Hi Edlawit,\n\nI used the package builder and selected:\n${names}\n\nEstimated total: ETB ${fmt(total)}\n\nPlease send me a final quote.`);
    const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1' +
      '&to=' + encodeURIComponent('etes2533@gmail.com') +
      '&su=' + subject +
      '&body=' + body;
    pkgCta.href = gmailUrl;
    pkgCta.target = '_blank';
    pkgCta.rel = 'noopener';
  }

  checks.forEach(cb => cb.addEventListener('change', update));
  update(); // run on load
})();
