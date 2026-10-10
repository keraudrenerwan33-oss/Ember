(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Instruments ---------- */
const INSTR = [
  {sym:'EURUSD', name:'Euro / Dollar', cat:'Forex', p0:1.0850, d:5, vol:.028, pip:.0001, cs:100000, inv:false, sp:.00008, unit:'pips', peak:13, lot:.10},
  {sym:'GBPUSD', name:'Livre / Dollar', cat:'Forex', p0:1.2650, d:5, vol:.033, pip:.0001, cs:100000, inv:false, sp:.00010, unit:'pips', peak:13, lot:.10},
  {sym:'USDJPY', name:'Dollar / Yen', cat:'Forex', p0:148.50, d:3, vol:.033, pip:.01, cs:100000, inv:true, sp:.008, unit:'pips', peak:12, lot:.10},
  {sym:'AUDUSD', name:'Dollar australien / Dollar', cat:'Forex', p0:.6650, d:5, vol:.034, pip:.0001, cs:100000, inv:false, sp:.00010, unit:'pips', peak:9, lot:.10},
  {sym:'USDCAD', name:'Dollar / Dollar canadien', cat:'Forex', p0:1.3550, d:5, vol:.027, pip:.0001, cs:100000, inv:true, sp:.00012, unit:'pips', peak:14, lot:.10},
  {sym:'USDCHF', name:'Dollar / Franc suisse', cat:'Forex', p0:.8800, d:5, vol:.028, pip:.0001, cs:100000, inv:true, sp:.00012, unit:'pips', peak:12, lot:.10},
  {sym:'NZDUSD', name:'Dollar néo-zélandais / Dollar', cat:'Forex', p0:.6100, d:5, vol:.034, pip:.0001, cs:100000, inv:false, sp:.00012, unit:'pips', peak:8, lot:.10},
  {sym:'EURGBP', name:'Euro / Livre', cat:'Forex', p0:.8550, d:5, vol:.022, pip:.0001, cs:100000, inv:false, sp:.00010, unit:'pips', peak:10, lot:.10},
  {sym:'EURJPY', name:'Euro / Yen', cat:'Forex', p0:160.5, d:3, vol:.035, pip:.01, cs:100000, inv:true, sp:.012, unit:'pips', peak:11, lot:.10},
  {sym:'GBPJPY', name:'Livre / Yen', cat:'Forex', p0:188, d:3, vol:.042, pip:.01, cs:100000, inv:true, sp:.02, unit:'pips', peak:11, lot:.10},
  {sym:'AUDJPY', name:'Dollar australien / Yen', cat:'Forex', p0:98, d:3, vol:.04, pip:.01, cs:100000, inv:true, sp:.015, unit:'pips', peak:7, lot:.10},
  {sym:'EURCHF', name:'Euro / Franc suisse', cat:'Forex', p0:.9550, d:5, vol:.018, pip:.0001, cs:100000, inv:true, sp:.00014, unit:'pips', peak:10, lot:.10},
  {sym:'EURAUD', name:'Euro / Dollar australien', cat:'Forex', p0:1.6300, d:5, vol:.03, pip:.0001, cs:100000, inv:false, sp:.00020, unit:'pips', peak:9, lot:.10},
  {sym:'XAUUSD', name:'Or', cat:'Matières premières', p0:1950, d:2, vol:.055, pip:.1, cs:100, inv:false, sp:.25, unit:'pips', peak:13, lot:.10},
  {sym:'XAGUSD', name:'Argent', cat:'Matières premières', p0:23.5, d:3, vol:.095, pip:.01, cs:5000, inv:false, sp:.025, unit:'pips', peak:13, lot:.10},
  {sym:'XPTUSD', name:'Platine', cat:'Matières premières', p0:950, d:2, vol:.075, pip:.1, cs:50, inv:false, sp:1.5, unit:'pips', peak:13, lot:.10},
  {sym:'USOIL', name:'Pétrole WTI', cat:'Matières premières', p0:78, d:2, vol:.11, pip:.01, cs:1000, inv:false, sp:.03, unit:'pips', peak:14, lot:.10},
  {sym:'UKOIL', name:'Pétrole Brent', cat:'Matières premières', p0:83, d:2, vol:.10, pip:.01, cs:1000, inv:false, sp:.04, unit:'pips', peak:13, lot:.10},
  {sym:'NATGAS', name:'Gaz naturel', cat:'Matières premières', p0:2.8, d:3, vol:.22, pip:.001, cs:10000, inv:false, sp:.006, unit:'pips', peak:14, lot:.10},
  {sym:'NAS100', name:'Nasdaq 100', cat:'Indices', p0:15500, d:1, vol:.065, pip:1, cs:1, inv:false, sp:1.2, unit:'pts', peak:16, idx:true, lot:1},
  {sym:'SPX500', name:'S&P 500', cat:'Indices', p0:4500, d:1, vol:.055, pip:1, cs:1, inv:false, sp:.5, unit:'pts', peak:16, idx:true, lot:1},
  {sym:'US30', name:'Dow Jones 30', cat:'Indices', p0:35000, d:1, vol:.05, pip:1, cs:1, inv:false, sp:2, unit:'pts', peak:16, idx:true, lot:1},
  {sym:'US2000', name:'Russell 2000', cat:'Indices', p0:1900, d:1, vol:.07, pip:1, cs:1, inv:false, sp:.5, unit:'pts', peak:16, idx:true, lot:1},
  {sym:'GER40', name:'DAX 40', cat:'Indices', p0:16000, d:1, vol:.06, pip:1, cs:1, inv:false, sp:1.2, unit:'pts', peak:9, idx:true, lot:1},
  {sym:'UK100', name:'FTSE 100', cat:'Indices', p0:7600, d:1, vol:.05, pip:1, cs:1, inv:false, sp:1, unit:'pts', peak:9, idx:true, lot:1},
  {sym:'FRA40', name:'CAC 40', cat:'Indices', p0:7300, d:1, vol:.055, pip:1, cs:1, inv:false, sp:1, unit:'pts', peak:9, idx:true, lot:1},
  {sym:'EU50', name:'Euro Stoxx 50', cat:'Indices', p0:4300, d:1, vol:.055, pip:1, cs:1, inv:false, sp:1.5, unit:'pts', peak:9, idx:true, lot:1},
  {sym:'JP225', name:'Nikkei 225', cat:'Indices', p0:33000, d:1, vol:.065, pip:1, cs:1, inv:false, sp:8, unit:'pts', peak:2, idx:true, lot:1},
  {sym:'BTCUSD', name:'Bitcoin', cat:'Crypto', p0:30000, d:2, vol:.15, pip:1, cs:1, inv:false, sp:15, unit:'pts', crypto:true, lot:.10},
  {sym:'ETHUSD', name:'Ethereum', cat:'Crypto', p0:1800, d:2, vol:.19, pip:.1, cs:1, inv:false, sp:1, unit:'pips', crypto:true, lot:1},
  {sym:'SOLUSD', name:'Solana', cat:'Crypto', p0:25, d:3, vol:.25, pip:.01, cs:10, inv:false, sp:.05, unit:'pips', crypto:true, lot:1},
  {sym:'XRPUSD', name:'Ripple', cat:'Crypto', p0:.52, d:4, vol:.2, pip:.0001, cs:1000, inv:false, sp:.0005, unit:'pips', crypto:true, lot:1},
  {sym:'AAPL', name:'Apple', cat:'Actions', p0:175, d:2, vol:.07, pip:.01, cs:1, inv:false, sp:.03, unit:'cents', peak:16, idx:true, lot:10},
  {sym:'MSFT', name:'Microsoft', cat:'Actions', p0:330, d:2, vol:.06, pip:.01, cs:1, inv:false, sp:.05, unit:'cents', peak:16, idx:true, lot:10},
  {sym:'NVDA', name:'Nvidia', cat:'Actions', p0:450, d:2, vol:.13, pip:.01, cs:1, inv:false, sp:.08, unit:'cents', peak:16, idx:true, lot:10},
  {sym:'TSLA', name:'Tesla', cat:'Actions', p0:240, d:2, vol:.15, pip:.01, cs:1, inv:false, sp:.08, unit:'cents', peak:16, idx:true, lot:10},
  {sym:'AMZN', name:'Amazon', cat:'Actions', p0:130, d:2, vol:.09, pip:.01, cs:1, inv:false, sp:.04, unit:'cents', peak:16, idx:true, lot:10},
  {sym:'META', name:'Meta', cat:'Actions', p0:300, d:2, vol:.10, pip:.01, cs:1, inv:false, sp:.06, unit:'cents', peak:16, idx:true, lot:10},
  {sym:'GOOGL', name:'Alphabet (Google)', cat:'Actions', p0:135, d:2, vol:.08, pip:.01, cs:1, inv:false, sp:.04, unit:'cents', peak:16, idx:true, lot:10}
];
const TFS = [{id:'M1',m:1,lab:'1m'},{id:'M3',m:3,lab:'3m'},{id:'M5',m:5,lab:'5m'},{id:'M15',m:15,lab:'15m'},{id:'M30',m:30,lab:'30m'},{id:'M45',m:45,lab:'45m'},{id:'H1',m:60,lab:'1H'},{id:'H2',m:120,lab:'2H'},{id:'H3',m:180,lab:'3H'},{id:'H4',m:240,lab:'4H'},{id:'D1',m:1440,lab:'1D'},{id:'W1',m:10080,lab:'1W'},{id:'MN',m:43200,lab:'1M'}];
const START = 75000, NSIM = 300000;
const MO = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];

