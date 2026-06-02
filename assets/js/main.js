/* ===================================
   NRITYASHALA - School of Odissi Dance
   Main JavaScript
   Author: Roshni Stephen / Loka AI
=================================== */

(function () {
  'use strict';

  // ===== Navbar Scroll & Solid =====
  const navbar = document.querySelector('.navbar');

  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      if (!navbar.classList.contains('navbar-solid')) {
        navbar.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ===== Hamburger Menu =====
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    function setMenuState(isOpen) {
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navMenu.classList.toggle('open', isOpen);
    }

    hamburger.addEventListener('click', function () {
      setMenuState(!navMenu.classList.contains('open'));
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuState(false);
      });
    });

    document.addEventListener('click', function (e) {
      if (navbar && !navbar.contains(e.target)) {
        setMenuState(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        setMenuState(false);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        setMenuState(false);
      }
    });
  }

  // ===== Active Nav Link =====
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === '') currentPage = 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // ===== Hero Ken Burns Effect =====
  var hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(function () { hero.classList.add('loaded'); }, 100);
  }

  // ===== Scroll Animations =====
  var animEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  if (animEls.length > 0 && 'IntersectionObserver' in window) {
    var animObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    animEls.forEach(function (el) { animObserver.observe(el); });
  } else {
    // Fallback: show all immediately
    animEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ===== Lightbox =====
  var lightbox = document.getElementById('lightbox');

  if (lightbox) {
    var lbImg = lightbox.querySelector('.lightbox-img');
    var lbClose = lightbox.querySelector('.lightbox-close');
    var lbPrev = lightbox.querySelector('.lightbox-prev');
    var lbNext = lightbox.querySelector('.lightbox-next');
    var lbCounter = lightbox.querySelector('.lightbox-counter');

    var lbImages = [];
    var lbIndex = 0;

    function openLightbox(imgs, idx) {
      lbImages = imgs;
      lbIndex = idx;
      updateLightbox();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function sanitizeImageSrc(src) {
      // Validate via URL constructor — blocks javascript:, data:, vbscript: etc.
      if (typeof src !== 'string') return '';
      try {
        var url = new URL(src, window.location.href);
        if (url.protocol !== 'https:' && url.protocol !== 'http:' && url.protocol !== 'file:') {
          return '';
        }
        return url.href;
      } catch (e) {
        return '';
      }
    }

    function updateLightbox() {
      if (lbImg) lbImg.src = sanitizeImageSrc(lbImages[lbIndex]);
      if (lbCounter && lbImages.length > 1) {
        lbCounter.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
      }
    }

    function prevImage() {
      lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
      updateLightbox();
    }

    function nextImage() {
      lbIndex = (lbIndex + 1) % lbImages.length;
      updateLightbox();
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', prevImage);
    if (lbNext) lbNext.addEventListener('click', nextImage);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });

    // Collect groups
    var triggers = document.querySelectorAll('[data-lightbox]');
    var groups = {};

    triggers.forEach(function (trigger) {
      var group = trigger.getAttribute('data-lightbox-group') || 'default';
      if (!groups[group]) groups[group] = [];
      var src = trigger.getAttribute('data-lightbox');
      if (groups[group].indexOf(src) === -1) {
        groups[group].push(src);
      }
    });

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var group = trigger.getAttribute('data-lightbox-group') || 'default';
        var src = trigger.getAttribute('data-lightbox');
        var imgs = groups[group] || [src];
        var idx = imgs.indexOf(src);
        openLightbox(imgs, idx < 0 ? 0 : idx);
      });
    });

    // Touch swipe support
    var touchStartX = 0;
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) nextImage();
        else prevImage();
      }
    }, { passive: true });
  }

  // ===== Smooth scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
