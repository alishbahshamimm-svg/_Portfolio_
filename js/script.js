/* =========================================================
   Alishbah.dev — script.js
   Vanilla JS: nav, typing, reveal, skills bar, filters, form
   ========================================================= */
(function () {
  'use strict';

  // ----- Year -----
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- Sticky nav bg on scroll -----
  var nav = document.getElementById('siteNav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Active nav link based on scroll position -----
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id], header[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.navbar-nav .nav-link'));

  function updateActiveLink() {
    var pos = window.scrollY + 140;
    var current = sections[0] ? sections[0].id : '';
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= pos) current = sections[i].id;
    }
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      link.classList.toggle('active', href === '#' + current);
    });
  }

  // ----- Collapse nav on link click (mobile) -----
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var menu = document.getElementById('navMenu');
      if (menu && menu.classList.contains('show')) {
        // Use Bootstrap Collapse API
        var bsCollapse = bootstrap.Collapse.getInstance(menu) || new bootstrap.Collapse(menu, { toggle: false });
        bsCollapse.hide();
      }
    });
  });

  // ----- Typing effect -----
  var typeTarget = document.getElementById('typeTarget');
  if (typeTarget) {
    var phrases = [
      'Junior Full Stack Developer',
      'Front-End Craftsperson',
      'PHP + MySQL Builder',
      'Bootstrap & Laravel Dev'
    ];
    var p = 0, c = 0, deleting = false;

    function tick() {
      var word = phrases[p];
      if (!deleting) {
        c++;
        typeTarget.textContent = word.slice(0, c);
        if (c === word.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        c--;
        typeTarget.textContent = word.slice(0, c);
        if (c === 0) {
          deleting = false;
          p = (p + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 40 : 75);
    }
    setTimeout(tick, 1200);
  }

  // ----- Reveal on scroll -----
  var revealTargets = document.querySelectorAll(
    '.section-head, .about-card, .strengths, .fun-facts, .skills-card, .service-card, .project, .tl-item, .edu-card, .cert, .contact-form, .contact-details, .socials'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');

          // Animate skill bars inside revealed skills cards
          if (entry.target.classList.contains('skills-card')) {
            var bars = entry.target.querySelectorAll('.bar');
            bars.forEach(function (b) { b.classList.add('animate'); });
          }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('.bar').forEach(function (b) { b.classList.add('animate'); });
  }

  // ----- Project filters -----
  var filters = document.querySelectorAll('.filter');
  var projects = document.querySelectorAll('.project');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      projects.forEach(function (p) {
        var tags = (p.getAttribute('data-tags') || '').split(' ');
        var show = f === 'all' || tags.indexOf(f) !== -1;
        p.classList.toggle('hidden', !show);
      });
    });
  });

  // ----- Contact form (client-side only) -----
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.style.color = '';
      status.textContent = '';

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var subject = form.subject.value.trim();
      var message = form.message.value.trim();

      if (!name || !email || !subject || !message) {
        status.style.color = '#B23B3B';
        status.textContent = 'Please fill in all fields.';
        return;
      }
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        status.style.color = '#B23B3B';
        status.textContent = 'That email doesn\u2019t look quite right.';
        return;
      }

      status.style.color = '#2E8B57';
      status.textContent = 'Thanks, ' + name.split(' ')[0] + ' \u2014 your message is on its way.';
      form.reset();
    });
  }
})();
