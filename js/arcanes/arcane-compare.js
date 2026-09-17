function getAllArcanes() {
  return [...majorArcanaList, ...minorArcanaList];
}

function getArcanaLabel(arcana) {
  return arcana.Numero
    ? `${arcana.Numero} - ${arcana.Nom}`
    : arcana.Nom || "Carte sans nom";
}

function formatComparisonMeaning(value) {
  if (!value || value === APP_CONFIG.emptyValueLabel) return "Non renseigné";
  return escapeHTML(value).replace(/[,;\n]+/g, "<br>• ");
}

function renderComparisonCard(arcana) {
  const image = getSafeImagePath(getArcanaImagePath(arcana));
  return `
    <article class="comparison-card">
      <img class="comparison-card-image" src="${escapeHTML(image)}" alt="${escapeHTML(arcana.Nom || "Carte de tarot")}">
      <h3>${escapeHTML(getArcanaLabel(arcana))}</h3>
      <dl class="comparison-correspondences">
        <div><dt>Élément</dt><dd>${escapeHTML(arcana["Elément"] || "Non renseigné")}</dd></div>
        <div><dt>Signe</dt><dd>${escapeHTML(arcana["Signe astro"] || "Non renseigné")}</dd></div>
        <div><dt>Planète</dt><dd>${escapeHTML(arcana.Planète || "Non renseigné")}</dd></div>
        <div><dt>Chakra</dt><dd>${escapeHTML(arcana.Shakra || "Non renseigné")}</dd></div>
      </dl>
      <div class="comparison-meaning comparison-positive">
        <strong>À l'endroit</strong>
        <p>• ${formatComparisonMeaning(arcana["Signification Positive"])}</p>
      </div>
      <div class="comparison-meaning comparison-negative">
        <strong>À l'envers</strong>
        <p>• ${formatComparisonMeaning(arcana["Signification Négative"])}</p>
      </div>
    </article>
  `;
}

function showArcanaComparison() {
  const arcanes = getAllArcanes();
  if (arcanes.length < 2) return;

  const options = arcanes.map((arcana, index) =>
    `<option value="${index}">${escapeHTML(getArcanaLabel(arcana))}</option>`
  ).join("");

  renderPage(
    "Comparer deux cartes",
    `
      <div class="comparison-view">
        <div class="comparison-controls">
          <label>
            Première carte
            <select id="comparisonFirst">${options}</select>
          </label>
          <label>
            Deuxième carte
            <select id="comparisonSecond">${options}</select>
          </label>
        </div>
        <div id="comparisonResult" class="comparison-result" aria-live="polite"></div>
      </div>
    `,
    showHome
  );

  const firstSelect = document.getElementById("comparisonFirst");
  const secondSelect = document.getElementById("comparisonSecond");
  secondSelect.value = "1";

  const updateComparison = () => {
    const firstArcana = arcanes[Number(firstSelect.value)];
    const secondArcana = arcanes[Number(secondSelect.value)];
    const result = document.getElementById("comparisonResult");
    if (!result || !firstArcana || !secondArcana) return;

    result.innerHTML = `${renderComparisonCard(firstArcana)}${renderComparisonCard(secondArcana)}`;
    result.querySelectorAll(".comparison-card-image").forEach((image, index) => {
      setupImage(image, getArcanaImagePath(arcanes[[firstSelect.value, secondSelect.value][index]]), image.alt);
    });
  };

  firstSelect.addEventListener("change", updateComparison);
  secondSelect.addEventListener("change", updateComparison);
  updateComparison();
}
