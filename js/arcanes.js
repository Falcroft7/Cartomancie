/* =========== PAGE ACCUEIL =========== */
function affichHome() {
  render(`
    <div class="home-container">
      <img src="Images/Banner/Tarot_Banner.jpg" class="home-banner">
      <h1>Explorez la magie des Arcanes</h1>
      <p>
        Le Tarot est un voyage symbolique à travers les mystères de l’existence.<br>
        Découvrez la sagesse des cartes ou apprenez à les faire parler à travers différents tirages.
      </p>
      <div class="home-buttons">
        <button onclick="affichChoixSignifications()">Signification des cartes</button>
        <button onclick="affichCategoriesTirages()">Méthodes de tirage</button>
      </div>
    </div>
  `);
}

/* =========== MENU INTERMÉDIAIRE : CHOIX SIGNIFICATIONS =========== */
function affichChoixSignifications() {
  const content = `
    <div class="categories grid-container">
      <button onclick="affichListeMajor()">Arcanes Majeures</button>
      <button onclick="affichListeMinorParFamille('Coupes')">Les Coupes</button>
      <button onclick="affichListeMinorParFamille('Bâtons')">Les Bâtons</button>
      <button onclick="affichListeMinorParFamille('Deniers')">Les Deniers</button>
      <button onclick="affichListeMinorParFamille('Épées')">Les Épées</button>
    </div>
  `;
  
  renderPage("Signification des cartes", content, affichHome);
}

/* =========== CREER CARTE =========== */
function creerCarteArcane(arcane, retourAction) {
    const img = nomToImagePath(arcane);
    const card = document.createElement("div");
    card.className = "card";
    const numeroAffiche = arcane.Numero ? `${arcane.Numero} - ` : "";
    card.innerHTML = `
        <img src="${img}" alt="${arcane.Nom}">
        <p>${numeroAffiche}${arcane.Nom}</p>
    `;
    card.onclick = () => affichArcane(arcane, retourAction);
    return card;
}

/* =========== AFFICHAGE LISTES ARCANES =========== */
function affichListeArcane(liste, titre, retourFonction) {
  const content = `<div id="cardsContainer" class="cards grid-container"></div>`;
  
  renderPage(titre, content, retourFonction);

  const container = document.getElementById("cardsContainer");
  
  liste.forEach(arcane => {
    const card = creerCarteArcane(arcane, () => affichListeArcane(liste, titre, retourFonction));
    container.appendChild(card);
  });
}

/* =========== LISTES SPÉCIFIQUES =========== */
function affichListeMajor() {
  affichListeArcane(listeMajors, "Arcanes Majeures", affichChoixSignifications);
}

function affichListeMinorParFamille(famille) {
  const filtered = listeMinors.filter(
    arcane => normalizeFamille(arcane.Famille) === normalizeFamille(famille)
  );
  
  affichListeArcane(filtered, `Arcanes Mineures - ${famille}`, affichChoixSignifications);
}

/* =========== FICHE ARCANE =========== */
function affichArcane(arcane, retourFonction) {
  const img = nomToImagePath(arcane);
  const titre = arcane.Numero && arcane.Numero.trim() 
                ? `${arcane.Numero} - ${arcane.Nom}` 
                : arcane.Nom;

  const content = `
    <div class="fiche-arcane">
      <div class="fiche-image">
        <img src="${img}" alt="${arcane.Nom}" class="fiche-arcane-image">
      </div>
      <div class="fiche-significations">
        <div class="mots-cles">
          <h3>Mots clés</h3>
          <p>${arcane["Mots clés"] || "Non renseigné"}</p>
        </div>
        <div class="fiche-left">
          <h3>Signification Positive</h3>
          <p>${arcane["Signification Positive"] || "Non renseigné"}</p>
        </div>
        <div class="fiche-right">
          <h3>Signification Négative</h3>
          <p>${arcane["Signification Négative"] || "Non renseigné"}</p>
        </div>
      </div>
    </div>
  `;

  renderPage(titre, content, retourFonction);
}
