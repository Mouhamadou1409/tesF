'use strict';

/* ── Sanitisation XSS ── */
function sanitize(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

/* ── Rate limiting formulaire ── */
let lastSubmit = 0;
const RATE_LIMIT = 60000; // 60 s

/* ── Menu mobile ── */
function openMenu() {
  const nav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileOverlay');
  const toggle = document.getElementById('menuToggle');
  if (!nav) return;
  nav.classList.add('open');
  overlay && overlay.classList.add('open');
  toggle && toggle.classList.add('open');
  toggle && toggle.setAttribute('aria-expanded', 'true');
  document.documentElement.classList.add('menu-open');
}

function closeMenu() {
  const nav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileOverlay');
  const toggle = document.getElementById('menuToggle');
  if (!nav) return;
  nav.classList.remove('open');
  overlay && overlay.classList.remove('open');
  toggle && toggle.classList.remove('open');
  toggle && toggle.setAttribute('aria-expanded', 'false');
  document.documentElement.classList.remove('menu-open');
}

/* ── Onglets programme ── */
function showAxe(i) {
  document.querySelectorAll('.prog-item').forEach((t, j) => t.classList.toggle('active', j === i));
  document.querySelectorAll('.prog-panel').forEach((p, j) => p.classList.toggle('active', j === i));
}

/* ── Accordéon mobile ── */
function setArrowLabel(panel) {
  const txt = panel.querySelector('.arr-txt');
  if (txt) txt.textContent = panel.classList.contains('acc-open') ? 'Réduire' : 'Voir le contenu';
}

function initAccordion() {
  if (window.innerWidth > 720) return;
  document.querySelectorAll('.prog-panel').forEach((panel, i) => {
    const header = panel.querySelector('.prog-hdr');
    const body = panel.querySelector('.prog-body');
    if (!header || !body || header.dataset.acc) return;
    header.dataset.acc = '1';
    const arrow = document.createElement('span');
    arrow.className = 'prog-arrow';
    arrow.innerHTML = '<span class="arr-txt">Voir le contenu</span><span class="arr-chev">&#9660;</span>';
    header.appendChild(arrow);
    const wrap = document.createElement('div');
    wrap.className = 'prog-body-wrap';
    body.parentNode.insertBefore(wrap, body);
    wrap.appendChild(body);
    if (i === 0) { panel.classList.add('acc-open'); setArrowLabel(panel); }
    header.addEventListener('click', () => {
      const wasOpen = panel.classList.contains('acc-open');
      document.querySelectorAll('.prog-panel').forEach(p => { p.classList.remove('acc-open'); setArrowLabel(p); });
      if (!wasOpen) { panel.classList.add('acc-open'); setArrowLabel(panel); }
    });
  });
}

/* ── Scroll reveal ── */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal, .ps-card, .cand-card, .ag-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/* ── Projets cards animation ── */
function initProjectCards() {
  const cards = document.querySelectorAll('.ps-blk, .ps-hero-card');
  if (!cards.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = Array.from(cards).indexOf(e.target);
        const delay = (idx % 2) * 130;
        setTimeout(() => e.target.classList.add('ps-in'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin:'0px 0px -30px 0px' });
  cards.forEach(c => obs.observe(c));
}

/* ── Exemples de mise en œuvre — accordéon ── */
function initExamples() {
  document.querySelectorAll('.ps-ex-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        body.setAttribute('hidden', '');
      } else {
        body.removeAttribute('hidden');
        body.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
}

/* ── Header ombre au scroll ── */
function initHeaderScroll() {
  const h = document.querySelector('.site-header');
  if (!h) return;
  window.addEventListener('scroll', () => {
    h.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(0,60,126,.08)' : 'none';
  }, { passive: true });
}

/* ── Smooth scroll ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ── Validation formulaire ── */
function validateForm(data) {
  const errors = [];
  if (!data.prenom || data.prenom.length < 2) errors.push('Prénom requis (2 caractères minimum).');
  if (!data.nom || data.nom.length < 2) errors.push('Nom requis (2 caractères minimum).');
  const emailRe = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!data.email || !emailRe.test(data.email)) errors.push('Adresse email invalide.');
  if (!data.statut || data.statut === '') errors.push('Veuillez sélectionner votre statut.');
  if (!data.message || data.message.length < 10) errors.push('Message trop court (10 caractères minimum).');
  if (data.message && data.message.length > 2000) errors.push('Message trop long (2000 caractères maximum).');
  return errors;
}

/* ── Affichage message formulaire ── */
function showFormMessage(type, text) {
  const existing = document.getElementById('formMessage');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.id = 'formMessage';
  div.setAttribute('role', type === 'error' ? 'alert' : 'status');
  div.style.cssText = [
    'padding:.85rem 1.1rem',
    'border-radius:4px',
    'font-size:.86rem',
    'margin-top:.8rem',
    'font-weight:500',
    type === 'success'
      ? 'background:#dcfce7;color:#166534;border:1px solid #bbf7d0;'
      : 'background:#fee2e2;color:#991b1b;border:1px solid #fecaca;'
  ].join(';');
  div.textContent = sanitize(text);
  const form = document.getElementById('contactForm');
  if (form) form.appendChild(div);
}

/* ── Soumission formulaire (Formspree) ── */
async function handleSubmit(e) {
  e.preventDefault();

  // Vérifier honeypot (bot trap)
  const honeypot = document.getElementById('_hp_website');
  if (honeypot && honeypot.value !== '') return;

  // Rate limiting côté client
  const now = Date.now();
  if (now - lastSubmit < RATE_LIMIT) {
    const wait = Math.ceil((RATE_LIMIT - (now - lastSubmit)) / 1000);
    showFormMessage('error', `Veuillez patienter ${wait} seconde(s) avant de renvoyer un message.`);
    return;
  }

  const prenom  = sanitize(document.getElementById('prenom').value.trim());
  const nom     = sanitize(document.getElementById('nom').value.trim());
  const email   = sanitize(document.getElementById('email').value.trim().toLowerCase());
  const statut  = sanitize(document.getElementById('statut').value);
  const message = sanitize(document.getElementById('message').value.trim());

  const errors = validateForm({ prenom, nom, email, statut, message });
  if (errors.length > 0) {
    showFormMessage('error', errors[0]);
    return;
  }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Envoi en cours…';

  try {
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/VOTRE_ID_FORMSPREE';

    if (FORMSPREE_ENDPOINT.includes('VOTRE_ID_FORMSPREE')) {
      throw new Error('Formulaire non configuré. Veuillez nous contacter directement par e-mail : contact@madyibrahima4esp2026.com');
    }

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prenom,
        nom,
        email,
        statut,
        message,
        _subject: `[ESP Campagne 2026] Message de ${prenom} ${nom}`
      })
    });

    if (response.ok) {
      lastSubmit = Date.now();
      showFormMessage('success', '✅ Message bien envoyé ! Nous vous répondrons dans les plus brefs délais.');
      document.getElementById('contactForm').reset();
    } else {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Erreur serveur');
    }
  } catch (err) {
    showFormMessage('error', 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Envoyer le message →';
  }
}

