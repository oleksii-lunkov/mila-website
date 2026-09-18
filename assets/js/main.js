/* Mila Potapova — site behaviour: language toggle, mobile nav, reveal, mailto form */
(function () {
  'use strict';

  var html = document.documentElement;
  var body = document.body;

  /* ---------- Language ---------- */
  var SUPPORTED = ['uk', 'en'];

  function pickInitialLang() {
    var fromQuery = new URLSearchParams(location.search).get('lang');
    if (SUPPORTED.indexOf(fromQuery) > -1) return fromQuery;
    try {
      var stored = localStorage.getItem('lang');
      if (SUPPORTED.indexOf(stored) > -1) return stored;
    } catch (e) { /* storage unavailable */ }
    return 'uk';
  }

  function setLang(lang, persist) {
    html.setAttribute('data-lang', lang);
    html.setAttribute('lang', lang);

    document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-set-lang') === lang));
    });

    var title = document.querySelector('title');
    if (title && title.dataset[lang]) title.textContent = title.dataset[lang];
    var desc = document.querySelector('meta[name="description"]');
    if (desc && desc.dataset[lang]) desc.setAttribute('content', desc.dataset[lang]);

    document.querySelectorAll('[data-ph-' + lang + ']').forEach(function (el) {
      el.setAttribute('placeholder', el.getAttribute('data-ph-' + lang));
    });

    if (persist) {
      try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
    }
  }

  setLang(pickInitialLang(), false);

  document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.getAttribute('data-set-lang'), true);
    });
  });

  /* ---------- Header state & mobile nav ---------- */
  var header = document.querySelector('.header');
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function closeNav() {
    body.classList.remove('nav-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Contact form → mailto ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var lang = html.getAttribute('data-lang');
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var topic = form.topic.value.trim();
      var message = form.message.value.trim();

      if (!name || !email || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        status.textContent = lang === 'en'
          ? 'Please fill in your name, a valid email and a message.'
          : 'Будь ласка, заповніть імʼя, коректний email і повідомлення.';
        return;
      }

      var subject = (topic ? topic + ' — ' : '') + (lang === 'en' ? 'Request from the website' : 'Запит із сайту') + ' · ' + name;
      var bodyText = message + '\n\n— ' + name + '\n' + email;
      location.href = 'mailto:mila.potapova07@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyText);
      status.textContent = lang === 'en'
        ? 'Your email client should open now. If it does not, write to mila.potapova07@gmail.com.'
        : 'Зараз відкриється ваш поштовий клієнт. Якщо ні — напишіть на mila.potapova07@gmail.com.';
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
