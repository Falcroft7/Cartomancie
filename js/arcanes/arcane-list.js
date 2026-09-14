function createArcanaCard(arcana, onBack) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";

  const image = document.createElement("img");
  setupImage(image, getArcanaImagePath(arcana), arcana.Nom || "Carte de tarot");
  image.loading = "lazy";

  const label = document.createElement("p");
  label.textContent = arcana.Numero
    ? `${arcana.Numero} - ${arcana.Nom}`
    : arcana.Nom || "Carte sans nom";

  card.append(image, label);
  card.addEventListener("click", () => showArcanaDetails(arcana, onBack));
  return card;
}

function showArcanaList(arcanaList, title, onBack) {
  renderPage(title, `<div id="arcanaGrid" class="cards grid-container"></div>`, onBack);
  const container = document.getElementById("arcanaGrid");

  arcanaList.forEach(arcana => {
    const card = createArcanaCard(
      arcana,
      () => showArcanaList(arcanaList, title, onBack)
    );
    container.appendChild(card);
  });
}

function showMajorArcana() {
  showArcanaList(majorArcanaList, "Arcanes Majeures", showArcanaMenu);
}

function showMinorArcana(arcanaSuit) {
  const normalizedSuit = normalizeSuit(arcanaSuit);
  const filtered = minorArcanaList.filter(arcana =>
    normalizeSuit(arcana.Famille) === normalizedSuit
  );
  showArcanaList(filtered, `Arcanes Mineures - ${arcanaSuit}`, showArcanaMenu);
}
