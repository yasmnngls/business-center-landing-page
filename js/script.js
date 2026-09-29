(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name, cls = '') => `<svg class="i ${cls}"><use href="#i-${name}"/></svg>`;

  // ---------- Motion helpers ----------
  // Show/hide an element that has an `.is-open` transition. Interruptible: reopening
  // during the exit keeps it mounted instead of restarting from zero.
  function show(el) {
    el.hidden = false;
    void el.offsetWidth;
    el.classList.add('is-open');
  }
  function hide(el, after) {
    el.classList.remove('is-open');
    setTimeout(() => {
      if (!el.classList.contains('is-open')) el.hidden = true;
      if (after) after();
    }, reduceMotion.matches ? 0 : 160);
  }
  // Crossfade a freshly shown panel in (opacity + a 2px blur mask), no layout animation.
  function fadeIn(el) {
    el.classList.add('fx', 'fx-in');
    void el.offsetWidth;
    el.classList.remove('fx-in');
  }
  function shake(el) {
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
  }

  // ---------- Sample data ----------
  const heroRows = [
    { id: '#10482', date: 'May 1, 2023', store: 'Downtown', amt: '$412.60' },
    { id: '#10483', date: 'May 1, 2023', store: 'Riverside', amt: '$86.20' },
    { id: '#10484', date: 'May 1, 2023', store: 'Airport', amt: '$1,240.00' },
    { id: '#10485', date: 'May 2, 2023', store: 'Downtown', amt: '$318.75' },
    { id: '#10486', date: 'May 2, 2023', store: 'Northgate', amt: '$59.90' },
    { id: '#10487', date: 'May 2, 2023', store: 'Riverside', amt: '$702.15' }
  ];

  const trustRows = [
    { id: '#10482', date: 'May 1', store: 'Downtown', amt: '$412.60' },
    { id: '#10483', date: 'May 1', store: 'Riverside', amt: '$86.20' },
    { id: '#10484', date: 'May 1', store: 'Airport', amt: '$1,240.00' },
    { id: '#10485', date: 'May 2', store: 'Downtown', amt: '$318.75' },
    { id: '#10486', date: 'May 2', store: 'Northgate', amt: '$59.90' },
    { id: '#10487', date: 'May 2', store: 'Riverside', amt: '$702.15' },
    { id: '#10489', date: 'May 2', store: 'Airport', amt: '$264.00' },
    { id: '#10490', date: 'May 3', store: 'Downtown', amt: '$148.35' }
  ];

  const onlineRows = [
    { id: 'W-5521', date: 'May 1', store: 'Web', amt: '$64.00' },
    { id: 'W-5522', date: 'May 1', store: 'Mobile app', amt: '$38.50' },
    { id: 'W-5523', date: 'May 1', store: 'Marketplace', amt: '$121.90' },
    { id: 'W-5524', date: 'May 2', store: 'Web', amt: '$42.75' },
    { id: 'W-5525', date: 'May 2', store: 'Web', amt: '$89.00' }
  ];

  function renderRows(container, rows, storeClass) {
    container.innerHTML = rows.map(r => `
      <div class="row">
        <span>${r.id}</span><span>${r.date}</span><span class="${storeClass}">${r.store}</span><span class="ta-r">${r.amt}</span>
      </div>`).join('');
  }
  renderRows($('heroRowsBody'), heroRows, 'col-store');
  renderRows($('trustRowsBody'), trustRows, '');

  // Pinned insights (the library). Four start on the Dashboard.
  const insights = {
    revenue: {
      title: 'Revenue · May 2023', def: 'SUM(Total Amount) · May 2023 · monthly', source: 'Retail Sales', measure: 'Revenue', span: 4, type: 'stat', icon: 'sparkle',
      value: '$410,000', label: 'Total revenue', delta: '+6.2% vs April',
      table: { cols: ['Metric', 'Value'], rows: [['Revenue', '$410,000'], ['Orders', '1,284'], ['Refunded (excluded)', '33']] }
    },
    stores: {
      title: 'Revenue by store', def: 'SUM(Total Amount) by Store · May 2023', source: 'Retail Sales', measure: 'Revenue by Store', span: 8, type: 'bars', icon: 'table',
      series: [['Airport', 128420], ['Downtown', 107860], ['Riverside', 93540], ['Northgate', 80180]], money: true
    },
    weekly: {
      title: 'Weekly revenue', def: 'SUM(Total Amount) · May 2023 · weekly', source: 'Retail Sales', measure: 'Revenue', span: 6, type: 'line', icon: 'refresh',
      series: [['May 1–7', 88420], ['May 8–14', 97310], ['May 15–21', 104950], ['May 22–31', 119320]], money: true
    },
    channel: {
      title: 'Online orders by channel', def: 'COUNT(Orders) by Channel · May 2023', source: 'Online Orders', measure: 'Orders by Channel', span: 6, type: 'table', icon: 'table',
      table: { cols: ['Channel', 'Orders', 'Share'], rows: [['Web', '486', '51%'], ['Mobile app', '322', '34%'], ['Marketplace', '141', '15%']] }
    },
    refunds: {
      title: 'Refund rate · May', def: 'Refunded orders ÷ all orders · May 2023', source: 'Retail Sales', measure: 'Refund rate', span: 4, type: 'stat', icon: 'sparkle',
      value: '2.5%', label: 'Refund rate', delta: '33 of 1,317 orders',
      table: { cols: ['Metric', 'Value'], rows: [['Refunded orders', '33'], ['All orders', '1,317'], ['Refund rate', '2.5%']] }
    },
    products: {
      title: 'Top products · May', def: 'SUM(Line Total) by Product · May 2023', source: 'Online Orders', measure: 'Revenue by Product', span: 6, type: 'bars', icon: 'table',
      series: [['Cold brew kit', 38200], ['Travel mug', 29450], ['Pour-over set', 21900], ['Filter papers', 12300]], money: true
    },
    weekday: {
      title: 'Orders by weekday', def: 'COUNT(Orders) by Weekday · May 2023', source: 'Online Orders', measure: 'Orders by Weekday', span: 6, type: 'cols', icon: 'grid',
      series: [['Mon', 128], ['Tue', 131], ['Wed', 139], ['Thu', 142], ['Fri', 158], ['Sat', 141], ['Sun', 110]]
    }
  };
  const defaultBoard = ['revenue', 'stores', 'weekly', 'channel'];
  Object.entries(insights).forEach(([id, ins]) => { ins.id = id; ins.baseSpan = ins.span; });

  const state = {
    board: defaultBoard.slice(),
    cards: {},          // per-card UI state: { view, frozen, fresh, rowsOpen }
    filter: 'all',
    title: 'Weekly Ops Review',
    visibility: 'private',
    people: [{ name: 'Operations team', kind: 'Group', access: 'Can edit' }],
    links: [],
    comments: false,
    followUps: false,
    gatePassed: false,
    selected: null
  };
  const cardState = id => (state.cards[id] ||= { view: 'chart', frozen: false, fresh: 'Computed 2m ago', rowsOpen: false });

  const fmt = (n, money) => (money ? '$' : '') + n.toLocaleString('en-US');

  // ---------- Viz ----------
  function vizHTML(ins, view) {
    if (view === 'table' || ins.type === 'table') return tableHTML(ins);
    if (ins.type === 'stat') {
      return `<div class="c-stat">${ins.value}</div><div class="c-stat-label">${ins.label}</div>
        <div class="c-stat-sub"><span class="chip chip--green">${ins.delta}</span></div>`;
    }
    if (ins.type === 'bars') {
      const max = Math.max(...ins.series.map(s => s[1]));
      return `<div class="c-bars">${ins.series.map(([k, v]) => `
        <div class="c-bars__row"><span>${k}</span><span class="c-bars__track"><span class="c-bars__fill" style="width:${(v / max * 100).toFixed(1)}%"></span></span><span>${fmt(v, ins.money)}</span></div>`).join('')}</div>`;
    }
    if (ins.type === 'line') {
      const vals = ins.series.map(s => s[1]);
      const lo = Math.min(...vals) * 0.85, hi = Math.max(...vals) * 1.05;
      const pts = vals.map((v, i) => [i / (vals.length - 1) * 300, 120 - (v - lo) / (hi - lo) * 120]);
      const line = pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ');
      const area = `M0,120 L${line.replace(/ /g, ' L')} L300,120 Z`;
      return `<div class="c-line">
        <div class="c-line__legend"><span>${ins.series[0][0]}: <b>${fmt(vals[0], true)}</b></span><span>${ins.series.at(-1)[0]}: <b>${fmt(vals.at(-1), true)}</b></span></div>
        <svg viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true">
          <line class="c-line__grid" x1="0" y1="30" x2="300" y2="30"/><line class="c-line__grid" x1="0" y1="60" x2="300" y2="60"/><line class="c-line__grid" x1="0" y1="90" x2="300" y2="90"/>
          <path class="c-line__area" d="${area}"/><polyline class="c-line__path" points="${line}"/>
        </svg>
        <div class="c-line__x">${ins.series.map(s => `<span>${s[0]}</span>`).join('')}</div></div>`;
    }
    if (ins.type === 'cols') {
      const max = Math.max(...ins.series.map(s => s[1]));
      return `<div class="c-cols">${ins.series.map(([k, v]) => `
        <div class="c-cols__col" title="${k}: ${v} orders"><span class="c-cols__bar" style="height:${(v / max * 82).toFixed(1)}%"></span><span>${k}</span></div>`).join('')}</div>`;
    }
    return '';
  }
  function tableHTML(ins) {
    const t = ins.table || {
      cols: [ins.type === 'cols' ? 'Weekday' : ins.type === 'line' ? 'Week' : 'Name', ins.money ? 'Revenue' : 'Orders'],
      rows: ins.series.map(([k, v]) => [k, fmt(v, ins.money)])
    };
    return `<table class="c-table"><thead><tr>${t.cols.map((c, i) => `<th class="${i ? 'ta-r' : ''}">${c}</th>`).join('')}</tr></thead>
      <tbody>${t.rows.map(r => `<tr>${r.map((c, i) => `<td class="${i ? 'ta-r' : ''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  function sourceRowsHTML(ins) {
    const online = ins.source === 'Online Orders';
    const rows = online ? onlineRows : trustRows.slice(0, 5);
    return `<div class="rows">
      <div class="rows__head"><span>Order</span><span>Date</span><span>${online ? 'Channel' : 'Store'}</span><span class="ta-r">Amount</span></div>
      ${rows.map(r => `<div class="row"><span>${r.id}</span><span>${r.date}</span><span>${r.store}</span><span class="ta-r">${r.amt}</span></div>`).join('')}
      <div class="rows__foot"><span>Showing ${rows.length} of ${online ? '949' : '1,284'} rows</span><span class="fw-500 ink">${esc(ins.source)}</span></div></div>`;
  }

  // ---------- Card ----------
  function cardHTML(ins, { readOnly }) {
    const cs = cardState(ins.id);
    const hasToggle = ins.type !== 'table';
    const filtered = !readOnly && state.filter !== 'all' && ins.source !== state.filter;
    const selected = readOnly && state.selected === ins.id;
    return `<article class="c-card${filtered ? ' is-filtered' : ''}${selected ? ' is-selected' : ''}" data-id="${ins.id}" data-span="${ins.span}" style="--span:${ins.span}"${readOnly ? ' tabindex="0"' : ''}>
      <header class="c-card__head">
        <h4 class="c-card__title">${ins.title}</h4>
        <div class="c-card__tools">
          <span class="c-filtered-note">Hidden by filter</span>
          ${hasToggle ? `<div class="c-viewtog" role="group" aria-label="View">
            <button type="button" data-act="view" data-view="chart" class="${cs.view === 'chart' ? 'is-on' : ''}" aria-pressed="${cs.view === 'chart'}">Chart</button>
            <button type="button" data-act="view" data-view="table" class="${cs.view === 'table' ? 'is-on' : ''}" aria-pressed="${cs.view === 'table'}">Table</button>
          </div>` : ''}
          ${readOnly ? '' : `<button type="button" class="c-icon-btn" data-act="remove" aria-label="Remove ${ins.title} from Dashboard" title="Remove from Dashboard">${icon('x')}</button>`}
        </div>
      </header>
      <div class="c-card__def">${ins.def}</div>
      <div class="c-card__mark">${vizHTML(ins, cs.view)}</div>
      <div class="c-card__rows"${cs.rowsOpen ? '' : ' hidden'}>${sourceRowsHTML(ins)}</div>
      <footer class="c-card__foot">
        <span class="c-prov">⟐ ${ins.source} · ${ins.measure}</span>
        <span class="c-fresh${cs.frozen ? ' is-frozen' : ''}">${cs.frozen ? icon('lock') + 'Frozen Sep 29' : cs.fresh}</span>
        <span class="c-actions">
          ${readOnly || cs.frozen ? '' : `<button type="button" data-act="refresh" aria-label="Refresh this Insight">${icon('refresh')}<span>Refresh</span></button>`}
          ${readOnly ? '' : `<button type="button" data-act="freeze" aria-label="${cs.frozen ? 'Unfreeze' : 'Freeze'} this Insight">${icon('lock')}${cs.frozen ? 'Unfreeze' : 'Freeze'}</button>`}
          <button type="button" data-act="rows" aria-expanded="${cs.rowsOpen}" aria-label="Open every row behind this number">${icon('table')}Rows</button>
        </span>
      </footer>
    </article>`;
  }

  // FLIP: record card positions, mutate, then animate each card from its old spot.
  function flip(grid, mutate) {
    const before = new Map([...grid.children].map(el => [el.dataset.id, el.getBoundingClientRect()]));
    mutate();
    if (reduceMotion.matches) return;
    [...grid.children].forEach(el => {
      const b = before.get(el.dataset.id);
      if (!b) return;
      const a = el.getBoundingClientRect();
      const dx = b.left - a.left, dy = b.top - a.top;
      if (!dx && !dy) return;
      el.style.transition = 'none';
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      void el.offsetWidth;
      el.style.transition = 'transform 300ms var(--ease-in-out)';
      el.style.transform = '';
      el.addEventListener('transitionend', () => { el.style.transition = ''; }, { once: true });
    });
  }

  // ---------- Dashboard ----------
  const dashGrid = $('dashGrid');
  const viewerGrid = $('viewerGrid');

  function renderBoard() {
    dashGrid.innerHTML = state.board.map(id => cardHTML(insights[id], { readOnly: false })).join('');
    $('dashEmpty').hidden = state.board.length > 0;
    renderLib();
    renderViewer();
  }

  function renderLib() {
    const ids = Object.keys(insights);
    $('libList').innerHTML = ids.map(id => {
      const ins = insights[id];
      const placed = state.board.includes(id);
      return `<li class="c-lib__item${placed ? ' is-placed' : ''}" data-id="${id}" draggable="${!placed}">
        <span class="c-lib__thumb">${icon(ins.icon)}</span>
        <span class="c-lib__txt"><b>${ins.title}</b><em>${ins.source}</em></span>
        ${placed ? `<span class="c-lib__on">${icon('check')}On Dashboard</span>`
                 : `<button type="button" class="c-lib__add" data-add="${id}" aria-label="Add ${ins.title} to Dashboard">${icon('plus')}</button>`}
      </li>`;
    }).join('');
    $('libCount').textContent = ids.length;
    $('libCount2').textContent = ids.length;
  }

  function addCard(id, silent) {
    if (!insights[id] || state.board.includes(id)) return;
    state.board.push(id);
    renderBoard();
    const el = dashGrid.querySelector(`[data-id="${id}"]`);
    if (el && !reduceMotion.matches) {
      el.classList.add('is-entering');
      void el.offsetWidth;
      el.classList.remove('is-entering');
    }
    if (!silent) toast('Added to Dashboard');
  }

  function removeCard(id) {
    const el = dashGrid.querySelector(`[data-id="${id}"]`);
    const commit = () => flip(dashGrid, () => {
      state.board = state.board.filter(x => x !== id);
      insights[id].span = insights[id].baseSpan;
      delete state.cards[id];
      if (state.selected === id) state.selected = null;
      renderBoard();
    });
    if (!el || reduceMotion.matches) return commit();
    el.classList.add('is-leaving');
    setTimeout(commit, 150);
  }

  function refreshCard(id, delay = 0) {
    const cs = cardState(id);
    if (cs.frozen) return;
    setTimeout(() => {
      const el = dashGrid.querySelector(`[data-id="${id}"]`);
      if (!el) return;
      el.setAttribute('data-refreshing', '');
      const btn = el.querySelector('[data-act="refresh"]');
      if (btn) {
        btn.disabled = true;
        btn.querySelector('.i').classList.add('spin');
        btn.querySelector('span').textContent = 'Refreshing…';
      }
      el.querySelector('.c-fresh').textContent = 'Refreshing…';
      setTimeout(() => {
        cs.fresh = 'Computed just now';
        const now = dashGrid.querySelector(`[data-id="${id}"]`);
        if (!now) return;
        now.outerHTML = cardHTML(insights[id], { readOnly: false });
        renderViewer();
      }, 700);
    }, delay);
  }

  // Greedy row-packing into 12 columns; the last card in a short row grows to fill it.
  function tidy() {
    const allowed = [4, 6, 8, 12];
    const left = state.board.map(id => insights[id]);
    left.forEach(ins => { ins.span = ins.baseSpan; });
    const out = [];
    while (left.length) {
      let room = 12;
      const row = [];
      for (let i = 0; i < left.length;) {
        if (left[i].span <= room) { room -= left[i].span; row.push(left.splice(i, 1)[0]); } else i++;
      }
      const last = row.at(-1);
      if (room > 0 && allowed.includes(last.span + room)) last.span += room;
      out.push(...row);
    }
    flip(dashGrid, () => {
      state.board = out.map(ins => ins.id);
      renderBoard();
    });
    toast('Layout tidied');
  }

  // Card actions (event delegation on both grids)
  function onCardClick(e, readOnly) {
    const btn = e.target.closest('[data-act]');
    const card = e.target.closest('.c-card');
    if (!card) return;
    const id = card.dataset.id;
    const cs = cardState(id);
    if (!btn) {
      if (readOnly) selectCard(id);
      return;
    }
    const act = btn.dataset.act;
    if (act === 'view') {
      if (cs.view === btn.dataset.view) return;
      cs.view = btn.dataset.view;
      card.querySelectorAll('[data-act="view"]').forEach(b => {
        const on = b.dataset.view === cs.view;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      const mark = card.querySelector('.c-card__mark');
      mark.innerHTML = vizHTML(insights[id], cs.view);
      fadeIn(mark);
      // keep the other surface in step without re-rendering this one
      const twin = (readOnly ? dashGrid : viewerGrid).querySelector(`[data-id="${id}"]`);
      if (twin) twin.outerHTML = cardHTML(insights[id], { readOnly: !readOnly });
    } else if (act === 'rows') {
      cs.rowsOpen = !cs.rowsOpen;
      btn.setAttribute('aria-expanded', String(cs.rowsOpen));
      const rows = card.querySelector('.c-card__rows');
      rows.hidden = !cs.rowsOpen;
      if (cs.rowsOpen) fadeIn(rows);
    } else if (act === 'remove') {
      removeCard(id);
    } else if (act === 'refresh') {
      refreshCard(id);
    } else if (act === 'freeze') {
      cs.frozen = !cs.frozen;
      card.outerHTML = cardHTML(insights[id], { readOnly: false });
      renderViewer();
      toast(cs.frozen ? 'Insight frozen' : 'Insight unfrozen');
    }
  }
  dashGrid.addEventListener('click', e => onCardClick(e, false));
  viewerGrid.addEventListener('click', e => onCardClick(e, true));
  viewerGrid.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('c-card')) {
      e.preventDefault();
      selectCard(e.target.dataset.id);
    }
  });

  $('libList').addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) addCard(add.dataset.add);
  });

  // Drag from the library onto the canvas (pointer devices)
  const canvas = $('dashCanvas');
  $('libList').addEventListener('dragstart', e => {
    const item = e.target.closest('.c-lib__item');
    if (!item || item.getAttribute('draggable') !== 'true') return;
    e.dataTransfer.setData('text/plain', item.dataset.id);
    e.dataTransfer.effectAllowed = 'copy';
    item.classList.add('is-dragging');
  });
  $('libList').addEventListener('dragend', e => {
    const item = e.target.closest('.c-lib__item');
    if (item) item.classList.remove('is-dragging');
    canvas.classList.remove('is-drop');
  });
  canvas.addEventListener('dragover', e => { e.preventDefault(); canvas.classList.add('is-drop'); });
  canvas.addEventListener('dragleave', e => { if (!canvas.contains(e.relatedTarget)) canvas.classList.remove('is-drop'); });
  canvas.addEventListener('drop', e => {
    e.preventDefault();
    canvas.classList.remove('is-drop');
    addCard(e.dataTransfer.getData('text/plain'));
  });

  $('libCollapse').addEventListener('click', () => { $('dashLib').classList.add('is-collapsed'); $('libExpand').focus(); });
  $('libExpand').addEventListener('click', () => { $('dashLib').classList.remove('is-collapsed'); $('libCollapse').focus(); });

  // The viewer's Ask panel takes the Pinned insights panel's height (side-by-side layouts only, in CSS).
  // Only a side-by-side measurement counts: the stacked strip is shorter, and a collapsed library
  // measures 0, so the last side-by-side height is kept until a new one exists.
  const libFull = document.querySelector('#dashLib .c-lib__full');
  const sideBySide = window.matchMedia('(min-width: 1081px)');
  if (libFull && 'ResizeObserver' in window) {
    new ResizeObserver(() => {
      if (sideBySide.matches && libFull.offsetHeight) $('askPanel').style.setProperty('--lib-h', libFull.offsetHeight + 'px');
    }).observe(libFull);
  }

  $('dashRebuild').addEventListener('click', () => {
    defaultBoard.forEach((id, i) => setTimeout(() => addCard(id, true), i * 60));
    toast('Added 4 Insights');
  });

  // Toolbar
  $('dashRefresh').addEventListener('click', e => {
    state.board.forEach((id, i) => refreshCard(id, i * 60));
    if (e.isTrusted) toast('Refreshing every Insight'); // the demo's scripted click stays silent
  });
  $('dashTidy').addEventListener('click', tidy);
  $('dashFilter').addEventListener('change', e => {
    state.filter = e.target.value;
    dashGrid.querySelectorAll('.c-card').forEach(el => {
      el.classList.toggle('is-filtered', state.filter !== 'all' && insights[el.dataset.id].source !== state.filter);
    });
  });

  const exportBtn = $('dashExportBtn');
  const exportMenu = $('dashExportMenu');
  const setExport = open => {
    exportBtn.setAttribute('aria-expanded', String(open));
    if (open) { show(exportMenu); exportMenu.querySelector('button').focus(); } else hide(exportMenu);
  };
  exportBtn.addEventListener('click', e => { e.stopPropagation(); setExport(exportMenu.hidden || !exportMenu.classList.contains('is-open')); });
  exportMenu.addEventListener('click', e => {
    const item = e.target.closest('[data-export]');
    if (!item) return;
    setExport(false);
    exportBtn.focus();
    toast(item.dataset.export === 'pdf' ? 'Export started · PDF report' : 'Export started · PNG per chart');
  });
  document.addEventListener('click', e => {
    if (!exportMenu.hidden && !e.target.closest('.c-menu-wrap')) setExport(false);
  });

  // Rename
  const titleEl = $('dashTitle');
  const titleInput = $('dashTitleInput');
  const startRename = () => {
    titleInput.value = state.title;
    titleEl.hidden = true;
    titleInput.hidden = false;
    titleInput.focus();
    titleInput.select();
  };
  const endRename = save => {
    if (titleInput.hidden) return;
    const v = titleInput.value.trim();
    if (save && v) { state.title = v; renderViewer(); }
    titleEl.textContent = state.title;
    titleInput.hidden = true;
    titleEl.hidden = false;
    if (save && v) toast('Dashboard renamed');
  };
  $('dashRename').addEventListener('click', startRename);
  titleInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); endRename(true); $('dashRename').focus(); }
    if (e.key === 'Escape') { e.stopPropagation(); endRename(false); $('dashRename').focus(); }
  });
  titleInput.addEventListener('blur', () => endRename(true));

  // ---------- Toasts ----------
  const toastHost = $('toasts');
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'c-toast';
    t.setAttribute('role', 'status');
    t.innerHTML = icon('check') + esc(msg);
    toastHost.appendChild(t);
    while (toastHost.children.length > 3) toastHost.firstElementChild.remove();
    void t.offsetWidth;
    t.classList.add('is-open');
    setTimeout(() => {
      t.classList.remove('is-open');
      setTimeout(() => t.remove(), 200);
    }, 2400);
  }

  // ---------- Share dialog ----------
  const shareOverlay = $('shareOverlay');
  const shareDialog = $('shareDialog');
  let shareReturn = null;

  function openShare(trigger) {
    shareReturn = trigger || document.activeElement;
    setMenu(false);
    show(shareOverlay);
    document.body.style.overflow = 'hidden';
    $('shareVis').focus();
  }
  function closeShare() {
    hide(shareOverlay);
    document.body.style.overflow = '';
    if (shareReturn) shareReturn.focus();
  }
  document.querySelectorAll('.js-open-share').forEach(b => b.addEventListener('click', () => openShare(b)));
  $('shareClose').addEventListener('click', closeShare);
  shareOverlay.addEventListener('click', closeShare);
  shareDialog.addEventListener('click', e => e.stopPropagation());

  const visLabels = { private: ['lock', 'Private'], workspace: ['users', 'Workspace'], restricted: ['users', 'Restricted'] };
  $('shareVis').addEventListener('change', e => {
    state.visibility = e.target.value;
    const [ic, label] = visLabels[state.visibility];
    const badge = $('dashVis');
    badge.innerHTML = icon(ic) + `<span>${label}</span>`;
    badge.classList.toggle('is-shared', state.visibility !== 'private');
    toast('Visibility updated');
  });

  function initials(name) {
    const parts = name.replace(/@.*/, '').split(/[\s._-]+/).filter(Boolean);
    return ((parts[0] || '?')[0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }
  function renderPeople() {
    $('sharePeople').innerHTML = state.people.map((p, i) => `
      <li><span class="c-avatar">${esc(p.kind === 'Group' ? 'G' : initials(p.name))}</span>
        <span class="c-people__name">${esc(p.name)} <em>— ${esc(p.access)}</em></span>
        <button type="button" class="c-link-btn" data-revoke-person="${i}">Revoke</button></li>`).join('');
  }
  $('shareAddForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = $('shareName');
    const name = input.value.trim();
    if (!name) {
      input.classList.add('is-invalid');
      shake(input);
      input.focus();
      return;
    }
    input.classList.remove('is-invalid');
    state.people.push({ name, kind: $('shareKind').value, access: $('shareAccess').value });
    input.value = '';
    renderPeople();
    fadeIn($('sharePeople').lastElementChild);
    toast('Share added');
  });
  $('shareName').addEventListener('input', e => e.target.classList.remove('is-invalid'));
  $('sharePeople').addEventListener('click', e => {
    const b = e.target.closest('[data-revoke-person]');
    if (!b) return;
    state.people.splice(Number(b.dataset.revokePerson), 1);
    renderPeople();
    toast('Access revoked');
  });

  // Link sharing
  const linkToggle = $('linkRowToggle');
  const linkPanel = $('linkPanel');
  linkToggle.addEventListener('click', () => {
    const open = linkPanel.hidden;
    linkPanel.hidden = !open;
    linkToggle.setAttribute('aria-expanded', String(open));
    if (open) fadeIn(linkPanel);
  });
  const token = () => Array.from(crypto.getRandomValues(new Uint8Array(10)), b => 'abcdefghjkmnpqrstuvwxyz23456789'[b % 31]).join('');
  const fmtDate = v => new Date(v + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  $('linkForm').addEventListener('submit', e => {
    e.preventDefault();
    const link = {
      url: `centri.app/?shared=${token()}`,
      restrict: $('linkRestrict').value.trim(),
      password: $('linkPass').value,
      expires: $('linkExpires').value,
      views: 0
    };
    state.links.push(link);
    state.gatePassed = false;
    $('linkUrl').textContent = link.url;
    $('linkNew').hidden = false;
    fadeIn($('linkNew'));
    $('linkForm').reset();
    renderLinks();
    renderViewer();
    toast('Link created');
  });
  $('copyLink').addEventListener('click', () => {
    const url = 'https://' + $('linkUrl').textContent;
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).catch(() => {});
    toast('Link copied');
  });
  function renderLinks() {
    $('linkList').innerHTML = state.links.map((l, i) => {
      const parts = [
        l.restrict ? `Gated: <b>${esc(l.restrict)}</b>` : '<b>Anyone with the link</b>',
        l.password ? 'Password protected' : '',
        l.expires ? `Expires ${fmtDate(l.expires)}` : 'No expiry',
        `${l.views} view${l.views === 1 ? '' : 's'}`
      ].filter(Boolean);
      return `<li>${icon('link')}<span>${parts.join(' · ')}</span><button type="button" class="c-link-btn" data-revoke-link="${i}">Revoke</button></li>`;
    }).join('');
    const n = state.links.length;
    const sum = $('linkSummary');
    sum.textContent = n ? `${n} active link${n > 1 ? 's' : ''} · Manage ›` : 'No links · Manage ›';
    sum.classList.toggle('is-on', n > 0);
  }
  $('linkList').addEventListener('click', e => {
    const b = e.target.closest('[data-revoke-link]');
    if (!b) return;
    state.links.splice(Number(b.dataset.revokeLink), 1);
    if (!state.links.length) $('linkNew').hidden = true;
    renderLinks();
    renderViewer();
    toast('Link revoked');
  });

  function bindToggle(id, key, label) {
    const t = $(id);
    t.addEventListener('click', () => {
      state[key] = !state[key];
      t.setAttribute('aria-checked', String(state[key]));
      renderViewer();
      toast(`${label} ${state[key] ? 'on' : 'off'}`);
    });
  }
  bindToggle('togComments', 'comments', 'Comments & interactions');
  bindToggle('togFollow', 'followUps', 'Filtering & follow-up questions');

  // ---------- Viewer (public shared Dashboard) ----------
  const activeLink = () => state.links.at(-1) || null;
  const gatedLink = () => state.links.find(l => l.restrict || l.password) || null;

  function renderViewer() {
    const link = activeLink();
    const gate = gatedLink();
    $('viewerUrl').textContent = link ? link.url : 'centri.app/?shared=…';
    $('viewerNotice').hidden = !!link;

    const showGate = !!gate && !state.gatePassed;
    $('viewerGate').hidden = !showGate;
    $('viewerMain').hidden = showGate;
    if (showGate) {
      $('gateTitle').textContent = gate.restrict ? 'Enter your email to continue' : 'This link is password protected';
      $('gateSub').textContent = gate.restrict && gate.password ? 'The owner restricted this link and set a password.'
        : gate.restrict ? `This link is restricted to ${gate.restrict}.` : 'Enter the password the owner gave you.';
      $('gateEmail').hidden = !gate.restrict;
      $('gatePass').hidden = !gate.password;
    }

    $('viewerTitle').textContent = state.title;
    const n = state.board.length;
    $('viewerCount').textContent = `${n} Insight${n === 1 ? '' : 's'}`;
    $('viewerComments').hidden = !state.comments;
    viewerGrid.innerHTML = n ? state.board.map(id => cardHTML(insights[id], { readOnly: true })).join('')
      : '<p class="c-faint" style="grid-column:span 12;margin:0">This Dashboard has no Insights yet.</p>';

    if (state.selected && !state.board.includes(state.selected)) state.selected = null;
    renderSelection();

    const panel = $('askPanel');
    panel.classList.toggle('is-off', !state.followUps);
    $('askOff').hidden = state.followUps;
    $('askInput').disabled = !state.followUps;
    panel.querySelector('.c-send').disabled = !state.followUps;
    $('askSuggest').querySelectorAll('button').forEach(b => { b.disabled = !state.followUps; });
  }

  $('gateForm').addEventListener('submit', e => {
    e.preventDefault();
    const gate = gatedLink();
    const email = $('gateEmail'), pass = $('gatePass');
    const err = $('gateErr');
    let problem = '';
    if (gate.restrict) {
      const v = email.value.trim().toLowerCase();
      const r = gate.restrict.toLowerCase();
      const ok = v && (r.startsWith('@') ? v.endsWith(r) : v === r);
      if (!ok) problem = v ? `This link is restricted to ${gate.restrict}.` : 'Enter your email to continue.';
      if (problem) { email.classList.add('is-invalid'); shake(email); }
    }
    if (!problem && gate.password && pass.value !== gate.password) {
      problem = 'That password isn’t right.';
      pass.classList.add('is-invalid');
      shake(pass);
    }
    err.hidden = !problem;
    err.textContent = problem;
    if (problem) return;
    email.classList.remove('is-invalid');
    pass.classList.remove('is-invalid');
    email.value = pass.value = '';
    state.gatePassed = true;
    gate.views += 1;
    renderLinks();
    renderViewer();
    fadeIn($('viewerMain'));
  });

  function selectCard(id) {
    state.selected = state.selected === id ? null : id;
    viewerGrid.querySelectorAll('.c-card').forEach(el => el.classList.toggle('is-selected', el.dataset.id === state.selected));
    renderSelection();
  }
  function renderSelection() {
    $('askSel').hidden = !state.selected;
    if (state.selected) $('askSelName').textContent = insights[state.selected].title;
  }
  $('askSelClear').addEventListener('click', () => selectCard(state.selected));

  // Canned answers, computed only from Insights that are on this Dashboard.
  const answers = {
    summary: {
      q: 'Summarize this Dashboard.',
      needs: ['revenue', 'stores', 'weekly', 'channel'],
      build: on => {
        const s = [];
        if (on.revenue) s.push('Revenue for May 2023 was $410,000, up 6.2% on April.');
        if (on.stores) s.push('Airport led the stores with $128,420.');
        if (on.weekly) s.push('Weekly revenue rose every week, from $88,420 to $119,320.');
        if (on.channel) s.push('Web brought in 486 of 949 online orders.');
        if (on.refunds) s.push('The refund rate was 2.5%.');
        return s.join(' ');
      }
    },
    store: {
      q: 'Which store led revenue in May?', needs: ['stores'],
      build: () => 'Airport, with $128,420, about 31% of May revenue. Downtown was second at $107,860.'
    },
    channel: {
      q: 'Where do online orders come from?', needs: ['channel'],
      build: () => 'Mostly the web: 486 of 949 online orders (51%). Mobile app had 322 and Marketplace 141.'
    }
  };
  function answerFor(key, text) {
    const on = Object.fromEntries(state.board.map(id => [id, true]));
    if (key && answers[key]) {
      const a = answers[key];
      const used = a.needs.filter(id => on[id]);
      if (!used.length) return { text: 'That Insight isn’t on this Dashboard, so I can’t answer it here. Answers use only this Dashboard’s Insights.', used: [] };
      return { text: a.build(on), used };
    }
    const sel = state.selected;
    if (sel) {
      const ins = insights[sel];
      const brief = { revenue: 'May revenue was $410,000 from 1,284 orders, excluding 33 refunds.', stores: 'Airport $128,420, Downtown $107,860, Riverside $93,540, Northgate $80,180.', weekly: 'Revenue grew each week in May, ending at $119,320 for May 22–31.', channel: 'Web 486, Mobile app 322, Marketplace 141 online orders in May.', refunds: '33 of 1,317 orders were refunded, a 2.5% rate.', products: 'Cold brew kit led with $38,200, then Travel mug at $29,450.', weekday: 'Friday was the busiest day with 158 orders; Sunday the quietest with 110.' }[sel];
      return { text: `About “${ins.title}”: ${brief}`, used: [sel] };
    }
    const lower = text.toLowerCase();
    if (/store|airport|downtown/.test(lower)) return answerFor('store');
    if (/channel|online|web|mobile/.test(lower)) return answerFor('channel');
    if (/summar|overview|total|revenue/.test(lower)) return answerFor('summary');
    return { text: 'I can only answer from this Dashboard’s Insights. Try a suggested question, or select a card first.', used: [] };
  }

  const askLog = $('askLog');
  // Shared by this panel and the hero chat. Scrolls only the log itself, never the page.
  function appendMsg(html, cls, log = askLog) {
    const el = document.createElement('div');
    el.className = `c-msg ${cls} c-msg-in`;
    el.innerHTML = html;
    log.appendChild(el);
    void el.offsetWidth;
    el.classList.remove('c-msg-in');
    log.scrollTop = log.scrollHeight;
    return el;
  }
  let answering = false;
  function ask(key, text) {
    if (!state.followUps || answering) return;
    const q = key ? answers[key].q : text;
    appendMsg(esc(q), 'c-msg-user');
    const { text: reply, used } = answerFor(key, q);
    answering = true;
    const ai = appendMsg(`<span class="c-msg-ai__avatar">${icon('sparkle')}</span><div class="c-msg-ai__body"><p></p></div>`, 'c-msg-ai');
    const p = ai.querySelector('p');
    const words = reply.split(' ');
    const finish = () => {
      p.textContent = reply;
      if (used.length) {
        const src = document.createElement('p');
        src.className = 'c-msg-ai__src';
        src.innerHTML = 'Answered from: ' + used.map(id => `<b>${esc(insights[id].title)}</b>`).join(', ');
        ai.querySelector('.c-msg-ai__body').appendChild(src);
      }
      askLog.scrollTop = askLog.scrollHeight;
      answering = false;
    };
    if (reduceMotion.matches) return finish();
    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      p.textContent = words.slice(0, i).join(' ');
      askLog.scrollTop = askLog.scrollHeight;
      if (i >= words.length) { clearInterval(tick); finish(); }
    }, 35);
  }
  $('askSuggest').addEventListener('click', e => {
    const b = e.target.closest('[data-q]');
    if (b) ask(b.dataset.q);
  });
  $('askForm').addEventListener('submit', e => {
    e.preventDefault();
    const v = $('askInput').value.trim();
    if (!v) return;
    $('askInput').value = '';
    ask(null, v);
  });

  renderPeople();
  renderLinks();
  renderBoard();

  // ---------- Sticky nav after the hero nav scrolls away ----------
  const stickyNav = $('stickyNav');
  const setStickyFocusable = on => {
    stickyNav.setAttribute('aria-hidden', String(!on));
    stickyNav.querySelectorAll('a, button').forEach(el => { el.tabIndex = on ? 0 : -1; });
  };
  new IntersectionObserver(([entry]) => {
    const showNav = !entry.isIntersecting;
    stickyNav.classList.toggle('is-visible', showNav);
    setStickyFocusable(showNav);
  }).observe($('heroNav'));

  // ---------- Mobile menu ----------
  const menuToggle = $('menuToggle');
  const mobileMenu = $('mobileMenu');
  function setMenu(open) {
    mobileMenu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    if (open) fadeIn(mobileMenu);
  }
  menuToggle.addEventListener('click', () => setMenu(mobileMenu.hidden));
  mobileMenu.querySelectorAll('.js-close-menu').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // ---------- Hero source rows toggle ----------
  const heroRowsToggle = $('heroRowsToggle');
  const heroRowsTable = $('heroRowsTable');
  heroRowsToggle.addEventListener('click', () => {
    const open = heroRowsTable.hidden;
    heroRowsTable.hidden = !open;
    heroRowsToggle.querySelector('span').textContent = open ? 'Hide rows' : 'Rows';
    heroRowsToggle.setAttribute('aria-expanded', String(open));
    if (open) fadeIn(heroRowsTable);
  });

  // ---------- Hero chat: suggested questions ----------
  // Insight-shaped, so vizHTML and sourceRowsHTML draw them like any other card.
  const heroAnswers = {
    revenue: {
      ...insights.revenue, q: 'What was our total revenue in May 2023?', crumb: 'Total revenue, May 2023', title: 'Total revenue · May 2023', rows: '1,284',
      plain: 'the sum of Total Amount for every order dated May 2023, excluding refunded orders.'
    },
    stores: {
      ...insights.stores, q: 'What was revenue by store in May 2023?', crumb: 'Revenue by store', title: 'Revenue by store · May 2023', rows: '1,284',
      plain: 'Airport led with $128,420, about 31% of the $410,000 total. Northgate was lowest at $80,180.'
    },
    products: {
      ...insights.products, q: 'What were our top products in May?', crumb: 'Top products in May', title: 'Top products · May 2023', rows: '949',
      plain: 'Cold brew kit led with $38,200, then Travel mug at $29,450. The top four products made $101,850.'
    },
    refunds: {
      q: 'What was the refund rate by store in May?', crumb: 'Refund rate by store', title: 'Refund rate by store · May 2023', rows: '1,317',
      def: 'Refunded orders ÷ all orders by Store · May 2023', source: 'Retail Sales', measure: 'Refund rate by Store', type: 'table',
      table: { cols: ['Store', 'Refunded', 'Orders', 'Rate'], rows: [['Airport', '8', '410', '2.0%'], ['Downtown', '9', '352', '2.6%'], ['Riverside', '6', '300', '2.0%'], ['Northgate', '10', '255', '3.9%'], ['All stores', '33', '1,317', '2.5%']] },
      plain: 'Northgate refunded the most, at 3.9%. Across all stores, 33 of 1,317 orders were refunded, a 2.5% rate.'
    },
    q2: {
      q: 'How are Q2 orders tracking against plan?', crumb: 'Q2 orders vs plan', title: 'Q2 orders vs plan', rows: '2,492',
      def: 'COUNT(Orders), excluding refunded, vs Plan · Q2 2023 · monthly', source: 'Retail Sales', measure: 'Orders vs Plan', type: 'table',
      table: { cols: ['Month', 'Orders', 'Plan', 'vs plan'], rows: [['April', '1,208', '1,250', '−3.4%'], ['May', '1,284', '1,250', '+2.7%'], ['June', '—', '1,300', 'Not started'], ['Q2 to date', '2,492', '2,500', '−0.3%']] },
      plain: 'Q2 is 8 orders behind plan through May 31. April missed by 42, and May beat plan by 34.'
    }
  };
  // Two gates, both fail-safe. First, every word of the question must come from this
  // vocabulary, which covers only what the sample answers support: May 2023 revenue and
  // revenue by store (Retail Sales), top products (Online Orders, which has no Store column),
  // refund counts and rates by store, and Q2 orders vs plan. Any other word (another period, a
  // measure such as profit or units, a dimension such as region, a person) gets the refusal.
  // Second, the question's topics must be a combination one answer actually has, so allowed
  // words can't be combined into a question no answer covers ("top products at the airport").
  // "A plausible guess is worse than a refusal."
  const HERO_WORDS = new Set((
    'a an the what whats was were is are be been had has have did do does how which where show me give tell list see get ' +
    'our we us my i in of for by at on to from and or with vs versus per each all any every this that it there ' +
    'top best most highest lowest biggest largest least worst total overall sum amount much ' +
    'revenue revenues sales sale sold sell sells seller sellers selling made make earn earned money brought ' +
    'store stores location locations shop shops branch branches airport downtown riverside northgate ' +
    'product products item items refund refunds refunded returns returned rate rates percentage percent share ' +
    'plan planned target targets tracking track tracked against compared compare comparison doing ' +
    'order orders breakdown break down split summary summarize summarise overview led lead leading performed performing performance ' +
    'may 2023 month q2'
  ).split(' '));
  function heroMatch(text) {
    const t = text.toLowerCase().replace(/['‘’]23\b/g, ' 2023').replace(/['‘’]s\b/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    const words = t.split(' ');
    if (!t || words.some(w => !HERO_WORDS.has(w))) return null;
    const any = re => words.some(w => re.test(w));
    const store = any(/^(stores?|locations?|shops?|branch(es)?|airport|downtown|riverside|northgate)$/);
    const product = any(/^(products?|items?)$/) || /best sell|sold best|sells? best|top sell/.test(t);
    const refund = any(/^(refund(s|ed)?|returns|returned)$/);
    const money = any(/^(revenues?|money|earn(ed)?|brought|amount|much|sum)$/);
    const plan = any(/^(plan(ned)?|targets?)$/);
    const order = any(/^orders?$/);
    const low = any(/^(least|lowest|worst)$/);
    const may = any(/^may$/), q2 = any(/^q2$/);
    const otherPeriod = !may && any(/^(month|2023)$/);  // "the month of May 2023" is fine; the whole of 2023 isn't

    if (plan) return order && !store && !product && !refund && !otherPeriod ? 'q2' : null; // May sits inside Q2
    if (q2 || otherPeriod || order) return null;  // no other answer covers Q2, other periods, or order counts
    if (refund) return product || money ? null : 'refunds'; // counts and rates by store, no dollars
    if (store && product) return null;            // products come from Online Orders, which has no Store column
    if (product) return low ? null : 'products';  // the card shows the top four, not the bottom
    if (store) return 'stores';                   // lists every store, so "lowest" is answered too
    if (money || any(/^(sales?|sold|total|may)$/)) return 'revenue';
    return null;
  }
  const heroCardHTML = a => `
    <header class="c-card__head"><h4 class="c-card__title">${a.title}</h4><span class="chip chip--green">Computed from ${a.rows} rows</span></header>
    <div class="c-card__def">${a.def}</div>
    <div class="c-card__mark">${vizHTML(a)}<p class="c-plain">In plain language: ${a.plain}</p></div>
    <div class="c-card__rows" hidden>${sourceRowsHTML(a)}</div>
    <footer class="c-card__foot">
      <span class="c-prov">⟐ ${a.source} · ${a.measure}</span>
      <span class="c-fresh">Computed just now</span>
      <span class="c-actions">
        <button type="button" data-hero-rows aria-expanded="false">${icon('table')}<span>Rows</span></button>
        <a href="#dashboard">${icon('pin')}Pin to Dashboard</a>
      </span>
    </footer>`;

  const heroThread = $('heroThread');
  const heroRecents = document.querySelectorAll('.hero__app .c-recent');
  const heroTriggers = document.querySelectorAll('#heroSuggest [data-hq], .hero__app .c-recent, #heroAskForm .c-send');
  let heroBusy = false;
  // aria-disabled, not disabled: a focused chip keeps focus while the answer is in flight.
  function setHeroBusy(on) {
    heroBusy = on;
    heroThread.setAttribute('aria-busy', String(on));
    heroTriggers.forEach(b => b.setAttribute('aria-disabled', String(on)));
  }
  // Put the new question at the top of the thread (the browser clamps at the bottom).
  // Only the thread scrolls; the page never moves.
  const heroScrollTo = el => { heroThread.scrollTop = el.offsetTop - 8; };

  function heroAsk(key, text) {
    if (heroBusy) return;
    const a = heroAnswers[key];
    const q = appendMsg(`<div class="c-asked__q">${esc(text || a.q)}</div>`, 'c-asked', heroThread);
    heroScrollTo(q);
    heroRecents.forEach(r => {
      r.classList.toggle('is-on', r.dataset.hq === key);
      if (r.dataset.hq === key) r.setAttribute('aria-current', 'true'); else r.removeAttribute('aria-current');
    });
    if (a) $('heroCrumb').textContent = a.crumb;
    const finish = () => {
      if (a) appendMsg(heroCardHTML(a), 'c-card c-card--hero', heroThread);
      else appendMsg(`<span class="c-msg-ai__avatar">${icon('sparkle')}</span><div class="c-msg-ai__body"><p>I can answer from Retail Sales and Online Orders. Try one of the suggested questions below.</p></div>`, 'c-msg-ai', heroThread);
      heroScrollTo(q);
    };
    if (reduceMotion.matches) return finish();
    // Brief "thinking" beat, then the answer card takes its place.
    setHeroBusy(true);
    const thinking = appendMsg(`<span class="c-msg-ai__avatar">${icon('sparkle')}</span><span>Reading ${a ? a.source : 'your sources'}<span class="c-thinking__dots" aria-hidden="true"><i></i><i></i><i></i></span></span>`, 'c-msg-ai c-thinking', heroThread);
    heroScrollTo(q);
    setTimeout(() => {
      thinking.remove();
      finish();
      setHeroBusy(false);
    }, 750);
  }
  heroTriggers.forEach(b => { if (b.dataset.hq) b.addEventListener('click', () => heroAsk(b.dataset.hq)); });
  $('heroAskForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = $('heroAskInput');
    const v = input.value.trim();
    if (!v || heroBusy) return;
    input.value = '';
    heroAsk(heroMatch(v), v);
  });
  // Rows toggle on answer cards added to the thread (the first card has its own above).
  heroThread.addEventListener('click', e => {
    const b = e.target.closest('[data-hero-rows]');
    if (!b) return;
    const rows = b.closest('.c-card').querySelector('.c-card__rows');
    const open = rows.hidden;
    rows.hidden = !open;
    b.querySelector('span').textContent = open ? 'Hide rows' : 'Rows';
    b.setAttribute('aria-expanded', String(open));
    if (open) fadeIn(rows);
  });

  // ---------- Automate section: workflow builder (trigger panel + n8n-style run) ----------
  const auApp = $('auApp');
  const auCanvas = $('auCanvas');
  const auPanel = $('auPanel');
  const auMini = $('auMini');
  const flowCanvas = $('flowCanvas');
  const flowEdges = $('flowEdges');
  const flowNodes = Array.from(flowCanvas.querySelectorAll('.flow-node'));
  const flowRun = $('flowRun');
  const flowApprove = $('flowApprove');
  const flowStatus = $('flowStatus');
  const flowLog = flowStatus.parentElement;
  const auOutOpen = $('auOutOpen');
  const REVIEW = 4;
  const ZOOMS = [75, 90, 100, 110, 125];
  let flowToken = 0;
  let edges = [];
  let miniRects = [];
  let built = false;
  let activated = false;
  let lastTrig = null;
  let zoomIdx = 2;

  // Connectors: bezier from port to port, side to side when the next node is beside, bottom to top when below.
  const SVG = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs) => {
    const el = document.createElementNS(SVG, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };
  function drawEdges() {
    if (!flowCanvas.offsetParent) return;
    const done = edges.map(e => e.run.classList.contains('is-done'));
    flowEdges.innerHTML = '';
    flowCanvas.querySelectorAll('.flow__label').forEach(l => l.remove());
    edges = [];
    for (let i = 0; i < flowNodes.length - 1; i++) {
      const a = flowNodes[i], b = flowNodes[i + 1];
      const ax = a.offsetLeft, ay = a.offsetTop, aw = a.offsetWidth, ah = a.offsetHeight;
      const bx = b.offsetLeft, by = b.offsetTop, bw = b.offsetWidth, bh = b.offsetHeight;
      let d, p1, p2;
      if (Math.abs((by + bh / 2) - (ay + ah / 2)) < Math.min(ah, bh) / 2) {
        const dir = bx > ax ? 1 : -1;
        p1 = [dir > 0 ? ax + aw : ax, ay + ah / 2];
        p2 = [dir > 0 ? bx : bx + bw, by + bh / 2];
        const k = Math.abs(p2[0] - p1[0]) / 2;
        d = `M${p1} C${p1[0] + dir * k},${p1[1]} ${p2[0] - dir * k},${p2[1]} ${p2}`;
      } else {
        p1 = [ax + aw / 2, ay + ah];
        p2 = [bx + bw / 2, by];
        const k = (p2[1] - p1[1]) / 2;
        d = `M${p1} C${p1[0]},${p1[1] + k} ${p2[0]},${p2[1] - k} ${p2}`;
      }
      const base = svgEl('path', { class: 'e-base', d });
      const run = svgEl('path', { class: 'e-run' + (done[i] ? ' is-done' : ''), d });
      flowEdges.append(base, run);
      const len = run.getTotalLength();
      run.style.transition = 'none';
      run.style.strokeDasharray = len;
      run.style.strokeDashoffset = done[i] ? 0 : len;
      const ports = [p1, p2].map(([x, y]) => {
        const c = svgEl('circle', { class: 'e-port' + (done[i] ? ' is-done' : ''), cx: x, cy: y, r: 4 });
        flowEdges.append(c);
        return c;
      });
      let label = null;
      if (a.dataset.label) {
        const mid = run.getPointAtLength(len / 2);
        label = document.createElement('span');
        label.className = 'flow__label' + (done[i] ? ' is-on' : '');
        label.textContent = a.dataset.label;
        label.style.left = mid.x + 'px'; label.style.top = mid.y + 'px';
        flowCanvas.appendChild(label);
      }
      void run.getBoundingClientRect();
      run.style.transition = '';
      edges.push({ run, len, ports, label });
    }
    renderMini();
  }
  if ('ResizeObserver' in window) new ResizeObserver(() => drawEdges()).observe(flowCanvas);

  // Minimap: the real node layout scaled down; before a trigger exists, one accent box and two ghosts.
  function renderMini() {
    auMini.innerHTML = '';
    miniRects = [];
    if (!built) {
      auMini.setAttribute('viewBox', '0 0 120 60');
      auMini.append(svgEl('path', { class: 'm-line', d: 'M40 30H50M70 30H80' }));
      [[20, 'm-node is-trig'], [50, 'm-node'], [80, 'm-node']].forEach(([x, cls]) =>
        auMini.append(svgEl('rect', { class: cls, x, y: 20, width: 20, height: 20, rx: 3 })));
      return;
    }
    const pad = 24;
    auMini.setAttribute('viewBox', `${-pad} ${-pad} ${flowCanvas.offsetWidth + pad * 2} ${flowCanvas.offsetHeight + pad * 2}`);
    const c = n => [n.offsetLeft + n.offsetWidth / 2, n.offsetTop + n.offsetHeight / 2];
    const path = flowNodes.map((n, i) => (i ? 'L' : 'M') + c(n)).join(' ');
    auMini.append(svgEl('path', { class: 'm-line', d: path, 'stroke-width': 6 }));
    flowNodes.forEach(n => {
      const state = ['running', 'done', 'waiting'].find(s => n.classList.contains('is-' + s));
      const r = svgEl('rect', { class: 'm-node' + (state ? ' is-' + state : ''), x: n.offsetLeft, y: n.offsetTop, width: n.offsetWidth, height: n.offsetHeight, rx: 16, 'stroke-width': 6 });
      auMini.append(r);
      miniRects.push(r);
    });
  }

  const flowBusy = () => flowRun.getAttribute('aria-disabled') === 'true';
  function setLog(state, text) { flowLog.dataset.state = state; flowStatus.textContent = text; }
  function setNode(i, state) {
    [flowNodes[i], miniRects[i]].forEach(el => {
      if (!el) return;
      el.classList.remove('is-running', 'is-done', 'is-waiting');
      if (state) el.classList.add('is-' + state);
    });
  }
  function setEdge(i, on, instant) {
    const e = edges[i]; if (!e) return;
    if (instant) e.run.style.transition = 'none';
    e.run.style.strokeDashoffset = on ? 0 : e.len;
    e.run.classList.toggle('is-done', on);
    e.ports.forEach(p => p.classList.toggle('is-done', on));
    if (e.label) e.label.classList.toggle('is-on', on);
    if (instant) { void e.run.getBoundingClientRect(); e.run.style.transition = ''; }
  }
  function resetFlow(text) {
    flowToken++;
    flowNodes.forEach((_, i) => setNode(i, null));
    edges.forEach((_, i) => setEdge(i, false, true));
    flowApprove.hidden = true;
    auOutOpen.hidden = true;
    flowRun.setAttribute('aria-disabled', String(!built));
    setLog('idle', text);
  }
  // Walk steps from..to: the node runs, turns done, its outgoing edge draws, then the next node starts.
  // A newer run bumps the token, which cancels every pending step of this one.
  function playSteps(from, to, onEnd) {
    const token = flowToken;
    const wait = ms => new Promise(r => setTimeout(r, reduceMotion.matches ? 0 : ms));
    (async () => {
      for (let i = from; i <= to; i++) {
        if (token !== flowToken) return;
        if (i === REVIEW && from < REVIEW) {
          setNode(i, 'waiting');
          flowApprove.hidden = false;
          flowRun.setAttribute('aria-disabled', 'false');
          setLog('waiting', 'Waiting for your review · nothing is sent until you approve');
          return;
        }
        setNode(i, 'running');
        setLog('running', `Running · step ${i + 1} of ${flowNodes.length}: ${flowNodes[i].querySelector('b').firstChild.textContent.trim()}`);
        await wait(520);
        if (token !== flowToken) return;
        setNode(i, 'done');
        if (i < flowNodes.length - 1) { setEdge(i, true, reduceMotion.matches); await wait(380); }
      }
      if (token === flowToken && onEnd) onEnd();
    })();
  }
  function runFlow() {
    resetFlow('Starting');
    flowRun.setAttribute('aria-disabled', 'true');
    playSteps(0, flowNodes.length - 1);
  }

  // Trigger panel: leaves with a short fade + nudge, then is removed from layout; comes back with the shared fadeIn.
  function openPanel() {
    if (!auPanel.hidden && !auPanel.classList.contains('is-leaving')) return;
    auPanel.classList.remove('is-leaving');
    auPanel.hidden = false;
    auApp.classList.remove('is-panel-off');
    fadeIn(auPanel);
    drawEdges();
  }
  function closePanel() {
    if (auPanel.hidden) return;
    const done = () => {
      if (!auPanel.classList.contains('is-leaving')) return;
      auPanel.hidden = true;
      auPanel.classList.remove('is-leaving');
      auApp.classList.add('is-panel-off');
      drawEdges();
    };
    auPanel.classList.add('is-leaving');
    if (reduceMotion.matches) done();
    else setTimeout(done, 200);
  }

  function setSaved(text) { $('auSaved').textContent = text; }
  function setTrigger(t) {
    const node = flowNodes[0];
    node.style.setProperty('--brand', t.brand);
    $('flowTriggerIcon').innerHTML = `<svg class="${t.icon.startsWith('lg-') ? 'lg' : 'i'}"><use href="#${t.icon}"/></svg>`;
    $('flowTriggerName').textContent = t.name;
    $('flowTriggerMeta').textContent = t.meta;
  }
  function buildFlow(t) {
    lastTrig = t;
    setTrigger(t);
    built = true;
    auCanvas.dataset.state = 'built';
    flowCanvas.hidden = false;
    flowNodes.forEach((n, i) => n.style.setProperty('--n', i));
    flowCanvas.classList.remove('is-building');
    void flowCanvas.offsetWidth;
    flowCanvas.classList.add('is-building');
    setTimeout(() => flowCanvas.classList.remove('is-building'), 700);
    resetFlow(activated ? 'Ready · press Run now' : 'Ready · press Activate to run');
    drawEdges();
    $('auUndo').disabled = false;
    $('auRedo').disabled = true;
    setSaved('Last saved just now');
  }
  function clearFlow() {
    built = false;
    resetFlow('Pick a trigger to start');
    auCanvas.dataset.state = 'empty';
    flowCanvas.hidden = true;
    renderMini();
    $('auUndo').disabled = true;
    $('auRedo').disabled = !lastTrig;
  }
  function pickTrigger(btn, out = false) {
    closePanel();
    buildFlow({ name: btn.dataset.t, meta: btn.dataset.m, icon: btn.dataset.icon, brand: btn.dataset.brand, out });
  }
  auPanel.querySelectorAll('.au-trig, .au-row').forEach(b => b.addEventListener('click', () => pickTrigger(b)));
  $('auAskAi').addEventListener('click', () => {
    pickTrigger(auPanel.querySelector('.au-trig'));
    toast('Centri AI suggests Schedule · every Monday 8:00');
  });
  function setActivated(on) {
    activated = on;
    $('auState').classList.toggle('is-active', on);
    $('auStateTxt').textContent = on ? 'Active' : 'Draft';
    $('flowRunTxt').textContent = on ? 'Run now' : 'Activate';
  }
  // A template names the workflow and brings its trigger; the steps build in like a picked trigger.
  auCanvas.querySelectorAll('.au-tpl').forEach(b => b.addEventListener('click', () => {
    $('auTitle').textContent = b.dataset.name;
    // Only the revenue report template has a "what was sent" output (see hasOutput)
    pickTrigger(b, b.dataset.name === 'Monday revenue report');
  }));
  $('auAddTrigger').addEventListener('click', openPanel);
  $('flowTrigger').addEventListener('click', openPanel);
  $('auPanelClose').addEventListener('click', closePanel);

  // Search filters both lists; a group's heading hides with it.
  $('auSearch').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    let any = false;
    ['rec', 'all'].forEach(g => {
      const list = auPanel.querySelector(`div[data-group="${g}"]`);
      let n = 0;
      list.querySelectorAll('button').forEach(b => {
        const hit = !q || b.textContent.toLowerCase().includes(q) || b.dataset.t.toLowerCase().includes(q);
        b.hidden = !hit;
        if (hit) n++;
      });
      list.hidden = !n;
      auPanel.querySelector(`.au-label[data-group="${g}"]`).hidden = !n;
      if (n) any = true;
    });
    $('auNone').hidden = any;
  });

  flowRun.addEventListener('click', () => {
    if (!built || flowBusy()) return;
    setActivated(true);
    runFlow();
  });
  flowApprove.addEventListener('click', () => {
    flowApprove.hidden = true;
    flowRun.setAttribute('aria-disabled', 'true');
    playSteps(REVIEW, flowNodes.length - 1, () => {
      flowRun.setAttribute('aria-disabled', 'false');
      setLog('done', 'Succeeded · sent to 4 people in leadership');
      toast('Email sent to leadership · 4 people');
      if (hasOutput()) { auOutOpen.hidden = false; fadeIn(auOutOpen); }
    });
  });

  // What the Run sent. Only the schedule-triggered revenue report has one: the PRD ships manual and
  // scheduled triggers (FR-162) and defers event triggers (FR-189), so the other templates show none.
  // The words are the Dashboard's own summary; every number is a Weekly Ops Review Insight.
  const auOutOverlay = $('auOutOverlay');
  const auOutList = $('auOutList');
  const auOutIds = ['revenue', 'stores', 'weekly', 'channel'];
  const auOutValue = {
    // Each value carries every figure the summary quotes, so no summary number lacks an Insight
    revenue: ins => `${ins.value} · ${ins.delta}`,
    stores: ins => `${ins.series[0][0]} · ${fmt(ins.series[0][1], true)}`,
    weekly: ins => `${fmt(ins.series[0][1], true)} → ${fmt(ins.series.at(-1)[1], true)}`,
    channel: ins => `${ins.table.rows[0][0]} · ${ins.table.rows[0][1]} of 949 orders`
  };
  let auOutReturn = null;
  function hasOutput() { return !!lastTrig && !!lastTrig.out; }
  function renderOut() {
    const name = $('auTitle').textContent;
    $('auOutName').textContent = name;
    $('auOutSubject').textContent = name;
    $('auOutText').textContent = answers.summary.build(Object.fromEntries(auOutIds.map(id => [id, true])));
    auOutList.innerHTML = auOutIds.map(id => {
      const ins = insights[id];
      return `<article class="c-card">
        <header class="c-card__head"><h5 class="c-card__title">${esc(ins.title)}</h5><b class="au-out__val">${esc(auOutValue[id](ins))}</b></header>
        <div class="c-card__def">${esc(ins.def)}</div>
        <div class="c-card__rows" id="auOutRows-${id}" hidden>${sourceRowsHTML(ins)}</div>
        <footer class="c-card__foot">
          <span class="c-prov">⟐ ${esc(ins.source)} · ${esc(ins.measure)}</span>
          <span class="c-actions"><button type="button" data-rows aria-expanded="false" aria-controls="auOutRows-${id}">${icon('table')}<span>Rows</span></button></span>
        </footer>
      </article>`;
    }).join('');
  }
  function openOut() {
    auOutReturn = document.activeElement;
    renderOut();
    show(auOutOverlay);
    document.body.style.overflow = 'hidden';
    $('auOutClose').focus();
  }
  function closeOut() {
    hide(auOutOverlay);
    document.body.style.overflow = '';
    // Safari doesn't focus a clicked button, so fall back to the button that opened the dialog
    (auOutReturn && auOutReturn !== document.body ? auOutReturn : auOutOpen).focus();
  }
  auOutOpen.addEventListener('click', openOut);
  $('auOutClose').addEventListener('click', closeOut);
  auOutOverlay.addEventListener('click', closeOut);
  $('auOutDialog').addEventListener('click', e => e.stopPropagation());
  auOutList.addEventListener('click', e => {
    const b = e.target.closest('[data-rows]');
    if (!b) return;
    const open = b.getAttribute('aria-expanded') !== 'true';
    const rows = $(b.getAttribute('aria-controls'));
    b.setAttribute('aria-expanded', String(open));
    b.querySelector('span').textContent = open ? 'Hide rows' : 'Rows';
    rows.hidden = !open;
    if (open) fadeIn(rows);
  });
  $('auSave').addEventListener('click', () => { setSaved('Last saved just now'); toast('Workflow saved'); });
  $('auUndo').addEventListener('click', () => { if (built) { clearFlow(); openPanel(); } });
  $('auRedo').addEventListener('click', () => { if (!built && lastTrig) { closePanel(); buildFlow(lastTrig); } });

  // Zoom: scale the graph (transform only), -1 / +1 steps, 0 resets.
  auCanvas.closest('.au-card').addEventListener('click', e => {
    const b = e.target.closest('[data-zoom]');
    if (!b) return;
    const step = +b.dataset.zoom;
    zoomIdx = step ? Math.min(ZOOMS.length - 1, Math.max(0, zoomIdx + step)) : 2;
    auCanvas.style.setProperty('--zoom', ZOOMS[zoomIdx] / 100);
    $('auZoom').textContent = ZOOMS[zoomIdx] + '%';
  });
  renderMini();

  // Automate demo: once the canvas is well in view, a guide cursor applies the Monday template,
  // activates it and approves the review. Any real pointer/key input in the builder stops it.
  const auCard = auCanvas.closest('.au-card');
  const auReplay = $('auReplay');
  const auCursor = document.createElement('div');
  auCursor.className = 'demo-cursor';
  auCursor.setAttribute('aria-hidden', 'true');
  auCursor.innerHTML = '<svg viewBox="0 0 24 24"><path d="M5 3l14 8-6.2 1.6L10 19z"/></svg><span class="demo-cursor__tip is-empty"></span>';
  auCard.appendChild(auCursor);
  const auTip = auCursor.querySelector('.demo-cursor__tip');
  let auRun = 0;
  let auDemo = 'idle'; // idle | playing | done
  let auCurX = 0;
  const auSleep = ms => new Promise(r => setTimeout(r, ms));

  function auPlaceTip() {
    const room = auCard.clientWidth - 8 - auTip.offsetWidth - auCurX;
    auTip.style.left = Math.max(8 - auCurX, Math.min(20, room)) + 'px';
  }
  function auSay(text) {
    if (auTip.textContent === text) return;
    auTip.textContent = text;
    auTip.classList.toggle('is-empty', !text);
    auPlaceTip();
    if (text) fadeIn(auTip);
  }
  function auMove(el, instant) {
    const c = auCard.getBoundingClientRect(), r = el.getBoundingClientRect();
    auCurX = r.left + r.width / 2 - c.left;
    auCursor.classList.toggle('is-instant', !!instant);
    auCursor.style.transform = `translate(${auCurX}px, ${r.top + r.height / 2 - c.top}px)`;
    auPlaceTip();
  }
  function auPress(el) {
    auCursor.classList.remove('is-press');
    void auCursor.offsetWidth;
    auCursor.classList.add('is-press');
    el.classList.add('is-demo-press');
    setTimeout(() => el.classList.remove('is-demo-press'), 160);
  }
  async function playAuDemo() {
    const run = ++auRun;
    const go = async ms => { await auSleep(ms); if (run !== auRun) throw 'stop'; };
    const until = async test => { while (!test()) await go(120); };
    const tap = async (el, travel = 700) => { auMove(el); await go(travel); auPress(el); await go(140); el.click(); };
    auDemo = 'playing';
    auReplay.hidden = true;
    try {
      if (built) clearFlow();
      setActivated(false);
      $('auTitle').textContent = 'Untitled workflow';
      openPanel();
      auMove($('auAddTrigger'), true);
      auSay('');
      auCursor.classList.add('is-on');
      await go(500);
      auSay('Start from a template');
      await tap(auCanvas.querySelector('.au-tpl'), 850);
      await go(500);
      auSay('Every step comes filled in');
      auMove(flowNodes[2]);
      await go(1600);
      auSay('Activate it to run');
      await tap(flowRun);
      auSay('Each step runs in order');
      auMove(flowNodes[3]);
      await until(() => !flowApprove.hidden);
      auSay('Then it waits for your review');
      await go(400);
      await tap(flowApprove, 850);
      await until(() => flowLog.dataset.state === 'done');
      auMove(auOutOpen);
      auSay('Sent. Open it to see what went out');
      await go(1800);
      endAuDemo();
    } catch (e) {
      if (e !== 'stop') throw e;
    }
  }
  function endAuDemo() {
    auRun++;
    auCursor.classList.remove('is-on');
    auDemo = 'done';
    auReplay.hidden = false;
  }
  auReplay.addEventListener('click', playAuDemo);
  ['pointerdown', 'keydown'].forEach(type => auApp.addEventListener(type, e => {
    if (!e.isTrusted || e.target.closest('#auReplay')) return;
    if (auDemo === 'playing') endAuDemo();
    else auDemo = 'done';
  }, true));
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    // Play once the whole workflow card is on screen, so the demo happens where people are looking.
    const auIO = new IntersectionObserver(([en]) => {
      const seen = en.intersectionRect.height;
      if (!en.isIntersecting || auDemo !== 'idle' || seen < Math.min(en.boundingClientRect.height * 0.7, innerHeight * 0.5)) return;
      auIO.disconnect();
      playAuDemo();
    }, { threshold: [0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });
    auIO.observe(auCard);
  } else {
    auReplay.lastChild.textContent = 'Play demo';
    auReplay.hidden = false;
  }

  // ---------- Segmented tabs ----------
  document.querySelectorAll('[data-tabs]').forEach(tabs => {
    const scope = tabs.closest('section');
    const buttons = tabs.querySelectorAll('[data-tab]');
    const panels = scope.querySelectorAll('[data-tab-panel]');

    // Sliding pill behind the active tab (placed without transition first, then it glides)
    // Outer span carries the shadow; the inner fill is clipped, so the clip can't cut the shadow off.
    const pill = document.createElement('span');
    pill.className = 'segmented__pill';
    pill.setAttribute('aria-hidden', 'true');
    pill.innerHTML = '<i></i>';
    const fill = pill.firstChild;
    tabs.prepend(pill);
    tabs.classList.add('has-pill');
    // The fill spans the whole track and is clipped down to the active tab, so the move
    // animates clip-path, never width (the small drop-shadow repaints alongside; cheap at this size). The track width comes from the last tab,
    // not scrollWidth, which would count the pill itself and could only ever grow.
    const placePill = () => {
      const on = tabs.querySelector('[data-tab].is-on');
      const last = buttons[buttons.length - 1];
      const w = last.offsetLeft + last.offsetWidth;
      pill.style.width = w + 'px';
      fill.style.clipPath = `inset(0 ${w - on.offsetLeft - on.offsetWidth}px 0 ${on.offsetLeft}px round 10px)`;
    };
    placePill();
    requestAnimationFrame(() => pill.classList.add('is-ready'));
    if ('ResizeObserver' in window) new ResizeObserver(placePill).observe(tabs);

    buttons.forEach(btn => btn.addEventListener('click', () => {
      buttons.forEach(b => {
        const on = b === btn;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-selected', String(on));
      });
      placePill();
      panels.forEach(p => {
        const on = p.dataset.tabPanel === btn.dataset.tab;
        const wasHidden = p.hidden;
        p.hidden = !on;
        if (on && wasHidden) {
          fadeIn(p);
          if (p.closest('.trust__panel')) playTrust(p);
        }
      });
    }));
  });

  // ---------- FAQ accordion (one open at a time) ----------
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    item.querySelector('.faq__q').addEventListener('click', () => {
      const wasOpen = !item.querySelector('.faq__a').hidden;
      faqItems.forEach(other => {
        const open = other === item && !wasOpen;
        const a = other.querySelector('.faq__a');
        const opening = open && a.hidden;
        a.hidden = !open;
        if (opening) fadeIn(a);
        other.querySelector('.faq__sign').textContent = open ? '−' : '+';
        other.querySelector('.faq__q').setAttribute('aria-expanded', String(open));
      });
    });
  });

  // ---------- Request a demo modal ----------
  const modalOverlay = $('modalOverlay');
  const modal = $('modal');
  const requestForm = $('requestForm');
  const modalSent = $('modalSent');
  let lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    requestForm.hidden = false;
    modalSent.hidden = true;
    setMenu(false);
    show(modalOverlay);
    document.body.style.overflow = 'hidden';
    requestForm.querySelector('input').focus();
  }
  function closeModal() {
    hide(modalOverlay);
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('.js-open-modal').forEach(btn => btn.addEventListener('click', openModal));
  $('modalClose').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  modal.addEventListener('click', e => e.stopPropagation());

  requestForm.addEventListener('submit', e => {
    e.preventDefault();
    requestForm.reset();
    requestForm.hidden = true;
    modalSent.hidden = false;
    fadeIn(modalSent);
  });

  // ---------- Escape closes the top-most layer ----------
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (modalOverlay.classList.contains('is-open')) closeModal();
    else if (shareOverlay.classList.contains('is-open')) closeShare();
    else if (auOutOverlay.classList.contains('is-open')) closeOut();
    else if (exportMenu.classList.contains('is-open')) { setExport(false); exportBtn.focus(); }
  });

  // ---------- Connections marquee: fill each track so one half covers the widest viewport, then double it ----------
  document.querySelectorAll('.tile-track').forEach(track => {
    const set = Array.from(track.children);
    const setWidth = track.scrollWidth || 1;
    const copies = Math.max(1, Math.ceil(Math.max(window.innerWidth, 1920) / setWidth));
    for (let c = 1; c < copies * 2; c++) set.forEach(el => track.appendChild(el.cloneNode(true)));
  });

  // ---------- Testimonial marquee (two rows): same doubling per track; clones are hidden from assistive tech ----------
  document.querySelectorAll('.why__track').forEach(track => {
    const set = Array.from(track.children);
    const setWidth = track.scrollWidth || 1;
    const copies = Math.max(1, Math.ceil(Math.max(window.innerWidth, 1920) / setWidth));
    for (let c = 1; c < copies * 2; c++) set.forEach(el => {
      const clone = el.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });

  // ---------- Scroll reveals (marketing sections; hero stays instant) ----------
  const revealGroups = [
    '.frame-col .center-head', '.frame-col .narrow-head', '.intro__grid > *', '.tile-wall', '.body-narrow',
    '.trust__panel', '.segmented', '.ask__stage', '.cards-4 > *', '.demo-hint', '.dash', '.share__points > *',
    '.share__cta', '.viewer', '.automate__app', '.review__copy', '.review__art', '.why__marquee', '.why__centri', '.faq__list', '.final__card'
  ];
  const revealEls = [];
  revealGroups.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--i', el.parentElement.matches('.cards-4, .share__points, .intro__grid') ? i : 0);
      revealEls.push(el);
    });
  });
  // Workflow cards: numbers count up as their piece enters (delay mirrors the CSS --i/--d stagger)
  // A newer run on the same element cancels the older one (tabs can be switched mid-count).
  function countUp(el, delay, dur = 900) {
    if (reduceMotion.matches) return;
    const run = el._run = (el._run || 0) + 1;
    const end = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const fmt = n => (el.dataset.prefix || '') + n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    el.textContent = fmt(0);
    setTimeout(() => {
      if (el._run !== run) return;
      const start = performance.now();
      const tick = now => {
        if (el._run !== run) return;
        const t = Math.min((now - start) / dur, 1);
        el.textContent = fmt(end * (1 - Math.pow(1 - t, 4)));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
  }
  const msVar = (el, name) => parseFloat(getComputedStyle(el).getPropertyValue(name)) || 0;
  function playCard(card) {
    const shift = card.classList.contains('is-replaying') ? msVar(card, '--i') * 80 + 250 : 0;
    card.querySelectorAll('[data-count]').forEach(el => countUp(el, msVar(el, '--i') * 80 + msVar(el, '--d') - shift));
    card._busyUntil = performance.now() + msVar(card, '--i') * 80 + 1800 - shift;
  }

  // Replay the answer on hover (mouse only; ignored while a run is still playing so it never stutters)
  const hoverFine = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.use-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (!hoverFine.matches || reduceMotion.matches || !card.classList.contains('is-in')) return;
      if (performance.now() < (card._busyUntil || 0)) return;
      card.classList.add('is-replaying', 'is-reset');
      void card.offsetWidth; // commit the reset frame before transitions resume
      card.classList.remove('is-reset');
      playCard(card);
    });
  });

  // Trust panel: each tab builds in when shown. Bars sweep out while their values count up.
  const trustPanel = document.querySelector('.trust__panel');
  if (trustPanel) {
    trustPanel.querySelectorAll('[data-tab-panel]').forEach(p => {
      p.querySelectorAll('.bar-row, .def__plain, .code > div, .kv > div, .rows__head, .row, .rows__foot').forEach((el, r) => {
        el.classList.add('t-item');
        el.style.setProperty('--r', r);
      });
      p.querySelectorAll('.bar-row__val').forEach(el => {
        el.dataset.prefix = '$';
        el.dataset.count = el.textContent.replace(/[^\d.]/g, '');
      });
    });
  }
  function playTrust(p) {
    p.classList.add('t-reset');
    void p.offsetWidth;
    p.classList.remove('t-reset');
    p.querySelectorAll('[data-count]').forEach(el => countUp(el, msVar(el, '--r') * 90 + 120, 800));
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        if (en.target.matches('.use-card')) playCard(en.target);
        if (en.target === trustPanel) playTrust(trustPanel.querySelector('[data-tab-panel]:not([hidden])'));
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  // ---------- Dashboard demo: the board builds itself from empty, then hands over ----------
  // Clears the board just before it scrolls into view, then a guide cursor (with a caption)
  // drags the four default Insights from the library onto the board, flips one to Table and
  // back, and hits Refresh. Any real pointer/key input inside the Dashboard stops it on the
  // spot and leaves the board as it is.
  const dashEl = $('dash');
  const demoBtn = $('demoToggle');
  let demoRun = 0;
  let demoState = 'idle'; // idle | armed | playing | done
  const cursor = document.createElement('div');
  cursor.className = 'demo-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<svg viewBox="0 0 24 24"><path d="M5 3l14 8-6.2 1.6L10 19z"/></svg><span class="demo-cursor__tip is-empty"></span>';
  dashEl.appendChild(cursor);
  const tip = cursor.querySelector('.demo-cursor__tip');
  let ghost = null;
  let cursorX = 0;

  // Caption beside the cursor; crossfades on change and slides left so it never leaves the Dashboard.
  function say(text) {
    if (tip.textContent === text) return;
    tip.textContent = text;
    tip.classList.toggle('is-empty', !text);
    placeTip();
    if (text) fadeIn(tip);
  }
  function placeTip() {
    const room = dashEl.clientWidth - 8 - tip.offsetWidth - cursorX; // space right of the cursor
    tip.style.left = Math.max(8 - cursorX, Math.min(20, room)) + 'px';
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  // The button keeps its space while idle (visibility, not display) so the Dashboard never shifts.
  function setDemo(s) {
    demoState = s;
    demoBtn.classList.toggle('is-idle', s === 'idle' || s === 'armed');
    demoBtn.querySelector('span').textContent = s === 'playing' ? 'Skip demo' : 'Replay demo';
  }
  function clearBoard() {
    state.board = [];
    state.cards = {};
    state.filter = 'all';
    $('dashFilter').value = 'all';
    Object.values(insights).forEach(ins => { ins.span = ins.baseSpan; });
    renderBoard();
  }
  // Move to a viewport point (x, y), or to the centre of an element.
  function moveCursor(target, instant) {
    const d = dashEl.getBoundingClientRect();
    let x, y;
    if (Array.isArray(target)) [x, y] = target;
    else {
      const r = target.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
    }
    cursorX = x - d.left;
    cursor.classList.toggle('is-instant', !!instant);
    cursor.style.transform = `translate(${cursorX}px, ${y - d.top}px)`;
    placeTip();
  }
  // Pick up a library item: a copy of it rides along with the cursor, the original dims.
  function pickUp(li, grab) {
    const r = li.getBoundingClientRect();
    ghost = li.cloneNode(true);
    ghost.className = 'c-lib__item demo-ghost';
    ghost.removeAttribute('draggable');
    ghost.removeAttribute('data-id');
    ghost.querySelector('.c-lib__add')?.remove(); // no focusable copy inside the aria-hidden cursor
    ghost.inert = true;
    ghost.style.width = r.width + 'px';
    ghost.style.left = (r.left - grab[0]) + 'px';
    ghost.style.top = (r.top - grab[1]) + 'px';
    cursor.prepend(ghost);
    void ghost.offsetWidth;
    ghost.classList.add('is-lifted');
    li.classList.add('is-dragging');
    cursor.classList.add('is-grabbing');
  }
  function drop() {
    cursor.classList.remove('is-grabbing');
    $('dashCanvas').classList.remove('is-drop');
    dashEl.querySelectorAll('.c-lib__item.is-dragging').forEach(el => el.classList.remove('is-dragging'));
    if (!ghost) return;
    const g = ghost;
    ghost = null;
    g.classList.add('is-dropped');
    setTimeout(() => g.remove(), 160);
  }
  // Where the next card will land: just under the cards already there (centre when empty).
  function dropPoint() {
    const c = $('dashCanvas').getBoundingClientRect();
    const cards = dashGrid.children;
    const y = cards.length ? Math.min(cards[cards.length - 1].getBoundingClientRect().bottom + 48, c.bottom - 40) : c.top + Math.min(c.height, 420) / 2;
    return [c.left + c.width / 2, y];
  }
  function pressAt(target) {
    cursor.classList.remove('is-press');
    void cursor.offsetWidth;
    cursor.classList.add('is-press');
    target.classList.add('is-demo-press');
    setTimeout(() => target.classList.remove('is-demo-press'), 160);
  }
  // On narrow screens the library is a horizontal strip; slide it (not the page) to the item.
  function revealInLib(el) {
    const list = $('libList'), li = el.closest('li');
    if (!li || list.scrollWidth <= list.clientWidth) return false;
    list.scrollTo({ left: li.getBoundingClientRect().left - list.getBoundingClientRect().left + list.scrollLeft - 8, behavior: 'smooth' });
    return true;
  }

  async function playDemo() {
    const run = ++demoRun;
    const go = async ms => { await sleep(ms); if (run !== demoRun) throw 'stop'; };
    const at = async (sel, travel = 650) => {
      const el = dashEl.querySelector(sel);
      if (!el) throw 'stop';
      if (revealInLib(el)) await go(320);
      moveCursor(el);
      await go(travel);
      pressAt(el);
      await go(140);
      return el;
    };
    // Drag one Insight from the library to the board, the way a person would.
    const dragIn = async (id, first) => {
      const li = dashEl.querySelector(`.c-lib__item[data-id="${id}"]`);
      if (!li) throw 'stop';
      if (revealInLib(li)) await go(320);
      const r = li.getBoundingClientRect();
      const grab = [r.left + 28, r.top + r.height / 2]; // over the thumbnail
      moveCursor(grab);
      await go(first ? 750 : 600);
      pressAt(li);
      pickUp(li, grab);
      await go(first ? 380 : 220);
      moveCursor(dropPoint());
      setTimeout(() => { if (ghost) $('dashCanvas').classList.add('is-drop'); }, 380);
      await go(first ? 900 : 700);
      drop();
      addCard(id, true);
      await go(first ? 700 : 360);
    };
    setDemo('playing');
    try {
      clearBoard();
      $('dashLib').classList.remove('is-collapsed'); // a replay needs the library open again
      moveCursor($('dashTitle'), true);
      say('');
      cursor.classList.add('is-on');
      await go(450);
      say('Drag a pinned Insight onto the Dashboard');
      await dragIn(defaultBoard[0], true);
      say('Add as many as your team needs');
      for (const id of defaultBoard.slice(1)) await dragIn(id);
      say('Switch any Insight to a Table');
      (await at('.c-card[data-id="weekly"] [data-view="table"]')).click();
      await go(1000);
      say('…and back to the Chart');
      (await at('.c-card[data-id="weekly"] [data-view="chart"]', 420)).click();
      await go(700);
      say('Refresh every Insight in one click');
      (await at('#dashRefresh')).click();
      await go(1300);
      say('Close Pinned Insights for more room');
      await at('#libCollapse');
      $('dashLib').classList.add('is-collapsed'); // not .click(): its focus hand-off could scroll the page
      await go(1100);
      say('Your turn. Try it yourself');
      await go(1400);
      endDemo();
    } catch (e) {
      if (e !== 'stop') throw e;
    }
  }
  function endDemo() {
    demoRun++;
    drop();
    cursor.classList.remove('is-on');
    setDemo('done');
  }

  demoBtn.addEventListener('click', () => {
    if (demoState !== 'playing') return playDemo();
    endDemo(); // Skip = jump to the finished board
    defaultBoard.forEach(id => addCard(id, true));
    $('dashLib').classList.add('is-collapsed');
  });
  // Real input takes over. A touch only counts once it becomes a tap (click): a finger
  // that starts over the Dashboard just to scroll past it must not stop the demo.
  const takeOver = e => {
    if (!e.isTrusted) return;
    if (demoState === 'playing') endDemo();
    else if (demoState === 'armed') setDemo('done');
  };
  dashEl.addEventListener('pointerdown', e => { if (e.pointerType !== 'touch') takeOver(e); }, true);
  ['click', 'keydown', 'dragstart'].forEach(type => dashEl.addEventListener(type, takeOver, true));

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    demoBtn.hidden = false;
    demoBtn.closest('.demo-hint').hidden = false;
    setDemo('idle');
    // Arm as soon as any of it nears the viewport (still faded out by the reveal), play once it's well in view.
    const armIO = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      armIO.disconnect();
      if (demoState !== 'idle') return;
      clearBoard();
      setDemo('armed');
    }, { rootMargin: '0px 0px 200px 0px' });
    const playIO = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting || (demoState !== 'armed' && demoState !== 'idle')) return;
      playIO.disconnect();
      playDemo();
    }, { rootMargin: '0px 0px -35% 0px' });
    armIO.observe(dashEl);
    playIO.observe(dashEl);
  }
})();
