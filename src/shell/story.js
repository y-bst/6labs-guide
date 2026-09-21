(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const layout = document.body.dataset.layout === 'steps' ? 'steps' : 'scroll';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover)').matches;

  /* ---------- ranges: "2", "2-4", "3-", "-1", "0,4-5" ---------- */
  function inRange(spec, k) {
    return String(spec).split(',').some(part => {
      const m = part.trim().match(/^(\d*)(-?)(\d*)$/);
      if (!m || (m[1] === '' && m[3] === '' )) return false;
      const a = m[1] === '' ? -Infinity : +m[1];
      const b = m[2] ? (m[3] === '' ? Infinity : +m[3]) : a;
      return k >= a && k <= b;
    });
  }

  /* ---------- layout switch + doc links ---------- */
  $$('.layswitch a').forEach(a => a.setAttribute('aria-current', String(a.dataset.lay === layout)));

  /* ---------- fit product screens to their box ---------- */
  function fit(shot) {
    const cs = getComputedStyle(shot);
    const w = parseFloat(cs.getPropertyValue('--w')) || 960;
    const h = parseFloat(cs.getPropertyValue('--h')) || 0;
    const box = shot.parentElement;
    let s = box.clientWidth / w;
    if (h && box.clientHeight > 0) s = Math.min(s, box.clientHeight / h);
    shot.style.setProperty('--s', Math.max(0.2, Math.min(1, s)).toFixed(4));
  }
  const ro = new ResizeObserver(entries => entries.forEach(e => $$(':scope > .shot', e.target).forEach(fit)));
  $$('.visual').forEach(v => ro.observe(v));

  /* ---------- stories ---------- */
  const stories = [];

  function Story(root) {
    const inDialog = !!root.closest('dialog');
    if (inDialog) root.classList.add('in-dialog');
    const scroll = layout === 'scroll' && !inDialog;
    const cards = $$('.card', root);
    const N = cards.length;
    root.style.setProperty('--n', N);
    const atEls = $$('.visual [data-at]', root);
    const fxEls = $$('.visual [data-fx]', root).map(el => ({
      el,
      rules: el.dataset.fx.trim().split(/\s+/).map(t => [t.slice(0, t.indexOf(':')), t.slice(t.indexOf(':') + 1)])
    }));
    const bar = $('.progress i', root);
    const dots = $('.dots', root);
    const prev = $('[data-prev]', root);
    const next = $('[data-next]', root);
    const chapterBtns = inDialog ? [] : $$('.chapters [data-jump]');
    const flowItems = $$('.flow [data-node]', root);
    const flowOrder = flowItems.map(li => li.dataset.node);
    const cam = $('.cam', root);
    const shot = cam?.closest('.shot');
    let beat = -1;

    flowItems.forEach(li => $('button', li).addEventListener('click', () => {
      const k = cards.findIndex(c => c.dataset.node === li.dataset.node);
      if (k > -1) jump(k);
    }));

    function aim(card) {
      if (!cam) return;
      const cs = getComputedStyle(shot);
      const W = parseFloat(cs.getPropertyValue('--w')) || 960;
      const H = parseFloat(cs.getPropertyValue('--h')) || 600;
      const f = (card.dataset.focus || '').trim().split(/\s+/).map(Number);
      let tx = 0, ty = 0, z = 1;
      if (f.length === 3 && f.every(Number.isFinite)) {
        z = f[2];
        tx = Math.min(0, Math.max(W - W * z, W / 2 - f[0] * z));
        ty = Math.min(0, Math.max(H - H * z, H / 2 - f[1] * z));
      }
      cam.style.transform = `translate(${tx}px, ${ty}px) scale(${z})`;
    }

    cards.forEach((c, k) => {
      const count = $('.count', c);
      if (count) count.textContent = `${String(k + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
      if (dots) {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Go to ${k + 1}: ${$('h2', c)?.textContent || ''}`);
        b.addEventListener('click', () => jump(k));
        dots.appendChild(b);
      }
    });

    function set(k) {
      k = Math.max(0, Math.min(N - 1, k));
      if (k === beat) return;
      const was = beat;
      beat = k;
      cards.forEach((c, j) => { c.classList.toggle('off', j !== k); c.inert = j !== k; });
      atEls.forEach(el => el.classList.toggle('off', !inRange(el.dataset.at, k)));
      fxEls.forEach(({ el, rules }) => rules.forEach(([cls, r]) => el.classList.toggle(cls, inRange(r, k))));
      if (dots) $$('button', dots).forEach((b, j) => { b.classList.toggle('on', j === k); b.classList.toggle('done', j < k); });
      chapterBtns.forEach(b => b.classList.toggle('on', +b.dataset.jump === k));
      const ni = flowOrder.indexOf(cards[k].dataset.node);
      flowItems.forEach((li, j) => { li.classList.toggle('on', j === ni); li.classList.toggle('done', j < ni); });
      if (flowItems[ni]) {
        const li = flowItems[ni], bar = li.parentElement;
        const left = li.getBoundingClientRect().left - bar.getBoundingClientRect().left + bar.scrollLeft - (bar.clientWidth - li.offsetWidth) / 2;
        bar.scrollLeft = Math.max(0, left);
      }
      aim(cards[k]);
      if (prev) prev.disabled = k === 0;
      if (next) next.textContent = k === N - 1 ? (root.dataset.endLabel || 'Start over') : 'Next';
      if (!scroll && bar) bar.style.width = `${((k + 1) / N) * 100}%`;
      root.dispatchEvent(new CustomEvent('beat', { detail: { beat: k, prev: was } }));
    }

    function jump(k) {
      if (!scroll) return set(k);
      const top = root.getBoundingClientRect().top + scrollY;
      const span = root.offsetHeight - innerHeight;
      scrollTo({ top: top + span * ((k + 0.5) / N), behavior: reduce ? 'auto' : 'smooth' });
    }

    function forward() {
      if (beat < N - 1) return set(beat + 1);
      if (root.dataset.endHref) location.href = root.dataset.endHref;
      else if ('endClose' in root.dataset) root.closest('dialog').close();
      else set(0);
    }

    if (scroll) {
      let queued = false;
      const update = () => {
        queued = false;
        const span = root.offsetHeight - innerHeight;
        const p = Math.min(1, Math.max(0, -root.getBoundingClientRect().top / span));
        if (bar) bar.style.width = `${p * 100}%`;
        set(Math.min(N - 1, Math.floor(p * N)));
      };
      addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
      addEventListener('resize', update);
      update();
    } else {
      prev?.addEventListener('click', () => set(beat - 1));
      next?.addEventListener('click', forward);
      set(0);
    }

    chapterBtns.forEach(b => b.addEventListener('click', () => {
      jump(+b.dataset.jump);
      if (!scroll) root.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }));

    root.dataset.ready = '1';
    const api = { root, set, jump, forward, back: () => set(beat - 1), inDialog, scroll, get beat() { return beat; } };
    stories.push(api);
    return api;
  }

  $$('[data-story]').forEach(Story);

  /* ---------- keyboard (step layout + dialogs) ---------- */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hideTip();
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;
    const open = $('dialog[open]');
    const s = open ? stories.find(x => open.contains(x.root)) : stories.find(x => !x.inDialog && !x.scroll);
    if (!s) return;
    e.preventDefault();
    e.key === 'ArrowRight' ? s.forward() : s.back();
  });

  /* ---------- term tooltips ---------- */
  const tip = document.createElement('div');
  tip.className = 'tip';
  tip.setAttribute('role', 'tooltip');
  tip.hidden = true;
  let tipFor = null;
  function showTip(el) {
    const host = el.closest('dialog') || document.body;
    if (tip.parentNode !== host) host.appendChild(tip);
    const b = document.createElement('b');
    b.textContent = el.dataset.title || el.textContent.trim();
    tip.replaceChildren(b, document.createTextNode(el.dataset.def || ''));
    tip.hidden = false;
    const r = el.getBoundingClientRect();
    const x = Math.min(Math.max(8, r.left + r.width / 2 - tip.offsetWidth / 2), innerWidth - tip.offsetWidth - 8);
    let y = r.top - tip.offsetHeight - 10;
    if (y < 8) y = r.bottom + 10;
    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
    tipFor = el;
  }
  function hideTip() { tip.hidden = true; tipFor = null; }
  document.addEventListener('click', e => {
    const t = e.target.closest('.term');
    if (!t) return hideTip();
    tipFor === t && !canHover ? hideTip() : showTip(t);
  });
  if (canHover) {
    document.addEventListener('mouseover', e => { const t = e.target.closest('.term'); if (t) showTip(t); });
    document.addEventListener('mouseout', e => { if (e.target.closest('.term')) hideTip(); });
  }
  addEventListener('scroll', hideTip, { passive: true, capture: true });

  /* ---------- dialogs ---------- */
  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-open]');
    if (opener) {
      const d = document.getElementById(opener.dataset.open);
      d.showModal();
      stories.filter(s => d.contains(s.root)).forEach(s => s.set(0));
      $$('.visual', d).forEach(v => $$(':scope > .shot', v).forEach(fit));
      return;
    }
    if (e.target.closest('[data-close]')) e.target.closest('dialog').close();
    else if (e.target.matches('dialog.sheet')) e.target.close();
  });

  window.Guide = { stories, $, $$ };
})();
