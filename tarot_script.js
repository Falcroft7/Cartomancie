/* =========== CONSTANTES =========== */
const csvArcanesUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjeBMuYH_nr0z9h1GL9FnU_2XzEeNMZQ4dVsCMeQVZfw5tXacWxY9VC_GdbONB2ZCzo4EVsnrGHwtC/pub?output=csv";
const csvTiragesUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjeBMuYH_nr0z9h1GL9FnU_2XzEeNMZQ4dVsCMeQVZfw5tXacWxY9VC_GdbONB2ZCzo4EVsnrGHwtC/pub?gid=1625499577&single=true&output=csv";

/* =========== DONNÉES =========== */
let listeMajors = [];
let listeMinors = [];
let tiragesCategorie = [];

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
    const nomFile = sanitize(arcane.Nom);
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

function familleToLabel(famille) {
  const key = normalizeFamille(famille);

  const labels = {
    epees: "Les Épées",
    coupes: "Les Coupes",
    batons: "Les Bâtons",
    deniers: "Les Deniers"
  };

  return labels[key] || famille;
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
      ? nomToImagePath(as)
      : "Images/placeholder.png";

    const bloc = document.createElement("div");
    bloc.className = "minor-famille-card";
    bloc.innerHTML = `
      <img src="${imgSrc}" alt="As de ${famille}">
      <button>${familleToLabel(famille)}</button>
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
  const titre =
    arcane.Numero && arcane.Numero.trim()
      ? `${arcane.Numero} - ${arcane.Nom}`
      : arcane.Nom;
  
  render(`
    <a href="#" id="backBtn" class="back-btn">⬅ Retour</a>
    <h1>${titre}</h1>
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

/* =========== TIRAGES =========== */
function affichCategoriesTirages() {
  const categories = Object.keys(tiragesCategorie);

  render(`
    <a href="#" id="backBtn" class="back-btn">⬅ Retour</a>
    <h2>Choisissez une catégorie</h2>
    <div id="categoriesContainer" class="categories"></div>
  `);

  const container = document.getElementById("categoriesContainer");

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.addEventListener("click", () => affichTirages(cat));
    container.appendChild(btn);
  });

  document.getElementById("backBtn").addEventListener("click", e => {
    e.preventDefault();
    affichHome();
  });
}

function affichTirages(categorie) {
  const tirages = tiragesCategorie[categorie] || [];

  render(`
    <a href="#" id="backBtn" class="back-btn">⬅ Retour</a>
    <h2>Tirages - ${categorie}</h2>
    <div id="tiragesContainer" class="tirages"></div>
  `);

  const container = document.getElementById("tiragesContainer");

  tirages.forEach(tirage => {
    const btn = document.createElement("button");
    btn.textContent = tirage.Nom;
    btn.addEventListener("click", () => affichTirageDetail(tirage, categorie));
    container.appendChild(btn);
  });

  document.getElementById("backBtn").addEventListener("click", e => {
    e.preventDefault();
    affichCategoriesTirages();
  });
}

function affichTirageDetail(tirage, categorie) {
  render(`
    <a href="#" id="backBtn" class="back-btn">⬅ Retour</a>
    <h2>${tirage.Nom}</h2>
    ${tirage.description ? `<p>${tirage.description}</p>` : ""}
    <div class="tirage-plateau"></div>
  `);

  const plateau = document.querySelector(".tirage-plateau");

  if (tirage.type === "Grille") {
    plateau.style.display = "grid";
    plateau.style.gridTemplateColumns = "repeat(auto-fit, 140px)";
    plateau.style.justifyContent = "center";
  } else {
    plateau.style.position = "relative";
    plateau.style.minHeight = "300px";
  }

  tirage.positions.forEach(pos => {
    const carte = document.createElement("div");
    carte.className = "tirage-carte";
    carte.innerHTML = `
      <img src="Images/Dos_carte.png" class="tirage-carte-image">
      <p>${pos.label}</p>
    `;

    if (tirage.type === "Grille") {
      carte.style.gridColumn = pos.x + 1;
      carte.style.gridRow = pos.y + 1;
    }

    if (tirage.type === "Circulaire") {
      const radiusPx = pos.radius * 60;
      const angleRad = (pos.angle * Math.PI) / 180;
      const center = 150;

      carte.style.position = "absolute";
      carte.style.left =
        center + radiusPx * Math.cos(angleRad) - 60 + "px";
      carte.style.top =
        center + radiusPx * Math.sin(angleRad) - 90 + "px";
    }
    
    plateau.appendChild(carte);
  });

  document.getElementById("backBtn").onclick = e => {
    e.preventDefault();
    affichTirages(categorie);
  };
}

/* =========== CHARGEMENT CSV =========== */
Papa.parse(csvArcanesUrl, {
  download: true,
  header: true,
  complete: function (results) {
    const all = results.data.filter(r => r.Nom && r.Nom.trim());
    listeMajors = all.filter(r => r.Type === "Majeure");
    listeMinors = all.filter(r => r.Type === "Mineure");    
    affichHome();
  }
});

Papa.parse(csvTiragesUrl, {
  download: true,
  header: true,
  complete: function (results) {
    const listeTirages = results.data
      .filter(r => r.Nom && r.Type && r.Positions)
      .map(r => {
        let positions = [];

        try {
          positions = JSON.parse(r.Positions);
        } catch (e) {
          console.error("JSON invalide :", r.Nom, r.Positions);
        }

        return {
          categorie: r.Catégorie?.trim(),
          nom: r.Nom.trim(),
          description: r.Description?.trim() || "",
          type: r.Type.trim(), // Grille | Circulaire
          positions
        };
      });

    tiragesCategorie = {};
    listeTirages.forEach(t => {
      if (!tiragesCategorie[t.categorie]) {
        tiragesCategorie[t.categorie] = [];
      }
      tiragesCategorie[t.categorie].push(t);
    });
  }
});
