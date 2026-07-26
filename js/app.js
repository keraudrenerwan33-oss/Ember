// ===================== app.js =====================
(function () {
  const S = EF.storage, U = EF.utils, C = EF.charts, AI = EF.ai;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const state = {
    accounts: [], strategies: [], goals: [], trades: [], settings: {},
    activeAccountId: null,
    editingTradeId: null,
    uploadBefore: null, uploadAfter: null,
    calDate: new Date(),
    calSelectedDay: null
  };

  // ---------- helpers ----------
  function activeAccount() { return state.accounts.find(a => a.id === state.activeAccountId) || state.accounts[0]; }
  function accountTrades() {
    const acc = activeAccount();
    return state.trades.filter(t => t.accountId === (acc && acc.id));
  }
  function toast(msg) {
    const stack = $('#toast-stack');
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = msg;
    stack.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }
  function openModal(id) { $('#' + id).classList.add('open'); }
  function closeModal(id) { $('#' + id).classList.remove('open'); }

  $$('.modal-overlay').forEach(ov => {
    ov.addEventListener('click', (e) => { if (e.target === ov) ov.classList.remove('open'); });
  });
  $$('[data-close]').forEach(btn => btn.addEventListener('click', (e) => {
    e.target.closest('.modal-overlay').classList.remove('open');
  }));

  // ---------- load / persist ----------
  function loadAll() {
    S.ensureDefaults();
    state.accounts = S.getAccounts();
    state.strategies = S.getStrategies();
    state.goals = S.getGoals();
    state.trades = S.getTrades();
    state.settings = S.getSettings();
    state.activeAccountId = S.getActiveAccountId() || (state.accounts[0] && state.accounts[0].id);
  }
  function persistTrades() { S.saveTrades(state.trades); }
  function persistAccounts() { S.saveAccounts(state.accounts); }
  function persistStrategies() { S.saveStrategies(state.strategies); }
  function persistGoals() { S.saveGoals(state.goals); }
  function persistSettings() { S.saveSettings(state.settings); }

  // ================= NAVIGATION =================
  const pageTitles = {
    dashboard: 'Dashboard', journal: 'Journal', stats: 'Statistiques',
    calendar: 'Calendrier', goals: 'Objectifs', coach: 'Coach IA', settings: 'Réglages'
  };
  function switchPage(name) {
    $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === name));
    $$('.page').forEach(p => p.classList.toggle('active', p.dataset.page === name));
    $('#page-title').textContent = pageTitles[name] || name;
    renderPage(name);
  }
  $('#nav').addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-item'); if (!btn) return;
    switchPage(btn.dataset.page);
  });

  function setTopbarDate() {
    $('#page-date').textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  const PRINCIPLES = [
    "Le plan se respecte avant que le résultat ne se juge.",
    "Un stop qui saute est un stop qui a fait son travail.",
    "Pas de setup propre, pas de trade.",
    "La série actuelle ne prédit rien sur le prochain trade.",
    "La discipline se mesure hors des trades gagnants.",
    "Le marché sera encore là demain matin.",
    "Chaque trade enregistré est un trade dont tu peux apprendre.",
    "La régularité bat l'intensité sur la durée."
  ];
  function setPrinciple() {
    const el = $('#page-principle'); if (!el) return;
    const dayIndex = Math.floor(Date.now() / 86400000);
    el.textContent = PRINCIPLES[dayIndex % PRINCIPLES.length];
  }

  // ================= ACCOUNT SWITCH =================
  function renderAccountSwitch() {
    const sel = $('#account-switch');
    sel.innerHTML = state.accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
    sel.value = state.activeAccountId;
    const acc = activeAccount();
    $('#account-mini').textContent = acc ? `${acc.broker || ''} · ${U.fmtCurrency(acc.capital, acc.currency).replace('+', '')} capital initial` : '—';
  }
  $('#account-switch').addEventListener('change', (e) => {
    state.activeAccountId = e.target.value;
    S.setActiveAccountId(state.activeAccountId);
    renderAccountSwitch();
    renderPage(currentPage());
  });
  function currentPage() { return $('.nav-item.active').dataset.page; }

  // ================= RENDER ROUTER =================
  function renderPage(name) {
    if (name === 'dashboard') renderDashboard();
    else if (name === 'journal') renderJournal();
    else if (name === 'stats') renderStats();
    else if (name === 'calendar') renderCalendar();
    else if (name === 'goals') renderGoals();
    else if (name === 'settings') renderSettingsPage();
  }

  // ================= DASHBOARD =================
  const CHART_IDS = ['chart-equity', 'chart-pnl', 'chart-winloss', 'chart-buysell', 'chart-asset', 'chart-session'];
  function setChartsEmptyState(isEmpty) {
    CHART_IDS.forEach(id => {
      const canvas = document.getElementById(id); if (!canvas) return;
      const box = canvas.closest('.chart-box'); if (!box) return;
      let overlay = box.querySelector('.chart-empty-overlay');
      if (isEmpty) {
        canvas.style.visibility = 'hidden';
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'chart-empty-overlay';
          overlay.textContent = 'Ajoute ton premier trade pour voir apparaître ce graphique.';
          box.appendChild(overlay);
        }
      } else {
        canvas.style.visibility = 'visible';
        if (overlay) overlay.remove();
      }
    });
  }

  function renderDashboard() {
    const acc = activeAccount(); if (!acc) return;
    const trades = accountTrades();
    const stats = U.computeStats(trades, acc);
    const cur = acc.currency;

    $('#kpi-total').textContent = trades.length ? U.fmtCurrency(stats.totalProfit, cur) : '—';
    $('#kpi-total').className = 'kpi-value ' + (stats.totalProfit > 0 ? 'pos' : stats.totalProfit < 0 ? 'neg' : '');
    $('#kpi-day').textContent = trades.length ? U.fmtCurrency(stats.dailyPnl, cur) : '—';
    $('#kpi-day').className = 'kpi-value ' + (stats.dailyPnl > 0 ? 'pos' : stats.dailyPnl < 0 ? 'neg' : '');
    $('#kpi-week').textContent = trades.length ? U.fmtCurrency(stats.weeklyPnl, cur) : '—';
    $('#kpi-week').className = 'kpi-value ' + (stats.weeklyPnl > 0 ? 'pos' : stats.weeklyPnl < 0 ? 'neg' : '');
    $('#kpi-month').textContent = trades.length ? U.fmtCurrency(stats.monthlyPnl, cur) : '—';
    $('#kpi-month').className = 'kpi-value ' + (stats.monthlyPnl > 0 ? 'pos' : stats.monthlyPnl < 0 ? 'neg' : '');
    $('#kpi-winrate').textContent = trades.length ? stats.winRate.toFixed(0) + '%' : '—';
    $('#kpi-winrate-sub').textContent = trades.length ? `${stats.wins.length}G / ${stats.losses.length}P / ${stats.bes.length}BE` : '\u00a0';
    $('#kpi-count').textContent = trades.length || '—';
    $('#kpi-count-sub').textContent = trades.length ? `${state.strategies.length} stratégie(s)` : '\u00a0';
    $('#kpi-avgrr').textContent = trades.length ? U.fmtNum(stats.avgRR) : '—';
    $('#kpi-pf').textContent = trades.length ? (isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : '∞') : '—';
    $('#kpi-dd').textContent = trades.length ? stats.currentDD.toFixed(1) + '%' : '—';
    $('#kpi-best').textContent = trades.length ? U.fmtCurrency(stats.biggestWin, cur) : '—';
    $('#kpi-worst').textContent = trades.length ? U.fmtCurrency(stats.biggestLoss, cur) : '—';
    $('#kpi-duration').textContent = stats.avgDuration ? Math.round(stats.avgDuration) + ' min' : '—';

    renderAlerts(stats, trades);

    if (trades.length) {
      C.renderEquity(stats, cur);
      C.renderPnlBar(trades, cur);
      C.renderWinLoss(stats);
      C.renderBuySell(stats);
      C.renderByAsset(stats);
      C.renderBySession(stats);
    } else {
      ['equity', 'pnl', 'winloss', 'buysell', 'asset', 'session'].forEach(k => C.destroy(k));
    }

    const recent = [...trades].sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime)).slice(0, 6);
    $('#dash-recent').innerHTML = recent.length ? recent.map(t => tradeRowMini(t, cur)).join('') : '<div class="empty">Aucun trade pour le moment</div>';
    $$('#dash-recent [data-open-trade]').forEach(el => el.addEventListener('click', () => openDetailModal(el.dataset.openTrade)));

    renderDashGoals(stats, trades);
  }

  function tradeRowMini(t, cur) {
    const cls = t.pnl > 0 ? 'pos' : t.pnl < 0 ? 'neg' : 'neutral';
    return `<div class="trow" style="grid-template-columns:70px 1fr 90px 70px;" data-open-trade="${t.id}">
      <span class="mono text-faint">${U.fmtDate(t.entryTime)}</span>
      <span><strong>${t.asset}</strong> <span class="text-faint">${t.direction === 'Sell' ? 'Vente' : 'Achat'}</span></span>
      <span class="mono ${cls}">${U.fmtCurrency(t.pnl, cur)}</span>
      <span class="mono text-dim">${t.rr !== null && t.rr !== undefined && t.rr !== '' ? U.fmtNum(t.rr) : '—'}</span>
    </div>`;
  }

  function renderAlerts(stats, trades) {
    const box = $('#alerts-box');
    const alerts = [];
    if (stats.curType === 'loss' && stats.curStreak >= 3) {
      alerts.push({ type: 'danger', text: `Série de ${stats.curStreak} pertes consécutives en cours — envisage de faire une pause avant le prochain trade.` });
    }
    const today = trades.filter(t => new Date(t.entryTime).toDateString() === new Date().toDateString());
    if (today.length >= 6) {
      alerts.push({ type: 'warn', text: `${today.length} trades pris aujourd'hui — signe possible de sur-trading.` });
    }
    const acc = activeAccount();
    if (acc) {
      const bigLoss = trades.find(t => Number(t.pnl) < 0 && Math.abs(Number(t.pnl)) > acc.capital * 0.03);
      if (bigLoss) alerts.push({ type: 'danger', text: `Un trade a généré une perte supérieure à 3% du capital initial (${bigLoss.asset}, ${U.fmtDate(bigLoss.entryTime)}) — vérifie le risque appliqué.` });
    }
    const planBroken = trades.filter(t => !t.planRespected).length;
    if (trades.length >= 5 && planBroken / trades.length > 0.35) {
      alerts.push({ type: 'warn', text: `Le plan de trading n'a pas été respecté sur ${Math.round(planBroken / trades.length * 100)}% des trades enregistrés.` });
    }
    box.innerHTML = alerts.map(a => `<div class="alert-item ${a.type === 'warn' ? 'warn' : ''}">${a.text}</div>`).join('');
  }

  function renderDashGoals(stats, trades) {
    const box = $('#dash-goals');
    if (!state.goals.length) { box.innerHTML = '<div class="empty">Aucun objectif défini</div>'; return; }
    box.innerHTML = state.goals.slice(0, 4).map(g => goalCardHtml(g, trades)).join('');
  }

  // ================= JOURNAL =================
  function populateJournalFilters() {
    const trades = accountTrades();
    const assets = Array.from(new Set(trades.map(t => t.asset))).sort();
    const selA = $('#j-filter-asset');
    const curA = selA.value;
    selA.innerHTML = '<option value="">Tous les actifs</option>' + assets.map(a => `<option>${a}</option>`).join('');
    selA.value = curA;
    const selS = $('#j-filter-strategy');
    const curS = selS.value;
    selS.innerHTML = '<option value="">Toutes les stratégies</option>' + state.strategies.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    selS.value = curS;
  }

  function renderJournal() {
    populateJournalFilters();
    const acc = activeAccount();
    let trades = accountTrades();

    const q = $('#j-search').value.trim().toLowerCase();
    const fAsset = $('#j-filter-asset').value;
    const fStrategy = $('#j-filter-strategy').value;
    const fSession = $('#j-filter-session').value;
    const fResult = $('#j-filter-result').value;
    const sortMode = $('#j-sort').value;

    if (q) trades = trades.filter(t => (t.asset + ' ' + (t.notes || '') + ' ' + (t.tags || []).join(' ')).toLowerCase().includes(q));
    if (fAsset) trades = trades.filter(t => t.asset === fAsset);
    if (fStrategy) trades = trades.filter(t => t.strategyId === fStrategy);
    if (fSession) trades = trades.filter(t => (t.session === 'auto' ? U.detectSession(t.entryTime) : t.session) === fSession);
    if (fResult) trades = trades.filter(t => U.resultOf(t) === fResult);

    trades.sort((a, b) => {
      if (sortMode === 'date-asc') return new Date(a.entryTime) - new Date(b.entryTime);
      if (sortMode === 'pnl-desc') return b.pnl - a.pnl;
      if (sortMode === 'pnl-asc') return a.pnl - b.pnl;
      if (sortMode === 'rr-desc') return (b.rr || 0) - (a.rr || 0);
      return new Date(b.entryTime) - new Date(a.entryTime);
    });

    const list = $('#journal-list');
    if (!trades.length) { list.innerHTML = '<div class="empty">Aucun trade ne correspond à ces filtres.</div>'; return; }

    list.innerHTML = trades.map(t => {
      const cls = t.pnl > 0 ? 'pos' : t.pnl < 0 ? 'neg' : 'neutral';
      const session = t.session === 'auto' ? U.detectSession(t.entryTime) : t.session;
      const stratName = U.resolveStrategyName(t.strategyId, state.strategies);
      const tags = (t.tags || []).slice(0, 3).map(tg => `<span class="chip">${tg}</span>`).join('');
      return `<div class="trow" data-id="${t.id}">
        <span class="mono text-faint">${U.fmtDate(t.entryTime)}</span>
        <span><strong>${t.asset}</strong></span>
        <span class="text-faint">${t.direction === 'Sell' ? 'Vente' : 'Achat'}</span>
        <span class="mono ${cls}">${U.fmtCurrency(t.pnl, acc.currency)}</span>
        <span class="mono text-dim">${t.pnlPercentDisplay || ''}</span>
        <span class="mono text-dim">${t.rr !== null && t.rr !== undefined && t.rr !== '' ? U.fmtNum(t.rr) : '—'}</span>
        <span class="text-dim" style="font-size:11.5px;">${stratName}</span>
        <span class="text-dim" style="font-size:11.5px;">${session}</span>
        <span>${tags}</span>
        <span style="display:flex;gap:4px;">
          <button class="icon-btn" title="Dupliquer" data-dup="${t.id}">⧉</button>
          <button class="icon-btn" title="Supprimer" data-del="${t.id}">✕</button>
        </span>
      </div>`;
    }).join('');

    $$('.trow[data-id]', list).forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('[data-dup]') || e.target.closest('[data-del]')) return;
        openDetailModal(row.dataset.id);
      });
    });
    $$('[data-dup]', list).forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); duplicateTrade(btn.dataset.dup); }));
    $$('[data-del]', list).forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); deleteTrade(btn.dataset.del); }));
  }
  ['j-search', 'j-filter-asset', 'j-filter-strategy', 'j-filter-session', 'j-filter-result', 'j-sort'].forEach(id => {
    $('#' + id).addEventListener('input', U.debounce(renderJournal, 120));
    $('#' + id).addEventListener('change', renderJournal);
  });

  function duplicateTrade(id) {
    const t = state.trades.find(t => t.id === id); if (!t) return;
    const copy = { ...t, id: U.uid(), entryTime: new Date().toISOString(), createdAt: new Date().toISOString() };
    state.trades.push(copy); persistTrades(); toast('Trade dupliqué'); renderPage(currentPage());
  }
  function deleteTrade(id) {
    if (!confirm('Supprimer ce trade ?')) return;
    state.trades = state.trades.filter(t => t.id !== id);
    persistTrades(); toast('Trade supprimé'); renderPage(currentPage());
    closeModal('modal-detail');
  }

  // ================= TRADE MODAL (add/edit) =================
  function populateStrategySelect() {
    const sel = $('#t-strategy');
    sel.innerHTML = '<option value="none">Sans stratégie</option>' + state.strategies.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  }

  function resetTradeForm() {
    $('#trade-form').reset();
    $('#t-entrytime').value = new Date().toISOString().slice(0, 16);
    $('#t-exittime').value = '';
    $('#t-plan').checked = true;
    state.uploadBefore = null; state.uploadAfter = null;
    $('#upload-before').innerHTML = 'Cliquer ou déposer une image';
    $('#upload-after').innerHTML = 'Cliquer ou déposer une image';
    state.editingTradeId = null;
    $('#trade-modal-title').textContent = 'Nouveau trade';
    $('#trade-submit-btn').textContent = 'Enregistrer le trade';
  }

  $('#btn-new-trade').addEventListener('click', () => {
    populateStrategySelect();
    resetTradeForm();
    openModal('modal-trade');
  });

  function fillTradeForm(t) {
    $('#t-asset').value = t.asset || '';
    $('#t-assetclass').value = t.assetClass || 'Forex';
    $('#t-strategy').value = t.strategyId || 'none';
    document.querySelector(`input[name="t-direction"][value="${t.direction}"]`).checked = true;
    $('#t-entrytime').value = t.entryTime ? t.entryTime.slice(0, 16) : '';
    $('#t-exittime').value = t.exitTime ? t.exitTime.slice(0, 16) : '';
    $('#t-size').value = t.size ?? '';
    $('#t-entryprice').value = t.entryPrice ?? '';
    $('#t-exitprice').value = t.exitPrice ?? '';
    $('#t-sl').value = t.sl ?? '';
    $('#t-tp').value = t.tp ?? '';
    $('#t-rr').value = t.rr ?? '';
    $('#t-pnl').value = t.pnl ?? '';
    $('#t-commission').value = t.commission ?? 0;
    $('#t-swap').value = t.swap ?? 0;
    $('#t-session').value = t.session || 'auto';
    $('#t-emotion').value = t.emotion || 'Calme';
    $('#t-tags').value = (t.tags || []).join(', ');
    $('#t-plan').checked = !!t.planRespected;
    $('#t-notes').value = t.notes || '';
    state.uploadBefore = t.screenshotBefore || null;
    state.uploadAfter = t.screenshotAfter || null;
    $('#upload-before').innerHTML = state.uploadBefore ? `<img src="${state.uploadBefore}">` : 'Cliquer ou déposer une image';
    $('#upload-after').innerHTML = state.uploadAfter ? `<img src="${state.uploadAfter}">` : 'Cliquer ou déposer une image';
  }

  function openEditModal(id) {
    const t = state.trades.find(t => t.id === id); if (!t) return;
    populateStrategySelect();
    resetTradeForm();
    fillTradeForm(t);
    state.editingTradeId = id;
    $('#trade-modal-title').textContent = 'Modifier le trade';
    $('#trade-submit-btn').textContent = 'Mettre à jour le trade';
    closeModal('modal-detail');
    openModal('modal-trade');
  }

  ['before', 'after'].forEach(kind => {
    const box = $('#upload-' + kind), input = $('#t-shot-' + kind);
    box.addEventListener('click', () => input.click());
    input.addEventListener('change', async () => {
      const file = input.files[0]; if (!file) return;
      try {
        const dataUrl = await U.resizeImageFile(file, 1000);
        if (kind === 'before') state.uploadBefore = dataUrl; else state.uploadAfter = dataUrl;
        box.innerHTML = `<img src="${dataUrl}">`;
      } catch (e) { toast("Impossible de charger l'image"); }
    });
  });

  $('#trade-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const acc = activeAccount();
    const sessionRaw = $('#t-session').value;
    let trade = {
      id: state.editingTradeId || U.uid(),
      accountId: acc.id,
      asset: $('#t-asset').value.trim().toUpperCase(),
      assetClass: $('#t-assetclass').value,
      strategyId: $('#t-strategy').value,
      direction: document.querySelector('input[name="t-direction"]:checked').value,
      entryTime: $('#t-entrytime').value ? new Date($('#t-entrytime').value).toISOString() : new Date().toISOString(),
      exitTime: $('#t-exittime').value ? new Date($('#t-exittime').value).toISOString() : null,
      size: $('#t-size').value ? parseFloat($('#t-size').value) : null,
      entryPrice: $('#t-entryprice').value ? parseFloat($('#t-entryprice').value) : null,
      exitPrice: $('#t-exitprice').value ? parseFloat($('#t-exitprice').value) : null,
      sl: $('#t-sl').value ? parseFloat($('#t-sl').value) : null,
      tp: $('#t-tp').value ? parseFloat($('#t-tp').value) : null,
      rr: $('#t-rr').value !== '' ? parseFloat($('#t-rr').value) : null,
      pnl: parseFloat($('#t-pnl').value) || 0,
      commission: parseFloat($('#t-commission').value) || 0,
      swap: parseFloat($('#t-swap').value) || 0,
      session: sessionRaw,
      emotion: $('#t-emotion').value,
      tags: $('#t-tags').value.split(',').map(s => s.trim()).filter(Boolean),
      planRespected: $('#t-plan').checked,
      notes: $('#t-notes').value.trim(),
      screenshotBefore: state.uploadBefore,
      screenshotAfter: state.uploadAfter,
      createdAt: state.editingTradeId ? (state.trades.find(t => t.id === state.editingTradeId).createdAt) : new Date().toISOString()
    };
    trade = U.computeTradeDerived(trade);
    const acc2 = acc;
    trade.pnlPercentDisplay = acc2 && acc2.capital ? U.fmtNum(trade.pnl / acc2.capital * 100) + '%' : '';

    if (state.editingTradeId) {
      const idx = state.trades.findIndex(t => t.id === state.editingTradeId);
      state.trades[idx] = trade;
      toast('Trade mis à jour');
    } else {
      state.trades.push(trade);
      toast('Trade enregistré');
    }
    persistTrades();
    closeModal('modal-trade');
    renderPage(currentPage());
  });

  // ================= TRADE DETAIL =================
  function openDetailModal(id) {
    const t = state.trades.find(t => t.id === id); if (!t) return;
    const acc = state.accounts.find(a => a.id === t.accountId) || activeAccount();
    const session = t.session === 'auto' ? U.detectSession(t.entryTime) : t.session;
    const stratName = U.resolveStrategyName(t.strategyId, state.strategies);
    const cls = t.pnl > 0 ? 'pos' : t.pnl < 0 ? 'neg' : 'neutral';
    $('#detail-content').innerHTML = `
      <div class="grid grid-3 section-gap">
        <div class="kpi"><div class="kpi-label">P&amp;L</div><div class="kpi-value ${cls}">${U.fmtCurrency(t.pnl, acc.currency)}</div></div>
        <div class="kpi"><div class="kpi-label">RR</div><div class="kpi-value">${t.rr ?? '—'}</div></div>
        <div class="kpi"><div class="kpi-label">Durée</div><div class="kpi-value" style="font-size:16px;">${t.durationMinutes !== null ? t.durationMinutes + ' min' : '—'}</div></div>
      </div>
      <div class="grid grid-2 section-gap" style="font-size:13px;">
        <div>
          <p><span class="text-faint">Actif :</span> <strong>${t.asset}</strong> (${t.assetClass})</p>
          <p><span class="text-faint">Direction :</span> ${t.direction === 'Sell' ? 'Vente' : 'Achat'}</p>
          <p><span class="text-faint">Entrée :</span> ${U.fmtDateTime(t.entryTime)} — ${t.entryPrice ?? '—'}</p>
          <p><span class="text-faint">Sortie :</span> ${t.exitTime ? U.fmtDateTime(t.exitTime) : '—'} — ${t.exitPrice ?? '—'}</p>
          <p><span class="text-faint">SL / TP :</span> ${t.sl ?? '—'} / ${t.tp ?? '—'}</p>
          <p><span class="text-faint">Taille :</span> ${t.size ?? '—'}</p>
        </div>
        <div>
          <p><span class="text-faint">Stratégie :</span> ${stratName}</p>
          <p><span class="text-faint">Session :</span> ${session}</p>
          <p><span class="text-faint">Émotion :</span> ${t.emotion}</p>
          <p><span class="text-faint">Plan respecté :</span> <span class="badge ${t.planRespected ? 'badge-ok' : 'badge-no'}">${t.planRespected ? 'oui' : 'non'}</span></p>
          <p><span class="text-faint">Commission / Swap :</span> ${t.commission ?? 0} / ${t.swap ?? 0}</p>
          <p><span class="text-faint">Tags :</span> ${(t.tags || []).map(tg => `<span class="chip">${tg}</span>`).join('') || '—'}</p>
        </div>
      </div>
      ${t.notes ? `<p class="text-dim" style="margin-bottom:16px;"><span class="text-faint">Notes :</span> ${t.notes}</p>` : ''}
      <div class="grid grid-2 section-gap">
        ${t.screenshotBefore ? `<div><div class="text-faint" style="font-size:11px;margin-bottom:6px;">AVANT</div><img src="${t.screenshotBefore}" style="width:100%;border-radius:8px;cursor:zoom-in;" data-zoom="${t.screenshotBefore}"></div>` : ''}
        ${t.screenshotAfter ? `<div><div class="text-faint" style="font-size:11px;margin-bottom:6px;">APRÈS</div><img src="${t.screenshotAfter}" style="width:100%;border-radius:8px;cursor:zoom-in;" data-zoom="${t.screenshotAfter}"></div>` : ''}
      </div>
      <div class="modal-foot">
        <button class="btn btn-danger" id="detail-del">Supprimer</button>
        <button class="btn btn-ghost" id="detail-dup">Dupliquer</button>
        <button class="btn btn-primary" id="detail-edit">Modifier</button>
      </div>`;
    $$('[data-zoom]').forEach(img => img.addEventListener('click', () => {
      $('#lightbox-img').src = img.dataset.zoom; openModal('lightbox'); $('#lightbox').classList.add('open');
    }));
    $('#detail-edit').addEventListener('click', () => openEditModal(t.id));
    $('#detail-dup').addEventListener('click', () => { duplicateTrade(t.id); closeModal('modal-detail'); });
    $('#detail-del').addEventListener('click', () => deleteTrade(t.id));
    openModal('modal-detail');
  }
  $('#lightbox-close').addEventListener('click', () => $('#lightbox').classList.remove('open'));
  $('#lightbox').addEventListener('click', (e) => { if (e.target.id === 'lightbox') $('#lightbox').classList.remove('open'); });

  // ================= STATISTIQUES =================
  function barRows(entries, currency, containerId, maxItems) {
    const el = $('#' + containerId);
    if (!entries.length) { el.innerHTML = '<div class="empty">Pas encore de données</div>'; return; }
    const list = entries.slice(0, maxItems || 10);
    const maxAbs = Math.max(1, ...list.map(e => Math.abs(e.pnl)));
    el.innerHTML = list.map(e => {
      const pct = Math.min(100, Math.abs(e.pnl) / maxAbs * 100);
      const color = e.pnl >= 0 ? 'var(--green)' : 'var(--red)';
      return `<div class="bar-row">
        <div class="bar-label" title="${e.key}">${e.key}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color};"></div></div>
        <div class="bar-val">${U.fmtCurrency(e.pnl, currency)}</div>
      </div>`;
    }).join('');
  }

  function renderStats() {
    const acc = activeAccount(); if (!acc) return;
    const trades = accountTrades();
    const stats = U.computeStats(trades, acc);
    const cur = acc.currency;

    $('#s-winrate').textContent = trades.length ? stats.winRate.toFixed(1) + '%' : '—';
    $('#s-lossrate').textContent = trades.length ? stats.lossRate.toFixed(1) + '%' : '—';
    $('#s-berate').textContent = trades.length ? stats.beRate.toFixed(1) + '%' : '—';
    $('#s-expectancy').textContent = trades.length ? U.fmtCurrency(stats.expectancy, cur) : '—';
    $('#s-avgwin').textContent = trades.length ? U.fmtCurrency(stats.avgWin, cur) : '—';
    $('#s-avgloss').textContent = trades.length ? U.fmtCurrency(stats.avgLoss, cur) : '—';
    $('#s-avgrr').textContent = trades.length ? U.fmtNum(stats.avgRR) : '—';
    $('#s-rrminmax').textContent = trades.length ? `${U.fmtNum(stats.maxRR)} / ${U.fmtNum(stats.minRR)}` : '—';
    $('#s-beststreak').textContent = trades.length ? stats.bestWinStreak : '—';
    $('#s-worststreak').textContent = trades.length ? stats.bestLossStreak : '—';
    $('#s-maxdd').textContent = trades.length ? stats.maxDD.toFixed(1) + '%' : '—';
    $('#s-curdd').textContent = trades.length ? stats.currentDD.toFixed(1) + '%' : '—';

    if (trades.length) { C.renderMonthly(stats, cur); C.renderYearly(stats, cur); }
    else { C.destroy('monthly'); C.destroy('yearly'); }

    barRows(stats.byDayOfWeek, cur, 's-byday');
    barRows(stats.byHour, cur, 's-byhour', 12);
    barRows(stats.byAsset, cur, 's-byasset');
    const byStrategyNamed = stats.byStrategyRaw.map(e => ({ ...e, key: U.resolveStrategyName(e.key === 'none' ? 'none' : e.key, state.strategies) }));
    barRows(byStrategyNamed, cur, 's-bystrategy');
  }

  // ================= CALENDRIER =================
  function renderCalendar() {
    const acc = activeAccount(); if (!acc) return;
    const trades = accountTrades();
    const d = state.calDate;
    const year = d.getFullYear(), month = d.getMonth();
    $('#cal-month-label').textContent = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

    const dow = $('#cal-dow');
    dow.innerHTML = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(x => `<div class="cal-dow">${x}</div>`).join('');

    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const byDay = {};
    trades.forEach(t => {
      const td = new Date(t.entryTime);
      if (td.getFullYear() === year && td.getMonth() === month) {
        const key = td.getDate();
        byDay[key] = byDay[key] || [];
        byDay[key].push(t);
      }
    });

    let html = '';
    for (let i = 0; i < startOffset; i++) html += '<div class="cal-cell empty"></div>';
    const todayStr = new Date().toDateString();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTrades = byDay[day] || [];
      const pnl = U.sum(dayTrades, t => t.pnl);
      const cellDate = new Date(year, month, day);
      const isToday = cellDate.toDateString() === todayStr;
      let bg = 'var(--bg-elevated)', color = 'var(--text-faint)';
      if (dayTrades.length) {
        color = pnl >= 0 ? 'var(--green)' : 'var(--red)';
        bg = pnl >= 0 ? 'var(--green-dim)' : 'var(--red-dim)';
      }
      html += `<div class="cal-cell ${isToday ? 'today' : ''}" style="background:${bg};" data-day="${day}">
        <div class="cal-daynum">${day}</div>
        ${dayTrades.length ? `<div class="cal-pnl" style="color:${color};">${U.fmtCurrency(pnl, acc.currency).replace(/\.\d+/, '')}</div><div class="cal-count">${dayTrades.length} trade(s)</div>` : ''}
      </div>`;
    }
    $('#cal-grid').innerHTML = html;
    $$('.cal-cell[data-day]').forEach(cell => cell.addEventListener('click', () => showCalDayDetail(year, month, parseInt(cell.dataset.day), byDay[cell.dataset.day] || [])));
  }
  function showCalDayDetail(year, month, day, dayTrades) {
    const box = $('#cal-day-detail');
    const acc = activeAccount();
    if (!dayTrades.length) { box.style.display = 'block'; box.innerHTML = `<div class="empty">Aucun trade le ${day}/${month + 1}/${year}</div>`; return; }
    box.style.display = 'block';
    box.innerHTML = `<div class="card-title">${day}/${month + 1}/${year} — ${dayTrades.length} trade(s), ${U.fmtCurrency(U.sum(dayTrades, t => t.pnl), acc.currency)}</div>` +
      dayTrades.map(t => tradeRowMini(t, acc.currency)).join('');
    $$('[data-open-trade]', box).forEach(el => el.addEventListener('click', () => openDetailModal(el.dataset.openTrade)));
  }
  $('#cal-prev').addEventListener('click', () => { state.calDate = new Date(state.calDate.getFullYear(), state.calDate.getMonth() - 1, 1); $('#cal-day-detail').style.display = 'none'; renderCalendar(); });
  $('#cal-next').addEventListener('click', () => { state.calDate = new Date(state.calDate.getFullYear(), state.calDate.getMonth() + 1, 1); $('#cal-day-detail').style.display = 'none'; renderCalendar(); });

  // ================= OBJECTIFS =================
  function periodTrades(trades, period) {
    const now = new Date();
    let start;
    if (period === 'week') { start = new Date(now); const wd = (start.getDay() + 6) % 7; start.setDate(start.getDate() - wd); start.setHours(0, 0, 0, 0); }
    else if (period === 'month') start = new Date(now.getFullYear(), now.getMonth(), 1);
    else start = new Date(now.getFullYear(), 0, 1);
    return trades.filter(t => new Date(t.entryTime) >= start);
  }
  function goalProgress(g, trades) {
    const pTrades = periodTrades(trades, g.period);
    const stats = U.computeStats(pTrades, activeAccount());
    let current = 0, unit = '';
    if (g.type === 'trades') { current = pTrades.length; unit = 'trades'; }
    else if (g.type === 'profit') { current = stats.totalProfit; unit = activeAccount().currency; }
    else if (g.type === 'winrate') { current = stats.winRate; unit = '%'; }
    else if (g.type === 'avgrr') { current = stats.avgRR; unit = 'R'; }
    else if (g.type === 'plan') { current = pTrades.length ? pTrades.filter(t => t.planRespected).length / pTrades.length * 100 : 0; unit = '%'; }
    else if (g.type === 'maxdd') { current = stats.maxDD; unit = '%'; }
    else if (g.type === 'daystraded') { current = new Set(pTrades.map(t => new Date(t.entryTime).toDateString())).size; unit = 'jours'; }
    const inverse = g.type === 'maxdd';
    const pct = g.target ? Math.min(100, Math.max(0, inverse ? (current <= g.target ? 100 : Math.max(0, 100 - (current - g.target) / g.target * 100)) : (current / g.target * 100))) : 0;
    return { current, unit, pct };
  }
  function goalTypeLabel(type) {
    return { trades: 'Nombre de trades', profit: 'Profit', winrate: 'Win rate minimum', avgrr: 'RR moyen', plan: 'Respect du plan', maxdd: 'Drawdown maximum', daystraded: 'Jours tradés' }[type] || type;
  }
  function goalCardHtml(g, trades) {
    const p = goalProgress(g, trades);
    return `<div class="goal-card">
      <div class="goal-top">
        <div class="goal-name">${g.label || goalTypeLabel(g.type)}</div>
        <div class="goal-progtext">${typeof p.current === 'number' ? p.current.toFixed(g.type === 'profit' ? 0 : 1) : p.current} / ${g.target} ${p.unit}</div>
      </div>
      <div class="goal-track"><div class="goal-fill" style="width:${p.pct}%;"></div></div>
    </div>`;
  }
  function renderGoals() {
    const trades = accountTrades();
    const box = $('#goals-list');
    if (!state.goals.length) { box.innerHTML = '<div class="empty">Aucun objectif défini pour ce compte. Crée ton premier objectif.</div>'; return; }
    box.innerHTML = state.goals.map(g => `<div style="position:relative;">${goalCardHtml(g, trades)}<button class="icon-btn" style="position:absolute;top:14px;right:16px;" data-goal-del="${g.id}" title="Supprimer">✕</button></div>`).join('');
    $$('[data-goal-del]', box).forEach(btn => btn.addEventListener('click', () => {
      if (!confirm('Supprimer cet objectif ?')) return;
      state.goals = state.goals.filter(g => g.id !== btn.dataset.goalDel);
      persistGoals(); renderGoals();
    }));
  }
  $('#btn-new-goal').addEventListener('click', () => openModal('modal-goal'));
  $('#g-save').addEventListener('click', () => {
    const g = { id: U.uid(), accountId: activeAccount().id, type: $('#g-type').value, period: $('#g-period').value, target: parseFloat($('#g-target').value) || 0, label: $('#g-label').value.trim() };
    state.goals.push(g); persistGoals(); closeModal('modal-goal'); toast('Objectif créé'); renderGoals();
  });

  // ================= COACH IA =================
  function coachButtons() { return [$('#btn-coach-full'), $('#btn-coach-week'), $('#btn-coach-month')]; }
  async function runCoach(mode) {
    const trades = accountTrades();
    if (trades.length < 3) { $('#coach-result').innerHTML = '<div class="empty">Ajoute au moins 3 trades pour obtenir une analyse pertinente.</div>'; return; }
    const apiKey = state.settings.apiKey;
    const resultEl = $('#coach-result');
    coachButtons().forEach(b => b.disabled = true);
    resultEl.innerHTML = `<div class="coach-loading"><span class="dot"></span><span class="dot"></span><span class="dot"></span> Analyse en cours...</div>`;
    try {
      const stats = U.computeStats(trades, activeAccount());
      const sample = [...trades].sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime)).slice(0, 40);
      const text = await AI.analyze(mode, sample, state.strategies, stats, apiKey);
      resultEl.innerHTML = `<div class="coach-output">${AI.renderText(text)}</div>`;
      state.settingsAnalyses = state.settingsAnalyses || [];
      const analyses = S.getAnalyses();
      analyses.unshift({ date: new Date().toISOString(), mode, text, accountId: activeAccount().id });
      S.saveAnalyses(analyses.slice(0, 20));
    } catch (err) {
      console.error(err);
      let msg = "L'analyse a échoué. Vérifie ta connexion et réessaie.";
      if (err.message === 'NO_KEY') msg = "Aucune clé API renseignée. Ajoute ta clé Anthropic dans Réglages pour activer le Coach IA.";
      resultEl.innerHTML = `<div class="empty">${msg}</div>`;
    } finally {
      coachButtons().forEach(b => b.disabled = false);
    }
  }
  $('#btn-coach-full').addEventListener('click', () => runCoach('full'));
  $('#btn-coach-week').addEventListener('click', () => runCoach('week'));
  $('#btn-coach-month').addEventListener('click', () => runCoach('month'));

  // ================= RÉGLAGES =================
  function renderSettingsPage() {
    $('#settings-apikey').value = state.settings.apiKey || '';
    $('#accounts-list').innerHTML = state.accounts.map(a => `
      <div class="trow" style="grid-template-columns:1fr 100px 90px 90px;">
        <span><strong>${a.name}</strong> <span class="text-faint">${a.broker || ''}</span></span>
        <span class="mono">${U.fmtCurrency(a.capital, a.currency).replace('+', '')}</span>
        <button class="icon-btn" data-acc-clear="${a.id}" title="Vider les trades de ce compte" style="width:auto;padding:0 8px;font-size:11px;">Vider</button>
        <button class="icon-btn" data-acc-del="${a.id}" title="Supprimer">✕</button>
      </div>`).join('');
    $$('[data-acc-clear]').forEach(btn => btn.addEventListener('click', () => {
      const id = btn.dataset.accClear;
      const acc = state.accounts.find(a => a.id === id);
      const n = state.trades.filter(t => t.accountId === id).length;
      if (!n) { toast('Ce compte ne contient aucun trade'); return; }
      if (!confirm(`Supprimer les ${n} trade(s) du compte "${acc.name}" ? Le compte lui-même est conservé.`)) return;
      state.trades = state.trades.filter(t => t.accountId !== id);
      persistTrades();
      renderAccountSwitch(); renderPage(currentPage());
      toast(`${n} trade(s) supprimé(s)`);
    }));
    $$('[data-acc-del]').forEach(btn => btn.addEventListener('click', () => {
      if (state.accounts.length <= 1) { toast('Impossible de supprimer le dernier compte'); return; }
      if (!confirm('Supprimer ce compte et tous ses trades ?')) return;
      const id = btn.dataset.accDel;
      state.accounts = state.accounts.filter(a => a.id !== id);
      state.trades = state.trades.filter(t => t.accountId !== id);
      state.goals = state.goals.filter(g => g.accountId !== id);
      persistAccounts(); persistTrades(); persistGoals();
      if (state.activeAccountId === id) { state.activeAccountId = state.accounts[0].id; S.setActiveAccountId(state.activeAccountId); }
      renderAccountSwitch(); renderSettingsPage(); toast('Compte supprimé');
    }));

    $('#strategies-list').innerHTML = state.strategies.length ? state.strategies.map(s => `
      <div class="trow" style="grid-template-columns:1fr 90px;">
        <span><strong>${s.name}</strong>${s.description ? `<br><span class="text-faint" style="font-size:11.5px;">${s.description}</span>` : ''}</span>
        <button class="icon-btn" data-strat-del="${s.id}" title="Supprimer">✕</button>
      </div>`).join('') : '<div class="empty">Aucune stratégie définie</div>';
    $$('[data-strat-del]').forEach(btn => btn.addEventListener('click', () => {
      if (!confirm('Supprimer cette stratégie ?')) return;
      state.strategies = state.strategies.filter(s => s.id !== btn.dataset.stratDel);
      persistStrategies(); renderSettingsPage();
    }));
  }

  $('#btn-new-account').addEventListener('click', () => openModal('modal-account'));
  $('#a-save').addEventListener('click', () => {
    const name = $('#a-name').value.trim(); if (!name) { toast('Le nom du compte est requis'); return; }
    const a = { id: U.uid(), name, broker: $('#a-broker').value.trim(), capital: parseFloat($('#a-capital').value) || 0, currency: $('#a-currency').value.trim() || 'USD', createdAt: new Date().toISOString() };
    state.accounts.push(a); persistAccounts(); state.activeAccountId = a.id; S.setActiveAccountId(a.id);
    closeModal('modal-account'); renderAccountSwitch(); renderSettingsPage(); toast('Compte créé');
    ['a-name', 'a-broker'].forEach(id => $('#' + id).value = '');
  });

  $('#btn-new-strategy').addEventListener('click', () => openModal('modal-strategy'));
  $('#st-save').addEventListener('click', () => {
    const name = $('#st-name').value.trim(); if (!name) { toast('Le nom de la stratégie est requis'); return; }
    state.strategies.push({ id: U.uid(), name, description: $('#st-desc').value.trim() });
    persistStrategies(); closeModal('modal-strategy'); renderSettingsPage(); toast('Stratégie créée');
    $('#st-name').value = ''; $('#st-desc').value = '';
  });

  $('#btn-save-apikey').addEventListener('click', () => {
    state.settings.apiKey = $('#settings-apikey').value.trim();
    persistSettings(); toast('Clé API enregistrée');
  });

  $('#btn-export').addEventListener('click', () => {
    U.downloadJSON(S.exportAll(), `edgeflow-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`);
    toast('Sauvegarde exportée');
  });
  $('#btn-import-json').addEventListener('click', () => openModal('modal-import-json'));
  $('#json-confirm').addEventListener('click', () => {
    const file = $('#json-file').files[0]; if (!file) { toast('Choisis un fichier'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        S.importAll(data);
        loadAll(); renderAccountSwitch(); renderPage(currentPage());
        closeModal('modal-import-json'); toast('Sauvegarde importée');
      } catch (e) { toast('Fichier JSON invalide'); }
    };
    reader.readAsText(file);
  });
  $('#btn-reset').addEventListener('click', () => {
    if (!confirm('Cela supprimera définitivement toutes les données locales. Continuer ?')) return;
    S.resetAll(); loadAll(); renderAccountSwitch(); renderPage(currentPage()); toast('Données réinitialisées');
  });

  // ================= CONNECTER UN COMPTE =================
  let connectHandle = null;
  let autoSyncTimer = null;
  const AUTO_SYNC_MS = 60000;

  async function silentSync() {
    if (!connectHandle) return;
    try {
      const acc = activeAccount();
      const { fresh } = await EF.connect.sync(connectHandle, acc.id, state.trades);
      if (fresh.length) {
        state.trades.push(...fresh);
        persistTrades();
        renderPage(currentPage());
        toast(`${fresh.length} nouveau(x) trade(s) synchronisé(s) automatiquement`);
      }
      const statusEl = connectStatusEl();
      if (statusEl) statusEl.textContent = `Synchronisation automatique active (${connectHandle.name}) — dernière vérification à ${new Date().toLocaleTimeString('fr-FR')}.`;
    } catch (e) {
      // échec silencieux (ex: permission perdue) — la prochaine tentative réessaiera
    }
  }
  function startAutoSync() {
    stopAutoSync();
    autoSyncTimer = setInterval(silentSync, AUTO_SYNC_MS);
  }
  function stopAutoSync() {
    if (autoSyncTimer) { clearInterval(autoSyncTimer); autoSyncTimer = null; }
  }
  async function initAutoSyncIfConnected() {
    if (!EF.connect.supported()) return;
    connectHandle = await EF.connect.getStoredHandle();
    if (connectHandle) { silentSync(); startAutoSync(); }
  }

  function connectStatusEl() { return $('#connect-status'); }
  async function refreshConnectUI() {
    const statusEl = connectStatusEl();
    if (!EF.connect.supported()) {
      statusEl.textContent = "Non disponible : ouvre l'app via Live Server (ou un serveur local) dans Chrome ou Edge, pas en double-clic direct sur le fichier.";
      $('#connect-pick').disabled = true;
      return;
    }
    connectHandle = await EF.connect.getStoredHandle();
    if (connectHandle) {
      statusEl.textContent = `Connecté à : ${connectHandle.name}. Clique sur Synchroniser pour mettre à jour tes trades.`;
      $('#connect-sync').disabled = false;
      $('#connect-forget').disabled = false;
    } else {
      statusEl.textContent = 'Aucun fichier connecté.';
      $('#connect-sync').disabled = true;
      $('#connect-forget').disabled = true;
    }
  }
  $('#btn-connect-account').addEventListener('click', () => { refreshConnectUI(); openModal('modal-connect'); });

  $('#connect-pick').addEventListener('click', async () => {
    try {
      connectHandle = await EF.connect.pickFile();
      await refreshConnectUI();
      startAutoSync();
      toast('Fichier connecté. Synchronisation automatique activée.');
    } catch (e) {
      if (e.name !== 'AbortError') toast("Impossible de connecter ce fichier.");
    }
  });

  $('#connect-sync').addEventListener('click', async () => {
    if (!connectHandle) return;
    const acc = activeAccount();
    $('#connect-sync').disabled = true;
    $('#connect-status').textContent = 'Synchronisation en cours...';
    try {
      const { fresh, fileName } = await EF.connect.sync(connectHandle, acc.id, state.trades);
      if (fresh.length) {
        state.trades.push(...fresh);
        persistTrades();
        renderPage(currentPage());
      }
      $('#connect-status').textContent = `Synchronisé avec ${fileName} — ${fresh.length} nouveau(x) trade(s) ajouté(s).`;
      toast(fresh.length ? `${fresh.length} nouveau(x) trade(s) importé(s)` : 'Déjà à jour, aucun nouveau trade');
    } catch (e) {
      console.error(e);
      $('#connect-status').textContent = e.message === 'PERMISSION_DENIED'
        ? "Permission refusée pour lire le fichier. Reconnecte-le."
        : "La synchronisation a échoué.";
    } finally {
      $('#connect-sync').disabled = false;
    }
  });

  $('#connect-forget').addEventListener('click', async () => {
    await EF.connect.forget();
    connectHandle = null;
    stopAutoSync();
    await refreshConnectUI();
    toast('Compte déconnecté');
  });

  // ================= IMPORT CSV =================
  $('#btn-import-csv').addEventListener('click', () => { $('#csv-preview').textContent = ''; $('#csv-file').value = ''; openModal('modal-import'); });
  let pendingImportTrades = [];
  $('#csv-file').addEventListener('change', () => {
    const file = $('#csv-file').files[0]; if (!file) return;
    U.readFileSmart(file).then(text => {
      pendingImportTrades = U.importTradesFromFile(text, file.name, activeAccount().id);
      $('#csv-preview').textContent = pendingImportTrades.length ? `${pendingImportTrades.length} trade(s) détecté(s) et prêt(s) à être importés.` : "Aucun trade reconnu dans ce fichier — vérifie qu'il s'agit bien d'un export d'historique MT5.";
    }).catch(() => { $('#csv-preview').textContent = 'Impossible de lire ce fichier.'; });
  });
  $('#csv-confirm').addEventListener('click', () => {
    if (!pendingImportTrades.length) { toast('Aucune donnée à importer'); return; }
    const fresh = EF.connect.mergeTrades(state.trades, pendingImportTrades);
    state.trades.push(...fresh);
    persistTrades();
    closeModal('modal-import');
    toast(`${fresh.length} trade(s) importé(s)${fresh.length < pendingImportTrades.length ? ' (doublons ignorés)' : ''}`);
    renderPage(currentPage());
  });

  // ================= PWA =================
  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol === 'file:') return; // nécessite http(s), pas file://
    navigator.serviceWorker.register('sw.js').catch((e) => console.warn('Service worker non enregistré :', e));
  }

  // ================= INIT =================
  function init() {
    loadAll();
    setTopbarDate();
    setPrinciple();
    renderAccountSwitch();
    populateStrategySelect();
    $('#t-entrytime').value = new Date().toISOString().slice(0, 16);
    switchPage('dashboard');
    registerServiceWorker();
    initAutoSyncIfConnected();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
