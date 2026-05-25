/* ============================================================
   EDLAWIT DAMANA — Portfolio JS  (performance-optimised)
   ============================================================ */

const isMobile = () => window.innerWidth <= 768;

/* ---- Scroll progress (throttled with rAF) ---- */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);
let rafScroll = false;
window.addEventListener('scroll', () => {
  if (rafScroll) return;
  rafScroll = true;
  requestAnimationFrame(() => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = pct + '%';
    rafScroll = false;
  });
}, { passive: true });

/* ---- Boot sequence ---- */
const bootScreen = document.getElementById('bootScreen');
const bootText   = document.getElementById('bootText');
const bootBar    = document.getElementById('bootBar');

const bootLines = [
  '> initializing edlawit.dev...',
  '> loading: [HTML5, CSS3, JavaScript]',
  '> loading: [Node.js, Java, Python]',
  '> location: Addis Ababa, Ethiopia 🇪🇹',
  '> status: open_to_work = true',
  '',
  '✓ all systems operational. welcome.',
];

let lineIdx = 0, charIdx = 0;
function typeBoot() {
  if (lineIdx >= bootLines.length) {
    bootBar.style.width = '100%';
    setTimeout(() => {
      bootScreen.classList.add('hide');
      setTimeout(() => { if (bootScreen.parentNode) bootScreen.remove(); }, 700);
    }, 300);
    return;
  }
  const line = bootLines[lineIdx];
  if (charIdx <= line.length) {
    bootText.textContent = bootLines.slice(0, lineIdx).join('\n') + '\n' + line.slice(0, charIdx);
    bootBar.style.width = ((lineIdx / bootLines.length) * 100) + '%';
    charIdx++;
    setTimeout(typeBoot, charIdx === 1 ? 80 : 18);
  } else {
    lineIdx++; charIdx = 0;
    setTimeout(typeBoot, 60);
  }
}
typeBoot();

/* ---- Custom cursor (desktop only, rAF-based) ---- */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

if (!isMobile() && cursor) {
  let cx = 0, cy = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; }, { passive: true });
  function animateCursor() {
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    tx += (cx - tx) * 0.18;
    ty += (cy - ty) * 0.18;
    cursorTrail.style.left = tx + 'px';
    cursorTrail.style.top  = ty + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

/* ---- Nav scroll ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---- Mobile hamburger ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav__link, .btn--hire').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---- Active nav on scroll (throttled) ---- */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__link');
let rafNav = false;
window.addEventListener('scroll', () => {
  if (rafNav) return;
  rafNav = true;
  requestAnimationFrame(() => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
    rafNav = false;
  });
}, { passive: true });

/* ---- Hero typewriter ---- */
const heroLine1 = document.getElementById('heroLine1');
if (heroLine1) {
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
}

/* ---- Matrix rain (disabled on mobile, optimised on desktop) ---- */
const canvas = document.getElementById('matrixCanvas');
if (canvas) {
  if (isMobile()) {
    // hide canvas on mobile — saves battery and removes lag
    canvas.style.display = 'none';
  } else {
    const ctx = canvas.getContext('2d');
    const FONT_SIZE = 13;
    const CHARS = 'アイウエオカキクケコ0123456789ABCDEF{}[]<>/\\;:='.split('');
    let drops = [];

    function resizeCanvas() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drops = Array(Math.floor(canvas.width / FONT_SIZE)).fill(1);
    }
    resizeCanvas();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 200);
    });

    // Set font once outside the loop
    ctx.font = FONT_SIZE + 'px "Fira Code", monospace';

    let lastMatrix = 0;
    function drawMatrix(ts) {
      requestAnimationFrame(drawMatrix);
      if (ts - lastMatrix < 80) return; // ~12fps — smooth enough, much less CPU
      lastMatrix = ts;

      ctx.fillStyle = 'rgba(13,17,23,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i];
        // head — bright
        ctx.fillStyle = '#aaffaa';
        ctx.fillText(CHARS[Math.random() * CHARS.length | 0], i * FONT_SIZE, y * FONT_SIZE);
        // trail
        ctx.fillStyle = '#3fb950';
        if (y > 1) ctx.fillText(CHARS[Math.random() * CHARS.length | 0], i * FONT_SIZE, (y - 1) * FONT_SIZE);
        if (y * FONT_SIZE > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    requestAnimationFrame(drawMatrix);
  }
}

/* ---- Skill tabs ---- */
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

/* ---- Intersection observer (fade + bars + counters) ---- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('visible');
    el.querySelectorAll('.skill-bar').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
    el.querySelectorAll('.stat__num').forEach(num => {
      const target = parseInt(num.dataset.target);
      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        num.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 30);
    });
    io.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.fade-in, .skill-card, .project-card, .service-card, .testimonial-card, .pricing-card, .process__step, .about__left, .about__right, .about__stats'
).forEach(el => io.observe(el));

window.addEventListener('load', () => {
  document.querySelectorAll('#tab-frontend .skill-bar').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
});

/* ---- 3D tilt (desktop only) ---- */
if (!isMobile()) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const rotX = (((e.clientY - rect.top)  / rect.height) - 0.5) * -12;
      const rotY = (((e.clientX - rect.left) / rect.width)  - 0.5) *  12;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    }, { passive: true });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---- Command palette (Ctrl+K) ---- */
