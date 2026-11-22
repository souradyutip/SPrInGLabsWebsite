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

  /* ---------- Project search (home page) ---------- */
  var search = document.querySelector('[data-project-search]');
  var grid = document.querySelector('[data-project-grid]');
  if (search && grid) {
    var wrap = search.parentElement;
    var clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 hidden';
    clearBtn.textContent = '×';
    wrap.appendChild(clearBtn);

    var status = document.createElement('div');
    status.className = 'text-center mt-2 text-sm text-secondary hidden';
    wrap.parentElement.appendChild(status);

    var empty = document.createElement('div');
    empty.className = 'text-center py-12 hidden';
    empty.innerHTML = '<div class="text-gray-400 text-lg mb-4">No projects found matching your search criteria.</div>' +
      '<button type="button" class="text-primary font-medium hover:text-primary/80 transition-colors duration-200">Clear search and show all projects</button>';
    grid.parentElement.insertBefore(empty, grid.nextSibling);

    var apply = function () {
      var q = search.value;
      var lq = q.trim().toLowerCase();
      var count = 0;
      Array.prototype.forEach.call(grid.children, function (card) {
        var show = !lq || card.getAttribute('data-search').indexOf(lq) !== -1;
        card.style.display = show ? '' : 'none';
        if (show) count++;
      });
      clearBtn.classList.toggle('hidden', !q);
      status.classList.toggle('hidden', !q);
      status.textContent = 'Found ' + count + ' project' + (count !== 1 ? 's' : '') + ' matching "' + q + '"';
      empty.classList.toggle('hidden', !(q && count === 0));
    };
    var clear = function () { search.value = ''; apply(); };
    search.addEventListener('input', apply);
    clearBtn.addEventListener('click', clear);
    empty.querySelector('button').addEventListener('click', clear);
  }

  /* ---------- Publication search (publications page) ---------- */
  var pubSearch = document.querySelector('[data-pub-search]');
  var pubList = document.querySelector('[data-pub-list]');
  if (pubSearch && pubList) {
    var pWrap = pubSearch.parentElement;
    var pClear = document.createElement('button');
    pClear.type = 'button';
    pClear.className = 'absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 hidden';
    pClear.textContent = '×';
    pWrap.appendChild(pClear);

    var pStatus = document.createElement('div');
    pStatus.className = 'text-center mt-2 text-sm text-secondary hidden';
    pWrap.parentElement.appendChild(pStatus);

    var pEmpty = document.createElement('div');
    pEmpty.className = 'text-center py-12 hidden';
    pEmpty.innerHTML = '<div class="text-gray-400 text-lg mb-4">No publications found matching your search.</div>' +
      '<button type="button" class="text-primary font-medium hover:text-primary/80 transition-colors duration-200">Clear search and show all publications</button>';
    pubList.parentElement.insertBefore(pEmpty, pubList.nextSibling);

    var pApply = function () {
      var q = pubSearch.value;
      var terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
      var count = 0;
      pubList.querySelectorAll('[data-year-group]').forEach(function (g) {
        var inGroup = 0;
        g.querySelectorAll('[data-pub]').forEach(function (el) {
          var hay = el.getAttribute('data-search');
          var show = terms.every(function (t) { return hay.indexOf(t) !== -1; });
          el.style.display = show ? '' : 'none';
          if (show) inGroup++;
        });
        g.style.display = inGroup ? '' : 'none';
        count += inGroup;
      });
      pClear.classList.toggle('hidden', !q);
      pStatus.classList.toggle('hidden', !q);
      pStatus.textContent = 'Found ' + count + ' publication' + (count !== 1 ? 's' : '') + ' matching "' + q + '"';
      pEmpty.classList.toggle('hidden', !(q && count === 0));
    };
    var pReset = function () { pubSearch.value = ''; pApply(); };
    pubSearch.addEventListener('input', pApply);
    pClear.addEventListener('click', pReset);
    pEmpty.querySelector('button').addEventListener('click', pReset);
  }

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
})();
