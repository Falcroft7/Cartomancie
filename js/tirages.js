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
  plateau.className = "tirage-plateau " + tirage.type.toLowerCase();

  tirage.positions.forEach((pos, i) => {
    const carte = document.createElement("div");
    carte.className = "tirage-carte";

    if (pos.horizontal == "true") carte.classList.add("horizontal");
    
    const titleTopHTML = pos.titleTop ? `<div class="tirage-carte-title-top">${pos.titleTop}</div>` : "";
    
    carte.innerHTML = `
      ${titleTopHTML}
      <img src="Images/Dos_carte.png" class="tirage-carte-image">
      <p>${pos.label}</p>
    `;

    if (tirage.type === "Grille") {
      carte.style.gridColumn = (pos.x || 0) + 1;
      carte.style.gridRow = (pos.y || 0) + 1;
      
      if (pos.offsetX || pos.offsetY) {
        carte.classList.add("offset");
        carte.style.setProperty('--offsetX', `${pos.offsetX || 0}px`);
        carte.style.setProperty('--offsetY', `${pos.offsetY || 0}px`);
      }
    }

    plateau.appendChild(carte);
    setTimeout(() => carte.classList.add("visible"), 200 + (i * 300));
  });

  if (tirage.type === "Circulaire") {
    setTimeout(() => {
      const centerX = plateau.clientWidth / 2;
      const centerY = plateau.clientHeight / 2;
      const radius = Math.min(centerX, centerY) * 0.7;
      const n = tirage.positions.length;
      const angleStep = 360 / n;
  
      Array.from(plateau.children).forEach((carte, i) => {
        const angleRad = ((-90 + i * angleStep) * Math.PI) / 180;
        carte.style.left = `${centerX + radius * Math.cos(angleRad)}px`;
        carte.style.top  = `${centerY + radius * Math.sin(angleRad)}px`;
      });
    }, 50);
  }
}
