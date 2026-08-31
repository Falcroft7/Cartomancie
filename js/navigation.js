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
        <button onclick="affichChoixSignifications()">Signification des cartes</button>
        <button onclick="affichCategoriesTirages()">Méthodes de tirage</button>
        <button onclick="afficherCarteDuJour()">Carte du jour</button>
        <button onclick="afficherDeckDuJour()">Deck du jour</button>
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
  // Combine les arcanes majeurs et mineurs
  const toutesLesCartes = [...listeMajors, ...listeMinors];
  
  if (toutesLesCartes.length === 0) {
    alert("Aucune carte disponible.");
    return;
  }

  // Sélection aléatoire d'une carte
  const indexAleatoire = Math.floor(Math.random() * toutesLesCartes.length);
  const carteChoisie = toutesLesCartes[indexAleatoire];

  affichArcane(carteChoisie, affichHome);
}
