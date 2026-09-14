function showDeckOfTheDay() {
  if (deckList.length === 0) {
    alert("La liste des decks n'est pas disponible.");
    return;
  }
  createDeckRevealOverlay(deckList[Math.floor(Math.random() * deckList.length)]);
}

function createDeckRevealOverlay(deck) {
  closeExistingOverlay();
  const overlay = document.createElement("div");
  overlay.id = "revealOverlay";
  overlay.className = "reveal-overlay";
  overlay.innerHTML = `
    <div class="scene scene-deck">
      <div class="card-flipper" id="cardFlipper">
        <div class="card-face card-back"><img alt="Dos du deck" fetchpriority="high"></div>
        <div class="card-face card-front"><img class="daily-deck-image" alt="Deck révélé"></div>
      </div>
      <p class="reveal-instruction">Le deck se révèle...</p>
      <div id="deckRevealInfo" class="deck-info">
        <span class="deck-type-badge"></span>
        <p class="deck-name"></p>
      </div>
    </div>
    <button type="button" class="overlay-close-button" aria-label="Fermer">✕</button>
  `;
  document.body.appendChild(overlay);
  setupOverlay(overlay);
  setupImage(overlay.querySelector(".card-back img"), getCardBackImagePath(), "Dos du deck");
  setupImage(overlay.querySelector(".daily-deck-image"), deck.image, deck.name || "Deck révélé");
  overlay.querySelector(".deck-type-badge").textContent = deck.type || "Oracle / Tarot";
  overlay.querySelector(".deck-name").textContent = deck.name || "Deck mystère";
  overlay.querySelector(".overlay-close-button").addEventListener("click", closeOverlay);

  const flipper = overlay.querySelector(".card-flipper");
  overlay._timerId = setTimeout(() => {
    flipper.classList.add("is-flipped");
    const instruction = overlay.querySelector(".reveal-instruction");
    instruction.textContent = "Voici le deck du jour !";
    instruction.classList.add("clickable");
    overlay.querySelector("#deckRevealInfo").classList.add("visible");
    flipper.addEventListener("click", closeOverlay, { once: true });
  }, 2500);
}