/* ── Video modal ── */
function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  if (modal) {
    modal.classList.remove('show');
    sessionStorage.setItem('videoModalSeen', '1');
  }
}

function initVideoModal() {
  const modal = document.getElementById('videoModal');
  if (!modal) return;
  if (sessionStorage.getItem('videoModalSeen')) return;

  setTimeout(() => {
    modal.classList.add('show');
  }, 3000);

  const watchBtn = document.getElementById('watchVideoBtn');
  if (watchBtn) {
    watchBtn.addEventListener('click', () => {
      closeVideoModal();
      const section = document.getElementById('video');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const vid = document.getElementById('mainVideo');
        if (vid) vid.play().catch(() => {});
      }, 700);
    });
  }

  const laterBtn = document.getElementById('laterVideoBtn');
  if (laterBtn) laterBtn.addEventListener('click', closeVideoModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeVideoModal();
  });
}

/* ── Compteurs animés (KPIs vidéo) ── */
function initCounters() {
  const counters = document.querySelectorAll('.vd-kpi-val[data-target]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 900;
      const steps = target;
      const delay = duration / steps;
      let current = 0;
      const timer = setInterval(() => {
        current++;
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, delay);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => obs.observe(c));
}

/* ── Garde documents non disponibles ── */
const DOC_UNAVAILABLE = [];

function showDocToast() {
  const existing = document.getElementById('doc-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'doc-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  const icon = document.createElement('span');
  icon.className = 'doc-toast-icon';
  icon.textContent = '📄';
  const msg = document.createElement('span');
  msg.textContent = 'Ce document n’est pas encore disponible. Revenez bientôt !';
  const btn = document.createElement('button');
  btn.className = 'doc-toast-close';
  btn.setAttribute('aria-label', 'Fermer');
  btn.textContent = '✕';
  btn.addEventListener('click', () => toast.remove());
  toast.append(icon, msg, btn);
  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentElement) toast.remove(); }, 5000);
}

