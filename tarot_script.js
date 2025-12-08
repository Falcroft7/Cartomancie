/* ===================== CONSTANTES ===================== */
const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjeBMuYH_nr0z9h1GL9FnU_2XzEeNMZQ4dVsCMeQVZfw5tXacWxY9VC_GdbONB2ZCzo4EVsnrGHwtC/pub?output=csv";

/* ===================== DONNÉES ===================== */
let listeMajors = [];
let listeMinors = [];

/* ===================== UTILITAIRES ===================== */
function render(html) {
  document.getElementById("app").innerHTML = html;
}

/* ===================== FONCTION NOM → IMAGE ===================== */
function nomToImagePath(nom, type) {
  if (type === "Majeure") {
    return (
      "Images/Major/" +
      nom
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/'/g, "")
        .replace(/-/g, "_")
        .replace(/ /g, "_") +
      ".png"
    );
  } else if (type === "Mineure") {
    const regex = /^(.+?) d[e']? (.+)$/i;
    const match = nom.match(regex);
    if (!match) {
      console.error("nomToImagePath : nom mineure inconnu →", nom);
      return "Images/placeholder.png";
    }
    let valeur = match[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let couleur = match[2].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return `Images/Minor/${valeur}_${couleur}.png`;
  }
  return "Images/placeholder.png";
}

/* ===================== PAGE ACCUEIL ===================== */
function affichHome() {
  render(`
    <div class="home-container">
      <img src="Images/Banner/Tarot_Banner.jpg" class="home-banner">
      <h1>Explorez la magie des Arcanes</h1>
      <p>
        Le Tarot est un voyage symbolique à travers les mystères de l’existence.<br>
        Que vous soyez débutant ou passionné, découvrez chaque carte, son énergie, sa signification et les messages qu’elle souhaite vous transmettre.
      </p>
      <div class="home-buttons">
        <button onclick="affichListeMajor()">Arcanes Majeures</button>
        <button onclick="affichListeMinor()">Arcanes Mineures</button>
        <button onclick="alert('En développement')">Méthodes de tirage</button>
      </div>
    </div>
  `);
}

/* ===================== LISTES ARCANES ===================== */
function affichListeMajor() {
  render(`
    <a href="#" onclick="affichHome()" class="back-btn">⬅ Retour</a>
    <h2>Arcanes Majeures</h2>
    <div id="cardsContainer" class="cards"></div>
  `);
  const container = document.getElementById("cardsContainer");
  listeMajors.forEach(arcane => {
    const img = nomToImagePath(arcane.Nom, "Majeure");
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.name = arcane.Nom;
    card.innerHTML = `<img src="${img}" alt="${arcane.Nom}">
                      <p>${arcane.Numero} - ${arcane.Nom}</p>`;
    card.addEventListener("click", () => affichArcane(arcane));
    container.appendChild(card);
  });
}

function affichListeMinor() {
  render(`
    <a href="#" onclick="affichHome()" class="back-btn">⬅ Retour</a>
    <h2>Arcanes Mineures</h2>
    <div class="minor-types-buttons">
      <button onclick="affichListeMinorParFamille('Épées')">Épées</button>
      <button onclick="affichListeMinorParFamille('Coupes')">Coupes</button>
      <button onclick="affichListeMinorParFamille('Bâtons')">Bâtons</button>
      <button onclick="affichListeMinorParFamille('Deniers')">Deniers</button>
    </div>
  `);
}

function affichListeMinorParFamille(famille) {
  render(`
    <a href="#" onclick="affichListeMinor()" class="back-btn">⬅ Retour</a>
    <h2>Arcanes Mineures - ${famille}</h2>
    <div id="cardsContainer" class="cards"></div>
  `);
  const container = document.getElementById("cardsContainer");
  const filtered = listeMinors.filter(arcane => arcane.Famille === famille);
  filtered.forEach(arcane => {
    const img = nomToImagePath(arcane.Nom, "Mineure");
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.name = arcane.Nom;
    card.innerHTML = `<img src="${img}" alt="${arcane.Nom}">
                      <p>${arcane.Numero} - ${arcane.Nom}</p>`;
    card.addEventListener("click", () => affichArcane(arcane));
    container.appendChild(card);
  });
}

/* ===================== FICHE ARCANE ===================== */
function affichArcane(arcane) {
  const img = nomToImagePath(arcane.Nom, arcane.Type);
  render(`
    <a href="#" onclick="arcane.Type === 'Majeure' ? affichListeMajor() : affichListeMinorParFamille(arcane.Famille)" class="back-btn">⬅ Retour</a>
    <h1>${arcane.Numero} - ${arcane.Nom}</h1>
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
  `);
}

/* ===================== CHARGEMENT CSV ===================== */
Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: function (results) {
    const all = results.data.filter(r => r.Nom && r.Nom.trim());
    listeMajors = all.filter(r => r.Type === "Majeure");
    listeMinors = all.filter(r => r.Type === "Mineure");

    // Ajouter Famille si pas renseignée
    listeMinors.forEach(arcane => {
      if (!arcane.Famille) {
        const parts = arcane.Nom.split(' de ');
        arcane.Famille = parts[1] || "Inconnue";
      }
    });

    affichHome();
  }
});
