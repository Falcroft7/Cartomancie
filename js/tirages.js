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
    <div class="tirage-plateau"></div>
    <div class="tirage-explication">${tirage.explication}</div>
  `);

  const plateau = document.querySelector(".tirage-plateau");

  plateau.className = "tirage-plateau";
  if (tirage.type === "Grille") plateau.classList.add("grille");
  else if (tirage.type === "Circulaire") plateau.classList.add("circulaire");
  
  tirage.positions.forEach((pos, i) => {
    const carte = document.createElement("div");
    carte.className = "tirage-carte";
    carte.innerHTML = `
      <img src="Images/Dos_carte.png" class="tirage-carte-image">
      <p>${pos.label}</p>
    `;

    if (tirage.type === "Grille") {
      carte.classList.add("grille");
    
      carte.style.setProperty('--col', pos.x + 1);
      carte.style.setProperty('--row', (pos.y ?? 0) + 1);
    
      if (pos.offsetX !== undefined || pos.offsetY !== undefined) {
        const spacingX = 120;
        const spacingY = 120;
    
        carte.classList.add("offset-mode");
    
        carte.style.left = `${pos.x * spacingX + (pos.offsetX ?? 0)}px`;
        carte.style.top  = `${pos.y * spacingY + (pos.offsetY ?? 0)}px`;
      }
    }

    plateau.appendChild(carte);

    setTimeout(() => {
      carte.style.opacity = "1";
    }, 50);
  });

  // === Placement circulaire ===
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

  document.getElementById("backBtn").onclick = e => {
    e.preventDefault();
    affichTirages(categorie);
  };
}
