/* SPrInG Labs – static site behaviour (replaces the former React runtime). */
(function () {
  'use strict';

  function swap(el, from, to) {
    from.split(' ').forEach(function (c) { if (c) el.classList.remove(c); });
    to.split(' ').forEach(function (c) { if (c) el.classList.add(c); });
  }

  /* ---------- Desktop dropdown (People) ---------- */
  document.querySelectorAll('[data-dropdown-toggle]').forEach(function (btn) {
    var menu = btn.parentElement.querySelector('[data-dropdown-menu]');
    var chevron = btn.querySelector('svg');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle('hidden') === false;
      if (chevron) chevron.classList.toggle('rotate-180', open);
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('[data-dropdown-menu]').forEach(function (menu) {
      if (!menu.classList.contains('hidden') && !menu.parentElement.contains(e.target)) {
        menu.classList.add('hidden');
        var chev = menu.parentElement.querySelector('[data-dropdown-toggle] svg');
        if (chev) chev.classList.remove('rotate-180');
      }
    });
  });

  /* ---------- Mobile menu ---------- */
  var mToggle = document.querySelector('[data-mobile-toggle]');
  var mPanel = document.querySelector('[data-mobile-panel]');
  if (mToggle && mPanel) {
    mToggle.addEventListener('click', function () {
      var opening = mPanel.classList.contains('max-h-0');
      if (opening) swap(mPanel, 'max-h-0 opacity-0', 'max-h-96 opacity-100');
      else swap(mPanel, 'max-h-96 opacity-100', 'max-h-0 opacity-0');
      mPanel.querySelectorAll('.-translate-x-4, .translate-x-0').forEach(function (el) {
        if (opening) swap(el, '-translate-x-4 opacity-0', 'translate-x-0 opacity-100');
        else swap(el, 'translate-x-0 opacity-100', '-translate-x-4 opacity-0');
      });
      mToggle.querySelector('[data-icon-open]').classList.toggle('hidden', opening);
      mToggle.querySelector('[data-icon-close]').classList.toggle('hidden', !opening);
    });
    mPanel.querySelectorAll('[data-mobile-sub-toggle]').forEach(function (btn) {
      var sub = btn.parentElement.querySelector('[data-mobile-sub]');
      btn.addEventListener('click', function () {
        var opening = sub.classList.contains('max-h-0');
        if (opening) swap(sub, 'max-h-0 opacity-0', 'max-h-32 opacity-100');
        else swap(sub, 'max-h-32 opacity-100', 'max-h-0 opacity-0');
        var chev = btn.querySelector('svg');
        if (chev) chev.classList.toggle('rotate-180', opening);
      });
    });
  }

  /* ---------- News "Read More / Show Less" ---------- */
  document.querySelectorAll('[data-readmore]').forEach(function (btn) {
    var text = btn.previousElementSibling;
    var expanded = false;
    btn.addEventListener('click', function () {
      expanded = !expanded;
      text.textContent = btn.getAttribute(expanded ? 'data-long-text' : 'data-short-text');
      btn.innerHTML = btn.getAttribute(expanded ? 'data-long-btn' : 'data-short-btn');
    });
  });

  /* ---------- "Apply Now" dialog (home page) ---------- */
  var mount = document.getElementById('dialog-mount');
  var tplHolder = document.getElementById('apply-dialog-templates');
  if (mount && tplHolder) {
    var checkTpl = tplHolder.querySelector('template[data-icon="check"]');
    var currentRole = null;

    var show = function (role, step) {
      var tpl = tplHolder.querySelector('template[data-dialog-role="' + role + '"][data-dialog-step="' + step + '"]');
      mount.innerHTML = '';
      if (!tpl) return;
      mount.appendChild(tpl.content.cloneNode(true));
      currentRole = role;
    };
    var close = function () { mount.innerHTML = ''; currentRole = null; };

    document.querySelectorAll('[data-apply]').forEach(function (btn) {
      btn.addEventListener('click', function () { show(btn.getAttribute('data-apply'), 'list'); });
    });

    var timers = {};
    mount.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t) return;
      if (t.hasAttribute('data-dialog-close')) return close();
      if (t.hasAttribute('data-dialog-back')) return show(currentRole, 'list');
      if (t.hasAttribute('data-dialog-topic')) return show(currentRole, t.getAttribute('data-dialog-topic'));
      if (t.hasAttribute('data-copy')) {
        var text = t.getAttribute('data-copy');
        var done = function () {
          var original = t.innerHTML;
          var small = t.querySelector('svg') && t.querySelector('svg').classList.contains('h-3');
          t.innerHTML = checkTpl.innerHTML.replace('h-4 w-4', small ? 'h-3 w-3' : 'h-4 w-4');
          swap(t, 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300', 'bg-green-500 text-white');
          var msg = document.createElement('p');
          msg.className = 'text-green-600 text-xs mt-1 flex items-center gap-1';
          var label = t.previousElementSibling.textContent.indexOf('@') !== -1 ? 'Email address copied!' : 'Subject line copied!';
          msg.innerHTML = checkTpl.innerHTML.replace('h-4 w-4', 'h-3 w-3') + label;
          t.parentElement.insertAdjacentElement('afterend', msg);
          clearTimeout(timers[label]);
          timers[label] = setTimeout(function () {
            t.innerHTML = original;
            swap(t, 'bg-green-500 text-white', 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300');
            msg.remove();
          }, 2000);
        };
        var legacyCopy = function () { // works on file:// and plain http
          var ta = document.createElement('textarea');
          ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); } catch (err) { /* ignore */ }
          ta.remove();
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).catch(legacyCopy);
        } else {
          legacyCopy();
        }
        done();
      }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && currentRole !== null) close(); });
  }

  /* ---------- Home hero stats: count what is actually on the page ---------- */
  document.querySelectorAll('[data-stat]').forEach(function (el) {
    var n = document.querySelectorAll(el.getAttribute('data-stat')).length;
    if (n) el.textContent = n;
  });

  /* ---------- One scrolling page (index.html#people, #publications, ...) ----------
     The main sections are stacked on one page and nav links scroll to them.
     Project detail pages (project-1..5) are shown on their own, in place of the page. */
  var pages = document.querySelectorAll('[data-page]');
  if (pages.length) {
    var isDetail = function (p) { return /^project-\d+$/.test(p.getAttribute('data-page')); };
    var mainPages = Array.prototype.filter.call(pages, function (p) { return !isDetail(p); });
    var navLinks = document.querySelectorAll('#root > nav a[href^="#"]');
    var detailOpen = false;

    var setActive = function (name) {
      Array.prototype.forEach.call(navLinks, function (a) {
        // The logo also links to #home; only highlight the text links.
        var on = a.getAttribute('href') === '#' + name && !a.querySelector('img');
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    };

    var route = function () {
      var key = decodeURIComponent(location.hash.slice(1)) || 'home';
      var detail = document.querySelector('[data-page="' + key + '"]');
      var showDetail = !!(detail && isDetail(detail));

      Array.prototype.forEach.call(pages, function (p) {
        p.hidden = showDetail ? p !== detail : isDetail(p);
      });

      // Close the mobile menu after choosing a link.
      if (mPanel && mToggle && !mPanel.classList.contains('max-h-0')) mToggle.click();

      if (showDetail) {
        detailOpen = true;
        setActive('projects');
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }
      var target = document.getElementById(key);
      if (detailOpen || !target) {
        // Coming back from a project page (or unknown link): jump without animating.
        detailOpen = false;
        if (target) target.scrollIntoView({ behavior: 'instant' });
        else window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        target.scrollIntoView();
      }
    };
    window.addEventListener('hashchange', route);
    route();

    // Highlight the nav link for the section currently in view.
    var spy = function () {
      if (detailOpen) return;
      var current = mainPages[0];
      mainPages.forEach(function (p) { if (p.getBoundingClientRect().top <= 80) current = p; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = mainPages[mainPages.length - 1];
      }
      setActive(current.getAttribute('data-page'));
    };
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }
})();
