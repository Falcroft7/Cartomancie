function showHome() {
  renderApp(`
    <div class="home-container">
      <img src="Images/Banner/Tarot_Banner.jpg" class="home-banner" alt="Illustration du tarot">
      <h1>Explorez la magie des Arcanes</h1>
      <p>
        Les cartes du Tarot sont autant de miroirs qui invitent à la réflexion.<br>
        Elles ne donnent pas nécessairement une réponse définitive, mais proposent des images, des symboles et des pistes pour mieux comprendre une question, une émotion ou une situation.<br>
        Explorez les arcanes, découvrez leurs messages, expérimentez différents tirages et laissez votre intuition donner du sens à chaque carte révélée.
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
      </div>
    </div>
  `);

  document.getElementById("arcanaButton")?.addEventListener("click", showArcanaMenu);
  document.getElementById("spreadsButton")?.addEventListener("click", showSpreadCategories);
  document.getElementById("dailyCardButton")?.addEventListener("click", showCardOfTheDay);
  document.getElementById("dailyDeckButton")?.addEventListener("click", showDeckOfTheDay);
}