const cmdPalette = document.getElementById('cmdPalette');
const cmdInput   = document.getElementById('cmdInput');
const cmdItems   = document.querySelectorAll('.cmd-item');
let selectedCmd  = -1;

function openPalette()  { cmdPalette.classList.add('open'); cmdInput.value = ''; cmdInput.focus(); selectedCmd = -1; filterCmds(''); }
function closePalette() { cmdPalette.classList.remove('open'); selectedCmd = -1; }
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
  closePalette();
  document.querySelector(target.dataset.href).scrollIntoView({ behavior: 'smooth' });
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
    closePalette();
    document.querySelector(item.dataset.href).scrollIntoView({ behavior: 'smooth' });
  });
});

/* ---- Live uptime ---- */
const uptimeEl  = document.getElementById('uptime');
const startTime = Date.now();
if (uptimeEl) {
  setInterval(() => {
    const s   = Math.floor((Date.now() - startTime) / 1000);
    const h   = String(Math.floor(s / 3600)).padStart(2, '0');
    const m   = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    uptimeEl.textContent = h + ':' + m + ':' + sec;
  }, 1000);
}

/* ---- Konami easter egg ---- */
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
const toast = document.createElement('div');
toast.className = 'konami-toast';
toast.textContent = '🎉 CHEAT CODE ACTIVATED — you found the easter egg!';
document.body.appendChild(toast);
document.addEventListener('keydown', e => {
  if (cmdPalette && cmdPalette.classList.contains('open')) return;
  if (e.key === konami[konamiIdx]) {
    if (++konamiIdx === konami.length) {
      konamiIdx = 0;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }
  } else { konamiIdx = 0; }
});

/* ---- Contact form ---- */
const contactForm = document.getElementById('contactForm');
const contactBtn  = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name    = this.elements['name'].value.trim();
    const email   = this.elements['email'].value.trim();
    const subject = this.elements['subject'].value.trim();
    const message = this.elements['message'].value.trim();
    if (contactBtn) { contactBtn.textContent = '$ sending...'; contactBtn.disabled = true; }
    const sub = encodeURIComponent(subject + ' — from ' + name);
    const bod = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=ede095053%40gmail.com&su=' + sub + '&body=' + bod, '_blank', 'noopener');
    setTimeout(() => {
      if (contactBtn) { contactBtn.textContent = '✓ opened in Gmail'; contactBtn.style.background = 'var(--green)'; contactBtn.style.color = 'var(--bg)'; }
      setTimeout(() => {
        contactForm.reset();
        if (contactBtn) { contactBtn.textContent = '$ send --message'; contactBtn.style.background = ''; contactBtn.style.color = ''; contactBtn.disabled = false; }
      }, 3000);
    }, 500);
  });
}

/* ---- Custom package builder ---- */
(function () {
  const checks  = document.querySelectorAll('.pkg-check');
  const totalEl = document.getElementById('pkgTotal');
  const linesEl = document.getElementById('resultLines');
  const pkgCta  = document.getElementById('pkgCta');
  if (!checks.length || !totalEl) return;

  const labels = { landing:'landing_page', responsive:'responsive_design', seo:'seo_optimization', contact_form:'contact_form', backend:'backend_api', database:'database_integration', auth:'user_authentication', ecommerce:'ecommerce_module', admin:'admin_dashboard', deploy:'cloud_deployment', support:'one_month_support', source:'full_source_code' };
  const fmt = n => n.toLocaleString('en-ET');

  function update() {
    let total = 0;
    const selected = [];
    checks.forEach(cb => {
      const boolSpan = cb.closest('.pkg-item').querySelector('.pkg-item__label .bool');
      if (boolSpan) boolSpan.textContent = cb.checked ? 'true' : 'false';
      if (cb.checked) { total += +cb.dataset.price; selected.push({ key: cb.dataset.key, price: +cb.dataset.price }); }
    });
    totalEl.classList.remove('pop');
    void totalEl.offsetWidth;
    totalEl.textContent = fmt(total);
    totalEl.classList.add('pop');
    linesEl.innerHTML = selected.length === 0
      ? '<p><span class="text--muted">// no features selected</span></p>'
      : selected.map(s => `<p class="result__line--added"><span class="text--green">+</span> <span class="text--cyan">${labels[s.key]||s.key}</span> <span class="text--muted">// ETB ${fmt(s.price)}</span></p>`).join('');
    if (pkgCta) {
      const names = selected.map(s => labels[s.key]||s.key).join(', ');
      const su = encodeURIComponent('Custom Package — ETB ' + fmt(total));
      const bo = encodeURIComponent('Hi Edlawit,\n\nSelected features:\n' + names + '\n\nEstimate: ETB ' + fmt(total) + '\n\nPlease send a final quote.');
      pkgCta.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=ede095053%40gmail.com&su=' + su + '&body=' + bo;
      pkgCta.target = '_blank'; pkgCta.rel = 'noopener';
    }
  }
  checks.forEach(cb => cb.addEventListener('change', update));
  update();
})();