/* ---------- Utils ---------- */
const p2 = n => String(n).padStart(2, '0');
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const dparts = s => { const d = new Date(s * 1000); return {y:d.getUTCFullYear(), mo:d.getUTCMonth(), d:d.getUTCDate(), h:d.getUTCHours(), mi:d.getUTCMinutes()}; };
const fmtFull = s => { const x = dparts(s); return `${x.d} ${MO[x.mo]} ${x.y}, ${p2(x.h)}:${p2(x.mi)}`; };
const fmtShort = s => { const x = dparts(s); return `${p2(x.d)}/${p2(x.mo+1)} ${p2(x.h)}:${p2(x.mi)}`; };
const fmtMoney = (x, cur, sign, dec = 2) => {
  const n = Math.abs(x).toLocaleString('en-US', {minimumFractionDigits:dec, maximumFractionDigits:dec});
  const sg = x < 0 && Math.abs(x) >= .005 ? '\u2212' : (sign && x >= .005 ? '+' : '');
  return cur === '\u20ac' ? sg + n + ' \u20ac' : sg + '$' + n;
};
const money = (x, sign) => fmtMoney(x, SS ? SS.cur : '$', sign);
const esc = t => String(t).replace(/[&<>"]/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;'}[ch]));
const cls = x => x > 0.004 ? 'up' : x < -0.004 ? 'down' : '';
function hashStr(s){ let h = 2166136261; for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed){ let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function gauss(r){ let u = 0; while (!u) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); }
function niceStep(x){ const p = Math.pow(10, Math.floor(Math.log10(x))); const f = x / p; return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p; }
function toast(msg, kind){
  const el = document.createElement('div'); el.className = 'toast ' + (kind || ''); el.textContent = msg;
  $('#toasts').appendChild(el); setTimeout(() => el.remove(), 2400);
  while ($('#toasts').children.length > 3) $('#toasts').firstChild.remove();
}

/* ---------- State ---------- */
const S = {sid:null, tf:'M15', favShow:true, favH:false, favPos:null, autoRisk:false, riskPct:1, favs:['trend', 'hline', 'fib', 'measure'], chalPos:null, chalMin:false, tk:'dock', tkMin:false, tkPos:null, dockMin:false, dockH:232, dockHide:false, cc:{}, dcol:'#6FA8FF', dw:2, dstay:false, magnet:false, dhide:false, max:false, commission:0, pause:true, inds:[{uid:'i0', type:'ema', params:{len:20}, color:'#FFB84D', vis:true}], ctype:'candles', theme:'dark', speed:5, tab:'pos', sessions:{}};
const KEY = 'rewind.v2';
const datasets = new Map();
const csvs = {};
let INST = null, D = null, LAST = 0, SS = null, AGG = {}, VER = 1, ACC = null, DRAFT = null, chPrev = null;
let V = {bw:9, off:10};
let kind = 'market', drag = null, mouse = null, GEO = null, levels = [];
let BEHIT = [];
let DT = null, DR = null, SEL = null, UNDO = [], TXP = null, HIT = [];
let playTimer = null;
let C = {};

function loadPrefs(){
  try {
    const j = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!j) return;
    for (const k of ['tf','commission','pause','inds','ctype','theme','speed','tk','tkMin','tkPos','dockMin','dockH','dockHide','cc','chalPos','chalMin','autoRisk','riskPct','favs','favShow','favH','favPos','dcol','dw','dstay','magnet']) if (j[k] !== undefined) S[k] = j[k];
    if (j.sessions) S.sessions = j.sessions;
  } catch (e) {}
}
let saveT = null;
function save(){
  clearTimeout(saveT);
  saveT = setTimeout(() => {
    try {
      const sessions = {};
      for (const k in S.sessions) if (!S.sessions[k].sym.startsWith('csv:')) sessions[k] = S.sessions[k];
      localStorage.setItem(KEY, JSON.stringify({tf:S.tf, commission:S.commission, pause:S.pause, inds:S.inds, ctype:S.ctype, theme:S.theme, speed:S.speed, tk:S.tk, tkMin:S.tkMin, tkPos:S.tkPos, dockMin:S.dockMin, dockH:S.dockH, dockHide:S.dockHide, cc:S.cc, chalPos:S.chalPos, chalMin:S.chalMin, autoRisk:S.autoRisk, riskPct:S.riskPct, favs:S.favs, favShow:S.favShow, favH:S.favH, favPos:S.favPos, dcol:S.dcol, dw:S.dw, dstay:S.dstay, magnet:S.magnet, sessions}, (k, v) => k[0] === '_' ? undefined : v));
    } catch (e) {}
  }, 350);
}

/* ---------- Data ---------- */
function genSim(inst, seed){
  const N = NSIM, r = rng((seed >>> 0) ^ hashStr(inst.sym)), SQ = Math.sqrt(5);
  const t = new Float64Array(N), o = new Float64Array(N), h = new Float64Array(N), l = new Float64Array(N), c = new Float64Array(N), v = new Float64Array(N);
  let ts = Date.UTC(2021, 0, 4) / 1000 + Math.floor(r() * 120) * 7 * 86400;
  let p = inst.p0 * (0.92 + 0.16 * r()), lv = 0, mu = 0, seg = 0;
  const f = Math.pow(10, inst.d), pk = inst.peak || 13;
  for (let i = 0; i < N; i++){
    if (!inst.crypto){ const dow = (Math.floor(ts / 86400) + 4) % 7; if (dow === 6) ts += 172800; else if (dow === 0) ts += 86400; }
    const hr = (ts % 86400) / 3600;
    const sess = inst.idx ? 0.4 + 1.1 * Math.exp(-Math.pow((hr - pk) / 3.2, 2))
      : inst.crypto ? 0.85 + 0.3 * Math.exp(-Math.pow((hr - 14) / 5, 2))
      : 0.55 + 0.9 * Math.exp(-Math.pow((hr - pk) / 4.5, 2));
    if (seg-- <= 0){ seg = 1500 + Math.floor(r() * 12000); mu = gauss(r) * 0.0157; }
    lv = 0.9992 * lv + 0.0157 * gauss(r);
    const sig = inst.vol / 100 / SQ * sess * Math.exp(lv - 0.05);
    let z = gauss(r); if (r() < 0.015) z *= 2.6;
    const op = p, cl = op * Math.exp(sig * (mu + z)), ws = sig * 0.55;
    const hi = Math.max(op, cl) * (1 + Math.abs(gauss(r)) * ws), lo = Math.min(op, cl) * (1 - Math.abs(gauss(r)) * ws);
    t[i] = ts; o[i] = Math.round(op * f) / f; c[i] = Math.round(cl * f) / f;
    h[i] = Math.max(Math.round(hi * f) / f, o[i], c[i]); l[i] = Math.min(Math.round(lo * f) / f, o[i], c[i]);
    v[i] = Math.round((120 + r() * 260) * sess * (1 + 2.2 * Math.abs(z)));
    p = c[i]; ts += 60;
  }
  return {t, o, h, l, c, v, baseMin:1, source:'sim'};
}
function getSim(inst, seed){
  const key = inst.sym + ':' + seed;
  if (!datasets.has(key)){
    if (datasets.size >= 3) datasets.delete(datasets.keys().next().value);
    datasets.set(key, genSim(inst, seed));
  }
  return datasets.get(key);
}
function parseCSV(text, name){
  const lines = text.split(/\r?\n/).filter(x => x.trim());
  if (lines.length < 60) throw new Error('Il faut au moins 60 lignes de bougies.');
  const sep = [';', '\t', ','].find(s => lines[0].includes(s)) || ',';
  const first = lines[0].split(sep).map(s => s.trim().toLowerCase().replace(/[<>"']/g, ''));
  const hasHead = first.some(x => /^(open|high|low|close|date|time|datetime|timestamp|gmt time|local time)/.test(x));
  let iD = 0, iT = -1, iO, iH, iL, iC, iV = -1, rows = lines;
  if (hasHead){
    rows = lines.slice(1);
    const f = n => first.findIndex(x => x === n || x.startsWith(n));
    iO = f('open'); iH = f('high'); iL = f('low'); iC = f('close');
    iV = first.findIndex(x => ['volume', 'vol', 'tickvol', 'tick_volume', 'tick volume'].includes(x));
    const dt = first.findIndex(x => ['datetime','timestamp','gmt time','local time'].includes(x));
    const dd = first.findIndex(x => x === 'date'), tt = first.findIndex(x => x === 'time');
    if (dt >= 0) iD = dt; else if (dd >= 0){ iD = dd; if (tt >= 0) iT = tt; } else if (tt >= 0) iD = tt;
  } else {
    const c2 = lines[0].split(sep);
    if (c2.length >= 6 && c2[1].includes(':')){ iT = 1; iO = 2; iH = 3; iL = 4; iC = 5; } else { iO = 1; iH = 2; iL = 3; iC = 4; }
  }
  if ([iO, iH, iL, iC].some(x => x === undefined || x < 0)) throw new Error('Colonnes open, high, low, close introuvables.');
  const out = [];
  let dec = 0;
  for (const ln of rows){
    const c = ln.split(sep).map(s => s.trim().replace(/"/g, ''));
    let raw = c[iD]; if (iT >= 0) raw += ' ' + c[iT];
    let ts;
    if (/^\d+(\.\d+)?$/.test(raw)){ ts = parseFloat(raw); if (ts > 1e12) ts /= 1000; }
    else {
      let s = raw.replace(/^(\d{4})\.(\d{2})\.(\d{2})/, '$1-$2-$3').replace(/^(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3').trim();
      if (/^\d{4}-\d{2}-\d{2} \d/.test(s)) s = s.replace(' ', 'T');
      if (/^\d{4}-\d{2}-\d{2}T[\d:]+$/.test(s)) s += 'Z';
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) s += 'T00:00:00Z';
      ts = Date.parse(s) / 1000;
    }
    const o = +c[iO], h = +c[iH], l = +c[iL], cl = +c[iC];
    if (!isFinite(ts) || !isFinite(o) || !isFinite(h) || !isFinite(l) || !isFinite(cl)) continue;
    if (out.length < 60){ const m = /\.(\d+)/.exec(c[iC]); if (m) dec = Math.max(dec, m[1].length); }
    out.push([ts, o, h, l, cl, iV >= 0 ? +c[iV] : NaN]);
  }
  if (out.length < 60) throw new Error('Format de date ou de prix non reconnu.');
  out.sort((a, b) => a[0] - b[0]);
  const n = out.length, deltas = [];
  for (let i = 1; i < Math.min(n, 500); i++) deltas.push(out[i][0] - out[i-1][0]);
  deltas.sort((a, b) => a - b);
  const baseMin = Math.max(1, Math.round(deltas[Math.floor(deltas.length / 2)] / 60));
  const data = {t:new Float64Array(n), o:new Float64Array(n), h:new Float64Array(n), l:new Float64Array(n), c:new Float64Array(n), v:new Float64Array(n), baseMin, source:'csv'};
  out.forEach((r, i) => { data.t[i] = r[0]; data.o[i] = r[1]; data.h[i] = r[2]; data.l[i] = r[3]; data.c[i] = r[4]; data.v[i] = r[5] > 0 ? r[5] : Math.max(1, Math.round((r[2] - r[3]) / (r[4] || 1) * 1e6)); });
  const d = clamp(dec || 2, 0, 6);
  const inst = {sym:'csv:' + name, name, cat:'Importé', d, pip:d >= 2 ? Math.pow(10, -(d - 1)) : 1, cs:d >= 4 ? 100000 : d >= 2 ? 100 : 1, inv:false, sp:0, unit:'pts', lot:.10};
  return {inst, data};
}

/* ---------- Session ---------- */
function tfList(){ return TFS.filter(x => x.m >= D.baseMin && x.m % D.baseMin === 0); }
function tfMin(){ return (TFS.find(x => x.id === S.tf) || TFS[3]).m; }
function openSession(id){
  stop();
  const s = S.sessions[id]; if (!s) return false;
  if (s.sym.startsWith('csv:') && !csvs[s.sym]){ toast('Les données CSV de cette session ne sont plus chargées. Réimporte le fichier depuis le formulaire.', 'down'); return false; }
  S.sid = id; SS = s;
  if (csvs[s.sym]){ INST = csvs[s.sym].inst; D = csvs[s.sym].data; }
  else { INST = INSTR.find(i => i.sym === s.sym) || INSTR[0]; D = getSim(INST, s.seed); }
  LAST = D.t.length - 1; AGG = {}; VER++; DRAFT = null; chPrev = null; ACC = null;
  SS.cursor = clamp(SS.cursor, 60, LAST); SS.maxSeen = clamp(Math.max(SS.maxSeen || 0, SS.cursor), 60, LAST);
  if (SS.tf) S.tf = SS.tf;
  const L = tfList();
  if (!L.find(x => x.id === S.tf)) S.tf = (L.find(x => x.m >= 15) || L[0]).id;
  SS.tf = S.tf;
  SS.draws = SS.draws || [];
  if (SS.hlines && SS.hlines.length){ SS.hlines.forEach((hp, i) => SS.draws.push({id:'h' + i + Date.now().toString(36), type:'hline', pts:[{t:D.t[SS.cursor], p:hp}], col:'#E9C46A', w:1.5, dash:true})); SS.hlines = []; }
  UNDO = []; SEL = null; DR = null; DT = null;
  V.off = 10; V.man = null; hideSetup();
  $('#iLots').value = INST.lot.toFixed(2);
  $('#uSl').textContent = $('#uTp').textContent = INST.unit;
  $('#iSl').value = $('#iTp').value = ''; $('#iPrice').value = ''; $('#iRisk').value = S.riskPct; $('#autoRisk').checked = !!S.autoRisk;
  $('#srcTag').textContent = D.source === 'csv' ? 'Données importées' : 'Données simulées';
  $('#sessMkt').textContent = INST.sym.replace('csv:', ''); $('#sessName').textContent = SS.name;
  $('#sessIco').innerHTML = ico(INST); renderLegend(); renderTfs(); updateRail(); updateDtb(); updateHint(); applyTk(); refresh(); resize(); return true;
}

/* ---------- Aggregation ---------- */
function getAgg(){
  const m = tfMin(); if (AGG[m]) return AGG[m];
  const n = D.t.length, s = [], e = [];
  let bf;
  if (m === 43200){ let ld = -1, lk = 0; bf = t => { const dd = Math.floor(t / 86400); if (dd !== ld){ ld = dd; const dt = new Date(dd * 86400000); lk = dt.getUTCFullYear() * 12 + dt.getUTCMonth(); } return lk; }; }
  else if (m === 10080) bf = t => Math.floor((t / 86400 - 4) / 7);
  else bf = t => Math.floor(t / (m * 60));
  let cb = null, st = 0;
  for (let i = 0; i < n; i++){ const b = bf(D.t[i]); if (b !== cb){ if (i > 0){ s.push(st); e.push(i - 1); } cb = b; st = i; } }
  s.push(st); e.push(n - 1);
  const G = s.length, O = new Float64Array(G), H = new Float64Array(G), L = new Float64Array(G), Cc = new Float64Array(G), T = new Float64Array(G), Vv = new Float64Array(G);
  for (let g = 0; g < G; g++){
    const a = s[g], b = e[g]; let hi = -Infinity, lo = Infinity, vs = 0;
    for (let i = a; i <= b; i++){ if (D.h[i] > hi) hi = D.h[i]; if (D.l[i] < lo) lo = D.l[i]; vs += D.v[i]; }
    O[g] = D.o[a]; Cc[g] = D.c[b]; H[g] = hi; L[g] = lo; T[g] = D.t[a]; Vv[g] = vs;
  }
  return AGG[m] = {s:Int32Array.from(s), e:Int32Array.from(e), O, H, L, C:Cc, T, V:Vv, n:G};
}
function groupOf(A, idx){ let lo = 0, hi = A.n - 1; while (lo < hi){ const mid = (lo + hi) >> 1; if (A.e[mid] >= idx) hi = mid; else lo = mid + 1; } return lo; }
function partial(A, g, cur){
  const a = A.s[g], b = Math.min(A.e[g], cur); let hi = -Infinity, lo = Infinity, vs = 0;
  for (let i = a; i <= b; i++){ if (D.h[i] > hi) hi = D.h[i]; if (D.l[i] < lo) lo = D.l[i]; vs += D.v[i]; }
  return {o:D.o[a], h:hi, l:lo, c:D.c[b], v:vs, t:A.T[g]};
}
/* ---------- Indicateurs ---------- */
const PAL = ['#FFB84D', '#6FA8FF', '#B992FF', '#2FD3A4', '#FF7AA2', '#59D2FF', '#E6C84A', '#9EE06E'];
const GR = '#2FD3A4', RD = '#FF5C6E', BL = '#6FA8FF', PU = '#B992FF', OR = '#FFB84D', PK = '#FF7AA2';
const IND = {};
const IP = (k, l, v, min = 1, max = 500, step = 1) => ({k, l, v, min, max, step});
function def(id, short, name, cat, pane, params, fn){ IND[id] = {id, short, name, cat, pane, params, fn}; }
const mk = n => new Float64Array(n).fill(NaN);
const hexA = (hex, a) => { const h = String(hex).replace('#', ''); const n = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
const hMap = (a, f) => { const o = mk(a.length); for (let i = 0; i < a.length; i++) o[i] = f(a[i], i); return o; };
const hZip = (a, b, f) => { const o = mk(a.length); for (let i = 0; i < a.length; i++) o[i] = f(a[i], b[i], i); return o; };
const fl = x => Math.max(1, Math.floor(x));
function hSMA(a, len){ len = fl(len); const n = a.length, o = mk(n); let s = 0, c = 0; for (let i = 0; i < n; i++){ if (isFinite(a[i])){ s += a[i]; c++; } if (i >= len && isFinite(a[i - len])){ s -= a[i - len]; c--; } if (c === len) o[i] = s / len; } return o; }
function hEMA(a, len, k){ len = fl(len); k = k || 2 / (len + 1); const n = a.length, o = mk(n); let p = NaN; for (let i = 0; i < n; i++){ const x = a[i]; if (!isFinite(x)) continue; p = isFinite(p) ? k * x + (1 - k) * p : x; o[i] = p; } return o; }
const hRMA = (a, len) => hEMA(a, len, 1 / fl(len));
function hWMA(a, len){ len = fl(len); const n = a.length, o = mk(n), den = len * (len + 1) / 2; for (let i = len - 1; i < n; i++){ let s = 0, ok = true; for (let j = 0; j < len; j++){ const x = a[i - len + 1 + j]; if (!isFinite(x)){ ok = false; break; } s += x * (j + 1); } if (ok) o[i] = s / den; } return o; }
function hSD(a, len){ len = fl(len); const n = a.length, o = mk(n); for (let i = len - 1; i < n; i++){ let s = 0, s2 = 0, ok = true; for (let j = i - len + 1; j <= i; j++){ const x = a[j]; if (!isFinite(x)){ ok = false; break; } s += x; s2 += x * x; } if (ok){ const m = s / len; o[i] = Math.sqrt(Math.max(0, s2 / len - m * m)); } } return o; }
function hHi(a, len){ len = fl(len); const n = a.length, o = mk(n); for (let i = len - 1; i < n; i++){ let m = -Infinity; for (let j = i - len + 1; j <= i; j++) if (a[j] > m) m = a[j]; o[i] = m; } return o; }
function hLo(a, len){ len = fl(len); const n = a.length, o = mk(n); for (let i = len - 1; i < n; i++){ let m = Infinity; for (let j = i - len + 1; j <= i; j++) if (a[j] < m) m = a[j]; o[i] = m; } return o; }
function hTR(w){ const n = w.n, o = new Float64Array(n); for (let i = 0; i < n; i++) o[i] = i ? Math.max(w.H[i] - w.L[i], Math.abs(w.H[i] - w.C[i-1]), Math.abs(w.L[i] - w.C[i-1])) : w.H[i] - w.L[i]; return o; }
function hRSI(C, len){ const n = C.length, up = mk(n), dn = mk(n); for (let i = 1; i < n; i++){ const d = C[i] - C[i-1]; up[i] = d > 0 ? d : 0; dn[i] = d < 0 ? -d : 0; } return hZip(hRMA(up, len), hRMA(dn, len), (a, b) => b === 0 ? 100 : 100 - 100 / (1 + a / b)); }
const hLag = (a, k) => hMap(a, (x, i) => i >= k ? a[i - k] : NaN);
function hCum(a){ const o = mk(a.length); let s = 0; for (let i = 0; i < a.length; i++){ if (isFinite(a[i])) s += a[i]; o[i] = s; } return o; }

const mA = (id, short, name, f, dv) => { def(id, short, name, 'Moyennes mobiles', false, [IP('len', 'Période', dv || 20)], (w, p) => ({lines:[{d:f(w, fl(p.len)), col:0, w:1.6}]})); };
mA('sma', 'SMA', 'Moyenne mobile simple (SMA)', (w, L) => hSMA(w.C, L));
mA('ema', 'EMA', 'Moyenne mobile exponentielle (EMA)', (w, L) => hEMA(w.C, L));
mA('wma', 'WMA', 'Moyenne mobile pondérée (WMA)', (w, L) => hWMA(w.C, L));
mA('smma', 'SMMA', 'Moyenne mobile lissée (SMMA)', (w, L) => hRMA(w.C, L));
mA('hma', 'HMA', 'Moyenne mobile de Hull (HMA)', (w, L) => hWMA(hZip(hWMA(w.C, fl(L / 2)), hWMA(w.C, L), (a, b) => 2 * a - b), fl(Math.round(Math.sqrt(L)))), 21);
mA('vwma', 'VWMA', 'Moyenne mobile pondérée par le volume (VWMA)', (w, L) => hZip(hSMA(hZip(w.C, w.V, (c, v) => c * v), L), hSMA(w.V, L), (a, b) => a / b));
mA('dema', 'DEMA', 'Double moyenne mobile exponentielle (DEMA)', (w, L) => { const e = hEMA(w.C, L); return hZip(e, hEMA(e, L), (a, b) => 2 * a - b); });

def('bb', 'BB', 'Bandes de Bollinger', 'Volatilité', false, [IP('len', 'Période', 20), IP('m', 'Écarts-types', 2, .1, 10, .1)], (w, p, col) => {
  const b = hSMA(w.C, p.len), sd = hSD(w.C, p.len), u = hZip(b, sd, (x, y) => x + p.m * y), l = hZip(b, sd, (x, y) => x - p.m * y);
  return {lines:[{d:b, col:OR, w:1.2}, {d:u, col:0}, {d:l, col:0}], fill:[{a:u, b:l, col:hexA(col, .09)}]};
});
def('kc', 'KC', 'Canaux de Keltner', 'Volatilité', false, [IP('len', 'Période', 20), IP('m', 'Multiplicateur', 2, .1, 10, .1), IP('al', 'Période ATR', 10)], (w, p, col) => {
  const e = hEMA(w.C, p.len), a = hRMA(hTR(w), p.al), u = hZip(e, a, (x, y) => x + p.m * y), l = hZip(e, a, (x, y) => x - p.m * y);
  return {lines:[{d:e, col:OR, w:1.2}, {d:u, col:0}, {d:l, col:0}], fill:[{a:u, b:l, col:hexA(col, .08)}]};
});
def('dc', 'DC', 'Canaux de Donchian', 'Volatilité', false, [IP('len', 'Période', 20)], (w, p, col) => {
  const u = hHi(w.H, p.len), l = hLo(w.L, p.len), m = hZip(u, l, (a, b) => (a + b) / 2);
  return {lines:[{d:u, col:0}, {d:l, col:0}, {d:m, col:OR, w:1.1, dash:[4, 3]}], fill:[{a:u, b:l, col:hexA(col, .07)}]};
});
def('env', 'ENV', 'Enveloppes (moyenne mobile)', 'Volatilité', false, [IP('len', 'Période', 20), IP('pct', 'Écart en %', 2.5, .1, 50, .1)], (w, p, col) => {
  const b = hSMA(w.C, p.len), u = hMap(b, x => x * (1 + p.pct / 100)), l = hMap(b, x => x * (1 - p.pct / 100));
  return {lines:[{d:b, col:OR, w:1.2}, {d:u, col:0}, {d:l, col:0}], fill:[{a:u, b:l, col:hexA(col, .07)}]};
});
def('ichi', 'Ichimoku', "Nuage d'Ichimoku", 'Tendance', false, [IP('c', 'Tenkan', 9), IP('b', 'Kijun', 26), IP('s', 'Senkou B', 52), IP('d', 'Décalage', 26)], (w, p) => {
  const mid = len => hZip(hHi(w.H, len), hLo(w.L, len), (a, b) => (a + b) / 2), t = mid(p.c), k = mid(p.b), sa = hZip(t, k, (a, b) => (a + b) / 2), sb = mid(p.s), d = fl(p.d);
  return {lines:[{d:t, col:BL, w:1.2}, {d:k, col:PK, w:1.2}, {d:w.C, col:GR, w:1, shift:-d}, {d:sa, col:GR, w:1, shift:d}, {d:sb, col:RD, w:1, shift:d}], fill:[{a:sa, b:sb, shift:d, up:'rgba(47,211,164,.16)', dn:'rgba(255,92,110,.16)'}]};
});
def('sar', 'SAR', 'SAR parabolique', 'Tendance', false, [IP('st', 'Départ', .02, .001, 1, .001), IP('inc', 'Incrément', .02, .001, 1, .001), IP('mx', 'Maximum', .2, .01, 2, .01)], (w, p) => {
  const n = w.n, o = mk(n); if (n < 3) return {dots:[{d:o, cd:o}]};
  let bull = true, af = p.st, ep = w.H[1], sar = w.L[0];
  for (let i = 1; i < n; i++){
    sar = sar + af * (ep - sar);
    if (bull){ sar = Math.min(sar, w.L[i-1], i > 1 ? w.L[i-2] : w.L[i-1]); if (w.L[i] < sar){ bull = false; sar = ep; ep = w.L[i]; af = p.st; } else if (w.H[i] > ep){ ep = w.H[i]; af = Math.min(af + p.inc, p.mx); } }
    else { sar = Math.max(sar, w.H[i-1], i > 1 ? w.H[i-2] : w.H[i-1]); if (w.H[i] > sar){ bull = true; sar = ep; ep = w.H[i]; af = p.st; } else if (w.L[i] < ep){ ep = w.L[i]; af = Math.min(af + p.inc, p.mx); } }
    o[i] = sar;
  }
  return {dots:[{d:o, cd:hZip(o, w.C, (a, c) => a < c ? 1 : -1)}]};
});
def('st', 'Supertrend', 'Supertrend', 'Tendance', false, [IP('len', 'Période ATR', 10), IP('m', 'Multiplicateur', 3, .1, 20, .1)], (w, p) => {
  const n = w.n, a = hRMA(hTR(w), p.len), up = mk(n), dn = mk(n), u = mk(n), d = mk(n); let tr = 1;
  for (let i = 0; i < n; i++){
    if (!isFinite(a[i])) continue;
    const hl = (w.H[i] + w.L[i]) / 2; let bu = hl - p.m * a[i], bd = hl + p.m * a[i];
    if (i > 0 && isFinite(up[i-1])){ if (w.C[i-1] > up[i-1]) bu = Math.max(bu, up[i-1]); if (w.C[i-1] < dn[i-1]) bd = Math.min(bd, dn[i-1]); }
    const hadPrev = i > 0 && isFinite(up[i-1]); const pu = hadPrev ? up[i-1] : bu, pd = hadPrev ? dn[i-1] : bd;
    up[i] = bu; dn[i] = bd;
    if (hadPrev){ if (tr === -1 && w.C[i] > pd) tr = 1; else if (tr === 1 && w.C[i] < pu) tr = -1; }
    if (tr === 1) u[i] = bu; else d[i] = bd;
  }
  return {lines:[{d:u, col:GR, w:1.8}, {d:d, col:RD, w:1.8}]};
});
def('vwap', 'VWAP', 'Prix moyen pondéré par le volume (VWAP)', 'Volume', false, [], w => {
  const o = mk(w.n); if (w.tf >= 1440) return {lines:[{d:o, col:0}]};
  let pv = 0, vv = 0, day = -1;
  for (let i = 0; i < w.n; i++){ const dd = Math.floor(w.T[i] / 86400); if (dd !== day){ day = dd; pv = 0; vv = 0; } pv += (w.H[i] + w.L[i] + w.C[i]) / 3 * w.V[i]; vv += w.V[i]; o[i] = vv ? pv / vv : NaN; }
  return {lines:[{d:o, col:0, w:1.7}]};
});

def('rsi', 'RSI', 'Indice de force relative (RSI)', 'Oscillateurs', true, [IP('len', 'Période', 14)], (w, p) => ({lines:[{d:hRSI(w.C, p.len), col:0, w:1.6}], levels:[30, 70], range:[0, 100]}));
def('macd', 'MACD', 'MACD', 'Oscillateurs', true, [IP('f', 'Rapide', 12), IP('s', 'Lente', 26), IP('sg', 'Signal', 9)], (w, p) => {
  const m = hZip(hEMA(w.C, p.f), hEMA(w.C, p.s), (a, b) => a - b), sg = hEMA(m, p.sg), h = hZip(m, sg, (a, b) => a - b);
  return {hist:[{d:h, chg:true}], lines:[{d:m, col:BL}, {d:sg, col:OR}], levels:[0]};
});
def('stoch', 'Stoch', 'Stochastique', 'Oscillateurs', true, [IP('k', 'Période %K', 14), IP('sm', 'Lissage %K', 3), IP('d', 'Période %D', 3)], (w, p) => {
  const hh = hHi(w.H, p.k), ll = hLo(w.L, p.k), raw = hZip(hh, ll, (a, b) => NaN); for (let i = 0; i < w.n; i++) raw[i] = 100 * (w.C[i] - ll[i]) / (hh[i] - ll[i]);
  const k = hSMA(raw, p.sm), d = hSMA(k, p.d); return {lines:[{d:k, col:BL}, {d:d, col:OR}], levels:[20, 80], range:[0, 100]};
});
def('srsi', 'StochRSI', 'RSI stochastique', 'Oscillateurs', true, [IP('r', 'Période RSI', 14), IP('s', 'Période stoch', 14), IP('k', 'Lissage %K', 3), IP('d', 'Lissage %D', 3)], (w, p) => {
  const r = hRSI(w.C, p.r), hh = hHi(r, p.s), ll = hLo(r, p.s), raw = mk(w.n); for (let i = 0; i < w.n; i++) raw[i] = 100 * (r[i] - ll[i]) / (hh[i] - ll[i]);
  const k = hSMA(raw, p.k), d = hSMA(k, p.d); return {lines:[{d:k, col:BL}, {d:d, col:OR}], levels:[20, 80], range:[0, 100]};
});
def('cci', 'CCI', 'Indice de canal des matières premières (CCI)', 'Oscillateurs', true, [IP('len', 'Période', 20)], (w, p) => {
  const L = fl(p.len), tp = hZip(w.H, w.L, (a, b) => 0), o = mk(w.n); for (let i = 0; i < w.n; i++) tp[i] = (w.H[i] + w.L[i] + w.C[i]) / 3;
  const m = hSMA(tp, L); for (let i = L - 1; i < w.n; i++){ let s = 0; for (let j = i - L + 1; j <= i; j++) s += Math.abs(tp[j] - m[i]); o[i] = (tp[i] - m[i]) / (0.015 * (s / L)); }
  return {lines:[{d:o, col:0}], levels:[-100, 0, 100]};
});
def('willr', '%R', 'Williams %R', 'Oscillateurs', true, [IP('len', 'Période', 14)], (w, p) => {
  const hh = hHi(w.H, p.len), ll = hLo(w.L, p.len), o = mk(w.n); for (let i = 0; i < w.n; i++) o[i] = -100 * (hh[i] - w.C[i]) / (hh[i] - ll[i]);
  return {lines:[{d:o, col:0}], levels:[-20, -80], range:[-100, 0]};
});
def('roc', 'ROC', 'Taux de variation (ROC)', 'Oscillateurs', true, [IP('len', 'Période', 9)], (w, p) => ({lines:[{d:hZip(w.C, hLag(w.C, fl(p.len)), (a, b) => 100 * (a / b - 1)), col:0}], levels:[0]}));
def('mom', 'MOM', 'Momentum', 'Oscillateurs', true, [IP('len', 'Période', 10)], (w, p) => ({lines:[{d:hZip(w.C, hLag(w.C, fl(p.len)), (a, b) => a - b), col:0}], levels:[0]}));
def('ao', 'AO', 'Oscillateur de Bill Williams (AO)', 'Oscillateurs', true, [], w => {
  const hl = hZip(w.H, w.L, (a, b) => (a + b) / 2); return {hist:[{d:hZip(hSMA(hl, 5), hSMA(hl, 34), (a, b) => a - b), chg:true}], levels:[0]};
});
def('aroon', 'Aroon', 'Aroon', 'Oscillateurs', true, [IP('len', 'Période', 14)], (w, p) => {
  const L = fl(p.len), up = mk(w.n), dn = mk(w.n);
  for (let i = L; i < w.n; i++){ let hi = -Infinity, lo = Infinity, hj = i, lj = i; for (let j = i - L; j <= i; j++){ if (w.H[j] >= hi){ hi = w.H[j]; hj = j; } if (w.L[j] <= lo){ lo = w.L[j]; lj = j; } } up[i] = 100 * (L - (i - hj)) / L; dn[i] = 100 * (L - (i - lj)) / L; }
  return {lines:[{d:up, col:GR}, {d:dn, col:RD}], levels:[50], range:[0, 100]};
});
def('uo', 'UO', 'Oscillateur ultime (UO)', 'Oscillateurs', true, [IP('a', 'Court', 7), IP('b', 'Moyen', 14), IP('c', 'Long', 28)], (w, p) => {
  const n = w.n, bp = mk(n), tr = mk(n); for (let i = 1; i < n; i++){ const lo = Math.min(w.L[i], w.C[i-1]), hi = Math.max(w.H[i], w.C[i-1]); bp[i] = w.C[i] - lo; tr[i] = hi - lo; }
  const r = L => hZip(hSMA(bp, L), hSMA(tr, L), (a, b) => a / b), a = r(p.a), b = r(p.b), c = r(p.c), o = mk(n);
  for (let i = 0; i < n; i++) o[i] = 100 * (4 * a[i] + 2 * b[i] + c[i]) / 7;
  return {lines:[{d:o, col:0}], levels:[30, 70], range:[0, 100]};
});
def('trix', 'TRIX', 'TRIX', 'Oscillateurs', true, [IP('len', 'Période', 15)], (w, p) => {
  const e = hEMA(hEMA(hEMA(w.C, p.len), p.len), p.len); return {lines:[{d:hZip(e, hLag(e, 1), (a, b) => 100 * (a - b) / b), col:0}], levels:[0]};
});
def('atr', 'ATR', 'Vraie amplitude moyenne (ATR)', 'Volatilité', true, [IP('len', 'Période', 14)], (w, p) => ({lines:[{d:hRMA(hTR(w), p.len), col:0, w:1.6}]}));
def('stdev', 'Écart-type', 'Écart-type', 'Volatilité', true, [IP('len', 'Période', 20)], (w, p) => ({lines:[{d:hSD(w.C, p.len), col:0}]}));
def('chop', 'CHOP', 'Indice de choppiness (CHOP)', 'Volatilité', true, [IP('len', 'Période', 14)], (w, p) => {
  const L = fl(p.len), s = hMap(hSMA(hTR(w), L), x => x * L), hh = hHi(w.H, L), ll = hLo(w.L, L), o = mk(w.n);
  for (let i = 0; i < w.n; i++) o[i] = 100 * Math.log10(s[i] / (hh[i] - ll[i])) / Math.log10(L); return {lines:[{d:o, col:0}], levels:[38.2, 61.8], range:[0, 100]};
});
def('adx', 'ADX', "Indice directionnel moyen (ADX)", 'Tendance', true, [IP('len', 'Période', 14)], (w, p) => {
  const n = w.n, pd = mk(n), md = mk(n); for (let i = 1; i < n; i++){ const u = w.H[i] - w.H[i-1], d = w.L[i-1] - w.L[i]; pd[i] = u > d && u > 0 ? u : 0; md[i] = d > u && d > 0 ? d : 0; }
  const tr = hRMA(hTR(w), p.len), pdi = hZip(hRMA(pd, p.len), tr, (a, b) => 100 * a / b), mdi = hZip(hRMA(md, p.len), tr, (a, b) => 100 * a / b), dx = hZip(pdi, mdi, (a, b) => 100 * Math.abs(a - b) / (a + b));
  return {lines:[{d:hRMA(dx, p.len), col:0, w:1.8}, {d:pdi, col:GR}, {d:mdi, col:RD}], levels:[25]};
});
def('vol', 'Volume', 'Volume', 'Volume', true, [IP('len', 'Moyenne', 20)], (w, p) => ({hist:[{d:w.V, cd:hZip(w.C, w.O, (c, o) => c >= o ? 1 : -1)}], lines:[{d:hSMA(w.V, p.len), col:0, w:1.3}]}));
def('obv', 'OBV', 'Volume cumulé (OBV)', 'Volume', true, [], w => { const d = mk(w.n); for (let i = 1; i < w.n; i++) d[i] = Math.sign(w.C[i] - w.C[i-1]) * w.V[i]; return {lines:[{d:hCum(d), col:0}]}; });
def('mfi', 'MFI', "Indice de flux monétaire (MFI)", 'Volume', true, [IP('len', 'Période', 14)], (w, p) => {
  const L = fl(p.len), n = w.n, tp = mk(n), pos = mk(n), neg = mk(n), o = mk(n); for (let i = 0; i < n; i++) tp[i] = (w.H[i] + w.L[i] + w.C[i]) / 3;
  for (let i = 1; i < n; i++){ const f = tp[i] * w.V[i]; pos[i] = tp[i] > tp[i-1] ? f : 0; neg[i] = tp[i] < tp[i-1] ? f : 0; }
  const sp = hSMA(pos, L), sn = hSMA(neg, L); for (let i = 0; i < n; i++) o[i] = sn[i] === 0 ? 100 : 100 - 100 / (1 + sp[i] / sn[i]);
  return {lines:[{d:o, col:0}], levels:[20, 80], range:[0, 100]};
});
const mfv = w => { const o = mk(w.n); for (let i = 0; i < w.n; i++){ const r = w.H[i] - w.L[i]; o[i] = r ? ((w.C[i] - w.L[i]) - (w.H[i] - w.C[i])) / r * w.V[i] : 0; } return o; };
def('cmf', 'CMF', 'Flux monétaire de Chaikin (CMF)', 'Volume', true, [IP('len', 'Période', 20)], (w, p) => ({lines:[{d:hZip(hSMA(mfv(w), p.len), hSMA(w.V, p.len), (a, b) => a / b), col:0}], levels:[0]}));
def('ad', 'A/D', 'Accumulation / Distribution', 'Volume', true, [], w => ({lines:[{d:hCum(mfv(w)), col:0}]}));
def('fi', 'FI', 'Indice de force (Force Index)', 'Volume', true, [IP('len', 'Période', 13)], (w, p) => { const f = mk(w.n); for (let i = 1; i < w.n; i++) f[i] = (w.C[i] - w.C[i-1]) * w.V[i]; return {lines:[{d:hEMA(f, p.len), col:0}], levels:[0]}; });

/* ----- structure de marché (Smart Money), niveaux et sessions ----- */
const pvH = (w, p, L) => { const v = w.H[p]; for (let j = p - L; j < p; j++) if (w.H[j] >= v) return false; for (let j = p + 1; j <= p + L; j++) if (w.H[j] > v) return false; return true; };
const pvL = (w, p, L) => { const v = w.L[p]; for (let j = p - L; j < p; j++) if (w.L[j] <= v) return false; for (let j = p + 1; j <= p + L; j++) if (w.L[j] < v) return false; return true; };
function structScan(w, L){
  const n = w.n, ev = [], obs = [], pH = [], pL = []; let lh = null, ll = null, trend = 0;
  for (let t = 2 * L; t < n; t++){
    const p = t - L;
    if (pvH(w, p, L)){ lh = {v:w.H[p], i:p, br:false}; pH.push({i:p, v:lh.v, t}); }
    if (pvL(w, p, L)){ ll = {v:w.L[p], i:p, br:false}; pL.push({i:p, v:ll.v, t}); }
    if (lh && !lh.br && w.C[t] > lh.v){
      lh.br = true; ev.push({type:trend === -1 ? 'CHoCH' : 'BOS', bull:true, i1:lh.i, i2:t, v:lh.v});
      let mi = lh.i; for (let j = lh.i; j <= t; j++) if (w.L[j] < w.L[mi]) mi = j;
      obs.push({i:mi, bull:true, lo:w.L[mi], hi:w.H[mi], t}); trend = 1;
    } else if (ll && !ll.br && w.C[t] < ll.v){
      ll.br = true; ev.push({type:trend === 1 ? 'CHoCH' : 'BOS', bull:false, i1:ll.i, i2:t, v:ll.v});
      let mi = ll.i; for (let j = ll.i; j <= t; j++) if (w.H[j] > w.H[mi]) mi = j;
      obs.push({i:mi, bull:false, lo:w.L[mi], hi:w.H[mi], t}); trend = -1;
    }
  }
  return {ev, obs, pH, pL, trend};
}
const structDef = (id, short, name, showBos, showCh) => def(id, short, name, 'Structure de marché', false, [IP('len', 'Longueur du swing', 5, 2, 50)], (w, p) => {
  const {ev} = structScan(w, fl(p.len)), segs = [];
  for (const e of ev.slice(-80)){
    if (e.type === 'BOS' && !showBos) continue; if (e.type === 'CHoCH' && !showCh) continue;
    segs.push({i1:e.i1, v1:e.v, i2:e.i2, v2:e.v, col:e.bull ? GR : RD, w:e.type === 'CHoCH' ? 1.8 : 1.2, dash:e.type === 'BOS' ? [5, 4] : null, label:e.type});
  }
  return {segs};
});
structDef('smc', 'BOS + CHoCH', 'Structure de marché (BOS et CHoCH)', true, true);
structDef('bos', 'BOS', 'Cassure de structure (BOS)', true, false);
structDef('choch', 'CHoCH', 'Changement de caractère (CHoCH)', false, true);
def('ob', 'OB', "Blocs d'ordres (Order Blocks)", 'Structure de marché', false, [IP('len', 'Longueur du swing', 5, 2, 50), IP('max', 'Nombre maximum', 6, 1, 30)], (w, p) => {
  const {obs} = structScan(w, fl(p.len)), zones = [];
  for (const o of obs.slice(-fl(p.max))){
    let end = null; for (let x = o.t + 1; x < w.n; x++){ if (o.bull ? w.C[x] < o.lo : w.C[x] > o.hi){ end = x; break; } }
    const c = o.bull ? GR : RD; zones.push({i1:o.i, i2:end, lo:o.lo, hi:o.hi, col:hexA(c, end == null ? .2 : .07), edge:end == null ? hexA(c, .6) : null, label:end == null ? 'OB' : null, lcol:c});
  }
  return {zones};
});
def('fvg', 'FVG', 'Déséquilibres de prix (Fair Value Gap)', 'Structure de marché', false, [IP('min', 'Taille minimale (x ATR)', .3, 0, 5, .1), IP('max', 'Nombre maximum', 12, 1, 50)], (w, p) => {
  const atr = hRMA(hTR(w), 14), zs = [];
  for (let i = 2; i < w.n; i++){
    const a = atr[i]; if (!isFinite(a)) continue;
    if (w.L[i] > w.H[i-2] && w.L[i] - w.H[i-2] >= p.min * a) zs.push({i1:i - 1, i0:i, bull:true, lo:w.H[i-2], hi:w.L[i]});
    else if (w.H[i] < w.L[i-2] && w.L[i-2] - w.H[i] >= p.min * a) zs.push({i1:i - 1, i0:i, bull:false, lo:w.H[i], hi:w.L[i-2]});
  }
  const zones = [];
  for (const z of zs.slice(-fl(p.max))){
    let end = null; for (let x = z.i0 + 1; x < w.n; x++){ if (z.bull ? w.L[x] <= z.lo : w.H[x] >= z.hi){ end = x; break; } }
    zones.push({i1:z.i1, i2:end, lo:z.lo, hi:z.hi, col:hexA(z.bull ? GR : RD, end == null ? .2 : .06)});
  }
  return {zones};
});
def('swings', 'Swings', 'Sommets et creux (HH, HL, LH, LL)', 'Structure de marché', false, [IP('len', 'Longueur du swing', 5, 2, 50)], (w, p) => {
  const {pH, pL} = structScan(w, fl(p.len)), marks = [];
  pH.forEach((q, k) => { const up = k > 0 && q.v > pH[k-1].v; marks.push({i:q.i, v:q.v, pos:'above', col:k ? (up ? GR : RD) : PU, label:k ? (up ? 'HH' : 'LH') : 'H'}); });
  pL.forEach((q, k) => { const up = k > 0 && q.v > pL[k-1].v; marks.push({i:q.i, v:q.v, pos:'below', col:k ? (up ? GR : RD) : PU, label:k ? (up ? 'HL' : 'LL') : 'L'}); });
  return {marks:marks.slice(-100)};
});
def('zz', 'ZigZag', 'ZigZag', 'Structure de marché', false, [IP('len', 'Longueur du swing', 5, 2, 50)], (w, p) => {
  const {pH, pL} = structScan(w, fl(p.len)), all = pH.map(q => ({i:q.i, v:q.v, t:q.t, h:true})).concat(pL.map(q => ({i:q.i, v:q.v, t:q.t, h:false}))).sort((a, b) => a.t - b.t || a.i - b.i), pts = [];
  for (const q of all){ const last = pts[pts.length - 1]; if (last && last.h === q.h){ if (q.h ? q.v > last.v : q.v < last.v) pts[pts.length - 1] = q; } else pts.push(q); }
  const segs = []; for (let k = 1; k < pts.length; k++) segs.push({i1:pts[k-1].i, v1:pts[k-1].v, i2:pts[k].i, v2:pts[k].v, col:0, w:1.6});
  return {segs:segs.slice(-80)};
});
def('frac', 'Fractales', 'Fractales de Williams', 'Structure de marché', false, [], w => {
  const marks = []; for (let q = 2; q < w.n - 2; q++){ if (pvH(w, q, 2)) marks.push({i:q, v:w.H[q], pos:'above', col:RD}); if (pvL(w, q, 2)) marks.push({i:q, v:w.L[q], pos:'below', col:GR}); }
  return {marks:marks.slice(-150)};
});
def('afib', 'Auto Fib', 'Fibonacci automatique', 'Niveaux et sessions', false, [IP('len', 'Longueur du swing', 10, 2, 60)], (w, p) => {
  const {pH, pL} = structScan(w, fl(p.len)), h = pH[pH.length - 1], l = pL[pL.length - 1]; if (!h || !l) return {};
  const A = h.i < l.i ? h : l, B = h.i < l.i ? l : h, LV = [0, .236, .382, .5, .618, .786, 1], FC = ['#8A93A6', RD, OR, '#E6C84A', GR, '#59D2FF', '#8A93A6'];
  return {segs:LV.map((L, i) => { const v = B.v + (A.v - B.v) * L; return {i1:Math.min(A.i, B.i), v1:v, i2:w.n - 1, v2:v, col:FC[i], w:1, label:`${L}  ${v.toFixed(INST.d)}`, lpos:'start'}; })};
});
const dayGroups = w => { const days = []; let key = -1; for (let i = 0; i < w.n; i++){ const k = Math.floor(w.T[i] / 86400); if (k !== key){ key = k; days.push({s:i, e:i, H:w.H[i], L:w.L[i], C:w.C[i]}); } const d = days[days.length - 1]; d.e = i; d.H = Math.max(d.H, w.H[i]); d.L = Math.min(d.L, w.L[i]); d.C = w.C[i]; } return days; };
def('pivots', 'Pivots', 'Points pivots (jour)', 'Niveaux et sessions', false, [], w => {
  if (w.tf >= 1440) return {}; const days = dayGroups(w), segs = [];
  for (let d = 1; d < days.length; d++){
    const q = days[d - 1], P = (q.H + q.L + q.C) / 3, R = q.H - q.L, last = d === days.length - 1;
    for (const [nm, v, c] of [['P', P, OR], ['R1', 2 * P - q.L, RD], ['S1', 2 * P - q.H, GR], ['R2', P + R, RD], ['S2', P - R, GR], ['R3', q.H + 2 * (P - q.L), RD], ['S3', q.L - 2 * (q.H - P), GR]])
      segs.push({i1:days[d].s, v1:v, i2:days[d].e, v2:v, col:c, w:1, label:last ? nm : null, lpos:'end'});
  }
  return {segs};
});
def('pdhl', 'PDH/PDL', 'Plus haut et plus bas de la veille', 'Niveaux et sessions', false, [], w => {
  if (w.tf >= 1440) return {}; const days = dayGroups(w), segs = [];
  for (let d = 1; d < days.length; d++){ const q = days[d - 1], last = d === days.length - 1; segs.push({i1:days[d].s, v1:q.H, i2:days[d].e, v2:q.H, col:RD, w:1.2, dash:[5, 4], label:last ? 'PDH' : null, lpos:'end'}, {i1:days[d].s, v1:q.L, i2:days[d].e, v2:q.L, col:GR, w:1.2, dash:[5, 4], label:last ? 'PDL' : null, lpos:'end'}); }
  return {segs};
});
def('sess', 'Sessions', 'Sessions de marché (Asie, Londres, New York)', 'Niveaux et sessions', false, [IP('a', 'Asie (1 = oui, 0 = non)', 1, 0, 1), IP('l', 'Londres (1 = oui, 0 = non)', 1, 0, 1), IP('n', 'New York (1 = oui, 0 = non)', 1, 0, 1)], (w, p) => {
  if (w.tf >= 240) return {}; const zones = [];
  for (const [on, name, h0, h1, c] of [[p.a, 'Asie', 0, 8, BL], [p.l, 'Londres', 7, 16, OR], [p.n, 'New York', 13, 21, GR]]){
    if (!on) continue; let st = -1, day = -1;
    for (let i = 0; i <= w.n; i++){
      let inS = false, k = -1; if (i < w.n){ const hr = (w.T[i] % 86400) / 3600; k = Math.floor(w.T[i] / 86400); inS = hr >= h0 && hr < h1; }
      if (st >= 0 && (!inS || k !== day)){ zones.push({i1:st, i2:i - 1, full:true, col:hexA(c, .07), label:name, lcol:c}); st = -1; }
      if (inS && st < 0){ st = i; day = k; }
    }
  }
  return {zones};
});
def('lreg', 'LinReg', 'Canal de régression linéaire', 'Tendance', false, [IP('len', 'Période', 100, 5, 500), IP('m', 'Écarts-types', 2, .1, 10, .1)], (w, p, col) => {
  const n = w.n, L = Math.min(fl(p.len), n), mid = mk(n), up = mk(n), lo = mk(n); let sx = 0, sy = 0, sxy = 0, sxx = 0;
  for (let k = 0; k < L; k++){ const y = w.C[n - L + k]; sx += k; sy += y; sxy += k * y; sxx += k * k; }
  const b = (L * sxy - sx * sy) / ((L * sxx - sx * sx) || 1), a = (sy - b * sx) / L; let ss = 0;
  for (let k = 0; k < L; k++){ const e = w.C[n - L + k] - (a + b * k); ss += e * e; }
  const sd = Math.sqrt(ss / L); for (let k = 0; k < L; k++){ const v = a + b * k; mid[n - L + k] = v; up[n - L + k] = v + p.m * sd; lo[n - L + k] = v - p.m * sd; }
  return {lines:[{d:mid, col:0, w:1.4, dash:[5, 4]}, {d:up, col:0}, {d:lo, col:0}], fill:[{a:up, b:lo, col:hexA(col, .07)}]};
});
def('allig', 'Alligator', 'Alligator de Williams', 'Tendance', false, [], w => { const hl = hZip(w.H, w.L, (a, b) => (a + b) / 2); return {lines:[{d:hRMA(hl, 13), col:BL, w:1.4, shift:8}, {d:hRMA(hl, 8), col:RD, w:1.4, shift:5}, {d:hRMA(hl, 5), col:GR, w:1.4, shift:3}]}; });
def('macross', 'MA Cross', 'Croisement de moyennes (EMA)', 'Moyennes mobiles', false, [IP('f', 'Rapide', 9), IP('s', 'Lente', 21)], (w, p) => {
  const f = hEMA(w.C, p.f), s = hEMA(w.C, p.s), marks = [];
  for (let i = 1; i < w.n; i++){ if (f[i-1] <= s[i-1] && f[i] > s[i]) marks.push({i, v:w.L[i], pos:'below', col:GR}); else if (f[i-1] >= s[i-1] && f[i] < s[i]) marks.push({i, v:w.H[i], pos:'above', col:RD}); }
  return {lines:[{d:f, col:0, w:1.5}, {d:s, col:OR, w:1.5}], marks:marks.slice(-60)};
});
def('ppo', 'PPO', 'Oscillateur de prix en pourcentage (PPO)', 'Oscillateurs', true, [IP('f', 'Rapide', 12), IP('s', 'Lente', 26), IP('sg', 'Signal', 9)], (w, p) => {
  const m = hZip(hEMA(w.C, p.f), hEMA(w.C, p.s), (a, b) => 100 * (a - b) / b), sg = hEMA(m, p.sg); return {hist:[{d:hZip(m, sg, (a, b) => a - b), chg:true}], lines:[{d:m, col:BL}, {d:sg, col:OR}], levels:[0]};
});
def('pctb', '%B', 'Bollinger %B', 'Volatilité', true, [IP('len', 'Période', 20), IP('m', 'Écarts-types', 2, .1, 10, .1)], (w, p) => {
  const b = hSMA(w.C, p.len), sd = hSD(w.C, p.len), o = mk(w.n); for (let i = 0; i < w.n; i++){ const u = b[i] + p.m * sd[i], l = b[i] - p.m * sd[i]; o[i] = (w.C[i] - l) / (u - l); } return {lines:[{d:o, col:0}], levels:[0, .5, 1]};
});
def('bbw', 'BBW', 'Largeur des bandes de Bollinger (BBW)', 'Volatilité', true, [IP('len', 'Période', 20), IP('m', 'Écarts-types', 2, .1, 10, .1)], (w, p) => {
  const b = hSMA(w.C, p.len), sd = hSD(w.C, p.len); return {lines:[{d:hZip(b, sd, (x, y) => 100 * 2 * p.m * y / x), col:0}]};
});
def('hv', 'HV', 'Volatilité historique (HV)', 'Volatilité', true, [IP('len', 'Période', 10)], (w, p) => {
  const r = mk(w.n); for (let i = 1; i < w.n; i++) r[i] = Math.log(w.C[i] / w.C[i-1]); const ann = Math.sqrt(252 * 1440 / Math.max(1, w.tf)); return {lines:[{d:hMap(hSD(r, p.len), x => x * ann * 100), col:0}]};
});
def('dpo', 'DPO', 'Oscillateur de prix sans tendance (DPO)', 'Oscillateurs', true, [IP('len', 'Période', 21)], (w, p) => {
  const L = fl(p.len), k = Math.floor(L / 2) + 1, s = hSMA(w.C, L), o = mk(w.n); for (let i = k; i < w.n; i++) o[i] = w.C[i - k] - s[i]; return {lines:[{d:o, col:0}], levels:[0]};
});
def('coppock', 'Coppock', 'Courbe de Coppock', 'Oscillateurs', true, [], w => {
  const roc = n => hZip(w.C, hLag(w.C, n), (a, b) => 100 * (a / b - 1)); return {lines:[{d:hWMA(hZip(roc(14), roc(11), (a, b) => a + b), 10), col:0}], levels:[0]};
});
def('vortex', 'Vortex', 'Indicateur Vortex (VI)', 'Tendance', true, [IP('len', 'Période', 14)], (w, p) => {
  const n = w.n, vp = mk(n), vm = mk(n); for (let i = 1; i < n; i++){ vp[i] = Math.abs(w.H[i] - w.L[i-1]); vm[i] = Math.abs(w.L[i] - w.H[i-1]); }
  const st = hSMA(hTR(w), p.len); return {lines:[{d:hZip(hSMA(vp, p.len), st, (a, b) => a / b), col:GR}, {d:hZip(hSMA(vm, p.len), st, (a, b) => a / b), col:RD}], levels:[1]};
});
def('elder', 'Elder Ray', 'Puissance haussière et baissière (Elder Ray)', 'Oscillateurs', true, [IP('len', 'Période', 13)], (w, p) => { const e = hEMA(w.C, p.len); return {hist:[{d:hZip(w.H, e, (a, b) => a - b)}, {d:hZip(w.L, e, (a, b) => a - b)}], levels:[0]}; });
def('volosc', 'Vol Osc', 'Oscillateur de volume', 'Volume', true, [IP('f', 'Rapide', 5), IP('s', 'Lente', 10)], (w, p) => ({hist:[{d:hZip(hEMA(w.V, p.f), hEMA(w.V, p.s), (a, b) => 100 * (a - b) / b), chg:true}], levels:[0]}));
def('chaikin', 'Chaikin', 'Oscillateur de Chaikin', 'Volume', true, [IP('f', 'Rapide', 3), IP('s', 'Lente', 10)], (w, p) => { const ad = hCum(mfv(w)); return {lines:[{d:hZip(hEMA(ad, p.f), hEMA(ad, p.s), (a, b) => a - b), col:0}], levels:[0]}; });

const IND_CATS = ['Structure de marché', 'Niveaux et sessions', 'Moyennes mobiles', 'Tendance', 'Volatilité', 'Oscillateurs', 'Volume'];
function indLabel(inst){ const sp = IND[inst.type]; return sp.short + (sp.params.length ? ' ' + sp.params.map(q => inst.params[q.k]).join(' ') : ''); }
function newInd(type){ const sp = IND[type], params = {}; sp.params.forEach(q => params[q.k] = q.v); return {uid:'i' + Math.random().toString(36).slice(2, 8), type, params, color:PAL[S.inds.length % PAL.length], vis:true}; }
let INDC = {key:'', res:[]};
function computeInds(){
  const A = getAgg(), g = groupOf(A, SS.cursor), act = S.inds.filter(i => i.vis && IND[i.type]);
  const key = [tfMin(), SS.id, SS.cursor, D.t.length, act.map(i => i.uid + JSON.stringify(i.params) + i.color).join('|')].join('#');
  if (INDC.key === key) return INDC;
  const P = partial(A, g, SS.cursor), W = 1500, g0 = Math.max(0, g - W + 1), n = g - g0 + 1;
  const w = {n, g0, tf:tfMin(), O:new Float64Array(n), H:new Float64Array(n), L:new Float64Array(n), C:new Float64Array(n), V:new Float64Array(n), T:new Float64Array(n)};
  for (let j = 0; j < n; j++){
    const k = g0 + j;
    if (k === g){ w.O[j] = P.o; w.H[j] = P.h; w.L[j] = P.l; w.C[j] = P.c; w.V[j] = P.v; w.T[j] = P.t; }
    else { w.O[j] = A.O[k]; w.H[j] = A.H[k]; w.L[j] = A.L[k]; w.C[j] = A.C[k]; w.V[j] = A.V[k]; w.T[j] = A.T[k]; }
  }
  const res = [];
  for (const inst of act){ try { res.push({inst, spec:IND[inst.type], out:IND[inst.type].fn(w, inst.params, inst.color), n, g0, label:indLabel(inst)}); } catch (err){} }
  return INDC = {key, res};
}

/* ---------- Trades ---------- */
function paramsAt(tr, c){
  let sl = tr.sl, tp = tr.tp, price = tr.price;
  for (const m of tr.mods.slice().sort((a, b) => a.idx - b.idx)) if (m.idx <= c){ if (m.sl !== undefined) sl = m.sl; if (m.tp !== undefined) tp = m.tp; if (m.price !== undefined) price = m.price; }
  return {sl, tp, price};
}
function resolve(tr){
  if (tr._v === VER) return tr._r;
  const sp = INST.sp, buy = tr.side === 'buy', mods = tr.mods.slice().sort((a, b) => a.idx - b.idx);
  let mi = 0, sl = tr.sl, tp = tr.tp, price = tr.price, fillIdx = -1, fillPrice = NaN, exitIdx = -1, exitPrice = NaN, reason = '';
  if (tr.kind === 'market'){ fillIdx = tr.placeIdx; fillPrice = tr.price; }
  for (let i = tr.placeIdx + 1; i <= LAST; i++){
    while (mi < mods.length && mods[mi].idx <= i - 1){ const m = mods[mi++]; if (m.sl !== undefined) sl = m.sl; if (m.tp !== undefined) tp = m.tp; if (m.price !== undefined) price = m.price; }
    if (tr.endIdx != null && i > tr.endIdx) break;
    const H = D.h[i], L = D.l[i];
    if (fillIdx < 0){
      let hit;
      if (buy) hit = tr.kind === 'limit' ? L + sp <= price : H + sp >= price;
      else hit = tr.kind === 'limit' ? H >= price : L <= price;
      if (hit){ fillIdx = i; fillPrice = price; }
      continue;
    }
    if (buy){
      if (sl != null && L <= sl){ exitIdx = i; exitPrice = sl; reason = 'Stop loss'; break; }
      if (tp != null && H >= tp){ exitIdx = i; exitPrice = tp; reason = 'Take profit'; break; }
    } else {
      if (sl != null && H + sp >= sl){ exitIdx = i; exitPrice = sl; reason = 'Stop loss'; break; }
      if (tp != null && L + sp <= tp){ exitIdx = i; exitPrice = tp; reason = 'Take profit'; break; }
    }
  }
  if (exitIdx < 0 && fillIdx >= 0 && tr.endIdx != null){ exitIdx = tr.endIdx; exitPrice = buy ? D.c[exitIdx] : D.c[exitIdx] + sp; reason = 'Manuel'; }
  tr._v = VER; return tr._r = {fillIdx, fillPrice, exitIdx, exitPrice, reason};
}
function tradePnl(tr, entry, exit){
  const diff = tr.side === 'buy' ? exit - entry : entry - exit;
  return diff * tr.size * INST.cs * (INST.inv ? 1 / exit : 1) - S.commission * tr.size * 2;
}
function computeAccount(){
  const c = SS.cursor; let realized = 0, floating = 0; const live = [], closed = [];
  for (const tr of SS.trades){
    if (c < tr.placeIdx) continue;
    const r = resolve(tr);
    if (r.fillIdx >= 0 && c >= r.fillIdx){
      if (r.exitIdx >= 0 && c >= r.exitIdx){ const p = tradePnl(tr, r.fillPrice, r.exitPrice); realized += p; closed.push({tr, r, pnl:p}); }
      else { const px = tr.side === 'buy' ? D.c[c] : D.c[c] + INST.sp; const p = tradePnl(tr, r.fillPrice, px); floating += p; live.push({tr, r, state:'open', pnl:p, px, par:paramsAt(tr, c)}); }
    } else if (!(tr.endIdx != null && c >= tr.endIdx)) live.push({tr, r, state:'pending', pnl:0, par:paramsAt(tr, c)});
  }
  closed.sort((a, b) => a.r.exitIdx - b.r.exitIdx);
  return {realized, floating, balance:SS.balance0 + realized, equity:SS.balance0 + realized + floating, live, closed};
}
function beTrade(tr, quiet){
  const q = ACC.live.find(z => z.tr.id === tr.id && z.state === 'open'); if (!q) return false;
  const buy = tr.side === 'buy', entry = q.r.fillPrice, c = D.c[SS.cursor], inProfit = buy ? c > entry : c + INST.sp < entry;
  if (!inProfit){ if (!quiet) toast('Pas encore en gain : le stop à l\u2019entrée serait déjà touché.', 'down'); return false; }
  const cur = q.par.sl; if (cur != null && (buy ? cur >= entry : cur <= entry)){ if (!quiet) toast('Le stop est déjà à l\u2019entrée ou mieux.'); return false; }
  modTrade(tr, {sl:rp(entry)}); if (!quiet) toast('Stop à l\u2019entrée (BE)', 'up'); return true;
}
function beAll(){
  const list = ACC.live.filter(q => q.state === 'open'); if (!list.length){ toast('Aucune position ouverte.'); return; }
  let n = 0; for (const q of list) if (beTrade(q.tr, true)) n++;
  toast(n ? `BE sur ${n} position${n > 1 ? 's' : ''}` : 'Aucune position en gain à passer à BE.', n ? 'up' : '');
}
function bump(){ VER++; save(); refresh(); }
function rp(x){ return +x.toFixed(INST.d); }
function modTrade(tr, patch){
  let m = tr.mods.find(x => x.idx === SS.cursor);
  if (!m){ m = {idx:SS.cursor}; tr.mods.push(m); }
  Object.assign(m, patch); bump();
}
function closeTrade(id){
  const tr = SS.trades.find(t => t.id === id); if (!tr) return;
  tr.endIdx = SS.cursor; bump();
}
function atr(){
  const A = getAgg(), g = groupOf(A, SS.cursor), P = partial(A, g, SS.cursor);
  const get = k => k === g ? P : {h:A.H[k], l:A.L[k], c:A.C[k]};
  if (g < 15) return 0;
  let s = 0;
  for (let k = g - 13; k <= g; k++){ const x = get(k), pc = get(k - 1).c; s += Math.max(x.h - x.l, Math.abs(x.h - pc), Math.abs(x.l - pc)); }
  return s / 14;
}
function readTicket(){
  return {lots:parseFloat($('#iLots').value), sl:parseFloat($('#iSl').value), tp:parseFloat($('#iTp').value), price:parseFloat($('#iPrice').value), risk:parseFloat($('#iRisk').value)};
}
function pushTrade(side, k, price, sl, tp, lots){
  SS.trades.push({id:SS.nextId++, side, kind:k, size:Math.round(lots * 100) / 100, placeIdx:SS.cursor, price:rp(price), sl, tp, mods:[], endIdx:null});
  const lbl = k === 'market' ? (side === 'buy' ? 'Achat' : 'Vente') : `Ordre ${k === 'limit' ? 'limite' : 'stop'} ${side === 'buy' ? 'achat' : 'vente'}`;
  toast(`${lbl} ${lots.toFixed(2)} à ${rp(price).toFixed(INST.d)}`, side === 'buy' ? 'up' : 'down');
  bump();
}
function place(side){
  const T = readTicket(), c = D.c[SS.cursor], sp = INST.sp;
  if (!(T.lots >= 0.01)){ toast('La taille minimale est de 0.01 lot.', 'down'); return; }
  let price;
  if (kind === 'market') price = side === 'buy' ? c + sp : c;
  else {
    price = T.price;
    if (!isFinite(price)){ toast("Indique un prix d'entrée pour cet ordre.", 'down'); return; }
    const ask = c + sp, bid = c;
    const ok = side === 'buy' ? (kind === 'limit' ? price < ask : price > ask) : (kind === 'limit' ? price > bid : price < bid);
    if (!ok){ const below = (side === 'buy') === (kind === 'limit'); toast(`Prix invalide : il doit être ${below ? 'sous' : 'au-dessus du'} ${below ? 'le prix actuel' : 'prix actuel'} pour cet ordre.`, 'down'); return; }
  }
  const dir = side === 'buy' ? -1 : 1;
  const sl = T.sl > 0 ? rp(price + dir * T.sl * INST.pip) : null;
  const tp = T.tp > 0 ? rp(price - dir * T.tp * INST.pip) : null;
  pushTrade(side, kind, price, sl, tp, T.lots);
}
/* ---- aperçu d'ordre sur le graphique ---- */
function chBlocked(){
  const cs = SS && ACC ? challengeState() : null;
  if (cs && cs.st === 'failed'){ toast('Défi échoué : plus aucune position possible. Relance la période dans les réglages.', 'down'); return true; }
  return false;
}
function entryOf(dr){ const c = D.c[SS.cursor]; return dr.entry != null ? dr.entry : (dr.side === 'buy' ? c + INST.sp : c); }
function draftKind(dr){
  if (dr.entry == null) return 'market';
  const ref = dr.side === 'buy' ? D.c[SS.cursor] + INST.sp : D.c[SS.cursor];
  return dr.side === 'buy' ? (dr.entry < ref ? 'limit' : 'stop') : (dr.entry > ref ? 'limit' : 'stop');
}
function defaultDist(){ const T = readTicket(), a = atr() || INST.pip * 20; return {sl:T.sl > 0 ? T.sl * INST.pip : a, tp:T.tp > 0 ? T.tp * INST.pip : 2 * a}; }
function startDraft(side, fresh){
  if (chBlocked()) return;
  let dsl, dtp;
  if (DRAFT && !fresh){ const e0 = entryOf(DRAFT); dsl = DRAFT.sl != null ? Math.abs(e0 - DRAFT.sl) : null; dtp = DRAFT.tp != null ? Math.abs(DRAFT.tp - e0) : null; }
  else { const dd = defaultDist(); dsl = dd.sl; dtp = dd.tp; }
  const dr = {side, entry:null, sl:null, tp:null}, e = entryOf(dr), dir = side === 'buy' ? -1 : 1;
  dr.sl = dsl != null ? rp(e + dir * dsl) : null; dr.tp = dtp != null ? rp(e - dir * dtp) : null;
  DRAFT = dr; syncFields(); updateTicket(); updateDraftBar(); drawChart();
}
function syncFields(){
  if (!DRAFT) return; const e = entryOf(DRAFT), f = v => String(Math.round(Math.abs(v) / INST.pip * 10) / 10);
  $('#iSl').value = DRAFT.sl != null ? f(e - DRAFT.sl) : ''; $('#iTp').value = DRAFT.tp != null ? f(DRAFT.tp - e) : '';
  if (DRAFT.entry != null) $('#iPrice').value = DRAFT.entry.toFixed(INST.d);
}
function fieldsToDraft(){
  if (!DRAFT) return; const e = entryOf(DRAFT), dir = DRAFT.side === 'buy' ? -1 : 1, T = readTicket();
  DRAFT.sl = T.sl > 0 ? rp(e + dir * T.sl * INST.pip) : null; DRAFT.tp = T.tp > 0 ? rp(e - dir * T.tp * INST.pip) : null;
}
function setDraftLevel(kd, price){
  if (!DRAFT) return; const v = rp(price);
  if (kd === 'entry'){
    const dsl = DRAFT.sl != null ? Math.abs(entryOf(DRAFT) - DRAFT.sl) : null, dtp = DRAFT.tp != null ? Math.abs(DRAFT.tp - entryOf(DRAFT)) : null, dir = DRAFT.side === 'buy' ? -1 : 1;
    const ref = DRAFT.side === 'buy' ? D.c[SS.cursor] + INST.sp : D.c[SS.cursor];
    DRAFT.entry = Math.abs(v - ref) <= INST.pip * 2 ? null : v;
    const e = entryOf(DRAFT);
    if (dsl != null) DRAFT.sl = rp(e + dir * dsl);
    if (dtp != null) DRAFT.tp = rp(e - dir * dtp);
  } else DRAFT[kd] = v;
  syncFields(); updateTicket(); updateDraftBar();
}
function updateDraftBar(){
  const el = $('#draftbar'); if (!DRAFT || !SS){ el.hidden = true; return; }
  const dr = DRAFT, buy = dr.side === 'buy', e = entryOf(dr), k = draftKind(dr), lots = Math.max(0, readTicket().lots || 0);
  const pl = p => tradePnl({side:dr.side, size:lots}, e, p);
  const risk = dr.sl != null ? pl(dr.sl) : null, gain = dr.tp != null ? pl(dr.tp) : null;
  const kl = k === 'market' ? 'au marché' : (k === 'limit' ? 'ordre limite' : 'ordre stop');
  el.hidden = false;
  el.title = "Glisse les lignes SL, TP et l'entrée sur le graphique. Entrée valide, Échap annule.";
  el.innerHTML = `<span class="side ${dr.side}">${buy ? 'Achat' : 'Vente'}</span><span class="dt">${lots.toFixed(2)} lot${k === 'market' ? '' : (k === 'limit' ? ' limite' : ' stop')}${risk != null && risk < 0 ? '  risque ' + (-risk / ACC.balance * 100).toFixed(1) + ' %' : ''}${risk != null && gain != null && risk < 0 ? '  1:' + (gain / -risk).toFixed(1) : ''}</span>` +
    `<button class="btn sm go" data-d="ok">Valider</button><button class="btn sm" data-d="no" title="Annuler (Échap)" aria-label="Annuler">\u2715</button>`;
}
function cancelDraft(){ DRAFT = null; updateDraftBar(); drawChart(); }
function confirmDraft(){
  if (!DRAFT || chBlocked()) return;
  const dr = DRAFT, buy = dr.side === 'buy', k = draftKind(dr), lots = readTicket().lots;
  if (!(lots >= 0.01)){ toast('La taille minimale est de 0.01 lot.', 'down'); return; }
  const e = entryOf(dr);
  if (dr.sl != null && (buy ? dr.sl >= e : dr.sl <= e)){ toast(`Le stop loss doit être ${buy ? 'sous' : 'au-dessus de'} l'entrée.`, 'down'); return; }
  if (dr.tp != null && (buy ? dr.tp <= e : dr.tp >= e)){ toast(`Le take profit doit être ${buy ? 'au-dessus de' : 'sous'} l'entrée.`, 'down'); return; }
  DRAFT = null; pushTrade(dr.side, k, e, dr.sl, dr.tp, lots);
}
function order(side){ if (chBlocked()) return; if ($('#quick').checked) place(side); else startDraft(side); }

/* ---- défi prop firm ---- */
function challengeState(){
  const ch = SS.challenge; if (!ch || !ch.on) return null;
  const goal = SS.balance0 * ch.target / 100, lim = SS.balance0 * ch.maxLoss / 100;
  const profit = ACC.balance - SS.balance0, eqPl = ACC.equity - SS.balance0;
  let st = 'run'; if (eqPl <= -lim) st = 'failed'; else if (profit >= goal) st = 'passed';
  return {st, goal, lim, profit, prog:clamp(profit / goal * 100, 0, 100), lossNow:Math.max(0, -eqPl)};
}
function placeChal(){
  const el = $('#chal'), c = $('#cw'); if (!el || !c) return;
  if (!S.chalPos){ el.style.left = ''; el.style.top = ''; el.style.right = ''; return; }
  const r = c.getBoundingClientRect(), w = el.offsetWidth || 180, h = el.offsetHeight || 90;
  el.style.right = 'auto'; el.style.left = clamp(S.chalPos.x, 0, Math.max(0, r.width - w)) + 'px'; el.style.top = clamp(S.chalPos.y, 0, Math.max(0, r.height - h)) + 'px';
}
(() => {
  const el = $('#chal'); let dg = null;
  el.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; const r = el.getBoundingClientRect(); dg = {dx:e.clientX - r.left, dy:e.clientY - r.top}; el.setPointerCapture(e.pointerId); e.preventDefault(); });
  el.addEventListener('pointermove', e => { if (!dg) return; const c = $('#cw').getBoundingClientRect(); S.chalPos = {x:e.clientX - c.left - dg.dx, y:e.clientY - c.top - dg.dy}; placeChal(); });
  const end = () => { if (dg){ dg = null; save(); } };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  $('#chMin').onclick = () => { S.chalMin = !S.chalMin; el.classList.toggle('min', S.chalMin); save(); placeChal(); };
})();
function updateChal(){
  const el = $('#chal'), cs = SS && ACC ? challengeState() : null;
  if (!cs){ el.hidden = true; chPrev = null; return; }
  el.hidden = false; el.className = 'chal' + (cs.st === 'passed' ? ' ok' : cs.st === 'failed' ? ' ko' : '') + (S.chalMin ? ' min' : ''); placeChal();
  $('#chSt').textContent = cs.st === 'passed' ? 'Réussi' : cs.st === 'failed' ? 'Échoué' : 'En cours';
  $('#chPct').textContent = Math.round(cs.prog) + ' %'; $('#chBar').style.width = cs.prog + '%';
  $('#chAmt').textContent = `${money(cs.profit, true)} sur ${fmtMoney(cs.goal, SS.cur, false, 0)}`;
  $('#chLoss').textContent = `Perte ${(cs.lossNow / SS.balance0 * 100).toFixed(1)} % sur ${SS.challenge.maxLoss} %`;
  if (chPrev !== null && cs.st !== chPrev){
    if (cs.st === 'passed'){ toast('Défi réussi : objectif de profit atteint.', 'up'); stop(); }
    else if (cs.st === 'failed'){ toast('Défi échoué : perte maximale atteinte.', 'down'); stop(); DRAFT = null; }
  }
  chPrev = cs.st;
}

/* ---- écran de démarrage ---- */
let setupSel = 'XAUUSD', setupCur = '\u20ac';
function hideSetup(){ $('#setup').hidden = true; stars.stop(); }
function showSetup(){ stop(); DRAFT = null; renderSaved(); $('#nBack').hidden = !SS; updateChPrev(); $('#setup').hidden = false; $('#setup').scrollTop = 0; stars.start(); }
function selInst(){ return setupSel.startsWith('csv:') ? (csvs[setupSel] && csvs[setupSel].inst) : INSTR.find(i => i.sym === setupSel); }
function updateSelInfo(){
  const i = selInst();
  $('#selInfo').innerHTML = i ? `<span class="ic">${ico(i)}</span><span><small>Marché choisi</small><b>${esc(i.sym.replace('csv:', ''))}</b><em>${esc(i.name)}</em></span>` : '<small>Aucun marché choisi</small>';
}
function renderMkts(){
  const q = $('#mSearch').value.trim().toLowerCase(), box = $('#mkts'); box.innerHTML = '';
  const groups = [...new Set(INSTR.map(i => i.cat))].map(c => ({c, list:INSTR.filter(i => i.cat === c)}));
  const mine = Object.values(csvs).map(x => x.inst); if (mine.length) groups.push({c:'Vos données', list:mine});
  for (const g of groups){
    const list = g.list.filter(i => !q || (i.sym + ' ' + i.name + ' ' + i.cat).toLowerCase().includes(q)); if (!list.length) continue;
    const sec = document.createElement('section'); sec.className = 'cat';
    sec.innerHTML = `<div class="cath"><h3>${esc(g.c)}</h3><span class="cnt">${list.length} marché${list.length > 1 ? 's' : ''}</span></div><div class="tiles"></div>`;
    const tiles = sec.querySelector('.tiles');
    for (const i of list){
      const b = document.createElement('button'); b.type = 'button'; b.className = 'tile'; b.dataset.s = i.sym;
      b.innerHTML = `<span class="ic">${ico(i)}</span><span class="tx"><b>${esc(i.sym.replace('csv:', ''))}</b><small>${esc(i.name)}</small></span>`;
      b.setAttribute('aria-pressed', String(i.sym === setupSel));
      b.onclick = () => { setupSel = i.sym; $$('#mkts [data-s]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.s === setupSel))); updateSelInfo(); };
      tiles.appendChild(b);
    }
    box.appendChild(sec);
  }
  if (!q || 'importer csv données mt5 tradingview dukascopy'.includes(q)){
    const sec = document.createElement('section'); sec.className = 'cat';
    sec.innerHTML = `<div class="cath"><h3>Tes propres données</h3><span class="cnt">Fichier CSV</span></div><div class="tiles"><button type="button" class="tile"><span class="ic">${ico({sym:'csv:x', cat:''})}</span><span class="tx"><b>Importer un CSV</b><small>MT5, TradingView, Dukascopy</small></span></button></div>`;
    sec.querySelector('button').onclick = () => $('#file').click(); box.appendChild(sec);
  }
  if (!box.children.length) box.innerHTML = '<div class="empty" style="padding:6px">Aucun marché ne correspond à cette recherche.</div>';
  updateSelInfo();
}
function updateChPrev(){
  const cap = parseFloat($('#nCap').value) || 0, t = parseFloat($('#chT').value) || 0, l = parseFloat($('#chL').value) || 0, f = x => fmtMoney(x, setupCur, false, 0);
  $('#chPrev').innerHTML = `Objectif : <b>+${f(cap * t / 100)}</b>, soit un capital de <b>${f(cap * (1 + t / 100))}</b> à atteindre.<br>Perte maximale : <b>\u2212${f(cap * l / 100)}</b>, le défi est perdu sous <b>${f(cap * (1 - l / 100))}</b>.`;
}
function renderSaved(){
  const el = $('#saved'), list = Object.values(S.sessions).sort((a, b) => (b.updated || 0) - (a.updated || 0));
  if (!list.length){ el.innerHTML = '<div class="empty" style="padding:4px 0">Aucune session pour l\u2019instant. Crée la première avec le formulaire.</div>'; return; }
  el.innerHTML = list.map(x => {
    const pl = x.sum ? x.sum.bal - x.balance0 : 0, ch = x.challenge && x.challenge.on, pct = ch ? clamp(pl / (x.balance0 * x.challenge.target / 100) * 100, 0, 100) : 0;
    return `<div class="sit"><div><b>${esc(x.name)}</b><div class="m">${esc(x.sym.replace('csv:', ''))}, ${fmtMoney(pl, x.cur, true, 0)}${ch ? `, défi ${Math.round(pct)} %` : ''}</div></div><div class="acts"><button class="btn sm go" data-open="${x.id}">Reprendre</button><button class="btn sm" data-del="${x.id}">Supprimer</button></div></div>`;
  }).join('');
}
function createSession(){
  const sym = setupSel, cap = parseFloat($('#nCap').value);
  if (!(cap >= 100)){ toast('Indique un capital d\u2019au moins 100.', 'down'); return; }
  const on = $('#chOn').checked, target = parseFloat($('#chT').value), maxLoss = parseFloat($('#chL').value);
  if (on && !(target > 0 && maxLoss > 0)){ toast('Renseigne un objectif de profit et une perte maximale.', 'down'); return; }
  const isCsv = sym.startsWith('csv:'), inst = isCsv ? (csvs[sym] && csvs[sym].inst) : INSTR.find(i => i.sym === sym);
  if (!inst){ toast('Choisis un marché.', 'down'); return; }
  const n = Object.values(S.sessions).filter(x => x.sym === sym).length + 1;
  const name = $('#nName').value.trim() || `${sym.replace('csv:', '')} session ${n}`;
  const c0 = isCsv ? Math.floor(csvs[sym].data.t.length * .3) : START, id = 's' + Date.now().toString(36);
  S.sessions[id] = {id, name, sym, seed:Math.floor(Math.random() * 900000) + 1000, cursor:c0, maxSeen:c0, trades:[], draws:[], nextId:1, balance0:cap, cur:setupCur, challenge:{on, target, maxLoss}, created:Date.now(), updated:Date.now(), tf:S.tf};
  save(); openSession(id);
}


/* ---------- Navigation ---------- */
function nextCursor(base){
  if (base) return Math.min(LAST, SS.cursor + 1);
  const A = getAgg(), g = groupOf(A, SS.cursor);
  const t = SS.cursor === A.e[g] ? (g + 1 < A.n ? A.e[g+1] : LAST) : A.e[g];
  return Math.min(t, LAST);
}
function prevCursor(base){
  if (base) return Math.max(60, SS.cursor - 1);
  const A = getAgg(), g = groupOf(A, SS.cursor);
  return Math.max(60, g > 0 ? A.e[g-1] : 0);
}
function eventsBetween(a, b){
  let ev = false;
  for (const tr of SS.trades){
    if (tr.placeIdx > b) continue;
    const r = resolve(tr);
    if (tr.kind !== 'market' && r.fillIdx > a && r.fillIdx <= b){ toast(`Ordre ${tr.kind === 'limit' ? 'limite' : 'stop'} exécuté à ${r.fillPrice.toFixed(INST.d)}`, tr.side === 'buy' ? 'up' : 'down'); ev = true; }
    if (r.fillIdx >= 0 && r.exitIdx > a && r.exitIdx <= b){ const p = tradePnl(tr, r.fillPrice, r.exitPrice); toast(`${r.reason} touché, ${money(p, true)}`, p >= 0 ? 'up' : 'down'); ev = true; }
  }
  return ev;
}
function moveTo(nc){
  nc = clamp(nc, 60, LAST); const prev = SS.cursor; let ev = false;
  if (nc === prev && prev === LAST){ toast('Fin des données de cette période.'); stop(); return false; }
  SS.cursor = nc;
  if (nc > prev){ ev = eventsBetween(Math.max(prev, SS.maxSeen), nc); SS.maxSeen = Math.max(SS.maxSeen, nc); }
  save(); refresh(); return ev;
}
function step(dir, n, base){ let ev = false; for (let i = 0; i < n; i++){ const nc = dir > 0 ? nextCursor(base) : prevCursor(base); if (nc === SS.cursor && dir > 0){ moveTo(nc); break; } ev = moveTo(nc) || ev; if (ev && dir > 0 && S.pause) break; } return ev; }
function play(){
  if (playTimer) return;
  $('#lblPlay').textContent = 'Pause'; $('#icoPlay').innerHTML = '<path d="M3.5 2.5h3.5v11H3.5zM9 2.5h3.5v11H9z"/>';
  playTimer = setInterval(() => { const ev = moveTo(nextCursor(false)); if (ev && S.pause) stop(); }, Math.max(30, 1000 / S.speed));
}
function stop(){
  if (!playTimer) return; clearInterval(playTimer); playTimer = null;
  $('#lblPlay').textContent = 'Lecture'; $('#icoPlay').innerHTML = '<path d="M4 2.5v11L13 8z"/>';
}
function restartPlay(){ if (playTimer){ stop(); play(); } }

/* ---------- Chart ---------- */
const cv = $('#cv'), ctx = cv.getContext('2d'), cw = $('#cw');
let CW = 0, CH = 0, DPR = 1;
const lum = hex => { const h = String(hex).replace('#', ''), n = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16); return (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255; };
function readColors(){
  const cs = getComputedStyle(document.documentElement), g = n => cs.getPropertyValue(n).trim();
  C = {chart:g('--chart'), grid:g('--grid'), line:g('--line'), text:g('--text'), muted:g('--muted'), up:g('--up'), down:g('--down'), onUp:g('--on-up'), onDown:g('--on-down'), accent:g('--accent'), panel:g('--panel'), ind:{ema20:g('--ind1'), ema50:g('--ind2'), sma200:g('--ind3')}};
  const cc = S.cc || {}, el = document.getElementById('cw');
  C.cUp = cc.up || C.up; C.cDn = cc.dn || C.down; C.axis = cc.text || C.muted; C.border = cc.border || 'rgba(0,0,0,.55)';
  if (cc.grid) C.grid = cc.grid;
  const light = cc.bg && lum(cc.bg) > .55;
  if (cc.bg){ C.chart = cc.bg; if (light){ C.text = '#131B26'; if (!cc.text) C.axis = '#66768A'; } }
  C.onCUp = lum(C.cUp) > .6 ? '#0B0F14' : '#FFFFFF'; C.onCDn = lum(C.cDn) > .6 ? '#0B0F14' : '#FFFFFF';
  if (el){
    const set = (k, v) => v ? el.style.setProperty(k, v) : el.style.removeProperty(k);
    set('--chart', cc.bg || ''); set('--up', cc.up || ''); set('--down', cc.dn || '');
    set('--text', light ? '#131B26' : ''); set('--muted', light ? '#66768A' : ''); set('--panel', light ? '#FFFFFF' : ''); set('--line', light ? '#D3DAE4' : '');
  }
}
function resize(){
  const r = cw.getBoundingClientRect(); DPR = Math.min(window.devicePixelRatio || 1, 2);
  CW = Math.floor(r.width) - (window.innerWidth <= 900 ? 38 : 44); CH = Math.floor(r.height);
  placeChal(); placeFav();
  cv.width = CW * DPR; cv.height = CH * DPR; cv.style.width = CW + 'px'; cv.style.height = CH + 'px';
  drawChart();
}
function tagBox(x, y, text, bg, fg, border){
  ctx.font = '600 11px "Geist Mono", ui-monospace, monospace';
  const w = ctx.measureText(text).width + 12, h = 18, x0 = x - w;
  ctx.fillStyle = bg; ctx.fillRect(x0, y - h / 2, w, h);
  if (border){ ctx.strokeStyle = border; ctx.lineWidth = 1; ctx.strokeRect(x0 + .5, y - h / 2 + .5, w - 1, h - 1); }
  ctx.fillStyle = fg; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(text, x0 + 6, y + .5);
  return x0;
}
function fmtV(v){ if (!isFinite(v)) return '-'; if (v === 0) return '0'; const a = Math.abs(v); if (a >= 1e9) return (v / 1e9).toFixed(2) + 'B'; if (a >= 1e6) return (v / 1e6).toFixed(2) + 'M'; if (a >= 1e4) return (v / 1e3).toFixed(1) + 'K'; if (a >= 100) return v.toFixed(1); if (a >= 1) return v.toFixed(2); return v.toFixed(4); }
function drawInd(r, X, Y, kmin, kmax, PW, bw){
  const o = r.out, mainCol = r.inst.color, colOf = c => (c === 0 || c === undefined) ? mainCol : c, g0 = r.g0;
  const rng = sh => [Math.max(0, kmin - sh - g0 - 1), Math.min(r.n - 1, kmax - sh - g0 + 1)];
  for (const f of o.fill || []){
    const sh = f.shift || 0, [a, b] = rng(sh); let run = [], cl = null;
    const flush = () => { if (run.length > 1){ ctx.fillStyle = cl; ctx.beginPath(); run.forEach((q, i) => i ? ctx.lineTo(q.x, q.ya) : ctx.moveTo(q.x, q.ya)); for (let i = run.length - 1; i >= 0; i--) ctx.lineTo(run[i].x, run[i].yb); ctx.closePath(); ctx.fill(); } run = []; };
    for (let j = a; j <= b; j++){
      const a0 = f.a[j], b0 = f.b[j]; if (!isFinite(a0) || !isFinite(b0)){ flush(); continue; }
      const c = f.col || (a0 >= b0 ? f.up : f.dn);
      if (cl !== c){ const last = run[run.length - 1]; flush(); cl = c; if (last) run.push(last); }
      const x = X(g0 + j + sh); run.push({x, ya:Y(a0), yb:Y(b0)}); if (x > PW + 4) break;
    }
    flush();
  }
  for (const z of o.zones || []){
    const xa = X(g0 + z.i1), xb = z.i2 == null ? PW : X(g0 + z.i2); if (xb < -4 || xa > PW + 4) continue;
    const ya = z.full ? -3000 : Y(z.hi), yb = z.full ? 6000 : Y(z.lo), top = Math.min(ya, yb), hh = Math.abs(yb - ya), ww = Math.max(1, xb - xa);
    ctx.fillStyle = z.col; ctx.fillRect(xa, top, ww, hh);
    if (z.edge){ ctx.strokeStyle = z.edge; ctx.lineWidth = 1; ctx.strokeRect(xa + .5, top + .5, ww - 1, Math.max(1, hh - 1)); }
    if (z.label){ ctx.fillStyle = z.lcol || mainCol; ctx.font = '600 10px "Geist", system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(z.label, Math.max(xa, 0) + 4, z.full ? 46 : top + 3); }
  }
  for (const h of o.hist || []){
    const [a, b] = rng(0), wd = Math.max(1, Math.floor(bw * .7)), y0 = Y(0);
    for (let j = a; j <= b; j++){
      const v = h.d[j]; if (!isFinite(v)) continue;
      const up = h.cd ? h.cd[j] >= 0 : h.chg ? (j > 0 && isFinite(h.d[j-1]) ? v >= h.d[j-1] : true) : v >= 0;
      ctx.fillStyle = up ? C.cUp : C.cDn; ctx.globalAlpha = .72;
      const x = X(g0 + j), y = Y(v); ctx.fillRect(Math.round(x - wd / 2), Math.min(y, y0), wd, Math.max(1, Math.abs(y - y0)));
    }
    ctx.globalAlpha = 1;
  }
  for (const l of o.lines || []){
    const sh = l.shift || 0, [a, b] = rng(sh);
    ctx.strokeStyle = colOf(l.col); ctx.lineWidth = l.w || 1.4; if (l.dash) ctx.setLineDash(l.dash);
    ctx.beginPath(); let on = false;
    for (let j = a; j <= b; j++){ const v = l.d[j]; if (!isFinite(v)){ on = false; continue; } const x = X(g0 + j + sh), y = Y(v); on ? ctx.lineTo(x, y) : ctx.moveTo(x, y); on = true; }
    ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
  }
  for (const sg of o.segs || []){
    const x1 = X(g0 + sg.i1), x2 = X(g0 + sg.i2); if (x2 < -4 || x1 > PW + 4) continue;
    const y1 = Y(sg.v1), y2 = Y(sg.v2);
    ctx.strokeStyle = sg.col || mainCol; ctx.lineWidth = sg.w || 1.2; if (sg.dash) ctx.setLineDash(sg.dash);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
    if (sg.label){
      ctx.fillStyle = sg.lcol || sg.col || mainCol; ctx.font = '600 10px "Geist Mono", ui-monospace, monospace'; ctx.textBaseline = 'bottom';
      if (sg.lpos === 'end'){ ctx.textAlign = 'left'; ctx.fillText(sg.label, x2 + 4, y2 + 4); }
      else if (sg.lpos === 'start'){ ctx.textAlign = 'left'; ctx.fillText(sg.label, Math.max(x1, 0) + 4, y1 - 2); }
      else { ctx.textAlign = 'center'; ctx.fillText(sg.label, (x1 + x2) / 2, Math.min(y1, y2) - 3); }
    }
  }
  for (const m of o.marks || []){
    const x = X(g0 + m.i); if (x < -6 || x > PW + 6) continue;
    const y = Y(m.v), below = m.pos === 'below', yy = below ? y + 4 : y - 4;
    ctx.fillStyle = m.col || mainCol; ctx.beginPath();
    if (below){ ctx.moveTo(x, yy); ctx.lineTo(x - 4, yy + 7); ctx.lineTo(x + 4, yy + 7); } else { ctx.moveTo(x, yy); ctx.lineTo(x - 4, yy - 7); ctx.lineTo(x + 4, yy - 7); }
    ctx.closePath(); ctx.fill();
    if (m.label){ ctx.font = '600 10px "Geist Mono", ui-monospace, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = below ? 'top' : 'bottom'; ctx.fillText(m.label, x, below ? yy + 9 : yy - 9); }
  }
  for (const dt of o.dots || []){
    const [a, b] = rng(0);
    for (let j = a; j <= b; j++){ const v = dt.d[j]; if (!isFinite(v)) continue; ctx.fillStyle = dt.cd[j] > 0 ? C.cUp : C.cDn; ctx.fillRect(Math.round(X(g0 + j)) - 1.5, Math.round(Y(v)) - 1.5, 3, 3); }
  }
}
function drawSub(r, y0, h, PW, kmin, kmax){
  const o = r.out, y1 = y0 + h, lines = o.lines || [], hists = o.hist || []; let lo, hi;
  if (o.range){ const pd = (o.range[1] - o.range[0]) * .04; lo = o.range[0] - pd; hi = o.range[1] + pd; }
  else {
    lo = Infinity; hi = -Infinity;
    for (const l of lines.concat(hists)) for (let k = kmin; k <= kmax; k++){ const v = l.d[k - (l.shift || 0) - r.g0]; if (v !== undefined && isFinite(v)){ if (v < lo) lo = v; if (v > hi) hi = v; } }
    if (hists.length){ lo = Math.min(lo, 0); hi = Math.max(hi, 0); }
    for (const lv of o.levels || []){ lo = Math.min(lo, lv); hi = Math.max(hi, lv); }
    if (!isFinite(lo) || !isFinite(hi)){ lo = 0; hi = 1; }
    const pd = (hi - lo) * .1 || Math.abs(hi) * .05 || 1; hi += pd; if (!hists.length || lo < 0) lo -= pd;
  }
  if (!(hi > lo)) hi = lo + 1;
  const top = y0 + 20, bot = y1 - 6, Y = v => top + (1 - (v - lo) / (hi - lo)) * (bot - top), pOf = y => lo + (1 - (y - top) / (bot - top)) * (hi - lo);
  ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, Math.round(y0) + .5); ctx.lineTo(CW, Math.round(y0) + .5); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.rect(0, y0 + 1, PW, h - 1); ctx.clip();
  for (const lv of o.levels || []){ const y = Math.round(Y(lv)) + .5; ctx.strokeStyle = C.line; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(PW, y); ctx.stroke(); ctx.setLineDash([]); }
  drawInd(r, GEO.xOf, Y, kmin, GEO.g + 80, PW, V.bw);
  ctx.restore();
  ctx.font = '11px "Geist Mono", ui-monospace, monospace'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillStyle = C.axis;
  if (o.range){ for (const v of [o.range[0], (o.range[0] + o.range[1]) / 2, o.range[1]]) ctx.fillText(fmtV(v), PW + 8, Y(v)); }
  else for (const q of [top, (top + bot) / 2, bot]) ctx.fillText(fmtV(pOf(q)), PW + 8, q);
  ctx.fillStyle = r.inst.color; ctx.fillRect(8, y0 + 7, 8, 8); ctx.fillStyle = C.muted; ctx.font = '600 11px "Geist", system-ui, sans-serif'; ctx.fillText(r.label, 22, y0 + 11);
  return {y0, y1, pOf};
}
function updateLegendVals(hk){
  for (const r of INDC.res){
    const el = document.querySelector(`#legend [data-u="${r.inst.uid}"] .lv`); if (!el) continue;
    const parts = [], fm = v => r.spec.pane ? fmtV(v) : v.toFixed(INST.d);
    for (const l of (r.out.lines || []).slice(0, 3)){ const v = l.d[hk - (l.shift || 0) - r.g0]; if (v !== undefined && isFinite(v)) parts.push(`<span style="color:${l.col === 0 || l.col === undefined ? r.inst.color : l.col}">${fm(v)}</span>`); }
    for (const h of (r.out.hist || []).slice(0, 1)){ const v = h.d[hk - r.g0]; if (v !== undefined && isFinite(v)) parts.push(`<span>${fmtV(v)}</span>`); }
    const html = parts.join(' '); if (el._h !== html){ el._h = html; el.innerHTML = html; }
  }
}
function drawChart(){
  if (!D || !SS || CW < 60 || CH < 60 || !C.chart) return;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.fillStyle = C.chart; ctx.fillRect(0, 0, CW, CH);
  const AX = 72, AY = 24, PW = CW - AX, PH = CH - AY, TOP = 40;
  const A = getAgg(), cur = SS.cursor, g = groupOf(A, cur), bw = V.bw, P = partial(A, g, cur);
  const IC = computeInds(), subs = IC.res.filter(r => r.spec.pane), ovl = IC.res.filter(r => !r.spec.pane);
  const subH = subs.length ? Math.floor(Math.min(subs.length * 128, PH * .52) / subs.length) : 0, MH = PH - subH * subs.length, BOT = MH - 16;
  const getC = k => k === g ? P : {o:A.O[k], h:A.H[k], l:A.L[k], c:A.C[k], t:A.T[k]};
  V.off = clamp(V.off, -(g - 3), PW / bw - 3);
  const kmin = Math.max(0, Math.floor(g + V.off + .5 - PW / bw) - 1), kmax = Math.min(g, Math.ceil(g + V.off + .5));
  let hi = -Infinity, lo = Infinity;
  for (let k = kmin; k <= kmax; k++){ const c = getC(k); if (c.h > hi) hi = c.h; if (c.l < lo) lo = c.l; }
  if (!isFinite(hi) || kmax < kmin){ hi = P.h; lo = P.l; }
  for (const r of ovl) for (const l of r.out.lines || []){ const sh = l.shift || 0; for (let k = kmin; k <= kmax; k++){ const v = l.d[k - sh - r.g0]; if (v !== undefined && isFinite(v)){ if (v > hi) hi = v; if (v < lo) lo = v; } } }
  const pad = (hi - lo) * .07 || hi * .001; hi += pad; lo -= pad;
  if (V.man){ lo = V.man.lo; hi = V.man.hi; }
  const yOf = p => TOP + (1 - (p - lo) / (hi - lo)) * (BOT - TOP);
  const pOf = y => lo + (1 - (y - TOP) / (BOT - TOP)) * (hi - lo);
  const xOf = k => PW - (V.off + (g - k) + .5) * bw;
  GEO = {AX, AY, PW, PH, MH, TOP, BOT, lo, hi, yOf, pOf, xOf, A, g, kmin, kmax, getC, panes:[]};
  levels = [];
  const d = INST.d, tags = [];

  /* grille */
  ctx.font = '11px "Geist Mono", ui-monospace, monospace'; ctx.textBaseline = 'middle'; ctx.lineWidth = 1;
  const stp = niceStep((hi - lo) / Math.max(3, (BOT - TOP) / 64));
  for (let p = Math.ceil(lo / stp) * stp; p <= hi; p += stp){
    const y = Math.round(yOf(p)) + .5;
    if (!(S.cc && S.cc.nogrid)){ ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(PW, y); ctx.stroke(); }
    ctx.fillStyle = C.axis; ctx.textAlign = 'left'; ctx.fillText(p.toFixed(d), PW + 8, y);
  }
  const every = Math.max(1, Math.ceil(110 / bw)), tfm = tfMin();
  for (let k = Math.ceil(kmin / every) * every; k <= kmax; k += every){
    const x = Math.round(xOf(k)) + .5, x2 = dparts(A.T[k]);
    if (!(S.cc && S.cc.nogrid)){ ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, PH); ctx.stroke(); }
    ctx.fillStyle = C.axis; ctx.textAlign = 'center';
    ctx.fillText(tfm >= 43200 ? `${MO[x2.mo]} ${String(x2.y).slice(2)}` : tfm >= 1440 ? `${p2(x2.d)} ${MO[x2.mo]}` : (x2.h === 0 && x2.mi === 0 ? `${x2.d} ${MO[x2.mo]}` : `${p2(x2.h)}:${p2(x2.mi)}`), x, PH + AY / 2 + 1);
  }
  ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(PW + .5, 0); ctx.lineTo(PW + .5, CH); ctx.moveTo(0, PH + .5); ctx.lineTo(PW, PH + .5); ctx.stroke();

  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, PW, MH); ctx.clip();

  /* bougies */
  if (S.ctype === 'line'){
    ctx.strokeStyle = C.text; ctx.lineWidth = 1.6; ctx.beginPath();
    for (let k = kmin; k <= kmax; k++){ const x = xOf(k), y = yOf(getC(k).c); k === kmin ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke(); ctx.lineWidth = 1;
  } else {
    const w = Math.max(1, Math.floor(bw * .72));
    for (let k = kmin; k <= kmax; k++){
      const c = getC(k), x = xOf(k), col = c.c >= c.o ? C.cUp : C.cDn, xm = Math.round(x) + (w % 2 ? .5 : 0);
      ctx.strokeStyle = col; ctx.fillStyle = col;
      ctx.beginPath(); ctx.moveTo(Math.round(x) + .5, yOf(c.h)); ctx.lineTo(Math.round(x) + .5, yOf(c.l)); ctx.stroke();
      const y1 = yOf(Math.max(c.o, c.c)), y2 = yOf(Math.min(c.o, c.c));
      const bh = Math.max(1, Math.round(y2 - y1));
      if (c.c >= c.o && S.cc && S.cc.hollow && w >= 3){ ctx.lineWidth = 1; ctx.strokeRect(Math.round(x - w / 2) + .5, Math.round(y1) + .5, w - 1, bh - 1); }
      else {
        ctx.fillRect(Math.round(x - w / 2), Math.round(y1), w, bh);
        if (!(S.cc && S.cc.noborder) && w >= 3){ ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.strokeRect(Math.round(x - w / 2) + .5, Math.round(y1) + .5, w - 1, Math.max(0, bh - 1)); }
      }
    }
  }
  /* indicateurs superposés */
  for (const r of ovl) drawInd(r, xOf, yOf, kmin, g + 80, PW, bw);
  /* dernier prix */
  const ly = Math.round(yOf(P.c)) + .5, lcol = P.c >= P.o ? C.cUp : C.cDn;
  ctx.strokeStyle = lcol; ctx.globalAlpha = .55; ctx.setLineDash([1, 3]); ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(PW, ly); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;

  /* trades */
  const dragOv = (id, kd, v) => drag && drag.type === 'level' && drag.id === id && drag.kind === kd ? drag.price : v;
  const mk = (x, y, up, col) => { ctx.fillStyle = col; ctx.beginPath(); if (up){ ctx.moveTo(x, y - 6); ctx.lineTo(x - 5, y + 4); ctx.lineTo(x + 5, y + 4); } else { ctx.moveTo(x, y + 6); ctx.lineTo(x - 5, y - 4); ctx.lineTo(x + 5, y - 4); } ctx.closePath(); ctx.fill(); };
  for (const q of ACC.closed){
    const ke = groupOf(A, q.r.fillIdx), kx = groupOf(A, q.r.exitIdx);
    if (kx < kmin || ke > kmax) continue;
    const col = q.pnl >= 0 ? C.up : C.down, x1 = xOf(ke), x2 = xOf(kx), y1 = yOf(q.r.fillPrice), y2 = yOf(q.r.exitPrice);
    ctx.strokeStyle = col; ctx.globalAlpha = .8; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
    ctx.fillStyle = col; ctx.fillRect(Math.round(x2) - 4, Math.round(y2) - 4, 8, 8);
    ctx.strokeStyle = C.chart; ctx.strokeRect(Math.round(x2) - 3.5, Math.round(y2) - 3.5, 7, 7);
    const ec = getC(ke); const buy = q.tr.side === 'buy';
    mk(x1, buy ? yOf(ec.l) + 11 : yOf(ec.h) - 11, buy, buy ? C.up : C.down);
  }
  for (const q of ACC.live){
    const tr = q.tr, buy = tr.side === 'buy', scol = buy ? C.up : C.down, par = q.par;
    const k0 = groupOf(A, q.state === 'open' ? q.r.fillIdx : tr.placeIdx), x0 = clamp(xOf(k0), 0, PW);
    if (q.state === 'open'){ const ec = getC(Math.min(k0, g)); if (k0 >= kmin && k0 <= kmax) mk(xOf(k0), buy ? yOf(ec.l) + 11 : yOf(ec.h) - 11, buy, scol); }
    const entryP = q.state === 'open' ? q.r.fillPrice : dragOv(tr.id, 'price', par.price);
    const ey = Math.round(yOf(entryP)) + .5;
    ctx.strokeStyle = scol; ctx.lineWidth = 1.2; if (q.state === 'pending') ctx.setLineDash([7, 4]);
    ctx.beginPath(); ctx.moveTo(x0, ey); ctx.lineTo(PW, ey); ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
    const lblK = q.state === 'open' ? (buy ? 'Achat' : 'Vente') : `${tr.kind === 'limit' ? 'Limite' : 'Stop'} ${buy ? 'achat' : 'vente'}`;
    tags.push({y:ey, text:`${lblK} ${tr.size.toFixed(2)}${q.state === 'open' ? '  ' + money(q.pnl, true) : ''}`, bg:scol, fg:buy ? C.onUp : C.onDown, be:q.state === 'open' ? tr.id : null});
    if (q.state === 'pending') levels.push({id:tr.id, kind:'price', y:ey});
    const base = q.state === 'open' ? q.r.fillPrice : par.price;
    for (const kd of ['sl', 'tp']){
      const v0 = par[kd]; if (v0 == null) continue;
      const v = dragOv(tr.id, kd, v0), y = Math.round(yOf(v)) + .5, col = kd === 'sl' ? C.down : C.up;
      ctx.globalAlpha = .08; ctx.fillStyle = col; ctx.fillRect(0, Math.min(y, ey), PW, Math.abs(y - ey)); ctx.globalAlpha = 1;
      ctx.strokeStyle = col; ctx.lineWidth = 1.3; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(PW, y); ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
      const proj = tradePnl(tr, base, v);
      tags.push({y, text:`${kd === 'sl' ? 'SL' : 'TP'}  ${money(proj, true)}`, bg:C.chart, fg:col, border:col});
      levels.push({id:tr.id, kind:kd, y});
    }
  }
  if (!S.dhide || DR) drawDrawings(tags);
  if (DRAFT){
    const dr = DRAFT, buy = dr.side === 'buy', e = entryOf(dr), k = draftKind(dr), col = buy ? C.up : C.down, ey = Math.round(yOf(e)) + .5;
    const lots = Math.max(0, parseFloat($('#iLots').value) || 0);
    const pl = p => tradePnl({side:dr.side, size:lots}, e, p);
    const L = [];
    for (const kd of ['sl', 'tp']){
      const v = dr[kd]; if (v == null) continue;
      const y = Math.round(yOf(v)) + .5, c2 = kd === 'sl' ? C.down : C.up;
      ctx.globalAlpha = .12; ctx.fillStyle = c2; ctx.fillRect(0, Math.min(y, ey), PW, Math.abs(y - ey)); ctx.globalAlpha = 1;
      ctx.strokeStyle = c2; ctx.lineWidth = 1.8; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(PW, y); ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
      tags.push({y, text:`${kd === 'sl' ? 'SL' : 'TP'} ${money(pl(v), true)}`, bg:c2, fg:kd === 'sl' ? C.onDown : C.onUp});
      L.push({id:'draft', kind:kd, y});
    }
    ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(0, ey); ctx.lineTo(PW, ey); ctx.stroke(); ctx.lineWidth = 1;
    tags.push({y:ey, text:`${buy ? 'Achat' : 'Vente'} ${lots.toFixed(2)}`, bg:C.text, fg:C.chart});
    L.push({id:'draft', kind:'entry', y:ey});
    levels = L.concat(levels);
  }
  ctx.restore();

  /* etiquettes */
  BEHIT = [];
  for (const t of tags){
    if (t.y < TOP - 10 || t.y > MH - 4) continue;
    if (t.axis) tagBox(CW - 4, t.y, t.text, t.bg, t.fg);
    else {
      const bx = tagBox(PW - 8, t.y, t.text, t.bg, t.fg, t.border);
      if (t.be){ const x0 = bx - 30; ctx.fillStyle = C.chart; ctx.fillRect(x0, t.y - 9, 26, 18); ctx.strokeStyle = C.text; ctx.lineWidth = 1; ctx.strokeRect(x0 + .5, t.y - 8.5, 25, 17); ctx.fillStyle = C.text; ctx.font = '700 11px "Geist", system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('BE', x0 + 13, t.y + .5); BEHIT.push({id:t.be, x:x0, y:t.y - 9, w:26, h:18}); }
    }
  }
  tagBox(CW - 4, clamp(yOf(P.c), TOP - 8, MH - 4), P.c.toFixed(d), lcol, P.c >= P.o ? C.onCUp : C.onCDn);

  /* sous-fenêtres */
  subs.forEach((r, si) => GEO.panes.push(drawSub(r, MH + si * subH, subH, PW, kmin, kmax)));

  /* réticule */
  let hk = g;
  if (mouse && mouse.x >= 0 && mouse.x <= PW && mouse.y >= 0 && mouse.y <= PH && !(drag && drag.type === 'pan')){
    ctx.strokeStyle = C.muted; ctx.globalAlpha = .7; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(Math.round(mouse.x) + .5, 0); ctx.lineTo(Math.round(mouse.x) + .5, PH); ctx.moveTo(0, Math.round(mouse.y) + .5); ctx.lineTo(PW, Math.round(mouse.y) + .5); ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha = 1;
    hk = clamp(Math.round(g - ((PW - mouse.x) / bw - V.off - .5)), 0, g);
    const pg = GEO.panes.find(q => mouse.y >= q.y0 && mouse.y < q.y1);
    tagBox(CW - 4, mouse.y, pg ? fmtV(pg.pOf(mouse.y)) : pOf(mouse.y).toFixed(d), C.text, C.chart);
    const xt = dparts(A.T[hk]), tt = tfm >= 1440 ? `${xt.d} ${MO[xt.mo]} ${xt.y}` : fmtShort(A.T[hk]), w = ctx.measureText(tt).width + 12;
    tagBox(clamp(mouse.x + w / 2, w, PW), PH + AY / 2, tt, C.text, C.chart);
  }
  updateHud(getC(hk), hk === g); updateLegendVals(hk); $('#autoBtn').hidden = !V.man;
}
function updateHud(c, isLast){
  const d = INST.d, up = c.c >= c.o, pct = (c.c - c.o) / c.o * 100, col = up ? 'up' : 'down';
  $('#hud').innerHTML = `<span class="t">${INST.sym.replace('csv:', '')} ${S.tf}</span><span class="m">${INST.name}</span>` +
    `<span><i>O</i> ${c.o.toFixed(d)} <i>H</i> ${c.h.toFixed(d)} <i>L</i> ${c.l.toFixed(d)} <i>C</i> <span class="${col}">${c.c.toFixed(d)}</span> <span class="${col}">${pct >= 0 ? '+' : '\u2212'}${Math.abs(pct).toFixed(2)}%</span></span>`;
}

/* ---------- Pointer ---------- */
function pos(e){ const r = cv.getBoundingClientRect(); return {x:e.clientX - r.left, y:e.clientY - r.top}; }
function hitLevel(y){ let best = null, bd = 7; for (const l of levels){ const dd = Math.abs(l.y - y); if (dd < bd){ bd = dd; best = l; } } return best; }
cv.addEventListener('pointerdown', e => {
  if (!GEO) return; const {x, y} = pos(e); mouse = {x, y};
  closeFly();
  const bh = BEHIT.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
  if (bh && !DT && !DR){ const tr = SS.trades.find(t => t.id === bh.id); if (tr) beTrade(tr); return; }
  if (x > GEO.PW){ if (y <= GEO.MH && !DR){ drag = {type:'yscale', y0:y, lo0:GEO.lo, hi0:GEO.hi}; cv.setPointerCapture(e.pointerId); } return; }
  if (y > GEO.PH && !DR && !DT){ drag = {type:'xscale', x0:x, bw0:V.bw}; cv.setPointerCapture(e.pointerId); return; }
  if (dtDown(x, y)){ cv.setPointerCapture(e.pointerId); drawChart(); return; }
  const lv = hitLevel(y);
  drag = lv ? {type:'level', id:lv.id, kind:lv.kind, price:GEO.pOf(y)} : {type:'pan', x0:x, off0:V.off, y0:y, lo0:GEO.lo, hi0:GEO.hi};
  cv.setPointerCapture(e.pointerId); drawChart();
});
cv.addEventListener('pointermove', e => {
  if (!GEO) return; const {x, y} = pos(e); mouse = {x, y};
  if (DR){ dtMove(x, y); drawChart(); return; }
  if (drag){
    if (drag.type === 'pan'){ V.off = drag.off0 - (x - drag.x0) / V.bw; if (V.man){ const sh = (y - drag.y0) / (GEO.BOT - GEO.TOP) * (drag.hi0 - drag.lo0); V.man = {lo:drag.lo0 + sh, hi:drag.hi0 + sh}; } }
    else if (drag.type === 'yscale'){ const c = (drag.lo0 + drag.hi0) / 2, r = (drag.hi0 - drag.lo0) * Math.exp(-(y - drag.y0) / 160); V.man = {lo:c - r / 2, hi:c + r / 2}; }
    else if (drag.type === 'xscale'){ V.bw = clamp(drag.bw0 * Math.exp((x - drag.x0) / 220), 2, 60); }
    else if (drag.type === 'dhandle'){ const d = getDraw(drag.id); if (d) d.pts[drag.i] = snapPt(x, y); }
    else if (drag.type === 'dmove'){ const d = getDraw(drag.id); if (d){ const dx = x - drag.x0, dy = y - drag.y0; d.pts = drag.orig.map(o => fromScr(o.x + dx, o.y + dy)); } }
    else { drag.price = GEO.pOf(y); if (drag.id === 'draft') setDraftLevel(drag.kind, drag.price); }
  } else cv.style.cursor = BEHIT.some(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) ? 'pointer' : (x > GEO.PW && y <= GEO.MH) ? 'ns-resize' : (y > GEO.PH && x <= GEO.PW) ? 'ew-resize' : (DT || DR) ? 'crosshair' : (hitLevel(y) && x <= GEO.PW ? 'ns-resize' : (y <= GEO.MH && x <= GEO.PW && (hitDraw(x, y) || (SEL && getDraw(SEL) && handleAt(getDraw(SEL), x, y) >= 0)) ? 'move' : 'default'));
  drawChart();
});
function endDrag(commit){
  if (!drag) return; const dg = drag; drag = null;
  if (dg.type === 'yscale' || dg.type === 'xscale'){ drawChart(); return; }
  if (dg.type === 'dmove' || dg.type === 'dhandle'){ save(); drawChart(); return; }
  if (dg.type === 'level' && dg.id === 'draft'){ drawChart(); return; }
  if (dg.type === 'level' && commit){
    const q = ACC.live.find(z => z.tr.id === dg.id); if (!q){ drawChart(); return; }
    const v = rp(dg.price), buy = q.tr.side === 'buy', ref = q.state === 'open' ? D.c[SS.cursor] : (q.par.price);
    if (dg.kind === 'price'){ modTrade(q.tr, {price:v}); return; }
    const okSl = dg.kind === 'sl' ? (buy ? v < ref : v > ref) : (buy ? v > ref : v < ref);
    if (!okSl){ toast('Ce niveau est du mauvais côté du prix.', 'down'); drawChart(); return; }
    modTrade(q.tr, {[dg.kind]:v}); return;
  }
  drawChart();
}
cv.addEventListener('pointerup', () => { if (DR && DR.down){ dtUp(); drawChart(); return; } endDrag(true); });
cv.addEventListener('pointercancel', () => endDrag(false));
cv.addEventListener('pointerleave', () => { if (!drag){ mouse = null; drawChart(); } });
cv.addEventListener('wheel', e => {
  e.preventDefault(); const {x, y} = pos(e);
  if (GEO && x > GEO.PW && y <= GEO.MH){ const c = (GEO.lo + GEO.hi) / 2, r = (GEO.hi - GEO.lo) * (e.deltaY < 0 ? .88 : 1.14); V.man = {lo:c - r / 2, hi:c + r / 2}; }
  else V.bw = clamp(V.bw * (e.deltaY < 0 ? 1.12 : .89), 2, 60);
  drawChart();
}, {passive:false});
cv.addEventListener('dblclick', e => {
  if (!GEO) return; const {x, y} = pos(e);
  if (x > GEO.PW && y <= GEO.MH){ V.man = null; drawChart(); }
  else if (y > GEO.PH && x <= GEO.PW){ V.bw = 9; V.off = 10; drawChart(); }
});
$('#autoBtn').onclick = () => { V.man = null; drawChart(); };

/* ---------- UI ---------- */
function renderTfs(){
  const box = $('#tfs'); box.innerHTML = '';
  for (const t of tfList()){ const b = document.createElement('button'); b.textContent = t.lab; b.setAttribute('aria-pressed', String(t.id === S.tf)); b.onclick = () => { S.tf = t.id; SS.tf = t.id; renderTfs(); save(); refresh(); }; box.appendChild(b); }
}
function buildSelect(){
  const sel = $('#sym'); sel.innerHTML = '';
  const cats = [...new Set(INSTR.map(i => i.cat))];
  for (const c of cats){ const og = document.createElement('optgroup'); og.label = c; for (const i of INSTR.filter(x => x.cat === c)){ const o = document.createElement('option'); o.value = i.sym; o.textContent = `${i.sym}  ${i.name}`; og.appendChild(o); } sel.appendChild(og); }
  const ck = Object.keys(csvs);
  if (ck.length){ const og = document.createElement('optgroup'); og.label = 'Importé'; for (const k of ck){ const o = document.createElement('option'); o.value = k; o.textContent = csvs[k].inst.name; og.appendChild(o); } sel.appendChild(og); }
}
let posSig = '', histSig = '';
function autoLots(){
  const el = $('#iLots'); el.readOnly = !!S.autoRisk; if (!S.autoRisk || !ACC) return;
  const T = readTicket(); if (!(T.sl > 0) || !(T.risk > 0)) return;
  const unit = INST.pip * INST.cs * (INST.inv ? 1 / D.c[SS.cursor] : 1);
  el.value = Math.max(.01, Math.floor(ACC.balance * T.risk / 100 / (T.sl * unit + S.commission * 2) * 100) / 100).toFixed(2);
}
function updateRiskNote(){
  const T = readTicket(), cs = SS && ACC && SS.challenge && SS.challenge.on ? challengeState() : null; let txt = '', warn = false;
  if (cs){ const rem = Math.max(0, SS.challenge.maxLoss - cs.lossNow / SS.balance0 * 100); txt = `Défi : perte maximale restante ${rem.toFixed(1)} % du capital.`; if (T.risk > rem){ txt += ' Ce risque la dépasse.'; warn = true; } }
  else if (S.autoRisk) txt = 'La taille se calcule à partir du stop loss.';
  const el = $('#riskNote'); el.textContent = txt; el.className = 'note' + (warn ? ' warn' : '');
  $('#riskLbl').textContent = cs ? 'Risque par trade (défi)' : 'Risque par trade (% du solde)';
  $$('#riskChips button').forEach(b => b.setAttribute('aria-pressed', String(Math.abs(parseFloat(b.dataset.r) - T.risk) < 1e-9)));
}
function updateTicket(){
  const c = D.c[SS.cursor], d = INST.d;
  $('#pSell').textContent = $('#pSell2').textContent = c.toFixed(d); $('#pBuy').textContent = $('#pBuy2').textContent = (c + INST.sp).toFixed(d);
  autoLots(); updateRiskNote();
  const T = readTicket(), conv = INST.inv ? 1 / c : 1, unit = INST.pip * INST.cs * conv;
  const risk = T.sl > 0 && T.lots > 0 ? T.sl * unit * T.lots + S.commission * T.lots * 2 : null;
  const gain = T.tp > 0 && T.lots > 0 ? T.tp * unit * T.lots - S.commission * T.lots * 2 : null;
  const rows = [
    ['Spread', `${(INST.sp / INST.pip).toFixed(1)} ${INST.unit}`],
    ['Perte si SL touché', risk != null ? `<b class="down">${money(-risk)}</b>` : '<b>-</b>'],
    ['Gain si TP touché', gain != null ? `<b class="up">${money(gain, true)}</b>` : '<b>-</b>'],
    ['Risque sur le solde', risk != null ? `<b>${(risk / ACC.balance * 100).toFixed(2)} %</b>` : '<b>-</b>'],
    ['Rapport gain / risque', risk && gain ? `<b>1 : ${(gain / risk).toFixed(2)}</b>` : '<b>-</b>']
  ];
  $('#info').innerHTML = rows.map(r => `<div><span>${r[0]}</span>${r[1].startsWith('<b') ? r[1] : `<b>${r[1]}</b>`}</div>`).join('');
}
function posRowHtml(q){
  const tr = q.tr, d = INST.d, par = q.par, buy = tr.side === 'buy';
  const kl = tr.kind === 'market' ? '' : (tr.kind === 'limit' ? ' limite' : ' stop');
  const inp = (f, v) => `<input class="mini" data-f="${f}" data-id="${tr.id}" type="number" step="any" value="${v != null ? v.toFixed(d) : ''}" placeholder="-" aria-label="${f}">`;
  return `<tr><td><span class="side ${tr.side}">${buy ? 'Achat' : 'Vente'}${kl}</span></td><td class="n r">${tr.size.toFixed(2)}</td>` +
    `<td class="n r">${q.state === 'pending' ? inp('price', par.price) : q.r.fillPrice.toFixed(d)}</td><td class="r">${inp('sl', par.sl)}</td><td class="r">${inp('tp', par.tp)}</td>` +
    `<td class="n r" data-pnl="${tr.id}">${q.state === 'open' ? `<span class="${cls(q.pnl)}">${money(q.pnl, true)}</span>` : 'En attente'}</td>` +
    `<td class="r">${q.state === 'open' ? `<button class="btn sm" data-act="be" data-id="${tr.id}" title="Passer le stop à l'entrée">BE</button> ` : ''}<button class="btn sm" data-act="close" data-id="${tr.id}">${q.state === 'open' ? 'Clôturer' : 'Annuler'}</button></td></tr>`;
}
function renderPane(){
  const pane = $('#pane'), d = INST.d;
  $('#btnCloseAll').style.display = $('#btnBeAll').style.display = S.tab === 'pos' && ACC.live.some(q => q.state === 'open') ? '' : 'none';
  if (S.tab === 'pos'){
    const sig = ACC.live.map(q => [q.tr.id, q.state, q.par.sl, q.par.tp, q.par.price].join('|')).join(';');
    if (sig !== posSig || !pane.dataset.k || pane.dataset.k !== 'pos'){
      posSig = sig; pane.dataset.k = 'pos';
      pane.innerHTML = ACC.live.length ? `<table><thead><tr><th>Sens</th><th class="r">Lots</th><th class="r">Entrée</th><th class="r">Stop loss</th><th class="r">Take profit</th><th class="r">Résultat</th><th></th></tr></thead><tbody>${ACC.live.map(posRowHtml).join('')}</tbody></table>`
        : `<div class="empty">Aucune position. Utilise Acheter ou Vendre à droite, ou les touches B et S.</div>`;
    } else for (const q of ACC.live) if (q.state === 'open'){ const el = pane.querySelector(`[data-pnl="${q.tr.id}"]`); if (el) el.innerHTML = `<span class="${cls(q.pnl)}">${money(q.pnl, true)}</span>`; }
  } else if (S.tab === 'hist'){
    const sig = ACC.closed.map(q => q.tr.id + ':' + q.r.exitIdx).join(',') + '|' + S.commission;
    if (sig !== histSig || pane.dataset.k !== 'hist'){
      histSig = sig; pane.dataset.k = 'hist';
      const rows = ACC.closed.slice().reverse().slice(0, 300).map(q => {
        const tr = q.tr, rr = q.tr.sl != null ? q.pnl / (Math.abs(q.r.fillPrice - tr.sl) * tr.size * INST.cs * (INST.inv ? 1 / q.r.fillPrice : 1)) : null;
        return `<tr><td class="n">${tr.id}</td><td><span class="side ${tr.side}">${tr.side === 'buy' ? 'Achat' : 'Vente'}</span></td><td class="n r">${tr.size.toFixed(2)}</td><td class="n">${fmtShort(D.t[q.r.fillIdx])}</td><td class="n r">${q.r.fillPrice.toFixed(d)}</td><td class="n">${fmtShort(D.t[q.r.exitIdx])}</td><td class="n r">${q.r.exitPrice.toFixed(d)}</td><td>${q.r.reason}</td><td class="n r ${cls(q.pnl)}">${money(q.pnl, true)}</td><td class="n r">${rr != null && isFinite(rr) ? (rr >= 0 ? '+' : '\u2212') + Math.abs(rr).toFixed(2) + ' R' : '-'}</td></tr>`;
      }).join('');
      pane.innerHTML = ACC.closed.length ? `<table><thead><tr><th>N°</th><th>Sens</th><th class="r">Lots</th><th>Ouverture</th><th class="r">Entrée</th><th>Clôture</th><th class="r">Sortie</th><th>Motif</th><th class="r">Résultat</th><th class="r">Multiple de risque</th></tr></thead><tbody>${rows}</tbody></table>` : `<div class="empty">Aucun trade clôturé pour l'instant.</div>`;
    }
  } else { pane.dataset.k = 'stats'; renderStats(pane); }
}
function renderStats(pane){
  const cl = ACC.closed, n = cl.length;
  let gw = 0, gl = 0, wins = 0, best = 0, worst = 0, peak = 0, bal = 0, dd = 0, ddp = 0, rs = [];
  const curve = [0];
  for (const q of cl){
    bal += q.pnl; curve.push(bal); if (q.pnl > 0){ wins++; gw += q.pnl; } else gl += -q.pnl;
    best = Math.max(best, q.pnl); worst = Math.min(worst, q.pnl); peak = Math.max(peak, bal);
    if (peak - bal > dd){ dd = peak - bal; ddp = dd / (SS.balance0 + peak) * 100; }
    if (q.tr.sl != null){ const rk = Math.abs(q.r.fillPrice - q.tr.sl) * q.tr.size * INST.cs * (INST.inv ? 1 / q.r.fillPrice : 1); if (rk > 0) rs.push(q.pnl / rk); }
  }
  const pf = gl > 0 ? (gw / gl).toFixed(2) : (gw > 0 ? '∞' : '-');
  const items = [
    ['Résultat net', `<b class="${cls(bal)}">${money(bal, true)}</b>`],
    ['Rendement', `<b class="${cls(bal)}">${(bal / SS.balance0 * 100).toFixed(2)} %</b>`],
    ['Trades clôturés', `<b>${n}</b>`],
    ['Taux de réussite', `<b>${n ? (wins / n * 100).toFixed(1) + ' %' : '-'}</b>`],
    ['Facteur de profit', `<b>${pf}</b>`],
    ['Espérance par trade', `<b>${n ? money(bal / n, true) : '-'}</b>`],
    ['Gain moyen', `<b class="up">${wins ? money(gw / wins, true) : '-'}</b>`],
    ['Perte moyenne', `<b class="down">${n - wins ? money(-gl / (n - wins)) : '-'}</b>`],
    ['Multiple de risque moyen', `<b>${rs.length ? (rs.reduce((a, b) => a + b, 0) / rs.length).toFixed(2) + ' R' : '-'}</b>`],
    ['Meilleur trade', `<b class="up">${n ? money(best, true) : '-'}</b>`],
    ['Pire trade', `<b class="down">${n ? money(worst) : '-'}</b>`],
    ['Drawdown maximum', `<b class="down">${n ? money(-dd) + ' (' + ddp.toFixed(1) + ' %)' : '-'}</b>`]
  ];
  pane.innerHTML = `<div class="stats"><div class="sgrid">${items.map(i => `<div class="st"><span>${i[0]}</span>${i[1]}</div>`).join('')}</div><canvas id="eq"></canvas></div>`;
  const cvq = $('#eq'), w = cvq.clientWidth, h = cvq.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
  cvq.width = w * dpr; cvq.height = h * dpr; const c = cvq.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.fillStyle = C.chart; c.fillRect(0, 0, w, h);
  if (n < 1){ c.fillStyle = C.muted; c.font = '12px "Geist", sans-serif'; c.textAlign = 'center'; c.fillText("La courbe de capital apparaît après le premier trade clôturé.", w / 2, h / 2); return; }
  const mn = Math.min(0, ...curve), mx = Math.max(0, ...curve), pd = 16, X = i => pd + (w - 2 * pd) * i / Math.max(1, curve.length - 1), Y = v => h - pd - (v - mn) / ((mx - mn) || 1) * (h - 2 * pd);
  c.strokeStyle = C.line; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(pd, Y(0)); c.lineTo(w - pd, Y(0)); c.stroke(); c.setLineDash([]);
  c.strokeStyle = bal >= 0 ? C.up : C.down; c.lineWidth = 2; c.beginPath(); curve.forEach((v, i) => i ? c.lineTo(X(i), Y(v)) : c.moveTo(X(i), Y(v))); c.stroke();
}
function refresh(){
  ACC = computeAccount();
  const c = D.c[SS.cursor], A = getAgg(), g = groupOf(A, SS.cursor), P = partial(A, g, SS.cursor), pc = g > 0 ? A.C[g-1] : P.o;
  $('#pxv').textContent = c.toFixed(INST.d);
  const dl = (P.c - pc) / pc * 100; $('#pxd').className = 'pxd ' + (dl >= 0 ? 'up' : 'down'); $('#pxd').textContent = `${dl >= 0 ? '+' : '\u2212'}${Math.abs(dl).toFixed(2)}%`;
  $('#aBal').textContent = money(ACC.balance); $('#aEq').textContent = money(ACC.equity);
  $('#aFl').textContent = money(ACC.floating, true); $('#aFl').className = cls(ACC.floating);
  $('#posCount').textContent = ACC.live.length ? '(' + ACC.live.length + ')' : '';
  $('#macct').innerHTML = `<span>Capital ${money(ACC.equity)}</span><span class="${cls(ACC.floating)}">${money(ACC.floating, true)}</span>`;
  $('#when').textContent = fmtFull(D.t[SS.cursor]);
  const sc = $('#scrub'); sc.min = 60; sc.max = Math.max(61, SS.maxSeen); sc.value = SS.cursor; sc.disabled = SS.maxSeen <= 60 || SS.maxSeen === SS.cursor && SS.cursor <= 60;
  updateTicket(); renderPane(); updateChal(); updateDraftBar(); drawChart();
  SS.sum = {bal:ACC.balance, eq:ACC.equity}; SS.updated = Date.now();
}

/* ---------- Events ---------- */
$('#btnSess').onclick = () => showSetup();
$$('#ctype button').forEach(b => b.onclick = () => { S.ctype = b.dataset.ct; $$('#ctype button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); save(); drawChart(); });
$('#bNext').onclick = () => step(1, 1); $('#bBack').onclick = () => step(-1, 1);
$('#bF10').onclick = () => step(1, 10); $('#bB10').onclick = () => step(-1, 10);
$('#bPlay').onclick = () => playTimer ? stop() : play();
$('#spd').onchange = e => { S.speed = +e.target.value; save(); restartPlay(); };
$('#scrub').oninput = e => { stop(); SS.cursor = clamp(+e.target.value, 60, SS.maxSeen); save(); refresh(); };
$('#btnBuy').onclick = () => order('buy'); $('#btnSell').onclick = () => order('sell');
$('#quick').onchange = e => { $('#qbox').hidden = !e.target.checked; $('#hintDraft').hidden = e.target.checked; if (e.target.checked) cancelDraft(); };
$('#draftbar').addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (!b) return; if (b.dataset.d === 'ok') confirmDraft(); else cancelDraft(); });
$$('#kinds button').forEach(b => b.onclick = () => {
  kind = b.dataset.k; $$('#kinds button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  $('#fPrice').style.display = kind === 'market' ? 'none' : '';
  if (kind !== 'market' && !$('#iPrice').value) $('#iPrice').value = D.c[SS.cursor].toFixed(INST.d);
});
$('#btnAtr').onclick = () => { const a = atr(); if (!a){ toast('Pas assez de bougies pour calculer l\u2019ATR.'); return; } $('#iSl').value = Math.max(1, Math.round(a / INST.pip)); $('#iTp').value = Math.max(1, Math.round(2 * a / INST.pip)); if (DRAFT) startDraft(DRAFT.side, true); else updateTicket(); };
$('#autoRisk').onchange = e => { S.autoRisk = e.target.checked; save(); updateTicket(); updateDraftBar(); drawChart(); };
$('#riskChips').addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (!b) return; $('#iRisk').value = b.dataset.r; S.riskPct = parseFloat(b.dataset.r); S.autoRisk = true; $('#autoRisk').checked = true; save(); updateTicket(); updateDraftBar(); drawChart(); });
$('#iRisk').addEventListener('input', () => { const v = parseFloat($('#iRisk').value); if (v > 0){ S.riskPct = v; save(); } });
$('#btnRisk').onclick = () => {
  const T = readTicket(); if (!(T.sl > 0)){ toast("Renseigne un stop loss pour calculer la taille.", 'down'); return; }
  if (!(T.risk > 0)){ toast('Indique un pourcentage de risque.', 'down'); return; }
  const unit = INST.pip * INST.cs * (INST.inv ? 1 / D.c[SS.cursor] : 1);
  const lots = Math.max(.01, Math.floor(ACC.balance * T.risk / 100 / (T.sl * unit + S.commission * 2) * 100) / 100);
  $('#iLots').value = lots.toFixed(2); updateTicket();
};
['iLots', 'iSl', 'iTp', 'iPrice', 'iRisk'].forEach(id => $('#' + id).addEventListener('input', () => { if (DRAFT && (id === 'iSl' || id === 'iTp')) fieldsToDraft(); updateTicket(); updateDraftBar(); drawChart(); }));
$$('.tabs [data-tab]').forEach(b => b.onclick = () => { S.tab = b.dataset.tab; $$('.tabs [data-tab]').forEach(x => x.setAttribute('aria-selected', String(x === b))); $('#pane').dataset.k = ''; renderPane(); });
$('#btnCloseAll').onclick = () => { ACC.live.filter(q => q.state === 'open').forEach(q => q.tr.endIdx = SS.cursor); bump(); };
$('#pane').addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (!b) return; if (b.dataset.act === 'be'){ const tr = SS.trades.find(t => t.id === +b.dataset.id); if (tr) beTrade(tr); } else closeTrade(+b.dataset.id); });
$('#btnBeAll').onclick = beAll;
$('#pane').addEventListener('change', e => {
  const i = e.target.closest('input[data-f]'); if (!i) return;
  const tr = SS.trades.find(t => t.id === +i.dataset.id); if (!tr) return;
  const v = parseFloat(i.value);
  modTrade(tr, {[i.dataset.f]:isFinite(v) ? rp(v) : (i.dataset.f === 'price' ? tr.price : null)});
});
$('#btnTheme').onclick = () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = S.theme; readColors(); save(); if (SS) refresh(); };
$('#btnNew').onclick = () => { stop(); const x = SS; if (csvs[x.sym]) x.cursor = x.maxSeen = Math.floor(LAST * .3); else { x.seed = Math.floor(Math.random() * 1e6); x.cursor = x.maxSeen = START; } x.trades = []; x.draws = []; x.nextId = 1; openSession(x.id); save(); toast(csvs[x.sym] ? 'Journal remis à zéro.' : 'Nouvelle période chargée, journal remis à zéro.'); };
$('#file').onchange = e => {
  const f = e.target.files[0]; if (!f) return; const rd = new FileReader();
  rd.onload = () => {
    try {
      const {inst, data} = parseCSV(String(rd.result), f.name.replace(/\.[^.]+$/, ''));
      csvs[inst.sym] = {inst, data}; setupSel = inst.sym; renderMkts();
      toast(`${data.t.length} bougies importées (pas de ${data.baseMin} min). Ce marché est sélectionné.`, 'up');
    } catch (err){ toast('Import impossible : ' + err.message, 'down'); }
  };
  rd.readAsText(f); e.target.value = '';
};
const dlg = $('#dlg');
$('#btnSet').onclick = () => { $('#sCom').value = S.commission; $('#sPause').checked = S.pause; dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', ''); };
$('#dClose').onclick = () => dlg.close ? dlg.close() : dlg.removeAttribute('open');
$('#sCom').onchange = e => { const v = parseFloat(e.target.value); if (v >= 0){ S.commission = v; bump(); } };
$('#sPause').onchange = e => { S.pause = e.target.checked; save(); };
$('#sRestart').onclick = () => { stop(); const x = SS; x.trades = []; x.draws = []; x.nextId = 1; x.cursor = x.maxSeen = csvs[x.sym] ? Math.floor(LAST * .3) : START; openSession(x.id); save(); dlg.close && dlg.close(); toast('Période relancée depuis le début.'); };
$('#sWipe').onclick = () => { stop(); S.sessions = {}; SS = null; D = null; INST = null; DRAFT = null; try { localStorage.removeItem(KEY); } catch (err) {} dlg.close && dlg.close(); showSetup(); toast('Toutes les sessions ont été effacées.'); };
window.addEventListener('keydown', e => {
  const t = e.target; if (t && /^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName) && t.type !== 'range') return;
  if (!SS || !$('#setup').hidden || document.querySelector('dialog[open]')) return;
  if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')){ e.preventDefault(); undoDraw(); }
  else if ((e.key === 'Delete' || e.key === 'Backspace') && SEL){ e.preventDefault(); deleteSel(); }
  else if (e.key === 'f' || e.key === 'F'){ setMax(!S.max); }
  else if (e.key === 'e' || e.key === 'E'){ beAll(); }
  else if (e.key === 'ArrowRight'){ e.preventDefault(); step(1, 1, e.shiftKey); }
  else if (e.key === 'ArrowLeft'){ e.preventDefault(); step(-1, 1, e.shiftKey); }
  else if (e.key === ' '){ e.preventDefault(); playTimer ? stop() : play(); }
  else if (e.key === 'b' || e.key === 'B') order('buy');
  else if (e.key === 's' || e.key === 'S') order('sell');
  else if (e.key === 'Enter' && DRAFT){ e.preventDefault(); confirmDraft(); }
  else if (e.key === 'Escape'){ escapeAll(); }
});
new ResizeObserver(resize).observe(cw);

/* ---------- Illustrations des marchés ---------- */
const CURG = {USD:'$', EUR:'\u20ac', GBP:'\u00a3', JPY:'\u00a5', AUD:'A', CAD:'C', CHF:'F', NZD:'N'};
const CURC = {USD:'#2E7D5B', EUR:'#2F54C6', GBP:'#8C2F52', JPY:'#C23B3B', AUD:'#C98A1C', CAD:'#B93232', CHF:'#A52828', NZD:'#2F4577'};
function ingot(id, top, f1, f2, st, tx, lab){
  return `<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f1}"/><stop offset="1" stop-color="${f2}"/></linearGradient></defs><ellipse cx="20" cy="34" rx="16" ry="2.4" fill="rgba(0,0,0,.4)"/><path d="M12 10h16l7 6H5z" fill="${top}" stroke="${st}" stroke-width=".8" stroke-linejoin="round"/><path d="M5 16h30l3 15H2z" fill="url(#${id})" stroke="${st}" stroke-width=".8" stroke-linejoin="round"/><path d="M7.5 18.4h25" stroke="rgba(255,255,255,.6)" stroke-width="1"/><text x="20" y="27.4" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="8.5" fill="${tx}">${lab}</text></svg>`;
}
function coin(bg, glyph, fg){ return `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16" fill="${bg}"/><circle cx="20" cy="20" r="13" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1"/><text x="20" y="26" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="17" fill="${fg || '#fff'}">${glyph}</text></svg>`; }
function ico(i){
  const sym = i.sym;
  if (sym.startsWith('csv:')) return `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 4h15l8 8v24H9z" fill="rgba(255,255,255,.08)" stroke="#E9C46A" stroke-width="1.4" stroke-linejoin="round"/><path d="M24 4v8h8M14 20h12M14 25h12M14 30h8" stroke="#E9C46A" stroke-width="1.4" fill="none"/></svg>`;
  if (sym === 'XAUUSD') return ingot('gG', '#FFF1BE', '#F8D263', '#B7820A', '#7A5200', '#6B4700', 'Au');
  if (sym === 'XAGUSD') return ingot('gS', '#F6F8FC', '#DDE3EB', '#8D98A8', '#5A6573', '#434D5A', 'Ag');
  if (sym === 'XPTUSD') return ingot('gP', '#EBF3FB', '#C7D5E4', '#7C91A7', '#4A5A6C', '#3A4959', 'Pt');
  if (sym === 'USOIL' || sym === 'UKOIL') return `<svg viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="35" rx="13" ry="2.4" fill="rgba(0,0,0,.4)"/><path d="M11 6h18c3.2 4.4 3.2 23.6 0 28H11c-3.2-4.4-3.2-23.6 0-28z" fill="#2A2F3B" stroke="#98A1B6" stroke-width="1"/><path d="M9.6 13h20.8M9.4 27h21.2" stroke="#C9A24B" stroke-width="1.6"/><path d="M20 15c3.2 3.6 4.6 5.3 4.6 7.4a4.6 4.6 0 0 1-9.2 0c0-2.1 1.4-3.8 4.6-7.4z" fill="#E9C46A"/></svg>`;
  if (sym === 'NATGAS') return `<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="gF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD36B"/><stop offset=".55" stop-color="#FF8A3D"/><stop offset="1" stop-color="#E5483A"/></linearGradient></defs><path d="M21 4c1 6 9 9.5 9 18a10 10 0 0 1-20 0c0-4 2.4-6.4 4-9 .8 2.6 2 4 3.4 4.8C17 14.6 20 10.6 21 4z" fill="url(#gF)"/><path d="M20 20c2 2.4 3.6 3.8 3.6 6a3.6 3.6 0 0 1-7.2 0c0-2.2 1.6-3.6 3.6-6z" fill="#7FC8FF"/></svg>`;
  if (sym === 'BTCUSD') return coin('#F7931A', '\u20bf');
  if (sym === 'ETHUSD') return `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16" fill="#627EEA"/><path d="M20 7l-7 12 7 4 7-4zM13 21.4 20 33l7-11.6-7 4z" fill="rgba(255,255,255,.92)"/></svg>`;
  if (sym === 'SOLUSD') return `<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="gSol" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#9945FF"/><stop offset="1" stop-color="#14F195"/></linearGradient></defs><circle cx="20" cy="20" r="16" fill="#0E1224" stroke="url(#gSol)" stroke-width="1.5"/><path d="M12 14h15l-2.5 3H12zM15.5 18.5H28l-2.5 3H13zM12 23h15l-2.5 3H12z" fill="url(#gSol)"/></svg>`;
  if (sym === 'XRPUSD') return coin('#23292F', 'X');
  if (i.cat === 'Crypto') return coin('#4C5568', sym[0]);
  if (i.cat === 'Actions'){
    const m = {AAPL:['#9AA1AE', 'A'], MSFT:['#2F6FD0', 'M'], NVDA:['#6AA300', 'N'], TSLA:['#C4202B', 'T'], AMZN:['#E58A00', 'a'], META:['#0A66E6', 'M'], GOOGL:['#3B7BEA', 'G']}[sym] || ['#4C5568', sym[0]];
    return `<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="5" y="5" width="30" height="30" rx="7" fill="${m[0]}"/><text x="20" y="27.5" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="20" fill="#fff">${m[1]}</text></svg>`;
  }
  if (i.cat === 'Indices') return `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M4 34h32" stroke="rgba(255,255,255,.35)" stroke-width="1.2"/><g stroke-width="1.4"><path d="M10 10v22" stroke="#2FD3A4"/><rect x="7" y="14" width="6" height="12" fill="#2FD3A4"/><path d="M20 6v20" stroke="#FF5C6E"/><rect x="17" y="10" width="6" height="11" fill="#FF5C6E"/><path d="M30 12v22" stroke="#2FD3A4"/><rect x="27" y="17" width="6" height="12" fill="#2FD3A4"/></g></svg>`;
  const b = sym.slice(0, 3), q = sym.slice(3, 6);
  return `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="15" cy="17" r="11" fill="${CURC[b] || '#4C5568'}" stroke="rgba(255,255,255,.35)" stroke-width="1"/><circle cx="26" cy="24" r="11" fill="${CURC[q] || '#4C5568'}" stroke="rgba(255,255,255,.45)" stroke-width="1"/><text x="15" y="22" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="13" fill="#fff">${CURG[b] || b[0]}</text><text x="26" y="29" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="13" fill="#fff">${CURG[q] || q[0]}</text></svg>`;
}
/* ---------- Ciel étoilé ---------- */
const stars = (() => {
  const cvs = $('#stars'), c = cvs.getContext('2d'), reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let W = 0, H = 0, st = [], sh = [], raf = 0, on = false, next = 0, last = 0;
  function size(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight; cvs.width = W * dpr; cvs.height = H * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const N = Math.min(420, Math.floor(W * H / 4800)); st = [];
    for (let i = 0; i < N; i++){ const k = Math.random(); st.push({x:Math.random() * W, y:Math.random() * H, r:k < .9 ? Math.random() * .9 + .25 : Math.random() * 1.2 + .9, a:Math.random() * .55 + .25, p:Math.random() * 6.28, sp:Math.random() * .0016 + .0004, c:k < .1 ? '#BFD3FF' : k > .94 ? '#FFE3A6' : '#FFFFFF'}); }
  }
  function spawn(){ const a = .42 + Math.random() * .3, v = .55 + Math.random() * .45; sh.push({x:W * (.25 + Math.random() * .85), y:Math.random() * H * .4, vx:-Math.cos(a) * v, vy:Math.sin(a) * v, life:0, max:900 + Math.random() * 700, len:110 + Math.random() * 120}); }
  function frame(ts){
    if (!on) return; raf = requestAnimationFrame(frame);
    const dt = last ? Math.min(60, ts - last) : 16; last = ts;
    c.clearRect(0, 0, W, H);
    for (const s of st){ c.globalAlpha = Math.max(0, s.a * (.62 + .38 * Math.sin(ts * s.sp + s.p))); c.fillStyle = s.c; c.beginPath(); c.arc(s.x, s.y, s.r, 0, 6.2832); c.fill(); }
    c.globalAlpha = 1;
    if (reduce) return;
    if (ts > next){ spawn(); if (Math.random() < .18) setTimeout(spawn, 380); next = ts + 7000 + Math.random() * 16000; }
    for (let i = sh.length - 1; i >= 0; i--){
      const s = sh[i]; s.life += dt; s.x += s.vx * dt; s.y += s.vy * dt;
      const t = s.life / s.max; if (t >= 1 || s.y > H + 40 || s.x < -200){ sh.splice(i, 1); continue; }
      const al = Math.sin(Math.PI * t), sp = Math.hypot(s.vx, s.vy), tx = s.x - s.vx / sp * s.len, ty = s.y - s.vy / sp * s.len;
      const gr = c.createLinearGradient(s.x, s.y, tx, ty); gr.addColorStop(0, `rgba(255,255,255,${.95 * al})`); gr.addColorStop(.35, `rgba(190,210,255,${.35 * al})`); gr.addColorStop(1, 'rgba(190,210,255,0)');
      c.strokeStyle = gr; c.lineWidth = 1.7; c.lineCap = 'round'; c.beginPath(); c.moveTo(s.x, s.y); c.lineTo(tx, ty); c.stroke();
      c.fillStyle = `rgba(255,255,255,${al})`; c.beginPath(); c.arc(s.x, s.y, 1.7, 0, 6.2832); c.fill();
    }
  }
  window.addEventListener('resize', () => { if (on) size(); });
  return {
    start(){ if (on) return; on = true; last = 0; size(); next = performance.now() + 2500 + Math.random() * 3500; raf = requestAnimationFrame(frame); },
    stop(){ on = false; cancelAnimationFrame(raf); }
  };
})();

/* ---------- Légende et fenêtres des indicateurs ---------- */
const EYE = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></svg>';
const GEAR = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="2.2"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4"/></svg>';
const XIC = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg>';
const showDlg = d => d.showModal ? d.showModal() : d.setAttribute('open', '');
const closeDlg = d => d.close ? d.close() : d.removeAttribute('open');
function renderLegend(){
  $('#legend').innerHTML = S.inds.filter(i => IND[i.type]).map(i => `<div class="lg${i.vis ? '' : ' off'}" data-u="${i.uid}"><i style="background:${i.color}"></i><span class="ln">${esc(indLabel(i))}</span><span class="lv"></span><button data-a="eye" title="Afficher ou masquer" aria-label="Afficher ou masquer">${EYE}</button><button data-a="set" title="Réglages" aria-label="Réglages">${GEAR}</button><button data-a="del" title="Supprimer" aria-label="Supprimer">${XIC}</button></div>`).join('');
}
function indChanged(){ INDC.key = ''; renderLegend(); save(); if (SS) drawChart(); }
function renderIndList(){
  const q = $('#indQ').value.trim().toLowerCase(), box = $('#indList'); box.innerHTML = '';
  for (const cat of IND_CATS){
    const items = Object.values(IND).filter(i => i.cat === cat && (!q || (i.name + ' ' + i.short + ' ' + cat).toLowerCase().includes(q))); if (!items.length) continue;
    const h = document.createElement('div'); h.className = 'ich'; h.textContent = cat; box.appendChild(h);
    for (const it of items){
      const b = document.createElement('button'); b.type = 'button'; b.className = 'ii'; b.innerHTML = `<span>${esc(it.name)}</span><small>${it.pane ? 'Sous le graphique' : 'Sur le graphique'}</small>`;
      b.onclick = () => { const n = newInd(it.id); S.inds.push(n); indChanged(); toast(`Indicateur ajouté : ${indLabel(n)}`, 'up'); };
      box.appendChild(b);
    }
  }
  if (!box.children.length) box.innerHTML = '<div class="empty">Aucun indicateur ne correspond.</div>';
}
function openIndSet(uid){
  const i = S.inds.find(x => x.uid === uid); if (!i) return; const sp = IND[i.type], body = $('#isBody');
  $('#isTitle').textContent = sp.name;
  body.innerHTML = sp.params.map(q => `<div class="fld"><label for="p_${q.k}">${esc(q.l)}</label><input id="p_${q.k}" type="number" data-p="${q.k}" min="${q.min}" max="${q.max}" step="${q.step}" value="${i.params[q.k]}"></div>`).join('') +
    `<div class="fld"><label for="p_col">Couleur</label><input id="p_col" type="color" data-col value="${i.color}" style="height:36px;padding:2px"></div><button class="btn" id="isDel">Supprimer l'indicateur</button>`;
  body.oninput = e => {
    const t = e.target;
    if (t.dataset.p){ const v = parseFloat(t.value), q = sp.params.find(z => z.k === t.dataset.p); if (isFinite(v) && v >= q.min && v <= q.max){ i.params[t.dataset.p] = v; indChanged(); } }
    else if (t.dataset.col !== undefined){ i.color = t.value; indChanged(); }
  };
  $('#isDel').onclick = () => { S.inds = S.inds.filter(x => x !== i); indChanged(); closeDlg($('#indSet')); };
  showDlg($('#indSet'));
}
$('#legend').addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return; const u = b.closest('[data-u]').dataset.u, i = S.inds.find(x => x.uid === u); if (!i) return;
  if (b.dataset.a === 'eye') i.vis = !i.vis; else if (b.dataset.a === 'del') S.inds = S.inds.filter(x => x !== i); else { openIndSet(u); return; }
  indChanged();
});
$('#btnInd').onclick = () => { $('#indQ').value = ''; renderIndList(); showDlg($('#indDlg')); };
$('#indQ').oninput = renderIndList;
$('#indClose').onclick = () => closeDlg($('#indDlg'));
$('#isClose').onclick = () => closeDlg($('#indSet'));

/* ---------- Outils de dessin ---------- */
const svgI = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const DTOOLS = {
  trend:{n:2, name:'Ligne de tendance', ic:'<path d="M4 19 20 5"/><circle cx="4" cy="19" r="1.7"/><circle cx="20" cy="5" r="1.7"/>'},
  ray:{n:2, name:'Demi-droite', ic:'<path d="M4 19 21 5"/><circle cx="4" cy="19" r="1.7"/>'},
  ext:{n:2, name:'Droite étendue', ic:'<path d="M2 21 22 3"/><circle cx="9" cy="15" r="1.7"/><circle cx="15" cy="9.5" r="1.7"/>'},
  arrow:{n:2, name:'Flèche', ic:'<path d="M5 19 19 5M10 5h9v9"/>'},
  hline:{n:1, name:'Ligne horizontale', ic:'<path d="M3 12h18"/><circle cx="12" cy="12" r="1.7"/>'},
  hray:{n:1, name:'Demi-droite horizontale', ic:'<path d="M5 12h16"/><circle cx="5" cy="12" r="1.7"/>'},
  vline:{n:1, name:'Ligne verticale', ic:'<path d="M12 3v18"/><circle cx="12" cy="12" r="1.7"/>'},
  cross:{n:1, name:'Ligne en croix', ic:'<path d="M3 12h18M12 3v18"/>'},
  channel:{n:3, name:'Canal parallèle', ic:'<path d="M3 14 17 4M7 21 21 11"/>'},
  fib:{n:2, name:'Retracement de Fibonacci', ic:'<path d="M3 5h18M3 10h18M3 15h18M3 20h18"/>'},
  fibx:{n:3, name:'Extension de Fibonacci', ic:'<path d="M3 6h18M3 12h18M3 18h18M6 20 10 4"/>'},
  fibtime:{n:2, name:'Zones de temps de Fibonacci', ic:'<path d="M5 4v16M9 4v16M15 4v16M21 4v16"/>'},
  gann:{n:2, name:'Éventail de Gann', ic:'<path d="M4 20 20 4M4 20 20 10M4 20 20 16M4 20 10 4"/>'},
  pitch:{n:3, name:"Fourche d'Andrews", ic:'<path d="M4 19 20 11M4 19 14 5M4 19 21 21"/>'},
  rect:{n:2, name:'Rectangle', ic:'<rect x="4" y="6" width="16" height="12"/>'},
  ellipse:{n:2, name:'Ellipse', ic:'<ellipse cx="12" cy="12" rx="9" ry="6"/>'},
  tri:{n:3, name:'Triangle', ic:'<path d="M4 19 12 5l8 14z"/>'},
  brush:{n:99, name:'Pinceau', ic:'<path d="M4 20c4-9 6 2 9-6s4-1 7-8"/>'},
  text:{n:1, name:'Texte', ic:'<path d="M5 6h14M12 6v13M9 19h6"/>'},
  label:{n:1, name:'Étiquette de prix', ic:'<path d="M4 8h12l4 4-4 4H4z"/>'},
  arrowup:{n:1, name:'Flèche haussière', ic:'<path d="M12 20V6M6 12l6-6 6 6"/>'},
  arrowdown:{n:1, name:'Flèche baissière', ic:'<path d="M12 4v14M6 12l6 6 6-6"/>'},
  measure:{n:2, name:'Mesure', ic:'<path d="M3 17 17 3l4 4L7 21z"/><path d="M8 12l2 2M11 9l2 2M14 6l2 2"/>'}
};
const DGROUPS = [
  {id:'lines', name:'Lignes', tools:['trend', 'ray', 'ext', 'arrow', 'hline', 'hray', 'vline', 'cross', 'channel']},
  {id:'fib', name:'Fibonacci, Gann et fourches', tools:['fib', 'fibx', 'fibtime', 'gann', 'pitch']},
  {id:'shapes', name:'Formes', tools:['rect', 'ellipse', 'tri', 'brush']},
  {id:'notes', name:'Annotations', tools:['text', 'label', 'arrowup', 'arrowdown']},
  {id:'measure', name:'Mesure', tools:['measure']}
];
const RAILSEL = {lines:'trend', fib:'fib', shapes:'rect', notes:'text', measure:'measure'};
const groupOfTool = t => DGROUPS.find(g => g.tools.includes(t));
const getDraw = id => SS && SS.draws.find(d => d.id === id);

/* conversions temps / prix <-> écran */
const tfSecs = () => tfMin() * 60;
function kfOf(x){ return GEO.g - ((GEO.PW - x) / V.bw - V.off - .5); }
function kfToTime(kf){
  const A = GEO.A, g = GEO.g;
  if (kf >= g) return A.T[g] + (kf - g) * tfSecs();
  if (kf < 0) return A.T[0] + kf * tfSecs();
  const ki = Math.floor(kf); return A.T[ki] + (kf - ki) * (A.T[Math.min(ki + 1, g)] - A.T[ki]);
}
function timeToKf(t){
  const A = GEO.A, g = GEO.g;
  if (t >= A.T[g]) return g + (t - A.T[g]) / tfSecs();
  if (t < A.T[0]) return (t - A.T[0]) / tfSecs();
  let lo = 0, hi = g; while (lo < hi){ const mid = (lo + hi + 1) >> 1; if (A.T[mid] <= t) lo = mid; else hi = mid - 1; }
  return lo >= g ? g + (t - A.T[g]) / tfSecs() : lo + (t - A.T[lo]) / (A.T[lo + 1] - A.T[lo]);
}
const toScr = pt => ({x:GEO.xOf(timeToKf(pt.t)), y:GEO.yOf(pt.p)});
const fromScr = (x, y) => ({t:kfToTime(kfOf(x)), p:GEO.pOf(y)});
function snapPt(x, y){
  let kf = kfOf(x), p = GEO.pOf(y);
  if (S.magnet){
    const k = clamp(Math.round(kf), 0, GEO.g), c = GEO.getC(k); let best = p, bd = 1e9;
    for (const v of [c.o, c.h, c.l, c.c]){ const dy = Math.abs(GEO.yOf(v) - y); if (dy < bd){ bd = dy; best = v; } }
    if (bd < 18) p = best; kf = k;
  }
  return {t:kfToTime(kf), p};
}
function farPt(a, b, L = 4000){ const dx = b.x - a.x, dy = b.y - a.y, n = Math.hypot(dx, dy) || 1; return {x:a.x + dx / n * L, y:a.y + dy / n * L}; }
function dSeg(px, py, x1, y1, x2, y2){ const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy; let t = l2 ? ((px - x1) * dx + (py - y1) * dy) / l2 : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy)); }
function fmtDur(sec){ sec = Math.abs(sec); const d = Math.floor(sec / 86400), h = Math.floor(sec % 86400 / 3600), m = Math.floor(sec % 3600 / 60); return [d ? d + ' j' : '', h ? h + ' h' : '', m || (!d && !h) ? m + ' min' : ''].filter(Boolean).join(' '); }

/* rendu */
function drawDrawings(tags){
  HIT = [];
  for (const d of SS.draws) renderOne(d, d.id === SEL, tags);
  if (DR) renderOne({id:'_dr', type:DR.tool, pts:DR.fixed.concat([DR.cur]), col:S.dcol, w:S.dw, preview:true}, false, tags);
}
function renderOne(d, sel, tags){
  const P = d.pts.map(toScr), n = P.length; if (!n) return;
  const col = d.col || S.dcol, w = d.w || 2, PWd = GEO.PW, MH = GEO.MH, dec = INST.d, segs = [], boxes = [];
  ctx.lineWidth = w; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.setLineDash(d.dash ? [6, 4] : []);
  const seg = (a, b) => { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); segs.push([a.x, a.y, b.x, b.y]); };
  const poly = (pts, alpha, stroke, closed) => {
    ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)); if (closed) ctx.closePath();
    if (alpha){ ctx.save(); ctx.globalAlpha = alpha; ctx.fill(); ctx.restore(); }
    if (stroke){ ctx.stroke(); for (let i = 1; i < pts.length; i++) segs.push([pts[i-1].x, pts[i-1].y, pts[i].x, pts[i].y]); if (closed) segs.push([pts[pts.length-1].x, pts[pts.length-1].y, pts[0].x, pts[0].y]); }
  };
  const head = (tip, from) => { const a = Math.atan2(tip.y - from.y, tip.x - from.x), L = 10 + w; ctx.beginPath(); ctx.moveTo(tip.x, tip.y); ctx.lineTo(tip.x - L * Math.cos(a - .4), tip.y - L * Math.sin(a - .4)); ctx.lineTo(tip.x - L * Math.cos(a + .4), tip.y - L * Math.sin(a + .4)); ctx.closePath(); ctx.fill(); };
  const lab = (txt, x, y, bg, fg, align) => {
    ctx.save(); ctx.font = '600 11px "Geist Mono", ui-monospace, monospace'; const w2 = ctx.measureText(txt).width + 10, x0 = align === 'r' ? x - w2 : align === 'c' ? x - w2 / 2 : x;
    ctx.setLineDash([]); ctx.fillStyle = bg; ctx.fillRect(x0, y - 9, w2, 18); ctx.fillStyle = fg; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(txt, x0 + 5, y + .5); ctx.restore(); boxes.push([x0, y - 9, w2, 18]);
  };
  const small = (txt, x, y, c, al) => { ctx.save(); ctx.setLineDash([]); ctx.font = '11px "Geist Mono", ui-monospace, monospace'; ctx.fillStyle = c; ctx.textAlign = al || 'left'; ctx.textBaseline = 'bottom'; ctx.fillText(txt, x, y); ctx.restore(); };
  const axis = (y, text) => tags.push({y, text, bg:col, fg:C.chart, axis:true});
  const A = P[0], B = P[1], Cc = P[2];
  switch (d.type){
    case 'trend': if (B) seg(A, B); break;
    case 'ray': if (B) seg(A, farPt(A, B)); break;
    case 'ext': if (B) seg(farPt(B, A), farPt(A, B)); break;
    case 'arrow': if (B){ seg(A, B); head(B, A); } break;
    case 'hline': seg({x:0, y:A.y}, {x:PWd, y:A.y}); axis(A.y, d.pts[0].p.toFixed(dec)); break;
    case 'hray': seg(A, {x:PWd, y:A.y}); axis(A.y, d.pts[0].p.toFixed(dec)); break;
    case 'vline': seg({x:A.x, y:0}, {x:A.x, y:MH}); break;
    case 'cross': seg({x:0, y:A.y}, {x:PWd, y:A.y}); seg({x:A.x, y:0}, {x:A.x, y:MH}); axis(A.y, d.pts[0].p.toFixed(dec)); break;
    case 'channel':
      if (B){
        seg(A, B);
        if (Cc){
          const dx = B.x - A.x, yb = dx ? A.y + (Cc.x - A.x) * (B.y - A.y) / dx : A.y, off = Cc.y - yb, A2 = {x:A.x, y:A.y + off}, B2 = {x:B.x, y:B.y + off};
          seg(A2, B2); poly([A, B, B2, A2], .10, false, true);
          ctx.save(); ctx.globalAlpha = .7; ctx.setLineDash([3, 4]); seg({x:A.x, y:A.y + off / 2}, {x:B.x, y:B.y + off / 2}); ctx.restore();
        }
      } break;
    case 'fib':
      if (B){
        const p0 = d.pts[0].p, p1 = d.pts[1].p, xa = Math.min(A.x, B.x), xe = Math.max(A.x, B.x), LV = [0, .236, .382, .5, .618, .786, 1], FC = ['#8A93A6', '#FF5C6E', '#FFB84D', '#E6C84A', '#2FD3A4', '#59D2FF', '#8A93A6']; let py = null;
        LV.forEach((L, i) => {
          const pr = p1 + (p0 - p1) * L, y = GEO.yOf(pr), c = d.mono ? col : FC[i];
          ctx.strokeStyle = c; ctx.lineWidth = Math.max(1, w - .5); ctx.setLineDash([]); seg({x:xa, y}, {x:xe, y}); small(`${L} (${pr.toFixed(dec)})`, xa + 4, y - 2, c);
          if (py !== null){ ctx.save(); ctx.globalAlpha = .07; ctx.fillStyle = c; ctx.fillRect(xa, Math.min(y, py), xe - xa, Math.abs(y - py)); ctx.restore(); }
          py = y;
        });
        ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); seg(A, B);
      } break;
    case 'fibx':
      if (B){
        ctx.save(); ctx.setLineDash([4, 4]); ctx.lineWidth = 1; seg(A, B); if (Cc) seg(B, Cc); ctx.restore();
        if (Cc){
          const LV = [0, .618, 1, 1.272, 1.618, 2, 2.618], dp = d.pts[1].p - d.pts[0].p, p2 = d.pts[2].p, xs = Math.min(B.x, Cc.x), FC = ['#8A93A6', '#FFB84D', '#E6C84A', '#2FD3A4', '#59D2FF', '#B992FF', '#FF7AA2'];
          LV.forEach((L, i) => { const pr = p2 + dp * L, y = GEO.yOf(pr), c = d.mono ? col : FC[i]; ctx.strokeStyle = c; ctx.lineWidth = Math.max(1, w - .5); ctx.setLineDash([]); seg({x:xs, y}, {x:PWd, y}); small(`${L} (${pr.toFixed(dec)})`, xs + 4, y - 2, c); });
        }
      } break;
    case 'fibtime':
      if (B){ const dt = B.x - A.x; if (Math.abs(dt) > 2) for (const f of [0, 1, 2, 3, 5, 8, 13, 21, 34, 55]){ const x = A.x + dt * f; if (x < -2 || x > PWd + 2) continue; seg({x, y:0}, {x, y:MH}); small(String(f), x + 3, 14, col); } else seg(A, B); } break;
    case 'gann':
      if (B){
        const dx = B.x - A.x, dy = B.y - A.y; seg(A, B);
        if (Math.abs(dx) > 2) [[8, '8x1'], [4, '4x1'], [3, '3x1'], [2, '2x1'], [1, '1x1'], [.5, '1x2'], [1 / 3, '1x3'], [.25, '1x4'], [.125, '1x8']].forEach(([r, lb]) => { const E = {x:A.x + dx, y:A.y + dy * r}; ctx.save(); ctx.globalAlpha = r === 1 ? 1 : .75; seg(A, farPt(A, E)); ctx.restore(); small(lb, E.x + 4, E.y, col); });
      } break;
    case 'pitch':
      if (B){
        if (!Cc) seg(A, B);
        else {
          const M = {x:(B.x + Cc.x) / 2, y:(B.y + Cc.y) / 2}, dir = {x:M.x - A.x, y:M.y - A.y}, f = 4000 / (Math.hypot(dir.x, dir.y) || 1), fB = {x:B.x + dir.x * f, y:B.y + dir.y * f}, fC = {x:Cc.x + dir.x * f, y:Cc.y + dir.y * f};
          seg(A, farPt(A, M)); seg(B, fB); seg(Cc, fC); poly([B, fB, fC, Cc], .07, false, true);
          ctx.save(); ctx.setLineDash([4, 4]); seg(B, Cc); ctx.restore();
        }
      } break;
    case 'rect': if (B) poly([A, {x:B.x, y:A.y}, B, {x:A.x, y:B.y}], .12, true, true); break;
    case 'ellipse':
      if (B){ const cx = (A.x + B.x) / 2, cy = (A.y + B.y) / 2, rx = Math.abs(B.x - A.x) / 2, ry = Math.abs(B.y - A.y) / 2, pts = []; for (let i = 0; i < 36; i++){ const a = i / 36 * 6.2832; pts.push({x:cx + rx * Math.cos(a), y:cy + ry * Math.sin(a)}); } poly(pts, .12, true, true); } break;
    case 'tri': if (B){ if (Cc) poly([A, B, Cc], .12, true, true); else seg(A, B); } break;
    case 'brush': if (n > 1) poly(P, 0, true, false); break;
    case 'text': {
      ctx.save(); ctx.setLineDash([]); const fs = d.fs || 14; ctx.font = `600 ${fs}px "Geist", system-ui, sans-serif`; const tx = d.text || '', w2 = ctx.measureText(tx).width + 14;
      ctx.fillStyle = hexA(col, .16); ctx.fillRect(A.x, A.y - fs - 4, w2, fs + 10); ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.strokeRect(A.x + .5, A.y - fs - 3.5, w2 - 1, fs + 9);
      ctx.fillStyle = col; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(tx, A.x + 7, A.y + 1); ctx.restore(); boxes.push([A.x, A.y - fs - 4, w2, fs + 10]); break;
    }
    case 'label': {
      const txt = d.pts[0].p.toFixed(dec); ctx.save(); ctx.font = '600 11px "Geist Mono", ui-monospace, monospace'; const w2 = ctx.measureText(txt).width + 12;
      ctx.setLineDash([]); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(A.x + 8, A.y - 10); ctx.lineTo(A.x + 8 + w2, A.y - 10); ctx.lineTo(A.x + 8 + w2, A.y + 10); ctx.lineTo(A.x + 8, A.y + 10); ctx.closePath(); ctx.fill();
      ctx.fillStyle = C.chart; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(txt, A.x + 14, A.y + .5); ctx.restore(); boxes.push([A.x, A.y - 10, w2 + 8, 20]); break;
    }
    case 'arrowup': case 'arrowdown': {
      const up = d.type === 'arrowup', sg = up ? 1 : -1, c = up ? C.up : C.down; ctx.save(); ctx.setLineDash([]); ctx.fillStyle = c; ctx.beginPath();
      ctx.moveTo(A.x, A.y); ctx.lineTo(A.x - 9, A.y + 11 * sg); ctx.lineTo(A.x - 3.5, A.y + 11 * sg); ctx.lineTo(A.x - 3.5, A.y + 26 * sg); ctx.lineTo(A.x + 3.5, A.y + 26 * sg); ctx.lineTo(A.x + 3.5, A.y + 11 * sg); ctx.lineTo(A.x + 9, A.y + 11 * sg); ctx.closePath(); ctx.fill(); ctx.restore();
      boxes.push([A.x - 10, Math.min(A.y, A.y + 26 * sg), 20, 26]); break;
    }
    case 'measure':
      if (B){
        const up = d.pts[1].p >= d.pts[0].p, mc = up ? C.up : C.down, dp = d.pts[1].p - d.pts[0].p, pct = dp / d.pts[0].p * 100, bars = Math.round(timeToKf(d.pts[1].t) - timeToKf(d.pts[0].t));
        const x0 = Math.min(A.x, B.x), y0 = Math.min(A.y, B.y), ww = Math.abs(B.x - A.x), hh = Math.abs(B.y - A.y);
        ctx.save(); ctx.fillStyle = mc; ctx.globalAlpha = .14; ctx.fillRect(x0, y0, ww, hh); ctx.restore();
        ctx.strokeStyle = mc; ctx.fillStyle = mc; ctx.setLineDash([]); ctx.lineWidth = 1.4; seg(A, B); head(B, A);
        ctx.save(); ctx.setLineDash([3, 3]); ctx.lineWidth = 1; seg({x:x0, y:y0}, {x:x0 + ww, y:y0}); seg({x:x0, y:y0 + hh}, {x:x0 + ww, y:y0 + hh}); ctx.restore();
        const sgn = v => (v >= 0 ? '+' : '\u2212') + Math.abs(v).toFixed(2), cx = x0 + ww / 2, ty = up ? y0 - 38 : y0 + hh + 8;
        const lines = [`${dp >= 0 ? '+' : '\u2212'}${Math.abs(dp).toFixed(dec)}  (${sgn(pct)} %)`, `${(Math.abs(dp) / INST.pip).toFixed(1)} ${INST.unit}`, `${Math.abs(bars)} bougies, ${fmtDur(d.pts[1].t - d.pts[0].t)}`];
        ctx.save(); ctx.font = '600 11px "Geist Mono", ui-monospace, monospace'; const bw2 = Math.max(...lines.map(l => ctx.measureText(l).width)) + 14, bx = clamp(cx - bw2 / 2, 4, PWd - bw2 - 4), by = clamp(ty, 4, MH - 52);
        ctx.fillStyle = mc; ctx.fillRect(bx, by, bw2, 48); ctx.fillStyle = up ? C.onUp : C.onDown; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; lines.forEach((l, i) => ctx.fillText(l, bx + 7, by + 9 + i * 15)); ctx.restore(); boxes.push([bx, by, bw2, 48]);
      } break;
  }
  ctx.setLineDash([]); ctx.lineWidth = 1;
  if (sel || d.preview){ for (const q of P){ ctx.fillStyle = C.chart; ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.fillRect(q.x - 4, q.y - 4, 8, 8); ctx.strokeRect(q.x - 4, q.y - 4, 8, 8); } ctx.lineWidth = 1; }
  if (!d.preview) HIT.push({id:d.id, segs, boxes});
}
function hitDraw(x, y){
  for (let i = HIT.length - 1; i >= 0; i--){ const h = HIT[i]; for (const sg of h.segs) if (dSeg(x, y, sg[0], sg[1], sg[2], sg[3]) < 6) return h.id; for (const b of h.boxes) if (x >= b[0] && x <= b[0] + b[2] && y >= b[1] && y <= b[1] + b[3]) return h.id; }
  return null;
}
function handleAt(d, x, y){ const P = d.pts.map(toScr); for (let i = 0; i < P.length; i++) if (Math.hypot(P[i].x - x, P[i].y - y) < 9) return i; return -1; }

