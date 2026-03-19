/* ============================================================
   Lumina — main.js
   Lightbox + UI interactions (no dependencies)
   ============================================================ */
(function () {
  'use strict';

  // ─── Scroll-aware header ──────────────────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ─── Lightbox ─────────────────────────────────────────────
  const lb        = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbCounter = document.getElementById('lightbox-counter');
  const lbClose   = document.getElementById('lightbox-close');
  const lbPrev    = document.getElementById('lightbox-prev');
  const lbNext    = document.getElementById('lightbox-next');

  if (!lb) return;

  let gallery    = [];  // array of { full, caption }
  let current    = 0;
  let isAnimating= false;

  // Collect all thumbs on current gallery page
  function buildGallery() {
    const container = document.querySelector('[data-lightbox-gallery]');
    if (!container) return [];
    return Array.from(container.querySelectorAll('.photo-thumb')).map(btn => ({
      full:    btn.dataset.full,
      caption: btn.dataset.caption || '',
    }));
  }

  function open(index) {
    gallery = buildGallery();
    if (!gallery.length) return;
    current = Math.max(0, Math.min(index, gallery.length - 1));
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lb.setAttribute('aria-hidden', 'false');
    lbClose.focus();
    loadImage(current);
  }

  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    lb.setAttribute('aria-hidden', 'true');
    // Return focus to the thumb that opened the lightbox
    const thumb = document.querySelector(`.photo-thumb[data-index="${current}"]`);
    if (thumb) thumb.focus();
    lbImg.src = '';
    lbCaption.textContent = '';
    lbCounter.textContent = '';
  }

  function loadImage(index) {
    if (isAnimating) return;
    isAnimating = true;

    const item = gallery[index];
    lbImg.classList.add('is-loading');

    const tmp = new Image();
    tmp.onload = () => {
      lbImg.src     = item.full;
      lbImg.alt     = item.caption;
      lbCaption.textContent = item.caption;
      lbCounter.textContent = `${index + 1} / ${gallery.length}`;
      lbPrev.disabled = index === 0;
      lbNext.disabled = index === gallery.length - 1;

      // Small rAF to let the browser register the class before removing it
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          lbImg.classList.remove('is-loading');
          isAnimating = false;
        });
      });
    };
    tmp.onerror = () => {
      lbImg.src     = item.full;   // try anyway
      lbImg.alt     = item.caption;
      lbCaption.textContent = item.caption;
      lbImg.classList.remove('is-loading');
      isAnimating = false;
    };
    tmp.src = item.full;
  }

  function navigate(dir) {
    const next = current + dir;
    if (next < 0 || next >= gallery.length) return;
    current = next;
    loadImage(current);
  }

  // ─── Listeners ────────────────────────────────────────────

  // Open on thumb click
  document.addEventListener('click', (e) => {
    const thumb = e.target.closest('.photo-thumb');
    if (thumb) {
      const index = parseInt(thumb.dataset.index, 10) || 0;
      open(index);
    }
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', () => navigate(-1));
  lbNext.addEventListener('click', () => navigate(1));

  // Close on backdrop click
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    switch (e.key) {
      case 'Escape':      close();          break;
      case 'ArrowLeft':   navigate(-1);     break;
      case 'ArrowRight':  navigate(1);      break;
      case 'ArrowUp':     navigate(-1);     break;
      case 'ArrowDown':   navigate(1);      break;
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  lb.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lb.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
  }, { passive: true });

  // ─── Staggered animation delay on photo grid ──────────────
  document.querySelectorAll('.photo-grid .photo-thumb').forEach((el, i) => {
    el.style.setProperty('--i', i);
  });

})();
