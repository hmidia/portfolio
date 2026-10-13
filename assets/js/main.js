/* Ahmad Hamidi portfolio interactions
   Motion is additive: every effect here has a static fallback in CSS,
   and all of it is skipped when the visitor asks for reduced motion.
   No scroll listeners: observers and CSS scroll timelines only. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- 1. load sequence ---------- */
  // the made-things words come into focus one after another
  var words = document.querySelectorAll('.blur-word');
  words.forEach(function (el, i) {
    el.style.setProperty('--delay', (500 + i * 160) + 'ms');
    el.style.setProperty('--i', i);
  });
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.add('is-ready');
      // once the intro has landed, hand the words over to the slow rack-focus loop
      if (words.length) {
        setTimeout(function () { document.body.classList.add('is-settled'); }, 500 + words.length * 160 + 1400);
      }
    });
  });

  /* ---------- 2. bar gains a surface once the hero top leaves view ---------- */
  var bar = document.getElementById('bar');
  var sentinel = document.querySelector('.hero__sentinel');
  if (bar && sentinel && hasIO) {
    new IntersectionObserver(function (entries) {
      bar.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- 3. mark the nav link for the section in view ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.bar__links a'));
  if (hasIO && links.length) {
    var byId = {};
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      if (href.charAt(0) === '#') byId[href.slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          link.setAttribute('aria-current', 'true');
        } else if (link.getAttribute('aria-current')) {
          link.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* ---------- 4. scroll reveals ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (hasIO && !reduced.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var siblings = Array.prototype.slice.call(
          entry.target.parentNode.querySelectorAll(':scope > .reveal')
        );
        var idx = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.setProperty('--delay', Math.min(idx, 3) * 100 + 'ms');
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
      // threshold 0 so a fast flick-scroll on mobile can't outrun the reveal
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 5. the portrait card leans toward the pointer, and its eyes follow it ---------- */
  var hero = document.querySelector('.hero');
  var card = document.querySelector('.hero__mark');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (hero && card) {
    var frame = 0, px = 0, py = 0;           // pointer within the hero, -1 .. 1
    var cx = null, cy = null;                // pointer in page coordinates, for the eyes
    var heroVisible = true;
    var markSvg = null, pupils = [];

    var apply = function () {
      frame = 0;
      card.style.setProperty('--rx', (px * 10).toFixed(2) + 'deg');
      card.style.setProperty('--ry', (py * -8).toFixed(2) + 'deg');
      lookAt();
    };
    var queue = function () { if (!frame) frame = requestAnimationFrame(apply); };

    // Move each pupil a few units toward the pointer, in the drawing's own coordinates.
    var lookAt = function () {
      if (!markSvg || !pupils.length) return;
      var vb = markSvg.viewBox.baseVal;
      var r = markSvg.getBoundingClientRect();
      pupils.forEach(function (p) {
        var ux = 0, uy = 0;
        if (cx !== null && r.width) {
          var sx = vb.x + (cx - r.left) / r.width * vb.width;
          var sy = vb.y + (cy - r.top) / r.height * vb.height;
          var dx = sx - p.cx, dy = sy - p.cy;
          var dist = Math.hypot(dx, dy) || 1;
          var reach = Math.min(1, dist / 260);   // close to the face = small glance, far = full look
          ux = dx / dist * 7 * reach;
          uy = Math.max(-2, Math.min(3, dy / dist * 3.5 * reach));
        }
        p.el.style.transform = 'translate(' + ux.toFixed(2) + 'px,' + uy.toFixed(2) + 'px)';
      });
    };

    hero.addEventListener('pointermove', function (ev) {
      if (reduced.matches || !finePointer.matches) return;
      var r = hero.getBoundingClientRect();
      px = ((ev.clientX - r.left) / r.width - 0.5) * 2;
      py = ((ev.clientY - r.top) / r.height - 0.5) * 2;
      queue();
    });
    hero.addEventListener('pointerleave', function () { px = 0; py = 0; queue(); });

    // the eyes keep following anywhere on the page while the hero is on screen
    document.addEventListener('pointermove', function (ev) {
      if (reduced.matches || !finePointer.matches || !heroVisible) return;
      cx = ev.clientX; cy = ev.clientY;
      queue();
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { cx = cy = null; queue(); });
    if (hasIO) {
      new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; }).observe(hero);
    }

    // Swap the <img> for the same SVG inline so the pupils can move. Any mark file
    // without class="pupil" paths simply stays a plain image.
    var img = card.querySelector('img');
    if (img && window.fetch && window.DOMParser && !reduced.matches && finePointer.matches) {
      fetch(img.getAttribute('src'))
        .then(function (res) { return res.ok ? res.text() : Promise.reject(); })
        .then(function (text) {
          var doc = new DOMParser().parseFromString(text, 'image/svg+xml');
          var svg = doc.documentElement;
          if (svg.nodeName !== 'svg' || !svg.querySelector('.pupil')) return;
          svg = document.importNode(svg, true);
          svg.setAttribute('role', 'img');
          svg.setAttribute('aria-label', img.getAttribute('alt') || '');
          img.replaceWith(svg);
          markSvg = svg;
          pupils = Array.prototype.map.call(svg.querySelectorAll('.pupil'), function (el) {
            var b = el.getBBox();
            return { el: el, cx: b.x + b.width / 2, cy: b.y };   // y: the flat top sits on the eye line
          });
          lookAt();
        })
        .catch(function () { /* keep the plain image */ });
    }
  }

  /* ---------- 6. copy email ---------- */
  var copyBtn = document.querySelector('.copy');
  var status = document.querySelector('.copy__status');
  if (copyBtn) {
    var label = copyBtn.querySelector('.copy__label');
    var icon = copyBtn.querySelector('i');
    var timer = 0;
    var settle = function (ok) {
      copyBtn.classList.toggle('is-done', ok);
      label.textContent = ok ? 'copied' : 'copy email';
      icon.className = ok ? 'ph ph-check' : 'ph ph-copy';
      status.textContent = ok
        ? 'Email address copied to your clipboard.'
        : 'Couldn’t copy automatically. Select the address above to copy it.';
      clearTimeout(timer);
      timer = setTimeout(function () {
        copyBtn.classList.remove('is-done');
        label.textContent = 'copy email';
        icon.className = 'ph ph-copy';
        status.textContent = '';
      }, 2400);
    };
    copyBtn.addEventListener('click', function () {
      var text = copyBtn.getAttribute('data-copy');
      if (!navigator.clipboard) { settle(false); return; }
      navigator.clipboard.writeText(text).then(
        function () { settle(true); },
        function () { settle(false); }
      );
    });
  }

  /* ---------- 7. mobile project bar (case pages) ----------
     Visible on load, slides away while scrolling down, back on scroll up,
     and hidden once the "next project" link at the end is on screen.
     Scroll direction needs a scroll listener (passive; browsers fire it at most
     once per frame), and the work in it is one comparison and a class toggle. */
  var pnav = document.querySelector('.pnav');
  var sheet = document.getElementById('pnav-sheet');
  if (pnav) {
    var lastY = window.scrollY;
    var end = document.querySelector('.cs-next');
    var setHidden = function (hide) {
      if (sheet && sheet.open) hide = false;
      pnav.classList.toggle('is-hidden', hide);
    };
    window.addEventListener('scroll', function () {
      var y = window.scrollY, dy = y - lastY;
      var atEnd = end && end.getBoundingClientRect().top < window.innerHeight;
      if (atEnd) { setHidden(true); lastY = y; return; }
      if (Math.abs(dy) < 8) return;                 // ignore tiny jitters
      setHidden(dy > 0 && y > 120);                 // down hides, up shows; always shown near the top
      lastY = y;
    }, { passive: true });
    // a keyboard user tabbing into the bar should always see it
    pnav.addEventListener('focusin', function () { pnav.classList.remove('is-hidden'); });

    if (sheet && typeof sheet.showModal === 'function') {
      var opener = pnav.querySelector('.pnav__current');
      opener.addEventListener('click', function () { sheet.showModal(); });
      sheet.querySelectorAll('[data-pnav-close]').forEach(function (b) {
        b.addEventListener('click', function () { sheet.close(); });
      });
      sheet.addEventListener('click', function (ev) { if (ev.target === sheet) sheet.close(); });
      sheet.addEventListener('close', function () { opener.focus(); });
    }
  }
})();