/* création et édition */
function pushUndo(){ UNDO.push(JSON.stringify(SS.draws)); if (UNDO.length > 40) UNDO.shift(); }
function undoDraw(){ if (!UNDO.length){ toast('Rien à annuler.'); return; } SS.draws = JSON.parse(UNDO.pop()); if (!getDraw(SEL)) SEL = null; save(); updateDtb(); drawChart(); }
function addDrawing(type, pts, extra){
  pushUndo(); const d = Object.assign({id:'d' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), type, pts, col:S.dcol, w:S.dw, dash:false}, extra || {});
  SS.draws.push(d); SEL = d.id; if (!S.dstay){ DT = null; updateRail(); } save(); updateDtb(); updateHint(); drawChart(); return d;
}
function deleteSel(){ if (!SEL) return; pushUndo(); SS.draws = SS.draws.filter(d => d.id !== SEL); SEL = null; save(); updateDtb(); drawChart(); }
function escapeAll(){
  if (DR){ DR = null; updateHint(); drawChart(); return; }
  if (DRAFT){ cancelDraft(); return; }
  if (DT){ DT = null; updateRail(); updateHint(); cv.style.cursor = 'default'; return; }
  if (SEL){ SEL = null; updateDtb(); drawChart(); return; }
  if (S.max) setMax(false);
}
function setTool(t){
  DT = t; DR = null; SEL = null; const g = groupOfTool(t); if (g) RAILSEL[g.id] = t;
  closeFly(); buildRail(); updateDtb(); updateHint(); cv.style.cursor = 'crosshair';
}
function startDraw(x, y){
  const tool = DT, n = DTOOLS[tool].n, p = snapPt(x, y);
  if (tool === 'text'){ TXP = {pt:p}; $('#txIn').value = ''; showDlg($('#txtDlg')); setTimeout(() => $('#txIn').focus(), 30); return; }
  if (n === 1){ addDrawing(tool, [p]); return; }
  DR = {tool, fixed:[p], cur:p, down:true, x0:x, y0:y, moved:false, brush:tool === 'brush'}; updateHint();
}
function dtDown(x, y){
  if (y > GEO.MH && !DR) return false;
  if (DR){ DR.fixed.push(snapPt(x, y)); if (DR.fixed.length >= DTOOLS[DR.tool].n) finishDraw(); else { DR.cur = DR.fixed[DR.fixed.length - 1]; updateHint(); } return true; }
  if (DT){ startDraw(x, y); return true; }
  if (hitLevel(y)) return false;
  if (SEL){ const d = getDraw(SEL); if (d){ const hi = handleAt(d, x, y); if (hi >= 0){ pushUndo(); drag = {type:'dhandle', id:SEL, i:hi}; return true; } } }
  const id = hitDraw(x, y);
  if (id){ SEL = id; pushUndo(); const d = getDraw(id); drag = {type:'dmove', id, x0:x, y0:y, orig:d.pts.map(toScr)}; updateDtb(); return true; }
  if (SEL){ SEL = null; updateDtb(); }
  return false;
}
function dtMove(x, y){
  if (!DR) return; const p = snapPt(x, y); DR.cur = p; if (DR.down && Math.hypot(x - DR.x0, y - DR.y0) > 6) DR.moved = true;
  if (DR.brush && DR.down){ const a = toScr(DR.fixed[DR.fixed.length - 1]); if (Math.hypot(a.x - x, a.y - y) > 3) DR.fixed.push(p); }
}
function dtUp(){
  if (!DR) return; DR.down = false;
  if (DR.brush){ DR.fixed.push(DR.cur); finishDraw(); return; }
  if (DR.moved){ DR.fixed.push(DR.cur); if (DR.fixed.length >= DTOOLS[DR.tool].n) finishDraw(); else DR.cur = Object.assign({}, DR.cur); }
  updateHint();
}
function finishDraw(){
  const r = DR; DR = null; const n = DTOOLS[r.tool].n, pts = r.brush ? r.fixed : r.fixed.slice(0, n);
  if (pts.length < (r.brush ? 2 : 1)){ updateHint(); return; }
  addDrawing(r.tool, pts);
}
function updateHint(){
  const el = $('#dthint'); if (!DT && !DR){ el.hidden = true; return; }
  const t = DR ? DR.tool : DT, n = DTOOLS[t].n, k = DR ? DR.fixed.length : 0; el.hidden = false;
  el.textContent = DTOOLS[t].name + (n === 1 ? ' : clique sur le graphique.' : t === 'brush' ? ' : maintiens et dessine.' : ` : clique le point ${Math.min(k + 1, n)} sur ${n}, ou glisse pour tracer.`) + ' Échap pour annuler.';
}

