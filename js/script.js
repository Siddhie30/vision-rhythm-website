document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile sidebar toggle ---------- */
  var sidebar = document.getElementById('sidebar');
  var toggle = document.getElementById('sidebarToggle');
  var backdrop = document.getElementById('sidebarBackdrop');

  function openSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('show');
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
  }
  backdrop.addEventListener('click', closeSidebar);

  var navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth < 992) closeSidebar();
    });
  });

  /* ---------- Active section highlighting ---------- */
  var sections = document.querySelectorAll('.section[id]');
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('data-section') === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add('in-view');
        }, i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Video modal ---------- */
  var modal = document.getElementById('videoModal');
  var modalPlayer = document.getElementById('videoModalPlayer');
  var modalTitle = document.getElementById('videoModalTitle');
  var modalClose = document.getElementById('videoModalClose');
  var modalBackdrop = document.getElementById('videoModalBackdrop');
  var lastFocused = null;

  function openVideo(src, title, poster) {
    lastFocused = document.activeElement;
    modalPlayer.setAttribute('src', src);
    if (poster) modalPlayer.setAttribute('poster', poster);
    modalTitle.textContent = title;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
    modalPlayer.play().catch(function () { /* autoplay may be blocked, that's fine */ });
  }
  function closeVideo() {
    modalPlayer.pause();
    modalPlayer.removeAttribute('src');
    modalPlayer.load();
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.video-card').forEach(function (card) {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    var title = card.getAttribute('data-video-title');
    card.setAttribute('aria-label', 'Play video: ' + title);

    function trigger() {
      openVideo(
        card.getAttribute('data-video-src'),
        title,
        card.getAttribute('data-video-poster')
      );
    }
    card.addEventListener('click', trigger);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger();
      }
    });
  });

  modalClose.addEventListener('click', closeVideo);
  modalBackdrop.addEventListener('click', closeVideo);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeVideo();
  });

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function () {
    backToTop.classList.toggle('show', window.scrollY > 500);
  });
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Callback form (frontend-only, no server) ---------- */
  var form = document.getElementById('callbackForm');
  var formNote = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('cbName').value.trim();
      formNote.textContent = 'Thanks' + (name ? ', ' + name : '') + '! We\'ll call you back soon. For anything urgent, call or text 7038026453 directly.';
      form.reset();
    });
  }

});
