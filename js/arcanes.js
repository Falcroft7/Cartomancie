/* =========== PAGE ACCUEIL =========== */
function affichHome() {
  render(`
    <div class="home-container">
      <img src="Images/Banner/Tarot_Banner.jpg" class="home-banner">
      <h1>Explorez la magie des Arcanes</h1>
      <p>
        Le Tarot est un voyage symbolique à travers les mystères de l’existence.<br>
        Que vous soyez débutant ou passionné, découvrez chaque carte, son énergie, sa signification et les messages qu’elle souhaite vous transmettre.
      </p>
      <p>
        Choisissez votre voie :<br>
        • commencez par la sagesse profonde des Arcanes Majeures,<br>
        • explorez la richesse quotidienne des Arcanes Mineures,<br>
        • ou initiez-vous aux différentes méthodes de tirage pour donner vie à vos lectures.
      </p>
      <div class="home-buttons">
        <button onclick="affichListeMajor()">Arcanes Majeures</button>
        <button onclick="affichListeMinor()">Arcanes Mineures</button>
        <button onclick="affichCategoriesTirages()">Méthodes de tirage</button>
      </div>
    </div>
  `);
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
  affichListeArcane(listeMajors, "Arcanes Majeures", affichHome);
}

function affichListeMinor() {
  const familles = [...new Set(listeMinors.map(a => a.Famille))];

  const content = `<div class="minor-familles grid-container" id="minorFamilles"></div>`;
  renderPage("Arcanes Mineures", content, affichHome);

  const container = document.getElementById("minorFamilles");

  familles.forEach(famille => {
    const as = listeMinors.find(arcane =>
      normalizeFamille(arcane.Famille) === normalizeFamille(famille) &&
      arcane.Nom.toLowerCase().startsWith("as")
    );

    const bloc = document.createElement("div");
    bloc.className = "minor-famille-card";
    bloc.innerHTML = `
      <img src="${as ? nomToImagePath(as) : 'Images/placeholder.png'}" alt="As de ${famille}">
      <button>${familleToLabel(famille)}</button>
    `;

    bloc.onclick = () => affichListeMinorParFamille(famille);
    container.appendChild(bloc);
  });
}

function affichListeMinorParFamille(famille) {
  const filtered = listeMinors.filter(
    arcane => normalizeFamille(arcane.Famille) === normalizeFamille(famille)
  );
  
  affichListeArcane(filtered, `Arcanes Mineures - ${famille}`, affichListeMinor);
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