/* barre latérale et fenêtre de choix */
const STAR_IC = '<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>';
const isFav = t => (S.favs || []).includes(t);
function toggleFav(t){
  S.favs = S.favs || []; S.favs = isFav(t) ? S.favs.filter(x => x !== t) : S.favs.concat([t]); if (isFav(t)) S.favShow = true; save(); buildRail(); buildFavbar();
  $$('#fly [data-fav]').forEach(b => b.classList.toggle('on', isFav(b.dataset.fav)));
}
const GRIP = '<svg viewBox="0 0 16 12" fill="currentColor"><circle cx="3" cy="3" r="1.2"/><circle cx="8" cy="3" r="1.2"/><circle cx="13" cy="3" r="1.2"/><circle cx="3" cy="9" r="1.2"/><circle cx="8" cy="9" r="1.2"/><circle cx="13" cy="9" r="1.2"/></svg>';
const ROT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/></svg>';
function placeFav(){
  const el = $('#favbar'), c = $('#cw'); if (!el || !c || el.hidden) return;
  const r = c.getBoundingClientRect(), w = el.offsetWidth || 44, h = el.offsetHeight || 44, p = S.favPos || {x:62, y:150};
  el.style.left = clamp(p.x, 0, Math.max(0, r.width - w)) + 'px'; el.style.top = clamp(p.y, 0, Math.max(0, r.height - h)) + 'px';
}
function buildFavbar(){
  const el = $('#favbar'); if (!el) return;
  const list = (S.favs || []).filter(t => DTOOLS[t]), show = list.length > 0 && S.favShow !== false;
  el.hidden = !show; if (!show){ updateRail(); return; }
  el.className = 'favbar' + (S.favH ? ' h' : '');
  el.innerHTML = `<div class="fb-grip" title="Déplacer la barre" aria-label="Déplacer la barre">${GRIP}</div>` +
    list.map(t => `<button class="rb" data-t="${t}" title="${DTOOLS[t].name} (clic droit pour retirer des favoris)" aria-label="${DTOOLS[t].name}">${svgI(DTOOLS[t].ic)}</button>`).join('') +
    `<div class="fsep"></div><button class="rb sm" data-o="1" title="Passer en horizontal ou en vertical" aria-label="Changer l'orientation">${ROT}</button><button class="rb sm" data-c="1" title="Masquer la barre" aria-label="Masquer la barre">${XIC}</button>`;
  placeFav(); updateRail();
}
(() => {
  const el = $('#favbar'); let dg = null;
  el.addEventListener('pointerdown', e => { if (!e.target.closest('.fb-grip')) return; const r = el.getBoundingClientRect(); dg = {dx:e.clientX - r.left, dy:e.clientY - r.top}; el.setPointerCapture(e.pointerId); e.preventDefault(); });
  el.addEventListener('pointermove', e => { if (!dg) return; const c = $('#cw').getBoundingClientRect(); S.favPos = {x:e.clientX - c.left - dg.dx, y:e.clientY - c.top - dg.dy}; placeFav(); });
  const end = () => { if (dg){ dg = null; save(); } };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  el.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.t){ setTool(b.dataset.t); return; }
    if (b.dataset.o){ S.favH = !S.favH; save(); buildFavbar(); return; }
    if (b.dataset.c){ S.favShow = false; save(); buildFavbar(); toast('Barre de favoris masquée. Réaffiche-la avec l\\u2019étoile de la barre de gauche.'); }
  });
  el.addEventListener('contextmenu', e => { const b = e.target.closest('[data-t]'); if (!b) return; e.preventDefault(); toggleFav(b.dataset.t); toast('Retiré des favoris.'); });
})();
function buildRail(){
  const r = $('#rail');
  const grp = DGROUPS.map(g => `<button class="rb" data-g="${g.id}" title="${g.name}" aria-label="${g.name}">${svgI(DTOOLS[RAILSEL[g.id]].ic)}</button>`).join('');
  r.innerHTML = `<button class="rb" data-t="" title="Curseur (Échap)" aria-label="Curseur">${svgI('<path d="M5 3l13 8-6 1.5L9.5 19z"/>')}</button><div class="rsep"></div>${grp}<div class="rsep"></div>` +
    `<button class="rb" data-x="favs" title="Afficher ou masquer la barre de favoris" aria-label="Barre de favoris">${STAR_IC}</button>` +
    `<button class="rb" data-x="magnet" title="Aimant : accroche aux ouvertures, hauts, bas et clôtures" aria-label="Aimant">${svgI('<path d="M6 4v8a6 6 0 0 0 12 0V4h-4v8a2 2 0 0 1-4 0V4z"/>')}</button>` +
    `<button class="rb" data-x="stay" title="Garder l'outil actif après chaque tracé" aria-label="Garder l'outil actif">${svgI('<rect x="6" y="11" width="12" height="9"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/>')}</button>` +
    `<button class="rb" data-x="hide" title="Masquer ou afficher les dessins" aria-label="Masquer les dessins">${svgI('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>')}</button>` +
    `<button class="rb" data-x="trash" title="Tout supprimer" aria-label="Tout supprimer">${svgI('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>')}</button>` +
    `<input type="color" class="rcol" id="dcol" value="${S.dcol}" title="Couleur par défaut des nouveaux dessins" aria-label="Couleur par défaut">`;
  updateRail();
}
function updateRail(){
  const r = $('#rail'); if (!r) return; const ag = DT ? groupOfTool(DT) : null;
  $$('#rail [data-g]').forEach(b => b.setAttribute('aria-pressed', String(!!ag && ag.id === b.dataset.g)));
  const cb = r.querySelector('[data-t=""]'); if (cb) cb.setAttribute('aria-pressed', String(!DT));
  $$('#favbar [data-t]').forEach(b => b.setAttribute('aria-pressed', String(DT === b.dataset.t)));
  const st = {magnet:S.magnet, stay:S.dstay, hide:S.dhide, favs:S.favShow !== false && (S.favs || []).length > 0};
  $$('#rail [data-x]').forEach(b => { if (b.dataset.x in st) b.setAttribute('aria-pressed', String(!!st[b.dataset.x])); });
}
function closeFly(){ const f = $('#fly'); if (f) f.hidden = true; }
function openFly(btn, gid){
  const g = DGROUPS.find(x => x.id === gid), f = $('#fly');
  f.innerHTML = `<div class="fh">${g.name}</div>` + g.tools.map(t => `<div class="fir"><button class="fi" data-t="${t}">${svgI(DTOOLS[t].ic)}<span>${DTOOLS[t].name}</span></button><button class="fav${isFav(t) ? ' on' : ''}" data-fav="${t}" title="Ajouter ou retirer des favoris" aria-label="Favori">${STAR_IC}</button></div>`).join('');
  const r = btn.getBoundingClientRect(); f.hidden = false; f.style.left = (r.right + 6) + 'px'; f.style.top = clamp(r.top, 8, Math.max(8, window.innerHeight - f.offsetHeight - 8)) + 'px';
}
$('#rail').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.g){ const f = $('#fly'); if (!f.hidden && f.dataset.g === b.dataset.g){ closeFly(); return; } f.dataset.g = b.dataset.g; openFly(b, b.dataset.g); return; }
  if (b.dataset.t === ''){ DT = null; DR = null; closeFly(); updateRail(); updateHint(); drawChart(); return; }
  if (b.dataset.t){ setTool(b.dataset.t); return; }

  if (b.dataset.x === 'favs'){
    if (!(S.favs || []).length){ toast('Ajoute des outils avec l\u2019étoile dans les menus pour les voir ici.'); return; }
    S.favShow = S.favShow === false; save(); buildFavbar(); return;
  }
  if (b.dataset.x === 'magnet'){ S.magnet = !S.magnet; save(); updateRail(); toast(S.magnet ? 'Aimant activé : les points s\u2019accrochent aux bougies.' : 'Aimant désactivé.'); }
  else if (b.dataset.x === 'stay'){ S.dstay = !S.dstay; save(); updateRail(); toast(S.dstay ? 'L\u2019outil reste actif après chaque tracé.' : 'L\u2019outil se désactive après chaque tracé.'); }
  else if (b.dataset.x === 'hide'){ S.dhide = !S.dhide; updateRail(); drawChart(); }
  else if (b.dataset.x === 'trash'){
    if (!SS.draws.length){ toast('Aucun dessin à supprimer.'); return; }
    if (b.dataset.armed){ pushUndo(); SS.draws = []; SEL = null; delete b.dataset.armed; save(); updateDtb(); drawChart(); toast('Tous les dessins ont été supprimés (Ctrl+Z pour annuler).'); }
    else { b.dataset.armed = '1'; b.setAttribute('aria-pressed', 'true'); toast('Clique encore pour tout supprimer.'); setTimeout(() => { delete b.dataset.armed; b.setAttribute('aria-pressed', 'false'); }, 3000); }
  }
});
$('#rail').addEventListener('input', e => { if (e.target.id === 'dcol'){ S.dcol = e.target.value; save(); } });
$('#fly').addEventListener('click', e => { const fv = e.target.closest('[data-fav]'); if (fv){ toggleFav(fv.dataset.fav); return; } const b = e.target.closest('[data-t]'); if (b) setTool(b.dataset.t); });
document.addEventListener('pointerdown', e => { if (!e.target.closest('#fly') && !e.target.closest('[data-g]')) closeFly(); });

