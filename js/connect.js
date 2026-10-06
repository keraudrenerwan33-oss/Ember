// ===================== connect.js =====================
// Permet de "connecter" un compte en pointant une seule fois vers le fichier
// d'export d'historique (ex : rapport CSV MT5), puis de le resynchroniser
// en un clic. Nécessite un navigateur compatible (Chrome/Edge) servi en
// http(s) ou localhost — pas disponible en ouverture directe (file://).
window.EF = window.EF || {};

EF.connect = (function () {
  const DB_NAME = 'ember-fs';
  const STORE = 'handles';
  const HANDLE_KEY = 'trading-account-file';

  function supported() {
    return 'showOpenFilePicker' in window && window.isSecureContext !== false;
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  async function idbSet(key, value) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
  async function idbGet(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }
  async function idbDelete(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function pickFile() {
    const [handle] = await window.showOpenFilePicker({
      types: [{ description: 'Export MT5 (CSV ou HTML)', accept: { 'text/csv': ['.csv'], 'text/html': ['.html', '.htm'] } }],
      multiple: false
    });
    await idbSet(HANDLE_KEY, handle);
    return handle;
  }

  async function getStoredHandle() {
    try { return await idbGet(HANDLE_KEY); } catch (e) { return null; }
  }

  async function forget() {
    await idbDelete(HANDLE_KEY);
  }

  async function ensurePermission(handle) {
    const opts = { mode: 'read' };
    if ((await handle.queryPermission(opts)) === 'granted') return true;
    if ((await handle.requestPermission(opts)) === 'granted') return true;
    return false;
  }

  // Fusionne les trades importés avec les trades existants : ignore les
  // doublons (même externalId, ou même actif+heure+P&L si pas de ticket).
  function mergeTrades(existingTrades, importedTrades) {
    const existingKeys = new Set(existingTrades.map(t => t.externalId || (t.asset + '|' + t.entryTime + '|' + t.pnl)));
    const fresh = importedTrades.filter(t => {
      const key = t.externalId || (t.asset + '|' + t.entryTime + '|' + t.pnl);
      return !existingKeys.has(key);
    });
    return fresh;
  }

  async function sync(handle, accountId, existingTrades) {
    const ok = await ensurePermission(handle);
    if (!ok) throw new Error('PERMISSION_DENIED');
    const file = await handle.getFile();
    const text = await EF.utils.readFileSmart(file);
    const imported = EF.utils.importTradesFromFile(text, file.name, accountId);
    const fresh = mergeTrades(existingTrades, imported);
    return { fresh, fileName: file.name, totalParsed: imported.length };
  }

  return { supported, pickFile, getStoredHandle, forget, sync, mergeTrades };
})();
