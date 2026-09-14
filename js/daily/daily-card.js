function showCardOfTheDay() {
  const cards = [...majorArcanaList, ...minorArcanaList];
  if (cards.length === 0) {
    alert("Aucune carte.");
    return;
  }
  createRevealOverlay(cards[Math.floor(Math.random() * cards.length)]);
}

function createRevealOverlay(card) {
  closeExistingOverlay();
  const overlay = document.createElement("div");
  overlay.id = "revealOverlay";
  overlay.className = "reveal-overlay";
  overlay.innerHTML = `
    <div class="scene">
      <div class="card-flipper" id="cardFlipper">
        <div class="card-face card-back"><img alt="Dos de la carte" fetchpriority="high"></div>
        <div class="card-face card-front"><img class="daily-card-image" alt="Carte révélée"></div>
      </div>
      <p class="reveal-instruction">La carte se révèle...</p>
    </div>
    <button type="button" class="overlay-close-button" aria-label="Fermer">✕</button>
  `;
  document.body.appendChild(overlay);
  setupOverlay(overlay);
  setupImage(overlay.querySelector(".card-back img"), getCardBackImagePath(), "Dos de la carte");
  setupImage(overlay.querySelector(".daily-card-image"), getArcanaImagePath(card), card.Nom || "Carte révélée");
  overlay.querySelector(".overlay-close-button").addEventListener("click", closeOverlay);

  const flipper = overlay.querySelector(".card-flipper");
  const timer = setTimeout(() => {
    flipper.classList.add("is-flipped");
    const instruction = overlay.querySelector(".reveal-instruction");
    instruction.textContent = "Cliquez sur la carte pour voir sa signification";
    instruction.classList.add("clickable");
    flipper.addEventListener("click", () => {
      closeOverlay();
      showArcanaDetails(card, showHome);
    }, { once: true });
  }, 2500);
  overlay._timerId = timer;
}