/* barre de réglage du dessin sélectionné */
function updateDtb(){
  const el = $('#dtb'), d = getDraw(SEL); if (!d){ el.hidden = true; return; } el.hidden = false;
  el.innerHTML = `<input type="color" data-a="col" value="${/^#[0-9a-f]{6}$/i.test(d.col) ? d.col : '#6fa8ff'}" aria-label="Couleur"><div class="seg">${[1, 2, 3, 4].map(n => `<button data-a="w" data-v="${n}" aria-pressed="${(d.w || 2) === n}">${n}</button>`).join('')}</div>` +
    `<button class="btn sm" data-a="dash" aria-pressed="${!!d.dash}">Pointillés</button>${d.type === 'text' ? '<button class="btn sm" data-a="edit">Modifier le texte</button>' : ''}<button class="btn sm" data-a="clone">Dupliquer</button><button class="btn sm" data-a="del">Supprimer</button>`;
}
$('#dtb').addEventListener('input', e => { const d = getDraw(SEL); if (d && e.target.dataset.a === 'col'){ d.col = e.target.value; save(); drawChart(); } });
$('#dtb').addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); const d = getDraw(SEL); if (!b || !d || b.dataset.a === 'col') return;
  if (b.dataset.a === 'w'){ pushUndo(); d.w = +b.dataset.v; updateDtb(); }
  else if (b.dataset.a === 'dash'){ pushUndo(); d.dash = !d.dash; updateDtb(); }
  else if (b.dataset.a === 'del'){ deleteSel(); return; }
  else if (b.dataset.a === 'clone'){ pushUndo(); const c = JSON.parse(JSON.stringify(d)); c.id = 'd' + Date.now().toString(36) + 'c'; c.pts.forEach(q => { q.t += tfSecs() * 3; }); SS.draws.push(c); SEL = c.id; updateDtb(); }
  else if (b.dataset.a === 'edit'){ TXP = {id:d.id}; $('#txIn').value = d.text || ''; showDlg($('#txtDlg')); setTimeout(() => $('#txIn').focus(), 30); return; }
  save(); drawChart();
});
$('#txOk').onclick = () => {
  const v = $('#txIn').value.trim(); closeDlg($('#txtDlg')); if (!TXP) return;
  if (TXP.id){ const d = getDraw(TXP.id); if (d && v){ pushUndo(); d.text = v; } save(); drawChart(); }
  else if (v) addDrawing('text', [TXP.pt], {text:v});
  TXP = null;
};
$('#txIn').addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); $('#txOk').click(); } });
$('#txClose').onclick = () => { closeDlg($('#txtDlg')); TXP = null; };

