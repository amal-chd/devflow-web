/* ── Year ──────────────────────────────────────────────────────── */
const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Announcement bar dismiss ──────────────────────────────────── */
const announceBar   = document.querySelector('#announce-bar');
const announceClose = document.querySelector('#announce-close');

if (announceBar && announceClose) {
  // restore dismissed state
  if (sessionStorage.getItem('df-announce-dismissed') === '1') {
    announceBar.style.display = 'none';
    document.documentElement.style.setProperty('--announce-h', '0px');
  }
  announceClose.addEventListener('click', () => {
    announceBar.style.height = announceBar.offsetHeight + 'px';
    requestAnimationFrame(() => {
      announceBar.style.transition = 'height 280ms ease, opacity 280ms ease';
      announceBar.style.overflow   = 'hidden';
      announceBar.style.height     = '0';
      announceBar.style.opacity    = '0';
    });
    setTimeout(() => {
      announceBar.style.display = 'none';
      document.documentElement.style.setProperty('--announce-h', '0px');
    }, 300);
    sessionStorage.setItem('df-announce-dismissed', '1');
  });
}

/* ── Header scroll shadow ──────────────────────────────────────── */
const header = document.querySelector('#site-header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 4);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Active nav link (page-level) ──────────────────────────────── */
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link[href], .mobile-nav-links a[href], .site-nav a[href]').forEach((link) => {
  const href = link.getAttribute('href') || '';
  const target = href.split('#')[0].replace('./', '');
  if (
    (target === currentPath ||
    (currentPath === 'index.html' && target === 'index.html') ||
    (currentPath === '' && target === 'index.html')) &&
    !href.includes('#')
  ) {
    link.classList.add('is-current');
    link.setAttribute('aria-current', 'page');
  }
});

/* ── Keyboard-accessible dropdowns ────────────────────────────── */
document.querySelectorAll('.nav-item').forEach((item) => {
  const trigger  = item.querySelector('.nav-link[role="button"]');
  const dropdown = item.querySelector('.nav-dropdown');
  if (!trigger || !dropdown) return;

  // toggle on click (touch devices)
  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    // close all others
    document.querySelectorAll('.nav-link[role="button"]').forEach((t) => t.setAttribute('aria-expanded', 'false'));
    trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  });

  // close on outside click
  document.addEventListener('click', (e) => {
    if (!item.contains(e.target)) trigger.setAttribute('aria-expanded', 'false');
  });

  // keyboard nav inside dropdown
  dropdown.querySelectorAll('.dropdown-link').forEach((link, i, all) => {
    link.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && all[i + 1]) { e.preventDefault(); all[i + 1].focus(); }
      if (e.key === 'ArrowUp'   && all[i - 1]) { e.preventDefault(); all[i - 1].focus(); }
      if (e.key === 'Escape') { trigger.setAttribute('aria-expanded', 'false'); trigger.focus(); }
    });
  });
});

/* ── Mobile nav toggle ─────────────────────────────────────────── */
const navToggle  = document.querySelector('#nav-toggle');
const mobileNav  = document.querySelector('#mobile-nav');

const setMobileMenu = (isOpen) => {
  if (!navToggle || !mobileNav) return;
  mobileNav.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  navToggle.innerHTML = isOpen
    ? `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
         <path d="M2 2l11 11M13 2L2 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
       </svg>`
    : `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
         <path d="M2 3.5h11M2 7.5h11M2 11.5h11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
       </svg>`;
  document.body.style.overflow = isOpen ? 'hidden' : '';
};

if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => setMobileMenu(!mobileNav.classList.contains('is-open')));

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMobileMenu(false));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) setMobileMenu(false);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMobileMenu(false);
  });
}

/* ── Scroll-reveal via IntersectionObserver ────────────────────── */
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
    return;
  }
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.07, rootMargin: '0px 0px -36px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();

/* ── FAQ accordion — one open at a time ────────────────────────── */
document.querySelectorAll('.faq-item').forEach((details) => {
  details.addEventListener('toggle', () => {
    if (details.open) {
      document.querySelectorAll('.faq-item[open]').forEach((other) => {
        if (other !== details) other.removeAttribute('open');
      });
    }
  });
});

/* ── Subtle 3-D card tilt on hover ────────────────────────────── */
const tiltCards = document.querySelectorAll('.audience-card, .trust-card, .pricing-tier, .value-card');
tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 8;
    card.style.transition = 'transform 80ms linear';
    card.style.transform  = `perspective(700px) rotateX(${-y * 0.35}deg) rotateY(${x * 0.35}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 420ms cubic-bezier(0.16,1,0.3,1)';
    card.style.transform  = '';
  });
});

/* ── App sidebar item click simulation ─────────────────────────── */
document.querySelectorAll('.sidebar-item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-item').forEach((i) => i.classList.remove('active'));
    item.classList.add('active');
  });
});

/* ── Legal sidebar scroll-spy ──────────────────────────────────── */
(() => {
  const sidebar = document.querySelector('.legal-sidebar');
  if (!sidebar || !('IntersectionObserver' in window)) return;

  const sidebarLinks = sidebar.querySelectorAll('a[href^="#"]');
  if (!sidebarLinks.length) return;

  const sectionMap = new Map();
  sidebarLinks.forEach((link) => {
    const id = link.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) sectionMap.set(el, link);
  });

  let active = null;
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = sectionMap.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          if (active) active.classList.remove('active');
          link.classList.add('active');
          active = link;
        }
      });
    },
    { rootMargin: '-64px 0px -60% 0px', threshold: 0 }
  );
  sectionMap.forEach((_, section) => spy.observe(section));
})();

/* ── Region Pricing Toggle ─────────────────────────────────────── */
(() => {
  const btnIndia  = document.querySelector('#toggle-india');
  const btnGlobal = document.querySelector('#toggle-global');
  if (!btnIndia || !btnGlobal) return;

  function setRegion(region) {
    const isIndia = region === 'india';

    // Toggle button states
    btnIndia.classList.toggle('active', isIndia);
    btnGlobal.classList.toggle('active', !isIndia);
    btnIndia.setAttribute('aria-pressed', String(isIndia));
    btnGlobal.setAttribute('aria-pressed', String(!isIndia));

    // Show/hide price spans
    document.querySelectorAll('.price-india').forEach(el => {
      el.style.display = isIndia ? '' : 'none';
    });
    document.querySelectorAll('.price-global').forEach(el => {
      el.style.display = isIndia ? 'none' : '';
    });

    localStorage.setItem('df-pricing-region', region);
  }

  // Auto-detect timezone for default
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const saved = localStorage.getItem('df-pricing-region');
  const defaultRegion = saved || (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta') ? 'india' : 'global');
  setRegion(defaultRegion);

  btnIndia.addEventListener('click',  () => setRegion('india'));
  btnGlobal.addEventListener('click', () => setRegion('global'));
})();
