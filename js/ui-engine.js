/* =========== RENDU DE BASE =========== */
function render(html) {
  const appContainer = document.getElementById("app");
  if (appContainer) {
    appContainer.classList.remove("fade-in");
    void appContainer.offsetWidth;
    appContainer.innerHTML = html;
    appContainer.classList.add("fade-in");
  }
}

/* =========== STRUCTURE DE PAGE STANDARD =========== */
function renderPage(title, contentHTML, backAction, description = "") {
  const descHTML = description ? `<div class="tirage-description">${description}</div>` : "";
  
  const html = `
    <div class="sticky-nav">
      <a href="#" id="backBtn" class="back-btn">⬅ Retour</a>
    </div>
    
    <div class="page-content">
      <h2>${title}</h2>
      ${descHTML}
      <div class="page-body">
        ${contentHTML}
      </div>
    </div>
  `;
  
  render(html);

  const btn = document.getElementById("backBtn");
  if (btn) {
    btn.onclick = (e) => {
      e.preventDefault();
      backAction();
    };
  }
  
  window.scrollTo(0, 0);
}

/* =========== GÉNÉRATEUR DE CHEMIN D'IMAGE =========== */
function nomToImagePath(arcane) {
  
  function sanitize(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")  // enlève les accents
      .replace(/['’‘]/g, "")            // enlève les apostrophes
      .replace(/-/g, "_")               // remplace tirets par underscore
      .replace(/ /g, "_");              // remplace espaces par underscore
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

/* =========== NORMALISATION DES FAMILLES =========== */
function normalizeFamille(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/* =========== TRADUCTION DES LABELS =========== */
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

/* =========== ANIMATION ETOILES =========== */
function createStars() {
  if (document.getElementById('stars-container')) return;
  
  const starsContainer = document.createElement('div');
  starsContainer.id = 'stars-container';
  document.body.appendChild(starsContainer);

  const starCount = 20;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    const size = Math.random() * 1.5 + 0.5;
    
    const duration = Math.random() * 8 + 7; 
    const maxOpacity = Math.random() * 0.5 + 0.2;

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    star.style.setProperty('--duration', `${duration}s`);
    star.style.setProperty('--max-opacity', maxOpacity);
    
    star.style.animationDelay = `${Math.random() * 20}s`;

    starsContainer.appendChild(star);
  }
}

window.addEventListener('DOMContentLoaded', createStars);
