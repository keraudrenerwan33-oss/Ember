// ===================== storage.js =====================
// Couche de persistance : tout est stocké en localStorage, propre à ce navigateur.
window.EF = window.EF || {};

EF.storage = (function () {
  const KEYS = {
    accounts: 'ef_accounts',
    strategies: 'ef_strategies',
    goals: 'ef_goals',
    trades: 'ef_trades',
    settings: 'ef_settings',
    analyses: 'ef_analyses',
    activeAccount: 'ef_active_account'
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error('Lecture storage échouée pour', key, e);
      return fallback;
    }
  }
  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Écriture storage échouée pour', key, e);
      return false;
    }
  }

  function ensureDefaults() {
    let accounts = read(KEYS.accounts, null);
    if (!accounts || !accounts.length) {
      accounts = [{
        id: EF.utils.uid(),
        name: 'Compte personnel',
        broker: 'Personnel',
        capital: 10000,
        currency: 'USD',
        createdAt: new Date().toISOString()
      }];
      write(KEYS.accounts, accounts);
    }
    if (!localStorage.getItem(KEYS.activeAccount)) {
      write(KEYS.activeAccount, accounts[0].id);
    }
    if (!read(KEYS.strategies, null)) write(KEYS.strategies, []);
    if (!read(KEYS.goals, null)) write(KEYS.goals, []);
    if (!read(KEYS.trades, null)) write(KEYS.trades, []);
    if (!read(KEYS.analyses, null)) write(KEYS.analyses, []);
    if (!read(KEYS.settings, null)) write(KEYS.settings, { apiKey: '' });
  }

  return {
    KEYS,
    ensureDefaults,
    getAccounts: () => read(KEYS.accounts, []),
    saveAccounts: (v) => write(KEYS.accounts, v),
    getActiveAccountId: () => read(KEYS.activeAccount, null),
    setActiveAccountId: (id) => write(KEYS.activeAccount, id),
    getStrategies: () => read(KEYS.strategies, []),
    saveStrategies: (v) => write(KEYS.strategies, v),
    getGoals: () => read(KEYS.goals, []),
    saveGoals: (v) => write(KEYS.goals, v),
    getTrades: () => read(KEYS.trades, []),
    saveTrades: (v) => write(KEYS.trades, v),
    getSettings: () => read(KEYS.settings, { apiKey: '' }),
    saveSettings: (v) => write(KEYS.settings, v),
    getAnalyses: () => read(KEYS.analyses, []),
    saveAnalyses: (v) => write(KEYS.analyses, v),
    exportAll: () => ({
      accounts: read(KEYS.accounts, []),
      strategies: read(KEYS.strategies, []),
      goals: read(KEYS.goals, []),
      trades: read(KEYS.trades, []),
      analyses: read(KEYS.analyses, []),
      exportedAt: new Date().toISOString(),
      version: 1
    }),
    importAll: (data) => {
      if (data.accounts) write(KEYS.accounts, data.accounts);
      if (data.strategies) write(KEYS.strategies, data.strategies);
      if (data.goals) write(KEYS.goals, data.goals);
      if (data.trades) write(KEYS.trades, data.trades);
      if (data.analyses) write(KEYS.analyses, data.analyses);
      if (data.accounts && data.accounts[0]) write(KEYS.activeAccount, data.accounts[0].id);
    },
    resetAll: () => {
      Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    }
  };
})();