/* ---------- Mise en page : panneau d'ordre, dock, agrandissement ---------- */
const ICO_MAX = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
const ICO_MIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
function applyTk(){
  const eff = S.max && S.tk === 'dock' ? 'float' : S.tk, m = $('.main'), tk = $('#ticket');
  m.className = 'main tk-' + eff; tk.classList.toggle('float', eff === 'float'); tk.classList.toggle('min', !!S.tkMin);
  $('#tkPill').hidden = eff !== 'hide' || !SS;
  if (eff === 'float'){
    const pos = S.tkPos || {x:Math.max(8, window.innerWidth - 320), y:120};
    tk.style.left = clamp(pos.x, 0, Math.max(0, window.innerWidth - 150)) + 'px'; tk.style.top = clamp(pos.y, 0, Math.max(0, window.innerHeight - 90)) + 'px';
  } else { tk.style.left = ''; tk.style.top = ''; }
  $('#tkFloat').title = S.tk === 'float' ? 'Replacer dans la colonne' : 'Détacher sur le graphique';
  requestAnimationFrame(resize);
}
function setMax(on){
  S.max = !!on; $('.stage').classList.toggle('max', S.max); document.body.classList.toggle('maxed', S.max);
  const b = $('#btnMax'); b.setAttribute('aria-pressed', String(S.max)); b.innerHTML = (S.max ? ICO_MIN : ICO_MAX) + `<span>${S.max ? 'Réduire' : 'Agrandir'}</span>`;
  b.title = S.max ? 'Remettre le graphique en taille normale (touche F)' : 'Agrandir le graphique (touche F)';
  applyTk();
}
function applyDock(){
  const dk = $('#dock'); dk.classList.toggle('min', !!S.dockMin); dk.hidden = !!S.dockHide; dk.style.setProperty('--dockh', S.dockH + 'px');
  $('#btnDockShow').setAttribute('aria-pressed', String(!S.dockHide)); requestAnimationFrame(resize);
}
$('#btnDockHide').onclick = () => { S.dockHide = true; save(); applyDock(); };
$('#btnDockShow').onclick = () => { S.dockHide = !S.dockHide; if (!S.dockHide) S.dockMin = false; save(); applyDock(); };
(() => {
  const h = $('#dockrs'); let dg = null;
  h.addEventListener('pointerdown', e => { dg = {y0:e.clientY, h0:$('#dock').getBoundingClientRect().height}; h.classList.add('on'); h.setPointerCapture(e.pointerId); e.preventDefault(); });
  h.addEventListener('pointermove', e => { if (!dg) return; S.dockH = Math.round(clamp(dg.h0 + (dg.y0 - e.clientY), 90, window.innerHeight * .75)); $('#dock').style.setProperty('--dockh', S.dockH + 'px'); });
  const end = () => { if (dg){ dg = null; h.classList.remove('on'); save(); requestAnimationFrame(resize); } };
  h.addEventListener('pointerup', end); h.addEventListener('pointercancel', end);
  h.addEventListener('dblclick', () => { S.dockH = 232; save(); applyDock(); });
})();
$('#btnMax').onclick = () => setMax(!S.max);
$('#btnDock').onclick = () => { S.dockMin = !S.dockMin; save(); applyDock(); };
$('#tkMin').onclick = () => { S.tkMin = !S.tkMin; save(); applyTk(); };
$('#tkFloat').onclick = () => { S.tk = S.tk === 'float' ? 'dock' : 'float'; save(); applyTk(); };
$('#tkHide').onclick = () => { S.tkPrev = S.tk; S.tk = 'hide'; save(); applyTk(); };
$('#tkShow').onclick = () => { S.tk = S.tkPrev && S.tkPrev !== 'hide' ? S.tkPrev : 'dock'; save(); applyTk(); };
$('#pillBuy').onclick = () => order('buy'); $('#pillSell').onclick = () => order('sell');
(() => {
  const h = $('#ticket .tkh'); let dg = null;
  h.addEventListener('pointerdown', e => { if (!$('#ticket').classList.contains('float') || e.target.closest('button')) return; const r = $('#ticket').getBoundingClientRect(); dg = {dx:e.clientX - r.left, dy:e.clientY - r.top}; h.setPointerCapture(e.pointerId); });
  h.addEventListener('pointermove', e => { if (!dg) return; S.tkPos = {x:clamp(e.clientX - dg.dx, 0, window.innerWidth - 150), y:clamp(e.clientY - dg.dy, 0, window.innerHeight - 90)}; $('#ticket').style.left = S.tkPos.x + 'px'; $('#ticket').style.top = S.tkPos.y + 'px'; });
  h.addEventListener('pointerup', () => { if (dg){ dg = null; save(); } });
})();

