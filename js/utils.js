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
