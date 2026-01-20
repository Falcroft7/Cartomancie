/* =========== TIRAGES =========== */
function affichCategoriesTirages() {
  const categories = Object.keys(tiragesCategorie);

  render(`
    <a href="#" id="backBtn" class="back-btn">⬅ Retour</a>
    <h2>Choisissez une catégorie</h2>
    <div id="categoriesContainer" class="categories grid-container"></div>
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
    <div id="tiragesContainer" class="tirages grid-container"></div>
  `);

  const container = document.getElementById("tiragesContainer");

  tirages.forEach(tirage => {
    const btn = document.createElement("button");
    btn.textContent = tirage.nom;
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
    <h2>${tirage.nom}</h2>
    <div class="tirage-description">${tirage.description}</div>
    <div class="tirage-plateau-wrapper">
      <div class="tirage-plateau"></div>
    </div>
    <div class="tirage-explication">${tirage.explication}</div>
  `);

  const wrapper = document.querySelector(".tirage-plateau-wrapper");
  const plateau = wrapper.querySelector(".tirage-plateau");

  // Wrapper centré horizontalement
  wrapper.style.display = "flex";
  wrapper.style.justifyContent = "center";

  if (tirage.type === "Grille") {
    plateau.style.display = "grid";
    plateau.style.gridTemplateColumns = `repeat(auto-fit, 120px)`;
    plateau.style.justifyContent = "center";
    plateau.style.position = "relative";
  } else if (tirage.type === "Circulaire") {
    plateau.style.position = "relative";
    plateau.style.width = "min(600px, 90vw)";
    plateau.style.height = "min(600px, 90vw)";
  }

  // Affichage des cartes
  tirage.positions.forEach(pos => {
    const carte = document.createElement("div");
    carte.className = "tirage-carte";
    carte.innerHTML = `
      <img src="Images/Dos_carte.png" class="tirage-carte-image">
      <p>${pos.label}</p>
    `;

    if (tirage.type === "Grille") {
      // Position par grid si y défini
      const y = pos.y ?? 0;
      carte.style.gridColumn = pos.x + 1;
      carte.style.gridRow = y + 1;

      // Appliquer les offsets si présents
      const offsetX = pos.offsetX ?? 0;
      const offsetY = pos.offsetY ?? 0;
      carte.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      carte.style.position = "relative"; // pour que translate fonctionne
    }

    plateau.appendChild(carte);

    setTimeout(() => { carte.style.opacity = "1"; }, 50);
  });

  // Tirage circulaire
  if (tirage.type === "Circulaire") {
    const centerX = plateau.clientWidth / 2;
    const centerY = plateau.clientHeight / 2;
    const radius = Math.min(centerX, centerY) - 60;

    tirage.positions.forEach((pos, i) => {
      const carte = plateau.children[i];
      const angleRad = (pos.angle * Math.PI) / 180;
      const r = pos.radius ?? radius;

      carte.style.position = "absolute";
      carte.style.left = `${centerX + r * Math.cos(angleRad) - 60}px`;
      carte.style.top = `${centerY + r * Math.sin(angleRad) - 90}px`;
    });
  }

  // Bouton retour
  document.getElementById("backBtn").onclick = e => {
    e.preventDefault();
    affichTirages(categorie);
  };
}