/* ---------- Couleurs du graphique ---------- */
const CC_FIELDS = [['up', 'Bougie haussière'], ['dn', 'Bougie baissière'], ['bg', 'Fond du graphique'], ['grid', 'Grille'], ['text', 'Texte et axes'], ['border', 'Contour des bougies']];
const CC_PRESETS = [
  {n:'Origine', v:{}},
  {n:'TradingView', v:{up:'#26A69A', dn:'#EF5350', bg:'#131722', grid:'#1E222D', text:'#787B86'}},
  {n:'Clair', v:{up:'#089981', dn:'#F23645', bg:'#FFFFFF', grid:'#F0F3FA', text:'#6A6D78'}},
  {n:'Monochrome', v:{up:'#E6E8EC', dn:'#6B7280', bg:'#0F1115', grid:'#1A1D23', text:'#8B93A1', hollow:true}},
  {n:'Or et nuit', v:{up:'#E9C46A', dn:'#5B6B8C', bg:'#0A0D1A', grid:'#141A30', text:'#9AA3BC'}},
  {n:'Néon', v:{up:'#00E5FF', dn:'#FF2D95', bg:'#0A0A14', grid:'#15152A', text:'#7C7FA6'}},
  {n:'Classique', v:{up:'#00C853', dn:'#FF1744', bg:'#0B0E14', grid:'#161B26', text:'#8A93A6'}}
];
const hex6 = v => /^#[0-9a-f]{6}$/i.test(v) ? v : '#888888';
function fillColors(){
  const cur = {up:C.cUp, dn:C.cDn, bg:C.chart, grid:C.grid, text:C.axis, border:(S.cc && S.cc.border) || '#000000'};
  $('#cFields').innerHTML = CC_FIELDS.map(([k, l]) => `<div class="fld"><label for="cc_${k}">${l}</label><input type="color" id="cc_${k}" data-k="${k}" value="${hex6(cur[k])}"></div>`).join('');
  $('#cBorder').checked = !(S.cc && S.cc.noborder); $('#cHollow').checked = !!(S.cc && S.cc.hollow); $('#cGrid').checked = !(S.cc && S.cc.nogrid);
}
function applyColors(){ readColors(); save(); if (SS) drawChart(); }
$('#cPresets').innerHTML = CC_PRESETS.map((p, i) => `<button data-i="${i}"><i>${['up', 'dn', 'bg'].map(k => `<b style="background:${p.v[k] || (k === 'up' ? '#2FD3A4' : k === 'dn' ? '#FF5C6E' : '#111A25')}"></b>`).join('')}</i>${p.n}</button>`).join('');
$('#cPresets').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; S.cc = Object.assign({}, CC_PRESETS[+b.dataset.i].v); applyColors(); fillColors(); });
$('#cFields').addEventListener('input', e => { const k = e.target.dataset.k; if (!k) return; S.cc = S.cc || {}; S.cc[k] = e.target.value; applyColors(); });
$('#cHollow').onchange = e => { S.cc = S.cc || {}; S.cc.hollow = e.target.checked; applyColors(); };
$('#cBorder').onchange = e => { S.cc = S.cc || {}; S.cc.noborder = !e.target.checked; applyColors(); };
$('#cGrid').onchange = e => { S.cc = S.cc || {}; S.cc.nogrid = !e.target.checked; applyColors(); };
$('#cReset').onclick = () => { S.cc = {}; applyColors(); fillColors(); };
$('#btnColors').onclick = () => { fillColors(); showDlg($('#colDlg')); };
$('#colClose').onclick = () => closeDlg($('#colDlg'));

