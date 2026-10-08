(() => {
  'use strict';
  const STORAGE_KEY = 'absolut_trades_v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const number = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 });
  let trades = loadTrades();
  let selectedId = null;
  let editingId = null;
  let pendingTrades = [];
  let pendingFileName = '';
  let activePage = 'history';
  let toastTimer = null;

  function loadTrades() {
    const seed = Array.isArray(window.ABSOLUT_INITIAL_TRADES) ? window.ABSOLUT_INITIAL_TRADES : [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      try {
        const parsed = JSON.parse(stored);
        // If the app was opened once before its bundled trades were available,
        // an empty saved list must not hide those trades forever.
        if (Array.isArray(parsed) && (parsed.length || !seed.length)) return parsed;
      } catch (e) { console.warn('Absolut: historique local illisible.', e); }
    }
    const initial = seed.map(trade => ({ ...trade }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  function saveTrades() { localStorage.setItem(STORAGE_KEY, JSON.stringify(trades)); }
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function moneyText(value) { return money.format(Number(value) || 0); }
  function parseDate(value) {
    if (!value) return null;
    const mt5 = String(value).match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
    if (mt5) return new Date(+mt5[1], +mt5[2] - 1, +mt5[3], +(mt5[4] || 0), +(mt5[5] || 0), +(mt5[6] || 0));
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  function localInputDate(value) {
    const d = value ? parseDate(value) : new Date();
    if (!d) return '';
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }
  function dateText(value, withTime = true) {
    const d = parseDate(value);
    if (!d) return 'Date inconnue';
    return d.toLocaleString('fr-FR', withTime ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' } : { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function outcome(t) { return Number(t.pnl) > 0 ? 'win' : Number(t.pnl) < 0 ? 'loss' : 'be'; }
  function flagged(t) { return t.emotionalError === true || t.plan === 'no'; }
  function bestMood(t) { return t.moodDuring || t.moodBefore || t.moodAfter || ''; }
  function showToast(message) {
    const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  const pageTitles = { history: 'Historique', errors: 'Erreurs à revoir', import: 'Importer des trades' };
  function switchPage(page) {
    activePage = page;
    $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === page));
    $$('.page').forEach(p => p.classList.toggle('active', p.id === `page-${page}`));
    $('#page-title').textContent = pageTitles[page] || 'Historique';
    render();
  }
  function render() {
    $('#sidebar-total').textContent = `${trades.length} trade${trades.length === 1 ? '' : 's'}`;
    $('#error-count').textContent = trades.filter(flagged).length;
    if (activePage === 'history') renderHistory();
    if (activePage === 'errors') renderErrors();
  }

  function filteredTrades(errorOnly = false) {
    const query = $('#search').value.trim().toLocaleLowerCase('fr');
    const filter = $('#history-filter').value;
    const sort = $('#history-sort').value;
    let list = errorOnly ? trades.filter(flagged) : [...trades];
    if (filter === 'review') list = list.filter(flagged);
    if (filter === 'wins') list = list.filter(t => outcome(t) === 'win');
    if (filter === 'losses') list = list.filter(t => outcome(t) === 'loss');
    if (query) list = list.filter(t => [t.asset, t.setup, t.strategy, t.thesis, t.execution, t.lesson, t.note, t.moodBefore, t.moodDuring, t.moodAfter, t.ticket].join(' ').toLocaleLowerCase('fr').includes(query));
    list.sort((a, b) => {
      const da = parseDate(a.entryTime)?.getTime() || 0;
      const db = parseDate(b.entryTime)?.getTime() || 0;
      return sort === 'old' ? da - db : db - da;
    });
    return list;
  }
  function tradeRow(t) {
    const mood = [t.moodBefore, t.moodDuring, t.moodAfter].filter(Boolean).join(' → ') || bestMood(t) || 'Non noté';
    const reviewLabel = t.plan === 'no' ? 'Écart au plan' : t.emotionalError ? 'À revoir' : 'Noté';
    const pnlClass = outcome(t) === 'loss' ? 'loss' : '';
    return `<button class="trade-row${t.id === selectedId ? ' selected' : ''}" type="button" data-trade-id="${escapeHtml(t.id)}" aria-pressed="${t.id === selectedId}">
      <span class="trade-main"><span class="asset-line"><b class="asset">${escapeHtml(t.asset || 'Trade')}</b><span class="direction${t.direction === 'Short' ? ' short' : ''}">${t.direction === 'Short' ? 'SHORT' : 'LONG'}</span></span><small class="trade-sub">${escapeHtml(dateText(t.entryTime))}${t.setup ? ` · ${escapeHtml(t.setup)}` : ''}</small></span>
      <span class="sentiment"><small>RESSENTI</small>${escapeHtml(mood)}</span>
      <span class="pnl ${pnlClass}">${moneyText(t.pnl)}<small>${t.rMultiple === null || t.rMultiple === '' || t.rMultiple === undefined ? 'R non noté' : `${number.format(t.rMultiple)}R`}</small></span>
      <span class="review-flag${flagged(t) ? ' warn' : ''}"><i></i>${reviewLabel}</span>
    </button>`;
  }
  function renderHistory() {
    const list = filteredTrades(false);
    $('#history-count').textContent = `${trades.length} trade${trades.length === 1 ? '' : 's'}`;
    $('#history-caption').textContent = `${list.length} affiché${list.length === 1 ? '' : 's'} · plus récent en premier`;
    $('#trade-list').innerHTML = list.map(tradeRow).join('');
    $('#history-empty').hidden = list.length > 0;
    if (selectedId && list.some(t => t.id === selectedId)) showTradeDetail(trades.find(t => t.id === selectedId));
    else if (!selectedId && list.length) { selectedId = list[0].id; renderHistory(); return; }
    else clearTradeDetail();
  }
  function renderErrors() {
    const list = filteredTrades(true);
    $('#errors-page-count').textContent = `${list.length} à revoir`;
    $('#error-list').innerHTML = list.map(tradeRow).join('');
    $('#errors-empty').hidden = list.length > 0;
    $$('.trade-row', $('#error-list')).forEach(row => row.addEventListener('click', () => { selectedId = row.dataset.tradeId; switchPage('history'); }));
  }
  function clearTradeDetail() {
    $('#trade-detail').hidden = true;
    $('#detail-empty').hidden = false;
  }
  function selectTrade(id) {
    selectedId = id;
    renderHistory();
  }
  function showTradeDetail(t) {
    if (!t) return clearTradeDetail();
    $('#detail-empty').hidden = true;
    const detail = $('#trade-detail'); detail.hidden = false;
    const review = t.plan === 'no' || t.emotionalError;
    const noteParts = [t.thesis && `<b>Pourquoi je l’ai pris</b><br>${escapeHtml(t.thesis)}`, t.execution && `<b>Exécution</b><br>${escapeHtml(t.execution)}`, t.lesson && `<b>À retenir</b><br>${escapeHtml(t.lesson)}`, t.note && `<b>Note</b><br>${escapeHtml(t.note)}`].filter(Boolean);
    const moods = [t.moodBefore, t.moodDuring, t.moodAfter].filter(Boolean);
    detail.innerHTML = `<div class="detail-overline">FICHE DU TRADE</div>
      <div class="detail-title">${escapeHtml(t.asset || 'Trade')} · ${t.direction === 'Short' ? 'Short' : 'Long'}</div>
      <div class="detail-sub">${escapeHtml(dateText(t.entryTime))}${t.setup ? ` · ${escapeHtml(t.setup)}` : ''}</div>
      <div class="detail-result ${outcome(t) === 'loss' ? 'loss' : ''}">${moneyText(t.pnl)}<small>${t.rMultiple === null || t.rMultiple === '' || t.rMultiple === undefined ? 'R non noté' : `${number.format(t.rMultiple)}R`}</small></div>
      <div class="detail-facts"><span class="detail-fact"><label>ENTRÉE</label><b>${t.entryPrice == null ? '—' : escapeHtml(number.format(t.entryPrice))}</b></span><span class="detail-fact"><label>SORTIE</label><b>${t.exitPrice == null ? '—' : escapeHtml(number.format(t.exitPrice))}</b></span><span class="detail-fact"><label>PLAN</label><b class="${t.plan === 'yes' ? 'good' : t.plan === 'no' ? 'bad' : ''}">${t.plan === 'yes' ? 'Respecté' : t.plan === 'no' ? 'Écart' : 'À préciser'}</b></span></div>
      ${t.ticket ? `<div class="ticket-line">Ticket ${escapeHtml(t.ticket)}${t.imported ? ' · importé' : ''}</div>` : ''}
      <div class="detail-section"><div class="detail-label">ÉTAT D’ESPRIT</div>${moods.length ? `<div class="mood-line">${moods.map((m, i) => `${i ? '<span class="mood-arrow">→</span>' : ''}<span class="mood-tag">${escapeHtml(m)}</span>`).join('')}</div>` : '<div class="detail-placeholder">Aucun ressenti noté.</div>'}${t.stressBefore != null || t.stressAfter != null ? `<div class="stress-line">Stress : avant ${t.stressBefore ?? '—'}/10 · après ${t.stressAfter ?? '—'}/10</div>` : ''}</div>
      <div class="detail-section"><div class="detail-label">NOTES</div>${noteParts.length ? `<div class="detail-note">${noteParts.join('<br><br>')}</div>` : '<div class="detail-placeholder">Pas encore de note. Tu peux compléter la fiche quand tu veux.</div>'}</div>
      ${review ? `<div class="detail-error"><span>⚑</span><span><b>${t.plan === 'no' ? 'Écart au plan' : 'Erreur signalée'}</b><br>Cette fiche apparaît dans « Erreurs à revoir ».</span></div>` : ''}
      ${t.grossPnl != null ? `<div class="fees-line">Brut ${moneyText(t.grossPnl)} · Commission ${moneyText(t.commission || 0)} · Swap ${moneyText(t.swap || 0)}</div>` : ''}
      <div class="detail-actions"><button class="button button-quiet" type="button" id="edit-selected">Modifier la fiche</button></div>`;
    $('#edit-selected').addEventListener('click', () => openTradeModal(t));
  }

  function openTradeModal(trade = null) {
    editingId = trade ? trade.id : null;
    const form = $('#trade-form'); form.reset();
    $('#modal-title').textContent = trade ? 'Modifier le trade' : 'Nouveau trade';
    $('#trade-modal').classList.add('open'); $('#trade-modal').setAttribute('aria-hidden', 'false');
    const elements = form.elements;
    elements.entryTime.value = localInputDate(trade?.entryTime || new Date().toISOString());
    if (trade) {
      for (const key of ['asset','direction','setup','exitTime','entryPrice','exitPrice','size','sl','tp','rMultiple','moodBefore','moodDuring','moodAfter','stressBefore','stressAfter','plan','thesis','execution','lesson','note']) {
        if (trade[key] !== undefined && trade[key] !== null) elements[key].value = trade[key];
      }
      elements.pnl.value = trade.pnl ?? 0;
      elements.emotionalError.checked = !!trade.emotionalError;
    } else {
      elements.direction.value = 'Long';
      elements.plan.value = 'unknown';
    }
    document.body.classList.add('modal-open');
    setTimeout(() => elements.asset.focus(), 30);
  }
  function closeTradeModal() {
    $('#trade-modal').classList.remove('open'); $('#trade-modal').setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }
  function formNumber(value) { return value === '' || value == null ? null : Number(value); }
  $('#trade-form').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.currentTarget, f = form.elements;
    const previous = editingId ? trades.find(t => t.id === editingId) : null;
    const trade = { ...(previous || {}), id: editingId || makeId(), asset: f.asset.value.trim().toUpperCase(), direction: f.direction.value, setup: f.setup.value.trim(), entryTime: f.entryTime.value ? new Date(f.entryTime.value).toISOString() : new Date().toISOString(), exitTime: f.exitTime.value ? new Date(f.exitTime.value).toISOString() : '', pnl: formNumber(f.pnl.value) || 0, entryPrice: formNumber(f.entryPrice.value), exitPrice: formNumber(f.exitPrice.value), size: formNumber(f.size.value), sl: formNumber(f.sl.value), tp: formNumber(f.tp.value), rMultiple: formNumber(f.rMultiple.value), moodBefore: f.moodBefore.value, moodDuring: f.moodDuring.value, moodAfter: f.moodAfter.value, stressBefore: formNumber(f.stressBefore.value), stressAfter: formNumber(f.stressAfter.value), plan: f.plan.value, thesis: f.thesis.value.trim(), execution: f.execution.value.trim(), lesson: f.lesson.value.trim(), note: f.note.value.trim(), emotionalError: f.emotionalError.checked, imported: false, updatedAt: new Date().toISOString() };
    const index = trades.findIndex(t => t.id === trade.id);
    if (index >= 0) trades[index] = trade; else trades.push(trade);
    selectedId = trade.id; saveTrades(); closeTradeModal(); render();
    showToast(previous ? 'Fiche mise à jour' : 'Trade enregistré');
  });
  function makeId() { return `ab-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`; }

  function normalizeHeader(s) { return String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ''); }
  function splitCsv(text) {
    const firstLine = String(text).replace(/^\uFEFF/, '').split(/\r?\n/, 1)[0] || '';
    const delimiter = [',',';','\t'].sort((a,b) => firstLine.split(b).length - firstLine.split(a).length)[0];
    const rows = []; let row = [], cell = '', quoted = false;
    const source = String(text).replace(/^\uFEFF/, '');
    for (let i = 0; i < source.length; i++) {
      const c = source[i];
      if (c === '"' && quoted && source[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = !quoted;
      else if (c === delimiter && !quoted) { row.push(cell.trim()); cell = ''; }
      else if ((c === '\n' || c === '\r') && !quoted) { if (c === '\r' && source[i + 1] === '\n') i++; row.push(cell.trim()); if (row.some(v => v !== '')) rows.push(row); row = []; cell = ''; }
      else cell += c;
    }
    row.push(cell.trim()); if (row.some(v => v !== '')) rows.push(row);
    return rows;
  }
  function findColumn(headers, aliases) {
    const keys = headers.map(normalizeHeader);
    for (const alias of aliases) { const index = keys.indexOf(normalizeHeader(alias)); if (index >= 0) return index; }
    return -1;
  }
  function asNumber(value) {
    if (value == null || String(value).trim() === '') return null;
    const n = Number(String(value).replace(/\s/g,'').replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  }
  function parseRows(rows) {
    if (!rows.length) return [];
    const headerIndex = rows.findIndex(r => {
      const h = r.map(normalizeHeader);
      return (h.includes('symbol') || h.includes('asset') || h.includes('actif') || h.includes('instrument')) && (h.includes('profit') || h.includes('pnl') || h.includes('result'));
    });
    if (headerIndex < 0) return [];
    const headers = rows[headerIndex];
    const cols = {
      ticket: findColumn(headers, ['ticket','position','deal','order','id']), asset: findColumn(headers, ['symbol','asset','actif','instrument','market']), direction: findColumn(headers, ['type','direction','side']),
      openTime: findColumn(headers, ['opentime','open time','entrytime','entry time','date','time']), closeTime: findColumn(headers, ['closetime','close time','exittime','exit time']),
      openPrice: findColumn(headers, ['openprice','open price','entryprice','entry price']), closePrice: findColumn(headers, ['closeprice','close price','exitprice','exit price']),
      price: findColumn(headers, ['price']), size: findColumn(headers, ['volume','size','lots']), sl: findColumn(headers, ['sl','stoploss','stop loss']), tp: findColumn(headers, ['tp','takeprofit','take profit']),
      gross: findColumn(headers, ['profit','grossprofit','gross pnl']), pnl: findColumn(headers, ['pnl','netprofit','net pnl','result']), commission: findColumn(headers, ['commission','commissions']), swap: findColumn(headers, ['swap','storage'])
    };
    const result = [];
    for (const row of rows.slice(headerIndex + 1)) {
      const get = key => cols[key] < 0 ? '' : (row[cols[key]] ?? '');
      const asset = String(get('asset')).trim();
      if (!asset) continue;
      const directionRaw = String(get('direction')).toLowerCase();
      const entryTime = get('openTime');
      const exitTime = get('closeTime');
      let grossPnl = asNumber(get('gross'));
      const directPnl = asNumber(get('pnl'));
      if (grossPnl == null) grossPnl = directPnl;
      if (grossPnl == null) continue;
      const commission = asNumber(get('commission')) || 0, swap = asNumber(get('swap')) || 0;
      const explicitNet = cols.pnl >= 0 && cols.gross >= 0 && cols.pnl !== cols.gross ? directPnl : null;
      const netPnl = explicitNet == null ? grossPnl + commission + swap : explicitNet;
      const ticket = String(get('ticket')).trim();
      const openPrice = asNumber(get('openPrice')) ?? (cols.price >= 0 ? asNumber(row[cols.price]) : null);
      const closePrice = asNumber(get('closePrice'));
      const id = ticket || makeId();
      result.push({ id, ticket, externalId: ticket, asset: asset.toUpperCase(), direction: /sell|short/.test(directionRaw) ? 'Short' : 'Long', entryTime, exitTime, entryPrice: openPrice, exitPrice: closePrice, size: asNumber(get('size')), sl: asNumber(get('sl')) || null, tp: asNumber(get('tp')) || null, grossPnl, commission, swap, pnl: netPnl, rMultiple: null, setup: '', moodBefore: '', moodDuring: '', moodAfter: '', stressBefore: null, stressAfter: null, plan: 'unknown', thesis: '', execution: '', lesson: '', note: '', emotionalError: false, imported: true, source: 'file' });
    }
    return result;
  }
  function parseImport(text, filename) {
    const isHtml = /\.html?$/i.test(filename) || /<table[\s>]/i.test(text);
    if (!isHtml) return parseRows(splitCsv(text));
    const doc = new DOMParser().parseFromString(text, 'text/html');
    const candidates = [...doc.querySelectorAll('table')].map(table => [...table.querySelectorAll('tr')].map(tr => [...tr.querySelectorAll('th,td')].map(cell => cell.textContent.trim()))).filter(rows => rows.length);
    for (const rows of candidates) { const parsed = parseRows(rows); if (parsed.length) return parsed; }
    return [];
  }
  function dedupe(imported) {
    const knownTickets = new Set(trades.map(t => String(t.externalId || t.ticket || '')).filter(Boolean));
    const knownKeys = new Set(trades.map(t => `${String(t.asset).toUpperCase()}|${String(t.entryTime)}|${Number(t.pnl)}`));
    const seenTickets = new Set(), seenKeys = new Set();
    return imported.filter(t => {
      const ticket = String(t.externalId || t.ticket || '');
      const key = `${String(t.asset).toUpperCase()}|${String(t.entryTime)}|${Number(t.pnl)}`;
      if ((ticket && (knownTickets.has(ticket) || seenTickets.has(ticket))) || knownKeys.has(key) || seenKeys.has(key)) return false;
      if (ticket) seenTickets.add(ticket); seenKeys.add(key); return true;
    });
  }
  function setImportStatus(kind, message) {
    const status = $('#import-status'); status.className = `import-status${kind ? ` ${kind}` : ''}`;
    status.replaceChildren(); const dot = document.createElement('span'); dot.className = 'status-dot'; const text = document.createElement('span'); text.textContent = message; status.append(dot, text);
  }
  function previewImport() {
    if (!pendingTrades.length) { $('#confirm-import').disabled = true; return; }
    const fresh = dedupe(pendingTrades), duplicates = pendingTrades.length - fresh.length;
    $('#confirm-import').disabled = fresh.length === 0;
    setImportStatus('ready', `${pendingFileName ? `${pendingFileName} · ` : ''}${pendingTrades.length} ligne(s) reconnue(s), ${fresh.length} nouvelle(s)${duplicates ? `, ${duplicates} doublon(s) ignoré(s)` : ''}.`);
  }
  async function readImportFile(file) {
    if (!file) return;
    pendingTrades = []; pendingFileName = file.name; $('#confirm-import').disabled = true;
    setImportStatus('', `Lecture de ${file.name}…`);
    try {
      const content = await file.text(); pendingTrades = parseImport(content, file.name);
      if (!pendingTrades.length) { setImportStatus('error', 'Aucun trade reconnu. Vérifie que le fichier contient un export MT5 avec les colonnes actif, date et résultat.'); return; }
      previewImport();
    } catch (e) { console.error(e); setImportStatus('error', 'Impossible de lire ce fichier. Essaie de le réexporter en CSV ou HTML.'); }
  }
  function clearImport() { pendingTrades = []; pendingFileName = ''; $('#import-file').value = ''; $('#confirm-import').disabled = true; setImportStatus('', 'Sélectionne un relevé pour afficher l’aperçu.'); $('#dropzone').classList.remove('drag-over'); }
  $('#confirm-import').addEventListener('click', () => {
    const fresh = dedupe(pendingTrades);
    if (!fresh.length) { showToast('Aucun nouveau trade à importer'); return; }
    trades.push(...fresh); saveTrades();
    const count = fresh.length, skipped = pendingTrades.length - fresh.length;
    pendingTrades = []; pendingFileName = ''; $('#import-file').value = ''; $('#confirm-import').disabled = true;
    setImportStatus('success', `${count} trade(s) ajouté(s) à l’historique${skipped ? ` · ${skipped} doublon(s) ignoré(s)` : ''}.`);
    render(); showToast(`${count} trade(s) importé(s)`);
  });

  function bindEvents() {
    $('#navigation').addEventListener('click', e => { const button = e.target.closest('[data-page]'); if (button) switchPage(button.dataset.page); });
    $('#top-add').addEventListener('click', () => openTradeModal());
    $('#top-import').addEventListener('click', () => switchPage('import'));
    $('#trade-list').addEventListener('click', e => { const row = e.target.closest('[data-trade-id]'); if (row) selectTrade(row.dataset.tradeId); });
    $('#history-filter').addEventListener('change', renderHistory);
    $('#history-sort').addEventListener('change', renderHistory);
    $('#search').addEventListener('input', renderHistory);
    $('#trade-modal').addEventListener('click', e => { if (e.target === $('#trade-modal')) closeTradeModal(); });
    $('#close-modal').addEventListener('click', closeTradeModal); $('#cancel-modal').addEventListener('click', closeTradeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeTradeModal(); });
    document.addEventListener('click', e => {
      const add = e.target.closest('[data-action="add"]'); if (add) openTradeModal();
      const pageLink = e.target.closest('[data-page-link]'); if (pageLink) switchPage(pageLink.dataset.pageLink);
    });
    $('#choose-file').addEventListener('click', () => $('#import-file').click());
    $('#dropzone').addEventListener('click', e => { if (!e.target.closest('#choose-file')) $('#import-file').click(); });
    $('#dropzone').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#import-file').click(); } });
    $('#import-file').addEventListener('change', () => readImportFile($('#import-file').files[0]));
    $('#clear-import').addEventListener('click', clearImport);
    ['dragenter','dragover'].forEach(type => $('#dropzone').addEventListener(type, e => { e.preventDefault(); $('#dropzone').classList.add('drag-over'); }));
    ['dragleave','drop'].forEach(type => $('#dropzone').addEventListener(type, e => { e.preventDefault(); $('#dropzone').classList.remove('drag-over'); }));
    $('#dropzone').addEventListener('drop', e => readImportFile(e.dataTransfer.files[0]));
  }
  bindEvents();
  render();
})();
