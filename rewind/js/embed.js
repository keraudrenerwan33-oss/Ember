/* Rewind — mode intégré dans Ember (activé par ?embed=1). Sans ce paramètre, ce fichier ne fait rien. */
(() => {
  if (!/[?&]embed=1/.test(location.search)) return;
  document.documentElement.classList.add('embed');
  document.addEventListener('DOMContentLoaded', () => {
    const setup = document.getElementById('setup');
    if (!setup || window.parent === window) return;
    // Écran de départ visible -> Ember reste affiché ; session lancée -> Rewind passe en plein écran.
    const send = () => window.parent.postMessage({ type: 'rewind-fullscreen', on: setup.hidden }, '*');
    new MutationObserver(send).observe(setup, { attributes: true, attributeFilter: ['hidden'] });
    send();
  });
})();
