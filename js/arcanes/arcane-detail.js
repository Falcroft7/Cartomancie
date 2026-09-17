function showArcanaDetails(arcana, onBack) {
  const imagePath = getArcanaImagePath(arcana);
  const title = arcana.Numero && arcana.Numero.trim()
    ? `${arcana.Numero} - ${arcana.Nom}`
    : arcana.Nom;
  const elementClass = (arcana["Elément"] || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, "");

  const renderCorrespondence = (label, value, icon) => {
    if (!value || value === APP_CONFIG.emptyValueLabel) return "";
    return `
      <div class="correspondence-item">
        <span class="correspondence-icon">${icon}</span>
        <div class="correspondence-text">
          <strong>${escapeHTML(label)}</strong>
          <span>${escapeHTML(value)}</span>
        </div>
      </div>
    `;
  };

  const formatMeaningList = value => {
    if (!value || value === APP_CONFIG.emptyValueLabel) return "";
    return value
      .split(/[,;\n]/)
      .map(item => item.trim())
      .filter(Boolean)
      .map(item => escapeHTML(item))
      .join("<br>• ");
  };

  const formatReflectionQuestions = value => {
    if (!value || value === APP_CONFIG.emptyValueLabel) return "";
    return escapeHTML(value).replace(/\?\s*/g, "?<br><br>");
  };

  const renderDomainInterpretation = (label, value, icon) => {
    if (!value || value === APP_CONFIG.emptyValueLabel) return "";
    return `
      <div class="domain-item">
        <span class="domain-icon">${icon}</span>
        <div class="domain-text">
          <strong>${escapeHTML(label)} :</strong> ${escapeHTML(value)}
        </div>
      </div>
    `;
  };

  const detailsLink = arcana.Details ? `
    <a class="details-button" href="${escapeHTML(arcana.Details)}" target="_blank" rel="noopener noreferrer">
      Details
    </a>
  ` : "";

  const content = `
    <div class="arcana-detail element-${elementClass}">
      ${arcana.Affirmation ? `
        <div class="full-width-block affirmation-container">
          <p class="arcana-affirmation">"${escapeHTML(arcana.Affirmation)}"</p>
        </div>
      ` : ""}
      <div class="arcana-detail-grid">
        <div class="arcana-sidebar">
          <div class="arcana-image element-aura">
            <img class="arcana-detail-image" alt="${escapeHTML(arcana.Nom)}" fetchpriority="high">
          </div>
          <div class="arcana-correspondences">
            ${renderCorrespondence("Élément", arcana["Elément"], "🌀")}
            ${renderCorrespondence("Signe", arcana["Signe astro"], "♈")}
            ${renderCorrespondence("Planète", arcana.Planète, "🪐")}
            ${renderCorrespondence("Chakra", arcana.Shakra, "💎")}
            ${renderCorrespondence("Oui/Non", arcana["Oui/Non"], "⚖️")}
          </div>
        </div>
        <div class="arcana-meanings">
          <div class="meaning-columns">
            <div class="meaning-positive">
              <h3>Significations à l'endroit</h3>
              <p>• ${formatMeaningList(arcana["Signification Positive"])}</p>
            </div>
            <div class="meaning-negative">
              <h3>Significations à l'envers</h3>
              <p>• ${formatMeaningList(arcana["Signification Négative"])}</p>
            </div>
          </div>
          <div class="domain-interpretations">
            <h3>Interprétations par domaine</h3>
            ${renderDomainInterpretation("Amour", arcana.Amour, "❤️")}
            ${renderDomainInterpretation("Travail", arcana.Travail, "💼")}
            ${renderDomainInterpretation("Argent", arcana.Argent, "💰")}
            ${renderDomainInterpretation("Guidance", arcana.Guidance, "✨")}
          </div>
        </div>
      </div>
      ${arcana.Question ? `
        <div class="full-width-block question-container">
          <div class="reflection-questions">
            <h3>Réflexion intérieure</h3>
            <p>${formatReflectionQuestions(arcana.Question)}</p>
          </div>
        </div>
      ` : ""}
    </div>
  `;

  renderPage(title, content, onBack, "", detailsLink);
  const image = document.querySelector(".arcana-detail-image");
  if (image) setupImage(image, imagePath, arcana.Nom || "Carte de tarot");
}