/* ---------- Setup events ---------- */
$('#mSearch').oninput = renderMkts;
$('#chOn').onchange = e => { $('#chBox').hidden = !e.target.checked; updateChPrev(); };
['nCap', 'chT', 'chL'].forEach(id => $('#' + id).addEventListener('input', updateChPrev));
$$('#curSeg button').forEach(b => b.onclick = () => { setupCur = b.dataset.c; $$('#curSeg button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); updateChPrev(); });
$('#nGo').onclick = createSession;
$('#nBack').onclick = () => { if (SS) hideSetup(); };
$('#saved').addEventListener('click', e => {
  const o = e.target.closest('[data-open]'), d = e.target.closest('[data-del]');
  if (o) openSession(o.dataset.open);
  else if (d){
    if (d.dataset.armed){ const id = d.dataset.del; delete S.sessions[id]; if (S.sid === id){ SS = null; D = null; INST = null; } save(); renderSaved(); $('#nBack').hidden = !SS; }
    else { d.dataset.armed = '1'; d.textContent = 'Confirmer'; setTimeout(() => { if (d.isConnected){ delete d.dataset.armed; d.textContent = 'Supprimer'; } }, 3000); }
  }
});

/* ---------- Init ---------- */
loadPrefs();
document.documentElement.dataset.theme = S.theme === 'light' ? 'light' : 'dark';
readColors(); renderMkts(); renderLegend(); buildRail(); buildFavbar();
$('#spd').value = String(S.speed);
$$('#ctype button').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.ct === S.ctype)));
$('#hintDraft').hidden = false;
applyTk(); applyDock();
showSetup();
})();
