function showArcanaMenu() {
  const suits = ["Bâtons", "Coupes", "Épées", "Deniers"];
  renderPage(
    "Signification des cartes",
    `
      <div class="arcana-menu-actions">
        <button type="button" id="compareArcanaButton">Comparer deux cartes</button>
      </div>
      <div class="arcana-menu-grid" id="arcanaMenu"></div>
    `,
    showHome
  );

  const container = document.getElementById("arcanaMenu");
  document.getElementById("compareArcanaButton")?.addEventListener("click", showArcanaComparison);
  const featuredMajorArcana = majorArcanaList.find(arcana =>
    arcana.Nom.toLowerCase() === "le monde"
  ) || majorArcanaList[0];
  const majorMenuItem = createArcanaMenuItem(featuredMajorArcana, "Arcanes Majeures", showMajorArcana);
  majorMenuItem.classList.add("major-menu-card");
  container.appendChild(majorMenuItem);

  suits.forEach(arcanaSuit => {
    const ace = minorArcanaList.find(arcana =>
      normalizeSuit(arcana.Famille) === normalizeSuit(arcanaSuit) &&
      arcana.Nom.toLowerCase().startsWith("as")
    );
    container.appendChild(createArcanaMenuItem(
      ace,
      getSuitLabel(arcanaSuit),
      () => showMinorArcana(arcanaSuit)
    ));
  });
}

function createArcanaMenuItem(arcana, label, onSelect) {
  const menuItem = document.createElement("div");
  menuItem.className = "suit-menu-card";

  const image = document.createElement("img");
  setupImage(image, arcana ? getArcanaImagePath(arcana) : APP_CONFIG.placeholderImagePath, label);
  image.addEventListener("click", onSelect);

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onSelect);

  menuItem.append(image, button);
  return menuItem;
}
