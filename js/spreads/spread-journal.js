const SAVED_READINGS_KEY = "cartomancieReadings";

function getSavedReadings() {
  try {
    const readings = JSON.parse(localStorage.getItem(SAVED_READINGS_KEY) || "[]");
    return Array.isArray(readings) ? readings : [];
  } catch (error) {
    return [];
  }
}

function formatReadingDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date inconnue";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function findArcanaByName(name) {
  return [...majorArcanaList, ...minorArcanaList].find(arcana => arcana.Nom === name);
}

function showSpreadJournal() {
  renderPage(
    "Journal des tirages",
    `
      <div class="journal-toolbar">
        <button type="button" id="clearJournalButton" class="journal-danger-button">
          Effacer le journal
        </button>
      </div>
      <div id="spreadJournal" class="spread-journal"></div>
    `,
    showSpreadCategories
  );

  const journal = document.getElementById("spreadJournal");
  const clearButton = document.getElementById("clearJournalButton");

  const renderJournal = () => {
    const readings = getSavedReadings();
    clearButton.disabled = readings.length === 0;

    if (readings.length === 0) {
      journal.innerHTML = `
        <div class="journal-empty">
          <p>Aucun tirage sauvegardé.</p>
          <button type="button" id="emptyJournalBackButton">Découvrir les méthodes de tirage</button>
        </div>
      `;
      journal.querySelector("#emptyJournalBackButton")?.addEventListener("click", showSpreadCategories);
      return;
    }

    journal.innerHTML = readings.map((reading, readingIndex) => `
      <article class="journal-entry">
        <div class="journal-entry-header">
          <div>
            <h3>${escapeHTML(reading.spreadName || "Tirage sans nom")}</h3>
            <time datetime="${escapeHTML(reading.date || "")}">${escapeHTML(formatReadingDate(reading.date))}</time>
          </div>
          <button type="button" class="journal-remove-button" data-reading-index="${readingIndex}" aria-label="Supprimer ce tirage">Supprimer</button>
        </div>
        <ul class="journal-card-list">
          ${(Array.isArray(reading.cards) ? reading.cards : []).map(card => `
            <li>
              <span class="journal-position">${escapeHTML(card.position || "Position")}</span>
              <button type="button" class="journal-card-button" data-card-name="${escapeHTML(card.cardName || "")}">
                ${escapeHTML(card.cardName || "Carte inconnue")}
                ${card.reversed ? "<span class=\"journal-reversed\">Renversée</span>" : ""}
              </button>
            </li>
          `).join("")}
        </ul>
      </article>
    `).join("");

    journal.querySelectorAll(".journal-remove-button").forEach(button => {
      button.addEventListener("click", () => {
        const updatedReadings = getSavedReadings();
        updatedReadings.splice(Number(button.dataset.readingIndex), 1);
        localStorage.setItem(SAVED_READINGS_KEY, JSON.stringify(updatedReadings));
        renderJournal();
      });
    });

    journal.querySelectorAll(".journal-card-button").forEach(button => {
      button.addEventListener("click", () => {
        const arcana = findArcanaByName(button.dataset.cardName);
        if (arcana) showArcanaDetails(arcana, showSpreadJournal);
      });
    });
  };

  clearButton.addEventListener("click", () => {
    localStorage.removeItem(SAVED_READINGS_KEY);
    renderJournal();
  });

  renderJournal();
}
