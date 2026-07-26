// ===================== charts.js =====================
window.EF = window.EF || {};

EF.charts = (function () {
  const instances = {};
  const COLORS = {
    gold: '#C9A227', goldBright: '#F0C863', green: '#5FA98A', red: '#9E0E24', redBright: '#D6203A',
    blue: '#8C6F2E', purple: '#8C6F2E', grid: '#201D1F', text: '#918C8F'
  };
  const PALETTE = ['#C9A227', '#9E0E24', '#F0C863', '#8C6F2E', '#D6203A', '#5FA98A', '#6E4A1F', '#2E0A10'];

  if (window.Chart) {
    Chart.defaults.color = COLORS.text;
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.plugins.legend.labels.boxWidth = 10;
    Chart.defaults.plugins.legend.labels.padding = 12;
  }

  function destroy(id) {
    if (instances[id]) { instances[id].destroy(); delete instances[id]; }
  }

  function ctx(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    if (!window.Chart) {
      const box = el.closest('.chart-box');
      if (box && !box.querySelector('.chart-fallback')) {
        const msg = document.createElement('div');
        msg.className = 'chart-fallback';
        msg.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--text-faint);font-size:12px;font-family:JetBrains Mono,monospace;text-align:center;padding:12px;';
        msg.textContent = "Chart.js n'a pas pu se charger — vérifie ta connexion internet puis recharge la page.";
        box.appendChild(msg);
      }
      return null;
    }
    return el.getContext('2d');
  }

  function renderEquity(stats, currency) {
    destroy('equity');
    const c = ctx('chart-equity'); if (!c) return;
    const labels = stats.curveEquity.map((_, i) => i === 0 ? 'Départ' : 'T' + i);
    instances.equity = new Chart(c, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: stats.curveEquity,
          borderColor: COLORS.gold, borderWidth: 2.2, tension: 0.25,
          pointRadius: 0, pointHoverRadius: 4,
          fill: true,
          backgroundColor: (context) => {
            const g = context.chart.ctx.createLinearGradient(0, 0, 0, 250);
            g.addColorStop(0, 'rgba(201,162,39,0.30)'); g.addColorStop(1, 'rgba(201,162,39,0)');
            return g;
          }
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => EF.utils.fmtCurrency(c.parsed.y, currency) } } },
        scales: {
          x: { display: false },
          y: { grid: { color: COLORS.grid }, ticks: { callback: (v) => EF.utils.fmtCurrency(v, currency).replace('+', '') } }
        }
      }
    });
  }

  function renderPnlBar(trades, currency) {
    destroy('pnl');
    const c = ctx('chart-pnl'); if (!c) return;
    const sorted = [...trades].sort((a, b) => new Date(a.entryTime) - new Date(b.entryTime)).slice(-40);
    instances.pnl = new Chart(c, {
      type: 'bar',
      data: {
        labels: sorted.map(t => EF.utils.fmtDate(t.entryTime)),
        datasets: [{
          data: sorted.map(t => t.pnl),
          backgroundColor: sorted.map(t => (Number(t.pnl) >= 0 ? COLORS.green : COLORS.red)),
          borderRadius: 3, maxBarThickness: 18
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => EF.utils.fmtCurrency(c.parsed.y, currency) } } },
        scales: { x: { display: false }, y: { grid: { color: COLORS.grid }, ticks: { callback: (v) => EF.utils.fmtCurrency(v, currency).replace('+', '') } } }
      }
    });
  }

  function renderDoughnut(canvasId, key, labels, data, colors) {
    destroy(key);
    const c = ctx(canvasId); if (!c) return;
    instances[key] = new Chart(c, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors || PALETTE, borderColor: '#171B24', borderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } }, cutout: '65%' }
    });
  }

  function renderWinLoss(stats) {
    renderDoughnut('chart-winloss', 'winloss', ['Gains', 'Pertes', 'Break-even'],
      [stats.wins.length, stats.losses.length, stats.bes.length], [COLORS.green, COLORS.red, COLORS.blue]);
  }
  function renderBuySell(stats) {
    const buy = stats.byDirection.find(d => d.key === 'Buy');
    const sell = stats.byDirection.find(d => d.key === 'Sell');
    renderDoughnut('chart-buysell', 'buysell', ['Achats', 'Ventes'], [buy ? buy.n : 0, sell ? sell.n : 0], [COLORS.gold, COLORS.blue]);
  }
  function renderByAsset(stats) {
    const top = stats.byAsset.slice(0, 8);
    renderDoughnut('chart-asset', 'asset', top.map(a => a.key), top.map(a => a.n));
  }
  function renderBySession(stats) {
    renderDoughnut('chart-session', 'session', stats.bySession.map(s => s.key), stats.bySession.map(s => s.n));
  }

  function renderMonthly(stats, currency) {
    destroy('monthly');
    const c = ctx('chart-monthly'); if (!c) return;
    const keys = Object.keys(stats.monthMap).sort();
    instances.monthly = new Chart(c, {
      type: 'bar',
      data: { labels: keys, datasets: [{ data: keys.map(k => stats.monthMap[k]), backgroundColor: keys.map(k => stats.monthMap[k] >= 0 ? COLORS.green : COLORS.red), borderRadius: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => EF.utils.fmtCurrency(c.parsed.y, currency) } } }, scales: { y: { grid: { color: COLORS.grid } } } }
    });
  }
  function renderYearly(stats, currency) {
    destroy('yearly');
    const c = ctx('chart-yearly'); if (!c) return;
    const keys = Object.keys(stats.yearMap).sort();
    instances.yearly = new Chart(c, {
      type: 'bar',
      data: { labels: keys, datasets: [{ data: keys.map(k => stats.yearMap[k]), backgroundColor: keys.map(k => stats.yearMap[k] >= 0 ? COLORS.green : COLORS.red), borderRadius: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => EF.utils.fmtCurrency(c.parsed.y, currency) } } }, scales: { y: { grid: { color: COLORS.grid } } } }
    });
  }

  return { renderEquity, renderPnlBar, renderWinLoss, renderBuySell, renderByAsset, renderBySession, renderMonthly, renderYearly, destroy, PALETTE, COLORS };
})();
