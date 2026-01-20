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

/* =========== AFFICHAGE LISTES ARCANES =========== */
function affichListeArcane(liste, titre, retourFonction, retourCarteFactory) {
  render(`
    <a href="#" id="backBtn" class="back-btn">⬅ Retour</a>
    <h2>${titre}</h2>
    <div id="cardsContainer" class="cards grid-container"></div>
  `);

  const container = document.getElementById("cardsContainer");
  liste.forEach(arcane => {
    const img = nomToImagePath(arcane);
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.name = arcane.Nom;
    const numeroAffiche = arcane.Numero ? `${arcane.Numero} - ` : "";
    card.innerHTML = `<img src="${img}" alt="${arcane.Nom}">
                      <p>${numeroAffiche}${arcane.Nom}</p>`;

    const retourPourCetteCarte = retourCarteFactory ? retourCarteFactory(arcane) : retourFonction;

    card.addEventListener("click", () => affichArcane(arcane, retourPourCetteCarte));
    container.appendChild(card);
  });

  document.getElementById("backBtn").addEventListener("click", (e) => {
    e.preventDefault();
    retourFonction();
  });
}

/* =========== LISTES SPÉCIFIQUES =========== */
function affichListeMajor() {
  const retourCarteFactory = (arcane) => {
    return () => affichListeMajor();
  };

  affichListeArcane(
    listeMajors,
    "Arcanes Majeures",
    affichHome,
    retourCarteFactory
  );
}
