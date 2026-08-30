/* =========================================================
   Ember — fond vivant
   Étoiles en warp + nébuleuses colorées + petits écrans de
   graphiques de trading fictifs qui flottent doucement.
   Fichier autonome : n'a besoin d'aucune donnée de l'app.
   ========================================================= */
(function(){
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const gctx = canvas.getContext('2d');
  let W, H, DPR;
  function resize(){
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    gctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize(); window.addEventListener('resize', resize);

  // ---- parallax souris, lissé ----
  let mouseX = 0, mouseY = 0, parX = 0, parY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / W - 0.5) * 2;
    mouseY = (e.clientY / H - 0.5) * 2;
  });

  // ---- nébuleuses de fond ----
  const nebulae = [
    { cx:.14, cy:.20, r:.5,  c:'201,162,39',  a:.08, sx: 22, sy: 14, sp: .00006 },
    { cx:.86, cy:.16, r:.46, c:'194,42,66',   a:.06, sx: -18,sy: 20, sp: .00008 },
    { cx:.5,  cy:.9,  r:.55, c:'63,166,142',  a:.05, sx: 16, sy: -18,sp: .00005 },
  ];
  function drawNebulae(t){
    for(const n of nebulae){
      const dx = Math.cos(t*n.sp) * n.sx, dy = Math.sin(t*n.sp*1.3) * n.sy;
      const cx = W*n.cx + dx, cy = H*n.cy + dy, r = Math.max(W,H)*n.r;
      const g = gctx.createRadialGradient(cx,cy,0,cx,cy,r);
      g.addColorStop(0, `rgba(${n.c},${n.a})`);
      g.addColorStop(1, `rgba(${n.c},0)`);
      gctx.fillStyle = g;
      gctx.fillRect(0,0,W,H);
    }
  }

  // ---- warp starfield ----
  const STAR_N = 220;
  const stars = Array.from({length:STAR_N}, () => spawnStar(true));
  function spawnStar(initial){
    return { x:(Math.random()-0.5)*W, y:(Math.random()-0.5)*H, z: initial ? Math.random()*W : W, pz:0 };
  }
  function drawWarp(dt){
    gctx.fillStyle = 'rgba(7,6,12,1)';
    gctx.fillRect(-20,-20,W+40,H+40);
    for(const s of stars){
      s.pz = s.z; s.z -= 2.6 * dt;
      if(s.z < 1){ Object.assign(s, spawnStar(false)); s.z = W; s.pz = W; }
      const sx = (s.x/s.z)*W + W/2, sy = (s.y/s.z)*W + H/2;
      const px = (s.x/s.pz)*W + W/2, py = (s.y/s.pz)*W + H/2;
      const size = Math.max(0.4,(1-s.z/W)*2.2);
      const alpha = Math.min(1,(1-s.z/W)*1.1);
      gctx.strokeStyle = `rgba(248,244,236,${alpha*0.7})`;
      gctx.lineWidth = size; gctx.lineCap = 'round';
      gctx.beginPath(); gctx.moveTo(px,py); gctx.lineTo(sx,sy); gctx.stroke();
    }
  }

  function drawVignette(){
    const g = gctx.createRadialGradient(W/2,H*0.4,Math.min(W,H)*0.3, W/2,H*0.4,Math.max(W,H)*0.8);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.4)');
    gctx.fillStyle = g;
    gctx.fillRect(0,0,W,H);
  }

  // ---- graphiques de trading fictifs flottants ----
  function makeCandles(n){
    let price = 100 + Math.random()*40;
    const arr = [];
    for(let i=0;i<n;i++){
      const open = price, vol = 1.2 + Math.random()*2.6;
      const close = open + (Math.random()-0.48)*vol;
      const high = Math.max(open,close) + Math.random()*vol*0.6;
      const low = Math.min(open,close) - Math.random()*vol*0.6;
      arr.push({open,close,high,low}); price = close;
    }
    return arr;
  }
  function panelDefs(){
    return [
      { cx:.08, cy:.14, w:210, h:120, symbol:'XAUUSD', tickMs:1000, sway:14, phase:0 },
      { cx:.92, cy:.12, w:190, h:112, symbol:'GBPJPY', tickMs:1300, sway:12, phase:1.4 },
      { cx:.05, cy:.85, w:180, h:108, symbol:'EURUSD', tickMs:1150, sway:16, phase:2.7 },
      { cx:.95, cy:.86, w:200, h:118, symbol:'USDJPY', tickMs:1500, sway:13, phase:4.1 },
    ];
  }
  const panels = panelDefs().map(p => ({ ...p, candles: makeCandles(20), lastTick:0 }));
  function tickPanel(panel, now){
    if(now - panel.lastTick < panel.tickMs) return;
    panel.lastTick = now;
    const price = panel.candles[panel.candles.length-1].close;
    const vol = 1.2 + Math.random()*2.6;
    const open = price, close = open + (Math.random()-0.48)*vol;
    const high = Math.max(open,close)+Math.random()*vol*0.6, low = Math.min(open,close)-Math.random()*vol*0.6;
    panel.candles.push({open,close,high,low});
    if(panel.candles.length > 22) panel.candles.shift();
  }
  function roundRect(x,y,w,h,r){
    gctx.beginPath();
    gctx.moveTo(x+r,y); gctx.arcTo(x+w,y,x+w,y+h,r); gctx.arcTo(x+w,y+h,x,y+h,r);
    gctx.arcTo(x,y+h,x,y,r); gctx.arcTo(x,y,x+w,y,r); gctx.closePath();
  }
  function drawPanel(panel, now){
    tickPanel(panel, now);
    const bob = Math.sin(now*0.0004 + panel.phase) * panel.sway;
    const px = W*panel.cx, py = H*panel.cy + bob;
    const w = panel.w, h = panel.h, x0 = px-w/2, y0 = py-h/2;

    gctx.save();
    gctx.globalAlpha = 0.4;
    gctx.fillStyle = 'rgba(20,18,28,0.3)';
    gctx.strokeStyle = 'rgba(232,178,58,0.18)';
    gctx.lineWidth = 1;
    roundRect(x0,y0,w,h,12); gctx.fill(); gctx.stroke();

    gctx.globalAlpha = 0.5;
    gctx.font = '600 11px Inter, sans-serif';
    gctx.fillStyle = 'rgba(248,244,236,0.5)';
    gctx.fillText(panel.symbol, x0+12, y0+18);

    const candles = panel.candles;
    const cLast = candles[candles.length-1], cFirst = candles[0];
    const up = cLast.close >= cFirst.open;
    gctx.fillStyle = up ? 'rgba(124,255,196,0.55)' : 'rgba(255,107,142,0.55)';
    gctx.font = '700 11px Inter, sans-serif';
    gctx.fillText(cLast.close.toFixed(2), x0+w-56, y0+18);

    const chartX = x0+10, chartY = y0+26, chartW = w-20, chartH = h-38;
    let lo = Infinity, hi = -Infinity;
    for(const c of candles){ lo = Math.min(lo,c.low); hi = Math.max(hi,c.high); }
    const range = Math.max(0.001, hi-lo), cw = chartW/candles.length;
    gctx.globalAlpha = 0.5;
    candles.forEach((c,i) => {
      const cx = chartX + i*cw + cw/2;
      const yFor = (v) => chartY + chartH - ((v-lo)/range)*chartH;
      const yO = yFor(c.open), yC = yFor(c.close), yH = yFor(c.high), yL = yFor(c.low);
      const col = c.close >= c.open ? 'rgba(124,255,196,0.8)' : 'rgba(255,107,142,0.8)';
      gctx.strokeStyle = col; gctx.fillStyle = col; gctx.lineWidth = 1;
      gctx.beginPath(); gctx.moveTo(cx,yH); gctx.lineTo(cx,yL); gctx.stroke();
      const bodyTop = Math.min(yO,yC), bodyH = Math.max(1.4, Math.abs(yC-yO));
      gctx.fillRect(cx-cw*0.32, bodyTop, cw*0.64, bodyH);
    });
    gctx.restore();
  }
  function drawFloatingCharts(now){ for(const p of panels) drawPanel(p, now); }

  let lastT = performance.now();
  function loop(now){
    const dt = Math.min(3, (now-lastT)/16.67);
    lastT = now;
    parX += (mouseX-parX)*0.04;
    parY += (mouseY-parY)*0.04;
    try{
      gctx.save();
      gctx.translate(parX*-10, parY*-8);
      drawWarp(dt);
      drawNebulae(now);
      drawFloatingCharts(now);
      gctx.restore();
      drawVignette();
    }catch(e){ console.error('background render error, continuing:', e); }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
