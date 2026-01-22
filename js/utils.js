/* =========== UTILITAIRES =========== */
function render(html) {
  document.getElementById("app").innerHTML = html;
}

function renderPage(title, contentHTML, backAction, description = "") {
  const descHTML = description ? `<div class="page-description">${description}</div>` : "";
  
  const html = `
    <a href="#" id="backBtn" class="back-btn">⬅ Retour</a>
    <h2>${title}</h2>
    ${descHTML}
    <div class="page-body">
      ${contentHTML}
    </div>
  `;
  
  render(html);

  document.getElementById("backBtn").onclick = (e) => {
    e.preventDefault();
    backAction();
  };
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
