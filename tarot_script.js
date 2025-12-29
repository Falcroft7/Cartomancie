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
function nomToImagePath(nom, type) {
  function sanitize(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // enlever accents
      .replace(/'/g, "")               // enlever apostrophes
      .replace(/-/g, "_")              // tirets → _
      .replace(/ /g, "_");             // espaces → _
  }

  if (type === "Majeure") {
    const nomFile = sanitize(nom);
    return `Images/Major/${nomFile}.png`;
  } 
  else if (type === "Mineure") {
    const regex = /^(.+?) d[e’']? (.+)$/i;
    const match = nom.match(regex);
    if (!match) return "Images/placeholder.png";

    const valeur = sanitize(match[1]);
    const famille = sanitize(match[2]);

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
    const img = nomToImagePath(arcane.Nom, arcane.Type);
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

function affichListeMinor() {
  const familles = ["Epées", "Coupes", "Bâtons", "Deniers"];

  render(`
    <a href="#" id="backBtn" class="back-btn">⬅ Retour</a>
    <h2>Arcanes Mineures</h2>
    <div class="minor-familles" id="minorFamilles"></div>
  `);

  const container = document.getElementById("minorFamilles");

  familles.forEach(famille => {
    const as = listeMinors.find(arcane =>
      arcane.Famille.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
      famille.normalize("NFD").replace(/[\u0300-\u036f]/g, "") &&
      arcane.Nom.toLowerCase().startsWith("as")
    );

    const imgSrc = as ? nomToImagePath(as.Nom, as.Type) : "Images/placeholder.png";

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

  document.getElementById("backBtn").addEventListener("click", (e) => {
    e.preventDefault();
    affichHome();
  });
}

function affichListeMinorParFamille(famille) {
  const filtered = listeMinors.filter(arcane => arcane.Famille === famille);
  const retourCarteFactory = (arcane) => {
    return () => affichListeMinorParFamille(famille);
  };

  affichListeArcane(filtered, `Arcanes Mineures - ${famille}`, affichListeMinor, retourCarteFactory);
}

/* =========== FICHE ARCANE =========== */
function affichArcane(arcane, retourFonction) {
  const img = nomToImagePath(arcane.Nom, arcane.Type);

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