function initDocGuard() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = (link.getAttribute('href') || '').replace(/^\.\//, '');
    if (DOC_UNAVAILABLE.includes(href)) {
      e.preventDefault();
      showDocToast();
    }
  });
}

/* ── Initialisation ── */
document.addEventListener('DOMContentLoaded', () => {
  initDocGuard();
  initSmoothScroll();
  initAccordion();
  initReveal();
  initProjectCards();
  initExamples();
  initHeaderScroll();
  initVideoModal();
  initCounters();

  // Menu mobile — overlay backdrop
  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  overlay.id = 'mobileOverlay';
  overlay.addEventListener('click', closeMenu);
  document.body.appendChild(overlay);

  // Injecter l'en-tête dans le panneau nav
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) {
    const oldClose = document.getElementById('closeMenu');
    if (oldClose) oldClose.remove();
    const hd = document.createElement('div');
    hd.className = 'mob-nav-hd';
    hd.innerHTML = '<div class="mob-nav-brand"><strong>Mady &amp; Ibrahima</strong><span>Ensemble vers une nouvelle dynamique de performances</span></div><button class="close-btn" id="closeMenu" aria-label="Fermer le menu">&#x2715;</button>';
    mobileNav.insertBefore(hd, mobileNav.firstChild);
    document.getElementById('closeMenu').addEventListener('click', closeMenu);

    // Marquer le lien actif
    const page = window.location.pathname.split('/').pop() || 'index.html';
    mobileNav.querySelectorAll('a').forEach(a => {
      if (a.getAttribute('href') === page) a.classList.add('active');
    });
  }

  const toggle = document.getElementById('menuToggle');
  if (toggle) toggle.addEventListener('click', openMenu);

  // Fermer menu et modal avec Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMenu();
      closeVideoModal();
    }
  });

  // Programme — onglets sidebar
  document.querySelectorAll('.prog-item').forEach((item, i) => {
    item.addEventListener('click', () => showAxe(i));
  });

  // Formulaire
  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', handleSubmit);

  // Galerie candidats — afficher description au survol doigt sur mobile
  document.querySelectorAll('.gal-item .gal-overlay-cand').forEach(overlay => {
    const card = overlay.closest('.gal-item');
    card.addEventListener('touchstart', () => {
      if (window.innerWidth > 720) return;
      const isOpen = card.classList.contains('tapped');
      document.querySelectorAll('.gal-item.tapped').forEach(c => c.classList.remove('tapped'));
      if (!isOpen) card.classList.add('tapped');
    }, { passive: true });
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth <= 720) initAccordion();
}, { passive: true });
