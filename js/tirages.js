/* =========== CATEGORIES =========== */
function affichCategoriesTirages() {
  const categories = Object.keys(tiragesCategorie);
  
  const content = `<div id="categoriesContainer" class="categories grid-container"></div>`;
  
  renderPage("Choisissez une catégorie", content, affichHome);

  const container = document.getElementById("categoriesContainer");
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => affichTirages(cat);
    container.appendChild(btn);
  });
}

/* =========== LISTES =========== */
function affichTirages(categorie) {
  const tirages = tiragesCategorie[categorie] || [];
  const content = `<div id="tiragesContainer" class="tirages grid-container"></div>`;

  renderPage(`Tirages - ${categorie}`, content, affichCategoriesTirages);

  const container = document.getElementById("tiragesContainer");
  tirages.forEach(tirage => {
    const btn = document.createElement("button");
    btn.textContent = tirage.nom;
    btn.onclick = () => affichTirageDetail(tirage, categorie);
    container.appendChild(btn);
  });
}

/* =========== DETAILS =========== */
function affichTirageDetail(tirage, categorie) {
  const content = `
    <div class="tirage-plateau"></div>
    <div class="tirage-explication">${tirage.explication}</div>
  `;

  renderPage(tirage.nom, content, () => affichTirages(categorie), tirage.description);

  const plateau = document.querySelector(".tirage-plateau");
  plateau.className = "tirage-plateau " + tirage.type.toLowerCase();

  let maxOffsetY = 0;

  tirage.positions.forEach((pos, i) => {
    const carte = document.createElement("div");
    carte.className = "tirage-carte";
    carte.innerHTML = `
      <img src="Images/Dos_carte.png" class="tirage-carte-image">
      <p>${pos.label}</p>
    `;

    if (tirage.type === "Grille") {
      carte.classList.add("grille");
      carte.style.gridColumn = pos.x + 1;
      carte.style.gridRow = (pos.y ?? 0) + 1;
      
      const offX = parseFloat(pos.offsetX) || 0;
      const offY = parseFloat(pos.offsetY) || 0;
      if (offY > maxOffsetY) maxOffsetY = offY;

      if (offX !== 0 || offY !== 0) {
        carte.classList.add("offset");
        carte.style.setProperty('--offsetX', `${offX}px`);
        carte.style.setProperty('--offsetY', `${offY}px`);
      }
    }

    plateau.appendChild(carte);
    setTimeout(() => { carte.style.opacity = "1"; }, 50);
  });

  if (maxOffsetY > 0) {
    plateau.style.marginBottom = `${maxOffsetY}px`;
  }

  if (tirage.type === "Circulaire") {
    const centerX = plateau.clientWidth / 2;
    const centerY = plateau.clientHeight / 2;
    const radius = Math.min(centerX, centerY) - 80;
    const n = tirage.positions.length;
    const startAngle = -90;
    const angleStep = 360 / n;

    tirage.positions.forEach((pos, i) => {
      const carte = plateau.children[i];
      const angleRad = ((startAngle + i * angleStep) * Math.PI) / 180;
      carte.style.position = "absolute";
      carte.style.left = `${centerX + radius * Math.cos(angleRad) - 60}px`;
      carte.style.top  = `${centerY + radius * Math.sin(angleRad) - 90}px`;
    });
  }
}
