// ===================== utils.js =====================
window.EF = window.EF || {};

EF.utils = (function () {

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function fmtCurrency(v, currency) {
    currency = currency || 'USD';
    const n = Number(v) || 0;
    const sign = n > 0 ? '+' : '';
    try {
      return sign + new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(n);
    } catch (e) {
      return sign + n.toFixed(2) + ' ' + currency;
    }
  }

  function fmtNum(v, digits) {
    digits = digits === undefined ? 2 : digits;
    const n = Number(v);
    if (Number.isNaN(n)) return '—';
    return (n > 0 ? '+' : '') + n.toFixed(digits);
  }

  function fmtDate(d) {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  function fmtDateTime(d) {
    return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  function fmtTime(d) {
    return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  // Détection de session à partir de l'heure UTC de l'entrée (approximation classique)
  function detectSession(dateStr) {
    if (!dateStr) return 'Hors session';
    const h = new Date(dateStr).getUTCHours();
    if (h >= 0 && h < 7) return 'Asie';
    if (h >= 7 && h < 13) return 'Londres';
    if (h >= 13 && h < 21) return 'New York';
    return 'Hors session';
  }

  function dayOfWeekLabel(dateStr) {
    return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long' });
  }

  // Calcule RR, % et durée à partir des champs bruts d'un trade si possible
  function computeTradeDerived(t) {
    const out = { ...t };
    if (t.entryTime && t.exitTime) {
      const mins = Math.round((new Date(t.exitTime) - new Date(t.entryTime)) / 60000);
      out.durationMinutes = mins >= 0 ? mins : null;
    } else {
      out.durationMinutes = null;
    }
    if ((t.rr === '' || t.rr === null || t.rr === undefined) && t.entryPrice && t.sl && t.exitPrice) {
      const entry = Number(t.entryPrice), sl = Number(t.sl), exit = Number(t.exitPrice);
      const risk = Math.abs(entry - sl);
      // Si le risque est quasi nul (SL resté collé au prix d'entrée, ex : trailing
      // stop remonté juste avant la clôture), le RR calculé exploserait de façon
      // irréaliste (ex: 80R) et fausserait toutes les moyennes. On ignore ces cas
      // plutôt que d'afficher un chiffre trompeur.
      const minMeaningfulRisk = entry * 0.0003; // 0.03% du prix, seuil de bon sens
      if (risk > minMeaningfulRisk) {
        const dirMult = t.direction === 'Sell' ? -1 : 1;
        const profitDist = (exit - entry) * dirMult;
        out.rr = +(profitDist / risk).toFixed(2);
      }
    }
    return out;
  }

  function groupBy(arr, keyFn) {
    const map = {};
    arr.forEach(item => {
      const k = keyFn(item);
      if (!map[k]) map[k] = [];
      map[k].push(item);
    });
    return map;
  }

  function sum(arr, fn) { return arr.reduce((s, x) => s + (Number(fn(x)) || 0), 0); }

  function resultOf(t) {
    const pnl = Number(t.pnl) || 0;
    if (pnl > 0) return 'win';
    if (pnl < 0) return 'loss';
    return 'be';
  }

  // ---------- moteur de statistiques ----------
  function computeStats(trades, account) {
    const n = trades.length;
    const wins = trades.filter(t => resultOf(t) === 'win');
    const losses = trades.filter(t => resultOf(t) === 'loss');
    const bes = trades.filter(t => resultOf(t) === 'be');
    const totalProfit = sum(trades, t => t.pnl);
    const grossWin = sum(wins, t => t.pnl);
    const grossLoss = Math.abs(sum(losses, t => t.pnl));
    const profitFactor = grossLoss > 0 ? grossWin / grossLoss : (grossWin > 0 ? Infinity : 0);
    const avgWin = wins.length ? grossWin / wins.length : 0;
    const avgLoss = losses.length ? -grossLoss / losses.length : 0;
    const winRate = n ? wins.length / n * 100 : 0;
    const lossRate = n ? losses.length / n * 100 : 0;
    const beRate = n ? bes.length / n * 100 : 0;
    const expectancy = n ? totalProfit / n : 0;

    const rrVals = trades.filter(t => t.rr !== null && t.rr !== undefined && t.rr !== '' && !Number.isNaN(Number(t.rr))).map(t => Number(t.rr));
    const avgRR = rrVals.length ? rrVals.reduce((a, b) => a + b, 0) / rrVals.length : 0;
    const maxRR = rrVals.length ? Math.max(...rrVals) : 0;
    const minRR = rrVals.length ? Math.min(...rrVals) : 0;

    const biggestWin = wins.length ? Math.max(...wins.map(t => Number(t.pnl))) : 0;
    const biggestLoss = losses.length ? Math.min(...losses.map(t => Number(t.pnl))) : 0;

    // séries (courante + records), triées chronologiquement
    const sorted = [...trades].sort((a, b) => new Date(a.entryTime) - new Date(b.entryTime));
    let curStreak = 0, curType = null, bestWinStreak = 0, bestLossStreak = 0, runW = 0, runL = 0;
    sorted.forEach(t => {
      const r = resultOf(t);
      if (r === 'win') { runW++; runL = 0; bestWinStreak = Math.max(bestWinStreak, runW); }
      else if (r === 'loss') { runL++; runW = 0; bestLossStreak = Math.max(bestLossStreak, runL); }
      else { runW = 0; runL = 0; }
    });
    for (let i = sorted.length - 1; i >= 0; i--) {
      const r = resultOf(sorted[i]);
      if (r === 'be') break;
      if (curType === null) { curType = r; curStreak = 1; }
      else if (r === curType) curStreak++;
      else break;
    }

    // drawdown (sur la courbe de capital cumulée)
    let equity = account ? Number(account.capital) || 0 : 0;
    let peak = equity, maxDD = 0, curveEquity = [equity];
    sorted.forEach(t => {
      equity += Number(t.pnl) || 0;
      curveEquity.push(equity);
      peak = Math.max(peak, equity);
      const dd = peak > 0 ? (peak - equity) / peak * 100 : 0;
      maxDD = Math.max(maxDD, dd);
    });
    const currentDD = peak > 0 ? (peak - equity) / peak * 100 : 0;

    const avgDuration = (() => {
      const withDur = trades.filter(t => t.durationMinutes !== null && t.durationMinutes !== undefined);
      if (!withDur.length) return null;
      return sum(withDur, t => t.durationMinutes) / withDur.length;
    })();

    // regroupements
    function groupPerf(keyFn) {
      const g = groupBy(trades, keyFn);
      return Object.keys(g).map(k => ({
        key: k,
        n: g[k].length,
        pnl: sum(g[k], t => t.pnl),
        winRate: g[k].length ? g[k].filter(t => resultOf(t) === 'win').length / g[k].length * 100 : 0
      })).sort((a, b) => b.pnl - a.pnl);
    }

    const byAsset = groupPerf(t => t.asset || '—');
    const byStrategyRaw = groupPerf(t => t.strategyId || 'none');
    const bySession = groupPerf(t => t.session || detectSession(t.entryTime));
    const byDayOfWeek = groupPerf(t => dayOfWeekLabel(t.entryTime));
    const byHour = groupPerf(t => {
      const h = t.entryTime ? new Date(t.entryTime).getHours() : 0;
      return String(h).padStart(2, '0') + 'h';
    });
    const byDirection = groupPerf(t => t.direction === 'Sell' ? 'Sell' : 'Buy');

    function periodPnl(filterFn) { return sum(trades.filter(filterFn), t => t.pnl); }
    const now = new Date();
    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(now); const wd = (startOfWeek.getDay() + 6) % 7; startOfWeek.setDate(startOfWeek.getDate() - wd); startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const dailyPnl = periodPnl(t => new Date(t.entryTime) >= startOfDay);
    const weeklyPnl = periodPnl(t => new Date(t.entryTime) >= startOfWeek);
    const monthlyPnl = periodPnl(t => new Date(t.entryTime) >= startOfMonth);
    const yearlyPnl = periodPnl(t => new Date(t.entryTime) >= startOfYear);

    // performance mensuelle / annuelle (pour graphiques)
    const monthMap = {};
    sorted.forEach(t => {
      const d = new Date(t.entryTime);
      const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      monthMap[key] = (monthMap[key] || 0) + (Number(t.pnl) || 0);
    });
    const yearMap = {};
    sorted.forEach(t => {
      const key = String(new Date(t.entryTime).getFullYear());
      yearMap[key] = (yearMap[key] || 0) + (Number(t.pnl) || 0);
    });

    return {
      n, wins, losses, bes, totalProfit, grossWin, grossLoss, profitFactor,
      avgWin, avgLoss, winRate, lossRate, beRate, expectancy,
      avgRR, maxRR, minRR, biggestWin, biggestLoss,
      curStreak, curType, bestWinStreak, bestLossStreak,
      maxDD, currentDD, curveEquity, avgDuration,
      byAsset, byStrategyRaw, bySession, byDayOfWeek, byHour, byDirection,
      dailyPnl, weeklyPnl, monthlyPnl, yearlyPnl,
      monthMap, yearMap, sortedTrades: sorted
    };
  }

  function resolveStrategyName(strategyId, strategies) {
    if (!strategyId || strategyId === 'none') return 'Sans stratégie';
    const s = strategies.find(s => s.id === strategyId);
    return s ? s.name : 'Sans stratégie';
  }

  // Lit un fichier en détectant son encodage réel (les rapports MT5 sont
  // souvent en UTF-16 avec BOM, alors que FileReader/file.text() supposent
  // à tort de l'UTF-8 par défaut — ce qui corrompt silencieusement les dates).
  function readFileSmart(file) {
    return file.arrayBuffer().then(buf => {
      const bytes = new Uint8Array(buf);
      let encoding = 'utf-8', offset = 0;
      if (bytes[0] === 0xFF && bytes[1] === 0xFE) { encoding = 'utf-16le'; offset = 2; }
      else if (bytes[0] === 0xFE && bytes[1] === 0xFF) { encoding = 'utf-16be'; offset = 2; }
      else if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) { encoding = 'utf-8'; offset = 3; }
      else {
        // heuristique : beaucoup d'octets nuls en position impaire => UTF-16LE sans BOM
        const total = Math.min(400, bytes.length);
        let zeros = 0;
        for (let i = 1; i < total; i += 2) if (bytes[i] === 0) zeros++;
        if (zeros > total / 2 * 0.6) encoding = 'utf-16le';
      }
      try {
        return new TextDecoder(encoding).decode(bytes.slice(offset));
      } catch (e) {
        return new TextDecoder('utf-8').decode(bytes);
      }
    });
  }

  // ---------- CSV (export MT5) ----------
  function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length);
    if (!lines.length) return [];
    const splitLine = (line) => {
      const out = []; let cur = ''; let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') { inQuotes = !inQuotes; }
        else if ((c === ',' || c === ';' || c === '\t') && !inQuotes) { out.push(cur.trim()); cur = ''; }
        else cur += c;
      }
      out.push(cur.trim());
      return out;
    };
    const headers = splitLine(lines[0]).map(h => h.toLowerCase());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = splitLine(lines[i]);
      if (cells.length < 2) continue;
      const row = {};
      headers.forEach((h, idx) => row[h] = cells[idx]);
      rows.push(row);
    }
    return rows;
  }

  // ---------- rapport HTML (export MT5 "Enregistrer un rapport") ----------
  function parseHTMLReport(text) {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    const headerKeywords = ['time', 'heure', 'date', 'symbol', 'symbole', 'type', 'profit', 'price', 'prix', 'volume', 'deal', 'order', 'ordre', 'ticket', 's/l', 't/p'];
    const rows = [];
    doc.querySelectorAll('table').forEach(table => {
      const trs = Array.from(table.querySelectorAll('tr'));
      let headers = null;
      trs.forEach(tr => {
        const cells = Array.from(tr.querySelectorAll('td,th')).map(c => c.textContent.trim());
        if (!cells.length) return;
        const lower = cells.map(c => c.toLowerCase());
        const matchCount = lower.filter(c => headerKeywords.some(k => c.includes(k))).length;
        if (matchCount >= 2) { headers = lower; return; }
        if (headers && cells.length === headers.length) {
          const nonEmpty = cells.filter(c => c).length;
          if (nonEmpty < 2) return;
          const row = {};
          headers.forEach((h, i) => row[h] = cells[i]);
          rows.push(row);
        }
      });
    });
    return rows;
  }

  // ---------- section "Positions" des rapports MT5 (source la plus fiable : 1 ligne = 1 trade complet) ----------
  function parseMT5PositionsToTrades(text, accountId) {
    try {
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const trs = Array.from(doc.querySelectorAll('tr'));
      let startIdx = -1;
      for (let i = 0; i < trs.length; i++) {
        const t = trs[i].textContent.trim().toLowerCase();
        if (t === 'positions' || t === 'position') { startIdx = i; break; }
      }
      if (startIdx === -1) return [];
      const trades = [];
      for (let i = startIdx + 2; i < trs.length; i++) {
        const cells = Array.from(trs[i].querySelectorAll('td,th'))
          .filter(c => !c.classList.contains('hidden'))
          .map(c => c.textContent.trim());
        if (!cells.length) continue;
        if (!/^\d{4}\.\d{2}\.\d{2}/.test(cells[0])) break; // fin de la section
        if (cells.length < 13) continue;
        const [openTimeStr, ticket, symbol, type, volume, openPrice, sl, tp, closeTimeStr, closePrice, commission, swap, profit] = cells;
        // ignore les lignes qui ne sont pas de vraies positions (dépôts, retraits,
        // crédits, ajustements de solde) — elles ont le même format de date que
        // les trades mais ne sont pas des Buy/Sell, et faussaient l'import.
        if (!/buy|sell/i.test(type || '')) continue;
        if (!symbol || !symbol.trim()) continue;
        // ignore les positions encore ouvertes (pas de date de clôture) : leur
        // profit flottant change à chaque export, ce qui les faisait réapparaître
        // comme "nouveau trade" à chaque synchro tant qu'elles restaient ouvertes.
        if (!closeTimeStr || !/^\d{4}\.\d{2}\.\d{2}/.test(closeTimeStr.trim())) continue;
        const parseDate = (s) => {
          if (!s) return null;
          const d = new Date(s.replace(/^(\d{4})\.(\d{2})\.(\d{2})/, '$1-$2-$3'));
          return isNaN(d) ? null : d.toISOString();
        };
        const entryTime = parseDate(openTimeStr) || new Date().toISOString();
        const exitTime = parseDate(closeTimeStr);
        let trade = {
          id: uid(),
          externalId: ticket || null,
          accountId,
          asset: (symbol || 'INCONNU').toUpperCase(),
          assetClass: 'Forex',
          direction: (type || '').toLowerCase().includes('sell') ? 'Sell' : 'Buy',
          size: parseFloat(volume) || null,
          entryPrice: parseFloat(openPrice) || null,
          exitPrice: parseFloat(closePrice) || null,
          sl: parseFloat(sl) || null,
          tp: parseFloat(tp) || null,
          pnl: parseFloat(profit) || 0,
          commission: parseFloat(commission) || 0,
          swap: parseFloat(swap) || 0,
          rr: null,
          entryTime, exitTime,
          durationMinutes: null,
          strategyId: 'none',
          session: 'auto',
          tags: ['import-mt5'],
          notes: 'Importé automatiquement depuis MT5 (Positions).',
          emotion: 'Calme',
          planRespected: true,
          screenshotBefore: null,
          screenshotAfter: null,
          createdAt: new Date().toISOString()
        };
        trades.push(computeTradeDerived(trade));
      }
      return trades;
    } catch (e) {
      console.error('parseMT5PositionsToTrades error', e);
      return [];
    }
  }

  // ---------- section "Transactions" / "Deals" des rapports MT5 ----------
  // Certains rapports (selon le broker / la langue / la version MT5) ont une
  // section "Positions" vide (elle ne liste que les positions ENCORE
  // OUVERTES) et ne donnent les trades clôturés que sous forme de lignes
  // séparées "in" (entrée) / "out" (sortie) dans la section "Transactions"
  // (ou "Deals" en anglais). On les réassemble ici en trades complets.
  function parseMT5DealsToTrades(text, accountId) {
    try {
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const trs = Array.from(doc.querySelectorAll('tr'));
      let startIdx = -1;
      for (let i = 0; i < trs.length; i++) {
        const t = trs[i].textContent.trim().toLowerCase();
        if (t === 'transactions' || t === 'deals' || t === 'transaction' || t === 'deal') { startIdx = i; break; }
      }
      if (startIdx === -1) return [];

      const parseDate = (s) => {
        if (!s) return null;
        const d = new Date(s.trim().replace(/^(\d{4})\.(\d{2})\.(\d{2})/, '$1-$2-$3'));
        return isNaN(d) ? null : d.toISOString();
      };
      const num = (s) => {
        if (s == null) return 0;
        const v = parseFloat(String(s).replace(/[^\d.,-]/g, '').replace(',', '.'));
        return isNaN(v) ? 0 : v;
      };

      // file d'attente des entrées ("in") non encore appariées, par symbole
      const openBySymbol = {};
      const trades = [];

      for (let i = startIdx + 2; i < trs.length; i++) {
        const cells = Array.from(trs[i].querySelectorAll('td,th'))
          .filter(c => !c.classList.contains('hidden'))
          .map(c => c.textContent.trim());
        if (!cells.length) continue;
        if (!/^\d{4}\.\d{2}\.\d{2}/.test(cells[0])) break; // fin de la section
        if (cells.length < 13) continue;
        const [timeStr, dealTicket, symbol, type, direction, volume, price, orderTicket, , commission, fees, swap, profit] = cells;

        // ignore dépôts / retraits / crédits / ajustements (pas de vrai trade)
        if (!/buy|sell/i.test(type || '')) continue;
        if (!symbol || !symbol.trim()) continue;
        const dirNorm = (direction || '').trim().toLowerCase();
        const sym = symbol.toUpperCase();

        if (dirNorm === 'in') {
          if (!openBySymbol[sym]) openBySymbol[sym] = [];
          openBySymbol[sym].push({ timeStr, dealTicket, type, volume, price, commission, fees, swap });
          continue;
        }
        if (dirNorm === 'out') {
          const queue = openBySymbol[sym];
          const entry = queue && queue.length ? queue.shift() : null;
          if (!entry) continue; // sortie sans entrée connue (hors de la période exportée) : on l'ignore plutôt que de créer un trade incomplet
          const entryTime = parseDate(entry.timeStr) || new Date().toISOString();
          const exitTime = parseDate(timeStr);
          let trade = {
            id: uid(),
            // le ticket du deal d'ENTRÉE identifie ce trade de façon stable et
            // unique d'un export à l'autre : deux exports du même historique
            // donnent toujours le même externalId pour le même trade.
            externalId: entry.dealTicket || null,
            accountId,
            asset: sym || 'INCONNU',
            assetClass: 'Forex',
            direction: (entry.type || '').toLowerCase().includes('sell') ? 'Sell' : 'Buy',
            size: num(entry.volume) || null,
            entryPrice: num(entry.price) || null,
            exitPrice: num(price) || null,
            sl: null,
            tp: null,
            pnl: num(profit),
            commission: num(entry.commission) + num(commission),
            swap: num(entry.swap) + num(swap),
            rr: null,
            entryTime, exitTime,
            durationMinutes: null,
            strategyId: 'none',
            session: 'auto',
            tags: ['import-mt5'],
            notes: 'Importé automatiquement depuis MT5 (Transactions).',
            emotion: 'Calme',
            planRespected: true,
            screenshotBefore: null,
            screenshotAfter: null,
            createdAt: new Date().toISOString()
          };
          trades.push(computeTradeDerived(trade));
        }
      }
      return trades;
    } catch (e) {
      console.error('parseMT5DealsToTrades error', e);
      return [];
    }
  }

  // Point d'entrée unique pour tout import (CSV ou HTML) : tente d'abord la
  // lecture ciblée de la section "Positions" (la plus fiable), et retombe
  // sur le parsing générique par en-têtes si elle ne trouve rien.
  function importTradesFromFile(text, fileName, accountId) {
    const lower = (fileName || '').toLowerCase();
    const looksHtml = lower.endsWith('.htm') || lower.endsWith('.html') || /<table/i.test(text.slice(0, 3000));
    if (!looksHtml) {
      const emberTrades = parseEmberExportCSV(text, accountId);
      if (emberTrades.length) return emberTrades;
    }
    if (looksHtml) {
      const mt5Trades = parseMT5PositionsToTrades(text, accountId);
      if (mt5Trades.length) return mt5Trades;
      const dealsTrades = parseMT5DealsToTrades(text, accountId);
      if (dealsTrades.length) return dealsTrades;
    }
    const rows = looksHtml ? parseHTMLReport(text) : parseCSV(text);
    return rows.map(r => mapCsvRowToTrade(r, accountId)).map(computeTradeDerived);
  }

  function parseImportFile(text, fileName) {
    const lower = (fileName || '').toLowerCase();
    if (lower.endsWith('.htm') || lower.endsWith('.html') || /<table/i.test(text.slice(0, 2000))) {
      return parseHTMLReport(text);
    }
    return parseCSV(text);
  }

  // ---------- CSV généré par le script EmberAutoExport.mq5 (format connu, fiable) ----------
  function parseEmberExportCSV(text, accountId) {
    const rows = parseCSV(text);
    if (!rows.length) return [];
    const first = rows[0];
    const hasKnownShape = 'openprice' in first && 'closetime' in first && 'closeprice' in first;
    if (!hasKnownShape) return [];

    const parseDate = (s) => {
      if (!s) return null;
      const d = new Date(String(s).replace(/^(\d{4})\.(\d{2})\.(\d{2})/, '$1-$2-$3'));
      return isNaN(d) ? null : d.toISOString();
    };

    return rows.map(row => {
      const entryTime = parseDate(row.opentime) || new Date().toISOString();
      const exitTime = parseDate(row.closetime);
      let trade = {
        id: uid(),
        externalId: row.ticket || null,
        accountId,
        asset: (row.symbol || 'INCONNU').toUpperCase(),
        assetClass: 'Forex',
        direction: (row.type || '').toLowerCase().includes('sell') ? 'Sell' : 'Buy',
        size: parseFloat(row.volume) || null,
        entryPrice: parseFloat(row.openprice) || null,
        exitPrice: parseFloat(row.closeprice) || null,
        sl: parseFloat(row.sl) || null,
        tp: parseFloat(row.tp) || null,
        pnl: parseFloat(row.profit) || 0,
        commission: parseFloat(row.commission) || 0,
        swap: parseFloat(row.swap) || 0,
        rr: null,
        entryTime, exitTime,
        durationMinutes: null,
        strategyId: 'none',
        session: 'auto',
        tags: ['import-mt5', 'auto-export'],
        notes: 'Importé automatiquement depuis MT5 (synchronisation automatique).',
        emotion: 'Calme',
        planRespected: true,
        screenshotBefore: null,
        screenshotAfter: null,
        createdAt: new Date().toISOString()
      };
      return computeTradeDerived(trade);
    });
  }

  function mapCsvRowToTrade(row, defaultAccountId) {
    const find = (...keys) => {
      for (const k of keys) {
        for (const rk in row) { if (rk.includes(k)) return row[rk]; }
      }
      return '';
    };
    const ticket = find('ticket', 'order', 'ordre', 'position', 'deal');
    const dateStr = find('time', 'date', 'ouverture', 'open');
    const symbol = find('symbol', 'symbole', 'actif', 'instrument');
    const type = (find('type', 'sens', 'direction') || '').toLowerCase();
    const direction = type.includes('sell') || type.includes('vente') ? 'Sell' : 'Buy';
    const volume = find('volume', 'lots', 'taille');
    const priceOpen = find('price', 'prix', 'ouverture');
    const sl = find('s/l', 'sl', 'stop');
    const tp = find('t/p', 'tp', 'take');
    const profit = find('profit', 'p&l', 'gain');
    const commission = find('commission');
    const swap = find('swap');
    const parsedDate = dateStr ? new Date(dateStr.replace(/\./g, '-')) : new Date();
    return {
      id: uid(),
      externalId: ticket || null,
      accountId: defaultAccountId,
      asset: (symbol || 'INCONNU').toUpperCase(),
      assetClass: 'Forex',
      direction,
      size: parseFloat(volume) || null,
      entryPrice: parseFloat(priceOpen) || null,
      exitPrice: null,
      sl: parseFloat(sl) || null,
      tp: parseFloat(tp) || null,
      pnl: parseFloat(profit) || 0,
      commission: parseFloat(commission) || 0,
      swap: parseFloat(swap) || 0,
      rr: null,
      entryTime: isNaN(parsedDate) ? new Date().toISOString() : parsedDate.toISOString(),
      exitTime: null,
      durationMinutes: null,
      strategyId: 'none',
      session: 'auto',
      tags: ['import-mt5'],
      notes: 'Importé automatiquement depuis MT5.',
      emotion: 'Calme',
      planRespected: true,
      screenshotBefore: null,
      screenshotAfter: null,
      createdAt: new Date().toISOString()
    };
  }

  // ---------- images ----------
  function resizeImageFile(file, maxWidth) {
    maxWidth = maxWidth || 1000;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Lecture du fichier échouée'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Image invalide'));
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width);
          const canvas = document.createElement('canvas');
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function downloadJSON(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function debounce(fn, wait) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  }

  return {
    uid, fmtCurrency, fmtNum, fmtDate, fmtDateTime, fmtTime,
    detectSession, dayOfWeekLabel, computeTradeDerived, groupBy, sum, resultOf,
    computeStats, resolveStrategyName, parseCSV, parseHTMLReport, parseImportFile,
    parseMT5PositionsToTrades, parseMT5DealsToTrades, parseEmberExportCSV, importTradesFromFile, mapCsvRowToTrade,
    resizeImageFile, downloadJSON, debounce, readFileSmart
  };
})();
