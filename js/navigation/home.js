function showHome() {
  renderApp(`
    <div class="home-container">
      <img src="Images/Banner/Tarot_Banner.jpg" class="home-banner" alt="Illustration du tarot">
      <h1>Explorez la magie des Arcanes</h1>
      <p>
        Le Tarot est un voyage symbolique à travers les mystères de l’existence.<br>
        Découvrez la sagesse des cartes, apprenez à les faire parler à travers différents tirages, ou laissez le hasard choisir pour vous.
      </p>
      <div class="home-buttons">
        <div class="button-group">
          <button type="button" id="arcanaButton">Signification des cartes</button>
          <button type="button" id="spreadsButton">Méthodes de tirage</button>
        </div>
        <div class="button-group">
          <button type="button" id="dailyCardButton">Carte du jour</button>
          <button type="button" id="dailyDeckButton">Deck du jour</button>
        </div>
        <div class="button-group home-secondary-actions">
          <button type="button" id="compareButton">Comparer deux cartes</button>
        </div>
      </div>
    </div>
  `);

  document.getElementById("arcanaButton")?.addEventListener("click", showArcanaMenu);
  document.getElementById("spreadsButton")?.addEventListener("click", showSpreadCategories);
  document.getElementById("dailyCardButton")?.addEventListener("click", showCardOfTheDay);
  document.getElementById("dailyDeckButton")?.addEventListener("click", showDeckOfTheDay);
  document.getElementById("compareButton")?.addEventListener("click", showArcanaComparison);
}
