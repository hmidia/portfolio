/* Ahmad Hamidi — portfolio interactions
   Motion is additive: every effect here has a static fallback in CSS,
   and all of it is skipped when the visitor asks for reduced motion. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- 1. load sequence ---------- */
  var lines = document.querySelectorAll('.hero__head .line > span');
  lines.forEach(function (el, i) {
    el.style.setProperty('--delay', (i * 110) + 'ms');
  });

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.add('is-ready');
    });
  });

  /* ---------- 2. nav condenses once you leave the hero ---------- */
  var nav = document.getElementById('nav');
  var onScrollNav = function () {
    nav.classList.toggle('is-stuck', window.scrollY > 80);
  };
  onScrollNav();

  /* ---------- 3. scroll reveals ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var siblings = Array.prototype.slice.call(
          entry.target.parentNode.querySelectorAll('.reveal')
        );
        var idx = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.setProperty('--delay', Math.min(idx, 3) * 110 + 'ms');
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
      // threshold 0 so a fast flick-scroll on mobile can't outrun the reveal
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* contact underline draws itself the first time it is seen */
  var mail = document.querySelector('.contact__mail');
  if (mail && 'IntersectionObserver' in window) {
    var mio = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { mail.classList.add('in'); mio.disconnect(); }
    }, { threshold: 0.5 });
    mio.observe(mail);
  }

  /* ---------- 4. the signature move: the wordmark drifts as you scroll ---------- */
  var brushes = Array.prototype.slice.call(document.querySelectorAll('.brush'));
  var hero = document.querySelector('.hero__brush');
  var ticking = false;
  var parallaxOn = false;

  function drift() {
    ticking = false;
    if (!hero) return;
    var rect = hero.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    // 0 when the band first enters the viewport, 1 once it has fully passed
    var p = (vh - rect.top) / (vh + rect.height);
    p = Math.max(0, Math.min(1, p));
    var shift = (p - 0.5) * 2; // -1 .. 1
    brushes.forEach(function (b) {
      var speed = parseFloat(b.getAttribute('data-speed')) || 0;
      b.style.transform = 'translate3d(' + (shift * speed).toFixed(2) + 'px,0,0)';
    });
  }

  function queueDrift() {
    if (!ticking) { ticking = true; requestAnimationFrame(drift); }
  }

  function onScroll() {
    onScrollNav();
    if (parallaxOn) queueDrift();
  }

  function applyMotionPreference() {
    parallaxOn = !reduced.matches;
    if (!parallaxOn) {
      brushes.forEach(function (b) { b.style.transform = ''; });
    } else {
      queueDrift();
    }
  }

  applyMotionPreference();
  if (reduced.addEventListener) {
    reduced.addEventListener('change', applyMotionPreference);
  } else if (reduced.addListener) {
    reduced.addListener(applyMotionPreference);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    if (parallaxOn) queueDrift();
  }, { passive: true });

  /* ---------- 5. case study links aren't built yet — say so honestly ---------- */
  document.querySelectorAll('.proj[href="#"]').forEach(function (card) {
    card.addEventListener('click', function (ev) {
      ev.preventDefault();
      var link = card.querySelector('.proj__link');
      if (!link || link.dataset.busy) return;
      var original = link.innerHTML;
      link.dataset.busy = '1';
      link.textContent = 'case study coming soon';
      setTimeout(function () {
        link.innerHTML = original;
        delete link.dataset.busy;
      }, 1800);
    });
  });
})();
