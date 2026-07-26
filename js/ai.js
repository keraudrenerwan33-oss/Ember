// ===================== ai.js =====================
window.EF = window.EF || {};

EF.ai = (function () {

  function buildTradeSummary(trades, strategies) {
    return trades.map(t => ({
      date: t.entryTime,
      actif: t.asset,
      classe: t.assetClass,
      direction: t.direction,
      taille: t.size,
      entree: t.entryPrice,
      sortie: t.exitPrice,
      sl: t.sl,
      tp: t.tp,
      pnl: t.pnl,
      rr: t.rr,
      duree_min: t.durationMinutes,
      strategie: EF.utils.resolveStrategyName(t.strategyId, strategies),
      session: t.session === 'auto' ? EF.utils.detectSession(t.entryTime) : t.session,
      tags: t.tags,
      plan_respecte: t.planRespected,
      emotion: t.emotion,
      notes: t.notes
    }));
  }

  function buildPrompt(mode, trades, strategies, stats) {
    const summary = buildTradeSummary(trades, strategies);
    const base = `Tu es un coach de trading professionnel qui analyse le journal d'un trader (Forex, indices, or, actions, crypto). Voici ${summary.length} trades au format JSON :

${JSON.stringify(summary, null, 2)}

Statistiques déjà calculées pour référence : win rate ${stats.winRate.toFixed(1)}%, profit factor ${isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : '∞'}, expectancy ${stats.expectancy.toFixed(2)}, drawdown max ${stats.maxDD.toFixed(1)}%, meilleure série de victoires ${stats.bestWinStreak}, pire série de défaites ${stats.bestLossStreak}.

Réponds en français, dans un style direct et professionnel, sans emoji, sans titres markdown (pas de #). Structure ta réponse en paragraphes courts séparés par une ligne vide, avec des mots clés importants en gras via **mot**.`;

    if (mode === 'week') {
      return base + `\n\nFais un résumé de la performance de la semaine écoulée : ce qui a bien fonctionné, ce qui doit être corrigé, et une recommandation claire pour la semaine à venir.`;
    }
    if (mode === 'month') {
      return base + `\n\nFais un résumé de la performance du mois écoulé : tendance générale, meilleure et pire décision, évolution de la discipline, et un axe d'amélioration prioritaire pour le mois suivant.`;
    }
    return base + `\n\nFais une analyse complète couvrant, sans les numéroter explicitement : les erreurs récurrentes et mauvaises habitudes détectées, les signes de sur-trading ou d'excès de risque, la relation entre l'état émotionnel et les résultats, les meilleures stratégies et actifs, les heures les plus rentables, et deux ou trois conseils concrets et actionnables. Reste factuel et base-toi uniquement sur les données fournies.`;
  }

  async function analyze(mode, trades, strategies, stats, apiKey) {
    if (!apiKey) {
      throw new Error('NO_KEY');
    }
    const prompt = buildPrompt(mode, trades, strategies, stats);
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      throw new Error('API_ERROR: ' + response.status + ' ' + errBody.slice(0, 200));
    }
    const data = await response.json();
    const text = (data.content || []).map(b => b.text || '').join('\n').trim();
    if (!text) throw new Error('EMPTY_RESPONSE');
    return text;
  }

  function renderText(text) {
    return text.split(/\n\s*\n/).map(p => {
      const div = document.createElement('div');
      div.textContent = p;
      const escaped = div.innerHTML;
      const bolded = escaped.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--gold-bright);">$1</strong>');
      return `<p>${bolded.replace(/\n/g, '<br>')}</p>`;
    }).join('');
  }

  return { analyze, renderText };
})();
