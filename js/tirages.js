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

/* =========== DETAILS =========== */
function affichTirageDetail(tirage, categorie) {
  const content = `
    <div class="tirage-plateau"></div>
    <div class="tirage-explication">${tirage.explication}</div>
  `;

  renderPage(tirage.nom, content, () => affichCategoriesTirages(categorie), tirage.description);

  const plateau = document.querySelector(".tirage-plateau");
  plateau.className = "tirage-plateau " + tirage.type.toLowerCase();

  let maxOffsetY = 0;

  tirage.positions.forEach((pos, i) => {
    const carte = document.createElement("div");
    carte.className = "tirage-carte";
    const titleTopHTML = pos.titleTop ? `<div class="tirage-carte-title-top">${pos.titleTop}</div>` : "";
    
    carte.innerHTML = `
      ${titleTopHTML}
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
