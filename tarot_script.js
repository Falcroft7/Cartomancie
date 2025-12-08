/* ===================== CONSTANTES ===================== */
const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjeBMuYH_nr0z9h1GL9FnU_2XzEeNMZQ4dVsCMeQVZfw5tXacWxY9VC_GdbONB2ZCzo4EVsnrGHwtC/pub?output=csv";

/* ===================== DONNÉES ===================== */
let listeTirages = [];
let listeMajors = [];
let listeMinors = [];

/* ===================== UTILITAIRES ===================== */
function render(html) {
  document.getElementById("app").innerHTML = html;
}

function nomToImagePath(nom) {
  return (
    "../Images/" +
    nom
      .toLowerCase()
      .normalize("NFD") // enlève accents
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/'/g, "") // enlève apostrophes
      .replace(/-/g, "_") // remplace tirets
      .replace(/ /g, "_") + // remplace espaces
    ".png"
  );
}

/* ===================== PAGE ACCUEIL ===================== */
function affichHome() {
  render(`
    <div class="home-container">
      <img src="../Images/Tarot Banner.jpg" class="home-banner">

      <h1>Explorez la magie des Arcanes</h1>
      <p>Parcourez les cartes, découvrez leurs significations et plongez dans l'univers fascinant du Tarot.<br>
      Chaque arcane vous ouvre un nouveau monde de connaissances et d'intuition.</p>
      <p>Commencez votre voyage parmi les arcanes :</p>

      <div class="home-buttons">
        <button onclick="affichListeMajor()">Arcanes Majeures</button>
        <button onclick="affichListeMinor()">Arcanes Mineures</button>
        <button onclick="alert('En développement')">Méthodes de tirage</button>
      </div>
    </div>
  `);
}

/* ===================== LISTE ARCANES MAJEURES ===================== */
function affichListeMajor() {
  render(`
    <a href="#" onclick="affichHome()" class="back-btn">⬅ Retour</a>

    <h2>Arcanes majeures</h2>

    <div id="cardsContainer" class="cards"></div>
  `);

  const container = document.getElementById("cardsContainer");

  listeMajors.forEach(arcane => {
    const img = nomToImagePath(arcane.Nom);

    const card = document.createElement("div");
    card.className = "card";
    card.dataset.name = arcane.Nom;

    card.innerHTML = `
      <img src="${img}" alt="${arcane.Nom}">
      <p>${arcane.Numero} - ${arcane.Nom}</p>
    `;

    card.addEventListener("click", () => affichArcane(arcane));

    container.appendChild(card);
  });
}

/* ===================== LISTE ARCANES MINEURES ===================== */
function affichListeMinor() {
  render(`
    <a href="#" onclick="affichHome()" class="back-btn">⬅ Retour</a>

    <h2>Arcanes mineures</h2>

    <div id="cardsContainer" class="cards"></div>

    <div class="minor-types-buttons">
      <button onclick="alert('En développement')">Epées</button>
      <button onclick="alert('En développement')">Coupes</button>
      <button onclick="alert('En développement')">Bâtons</button>
      <button onclick="alert('En développement')">Deniers</button>
    </div>
  `);

  const container = document.getElementById("cardsContainer");

  listeMinors.forEach(arcane => {
    const img = nomToImagePath(arcane.Nom);

    const card = document.createElement("div");
    card.className = "card";
    card.dataset.name = arcane.Nom;

    card.innerHTML = `
      <img src="${img}" alt="${arcane.Nom}">
      <p>${arcane.Numero} - ${arcane.Nom}</p>
    `;

    card.addEventListener("click", () => affichArcane(arcane));

    container.appendChild(card);
  });
}

/* ===================== FICHE ARCANE ===================== */
function affichArcane(arcane) {
  const img = nomToImagePath(arcane.Nom);

  render(`
    <a href="#" onclick="affichListeMajor()" class="back-btn">⬅ Retour</a>

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
    // On garde seulement les lignes qui ont un nom d’arcane
    listeMajors = results.data.filter(r => r.Nom && r.Nom.trim());

    affichHome(); // On affiche la page d’accueil après chargement
  }
});
