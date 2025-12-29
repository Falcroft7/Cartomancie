/* =========== CONSTANTES =========== */
const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjeBMuYH_nr0z9h1GL9FnU_2XzEeNMZQ4dVsCMeQVZfw5tXacWxY9VC_GdbONB2ZCzo4EVsnrGHwtC/pub?output=csv";

/* =========== DONNÉES =========== */
let listeMajors = [];
let listeMinors = [];

/* =========== UTILITAIRES =========== */
function render(html) {
  document.getElementById("app").innerHTML = html;
}

/* =========== FONCTION NOM → IMAGE =========== */
function nomToImagePath(arcane) {
  
  function sanitize(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // enlever accents
      .replace(/'/g, "")               // enlever apostrophes
      .replace(/-/g, "_")              // tirets → _
      .replace(/ /g, "_");             // espaces → _
  }

  if (arcane.Type === "Majeure") {
    const nomFile = sanitize(nom);
    return `Images/Major/${nomFile}.png`;
  } 

  if (arcane.Type === "Mineure") {
    const valeurMatch = arcane.Nom.match(/^(.+?) d[e’']?/i);
    if (!valeurMatch) return "Images/placeholder.png";

    const valeur = sanitize(valeurMatch[1]);
    const famille = sanitize(arcane.Famille);

    return `Images/${famille}/${valeur}_${famille}.png`;
  }

  return "Images/placeholder.png";
}

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
        <button onclick="alert('En développement')">Méthodes de tirage</button>
      </div>
    </div>
  `);
}

/* =========== AFFICHAGE LISTES ARCANES =========== */
function affichListeArcane(liste, titre, retourFonction, retourCarteFactory) {
  render(`
    <a href="#" id="backBtn" class="back-btn">⬅ Retour</a>
    <h2>${titre}</h2>
    <div id="cardsContainer" class="cards"></div>
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

function normalizeFamille(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function affichListeMinor() {
  const famillesMap = {};

  listeMinors.forEach(arcane => {
    const key = normalizeFamille(arcane.Famille);
    if (!famillesMap[key]) {
      famillesMap[key] = arcane.Famille;
    }
  });

  const familles = Object.values(famillesMap);

  render(`
    <a href="#" id="backBtn" class="back-btn">⬅ Retour</a>
    <h2>Arcanes Mineures</h2>
    <div class="minor-familles" id="minorFamilles"></div>
  `);

  const container = document.getElementById("minorFamilles");

  familles.forEach(famille => {

    const as = listeMinors.find(arcane =>
      normalizeFamille(arcane.Famille) === normalizeFamille(famille) &&
      arcane.Nom.toLowerCase().startsWith("as")
    );

    const imgSrc = as
      ? nomToImagePath(arcane)
      : "Images/placeholder.png";

    const bloc = document.createElement("div");
    bloc.className = "minor-famille-card";
    bloc.innerHTML = `
      <img src="${imgSrc}" alt="As de ${famille}">
      <button>${famille}</button>
    `;

    bloc.addEventListener("click", () => {
      affichListeMinorParFamille(famille);
    });

    container.appendChild(bloc);
  });

  document.getElementById("backBtn").addEventListener("click", e => {
    e.preventDefault();
    affichHome();
  });
}

function affichListeMinorParFamille(famille) {
  const filtered = listeMinors.filter(
    arcane => normalizeFamille(arcane.Famille) === normalizeFamille(famille)
  );

  const retourCarteFactory = () => {
    return () => affichListeMinorParFamille(famille);
  };

  affichListeArcane(
    filtered,
    `Arcanes Mineures - ${famille}`,
    affichListeMinor,
    retourCarteFactory
  );
}

/* =========== FICHE ARCANE =========== */
function affichArcane(arcane, retourFonction) {
  const img = nomToImagePath(arcane);

  render(`
    <a href="#" id="backBtn" class="back-btn">⬅ Retour</a>
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

  document.getElementById("backBtn").addEventListener("click", (e) => {
    e.preventDefault();
    retourFonction();
  });
}

/* =========== CHARGEMENT CSV =========== */
Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: function (results) {
    const all = results.data.filter(r => r.Nom && r.Nom.trim());
    listeMajors = all.filter(r => r.Type === "Majeure");
    listeMinors = all.filter(r => r.Type === "Mineure");

    affichHome();
  }
});

