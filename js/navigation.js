/* ============= PAGE D'ACCUEIL ============= */
function affichHome() {
  render(`
    <div class="home-container">
      <img src="Images/Banner/Tarot_Banner.jpg" class="home-banner">
      <h1>Explorez la magie des Arcanes</h1>
      <p>
        Le Tarot est un voyage symbolique à travers les mystères de l’existence.<br>
        Découvrez la sagesse des cartes, apprenez à les faire parler à travers différents tirages, ou laissez le hasard choisir pour vous.
      </p>
      <div class="home-buttons">
        <div class="button-group">
          <button onclick="affichChoixSignifications()">Signification des cartes</button>
          <button onclick="affichCategoriesTirages()">Méthodes de tirage</button>
        </div>
        <div class="button-group">
          <button onclick="afficherCarteDuJour()">Carte du jour</button>
          <button onclick="afficherDeckDuJour()">Deck du jour</button>
        </div>
      </div>
    </div>
  `);
}

/* ============= PAGE SIGNIFICATIONS ============= */
function affichChoixSignifications() {
  const familles = ["Bâtons", "Coupes", "Épées", "Deniers"];
  
  const content = `<div class="menu-significations-grid" id="menuSignifications"></div>`;
  renderPage("Signification des cartes", content, affichHome);

  const container = document.getElementById("menuSignifications");

  const majeureArcane = listeMajors.find(a => a.Nom.toLowerCase() === "le monde") || listeMajors[0];
  const blocMajor = creerBlocMenu(majeureArcane, "Arcanes Majeures", affichListeMajor);
  blocMajor.classList.add("card-major");
  container.appendChild(blocMajor);

  familles.forEach(famille => {
    const as = listeMinors.find(arcane => 
      normalizeFamille(arcane.Famille) === normalizeFamille(famille) && 
      arcane.Nom.toLowerCase().startsWith("as")
    );
    
    const bloc = creerBlocMenu(
        as, 
        familleToLabel(famille), 
        () => affichListeMinor(famille)
    );
    container.appendChild(bloc);
  });
}

/* ============= BLOC MENU ============= */
function creerBlocMenu(arcane, label, action) {
  const bloc = document.createElement("div");
  bloc.className = "minor-famille-card";
  
  const imgSrc = arcane ? nomToImagePath(arcane) : 'Images/placeholder.png';
  
  bloc.innerHTML = `
    <img src="${imgSrc}" alt="${label}">
    <button>${label}</button>
  `;
  
  bloc.onclick = action;
  
  return bloc;
}

/* ============= CARTE DU JOUR ============= */
function afficherCarteDuJour() {
    const toutesLesCartes = [...listeMajors, ...listeMinors];
    if (toutesLesCartes.length === 0) { alert("Aucune carte."); return; }
    const carteChoisie = toutesLesCartes[Math.floor(Math.random() * toutesLesCartes.length)];
    
    creerOverlayMagique(carteChoisie);
}

function creerOverlayMagique(carte) {
    const overlay = document.createElement('div');
    overlay.id = 'magicalOverlay';
    overlay.className = 'magical-overlay';

    const imageDos = getImagePathDos(); 

    // Construction de la carte (conteneur flip + recto/verso)
    overlay.innerHTML = `
        <div class="scene">
            <div class="card-flipper" id="cardFlipper">
                <div class="card-face card-back">
                    <img src="${imageDos}" alt="Dos de la carte" fetchpriority="high">
                </div>
                
                <div class="card-face card-front">
                    <img src="${nomToImagePath(carte)}" alt="${carte.Nom}">
                </div>
            </div>
            <p class="overlay-instruction">La carte se révèle...</p>
        </div>
        <button class="overlay-close-btn" onclick="fermerOverlayMagique()">✕</button>
    `;

    document.body.appendChild(overlay);

    // Animation et Navigation
    const flipper = document.getElementById('cardFlipper');
    void flipper.offsetWidth; 
    const timerFlip = setTimeout(() => {
        flipper.classList.add('is-flipped');
        
        const instr = document.querySelector('.overlay-instruction');
        instr.textContent = "Cliquez sur la carte pour voir sa signification";
        instr.classList.add('clickable');

        flipper.onclick = () => {
            fermerOverlayMagique();
            affichArcane(carte, affichHome);
        };
        
    }, 2500);

    overlay.dataset.timerId = timerFlip;
}


/* ============= DECK DU JOUR ============= */
function afficherDeckDuJour() {
    if (typeof listeDecks === 'undefined' || listeDecks.length === 0) {
        alert("La liste des decks n'est pas disponible.");
        return;
    }

    const deckChoisi = listeDecks[Math.floor(Math.random() * listeDecks.length)];
    
    creerOverlayDeckMagique(deckChoisi);
}

function creerOverlayDeckMagique(deck) {
    const overlay = document.createElement('div');
    overlay.id = 'magicalOverlay';
    overlay.className = 'magical-overlay';

    const imageDos = getImagePathDos(); 
    const imgDeck = deck.Image || 'Images/placeholder.png';
    const nomDeck = deck.Nom || "Deck mystère";
    const typeDeck = deck.Type || "Oracle / Tarot";

    overlay.innerHTML = `
        <div class="scene">
            <div class="card-flipper" id="cardFlipper">
                <div class="card-face card-back">
                    <img src="${imageDos}" alt="Dos du deck" fetchpriority="high">
                </div>
                
                <div class="card-face card-front deck-front">
                    <img src="${imgDeck}" alt="${nomDeck}">
                    <div class="deck-flash-info">
                        <span class="deck-type-badge">${typeDeck}</span>
                        <p class="deck-nom-flash">${nomDeck}</p>
                    </div>
                </div>
            </div>
            <p class="overlay-instruction">Le deck se révèle...</p>
        </div>
        <button class="overlay-close-btn" onclick="fermerOverlayMagique()">✕</button>
    `;

    document.body.appendChild(overlay);

    const flipper = document.getElementById('cardFlipper');
    void flipper.offsetWidth; 

    const timerFlip = setTimeout(() => {
        flipper.classList.add('is-flipped');
        
        const instr = document.querySelector('.overlay-instruction');
        instr.textContent = "Voici le deck du jour !";
        instr.classList.add('clickable');

        flipper.onclick = () => {
            fermerOverlayMagique();
        };
        
    }, 2500);

    overlay.dataset.timerId = timerFlip;
}


function fermerOverlayMagique() {
    const overlay = document.getElementById('magicalOverlay');
    if (overlay) {
        clearTimeout(overlay.dataset.timerId);

        overlay.classList.add('fade-out');

        setTimeout(() => {
            overlay.remove();
        }, 500);
    }
}

function getImagePathDos() {
  return "Images/Dos_carte.png";
}

(function prechargerDosCarte() {
    const imgPreload = new Image();
    imgPreload.src = getImagePathDos();
})();
