let isLoading = false;

function showLoadingState() {
  renderApp(`
    <div class="app-status" role="status" aria-live="polite">
      <p>Chargement des arcanes...</p>
    </div>
  `);
}

function showLoadingError() {
  renderApp(`
    <div class="app-status app-status-error" role="alert">
      <p>Les données sont momentanément indisponibles.</p>
      <p>Vérifie ta connexion puis réessaie.</p>
      <button type="button" id="retryButton">Réessayer</button>
    </div>
  `);
  document.getElementById("retryButton")?.addEventListener("click", initApp);
}

async function initApp() {
  if (isLoading) return;
  isLoading = true;
  showLoadingState();

  try {
    const [arcaneRows, tirageRows, deckRows] = await Promise.all([
      fetchCsv(APP_CONFIG.arcanaCsvUrl),
      fetchCsv(APP_CONFIG.spreadsCsvUrl),
      fetchCsv(APP_CONFIG.decksCsvUrl)
    ]);

    const arcanaRows = normalizeArcanaRows(arcaneRows);
    majorArcanaList = arcanaRows.filter(row => row.Type === "Majeure");
    minorArcanaList = arcanaRows.filter(row => row.Type === "Mineure");

    spreadsByCategory = {};
    normalizeSpreadRows(tirageRows).forEach(spread => {
      if (!spreadsByCategory[spread.category]) {
        spreadsByCategory[spread.category] = [];
      }
      spreadsByCategory[spread.category].push(spread);
    });

    deckList = normalizeDeckRows(deckRows);
    showHome();
  } catch (error) {
    console.error("Erreur fatale au chargement :", error);
    showLoadingError();
  } finally {
    isLoading = false;
  }
}

initApp();
