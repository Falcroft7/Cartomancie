/* =========== CATEGORIES =========== */
function affichCategoriesTirages(categoryToOpen = null) {
  const categories = Object.keys(tiragesCategorie);
  const content = `<div id="accordionContainer" class="accordion-container"></div>`;

  renderPage("Méthodes de tirage", content, affichHome);
  
  const container = document.getElementById("accordionContainer");

  categories.forEach(cat => {
    const tirages = tiragesCategorie[cat] || [];
    const catBlock = document.createElement("div");
    catBlock.className = "accordion-item";

    const btn = document.createElement("button");
    btn.className = "accordion-header";
    btn.innerHTML = `${cat} <span class="arrow">▼</span>`;

    const panel = document.createElement("div");
    panel.className = "accordion-panel";

    tirages.forEach(tirage => {
      const tirageBtn = document.createElement("button");
      tirageBtn.className = "tirage-link-btn";
      tirageBtn.textContent = tirage.nom;
      tirageBtn.onclick = () => affichTirageDetail(tirage, cat);
      panel.appendChild(tirageBtn);
    });

    const openPanel = () => {
      panel.style.maxHeight = panel.scrollHeight + "px";
      btn.querySelector(".arrow").style.transform = "rotate(180deg)";
    };

    btn.onclick = () => {
      const allPanels = document.querySelectorAll('.accordion-panel');
      const allArrows = document.querySelectorAll('.arrow');
      const isOpen = panel.style.maxHeight;

      allPanels.forEach(p => p.style.maxHeight = null);
      allArrows.forEach(a => a.style.transform = "rotate(0deg)");

      if (!isOpen) openPanel();
    };

    if (categoryToOpen === cat) {
        setTimeout(openPanel, 10);
    }

    catBlock.appendChild(btn);
    catBlock.appendChild(panel);
    container.appendChild(catBlock);
  });
}

/* =========== PLATEAU DE TIRAGE =========== */
function affichTirageDetail(tirage, categorie) {
  // Préparation commune (Titre, bouton retour, description)
  const formatExplication = (texte) => {
    if (!texte) return "";
    return texte.replace(/^([^:\n]+):/gm, '<strong>$1 :</strong>');
  };

  const content = `
    <div class="tirage-plateau"></div>
    <div class="tirage-explication">${formatExplication(tirage.explication)}</div>
  `;

  renderPage(tirage.nom, content, () => affichCategoriesTirages(categorie), tirage.description);

  const plateau = document.querySelector(".tirage-plateau");
  plateau.innerHTML = "";
  plateau.className = "tirage-plateau " + tirage.type.toLowerCase();
  const positionsData = tirage.positions;

  // Logique Grille
  if (tirage.type === "Grille") {
    // A. Configuration du plateau (Le contenant)
    const maxX = Math.max(...positionsData.map(p => p.x || 0));
    const maxY = Math.max(...positionsData.map(p => p.y || 0));
    plateau.style.display = "grid";
    plateau.style.gridTemplateRows = `repeat(${maxY + 1}, 130px)`;

    // B. Création et placement des cartes
    positionsData.forEach((pos, i) => {
      const carte = document.createElement("div");
      carte.className = "tirage-carte";
      carte.style.gridColumn = (pos.x || 0) + 1;
      carte.style.gridRow = (pos.y || 0) + 1;
      carte.style.zIndex = i + 1;

      if (pos.offsetX || pos.offsetY) {
        carte.classList.add("offset");
        carte.style.setProperty('--offsetX', `${pos.offsetX || 0}px`);
        carte.style.setProperty('--offsetY', `${pos.offsetY || 0}px`);
      }

      finaliserCarte(carte, pos, i, plateau);
    });
  }

  // Logique Circulaire ou Ovale
  if (tirage.type === "Circulaire" || tirage.type === "Ovale") {
    // A. Création des cartes
    positionsData.forEach((pos, i) => {
      const carte = document.createElement("div");
      carte.className = "tirage-carte";
      finaliserCarte(carte, pos, i, plateau);
    });

    // B. Calcul du placement
    setTimeout(() => {
      const colonneSens = tirage.sens ? tirage.sens.toLowerCase().trim() : "";
      const departValeur = parseFloat(tirage.depart);
      const configSens = (colonneSens === "anti") ? "anti" : "horaire";
      const configDepart = isNaN(departValeur) ? -90 : departValeur;

      const centerX = plateau.clientWidth / 2;
      const centerY = plateau.clientHeight / 2;
      const n = positionsData.length;
      const angleStep = 360 / n;
      const direction = configSens === "anti" ? -1 : 1;

      let rx = (tirage.type === "Ovale") ? centerX * 0.85 : Math.min(centerX, centerY) * 0.7;
      let ry = (tirage.type === "Ovale") ? centerY * 0.7 : rx;

      Array.from(plateau.children).forEach((carte, i) => {
        const angleRad = ((configDepart + (i * angleStep * direction)) * Math.PI) / 180;
        carte.style.left = `${centerX + rx * Math.cos(angleRad)}px`;
        carte.style.top  = `${centerY + ry * Math.sin(angleRad)}px`;
      });
    }, 50);
  }

  function finaliserCarte(carte, pos, i, conteneur) {
    if (pos.horizontal === "true") carte.classList.add("horizontal");
    const titleTop = pos.titleTop ? `<div class="tirage-carte-title-top">${pos.titleTop}</div>` : "";
    carte.innerHTML = `${titleTop}<img src="Images/Dos_carte.png" class="tirage-carte-image"><p>${pos.label}</p>`;
    conteneur.appendChild(carte);
    setTimeout(() => carte.classList.add("visible"), 200 + (i * 300));
  }
}
