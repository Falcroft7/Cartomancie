function showSpreadCategories(categoryToOpen = null) {
  const includeReversed = localStorage.getItem("cartomancieIncludeReversed") === "true";
  renderPage(
    "Méthodes de tirage",
    `
      <div class="spread-journal-link">
        <button type="button" id="spreadJournalButton">Voir le journal</button>
      </div>
      <div class="spread-preference">
        <label>
          <input type="checkbox" id="includeReversedPreference" ${includeReversed ? "checked" : ""}>
          <span>Inclure les cartes renversées dans les tirages</span>
        </label>
      </div>
      <div id="spreadCategories" class="accordion"></div>
    `,
    showHome
  );
  const container = document.getElementById("spreadCategories");
  document.getElementById("spreadJournalButton")?.addEventListener("click", showSpreadJournal);
  document.getElementById("includeReversedPreference")?.addEventListener("change", event => {
    localStorage.setItem("cartomancieIncludeReversed", String(event.target.checked));
  });

  Object.keys(spreadsByCategory).forEach(category => {
    const catBlock = document.createElement("div");
    catBlock.className = "accordion-item";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "accordion-trigger";
    button.textContent = category;
    button.setAttribute("aria-expanded", "false");

    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.textContent = "▼";
    button.appendChild(arrow);

    const panel = document.createElement("div");
    panel.className = "accordion-content";

    (spreadsByCategory[category] || []).forEach(spread => {
      const spreadButton = document.createElement("button");
      spreadButton.type = "button";
      spreadButton.className = "spread-link";
      spreadButton.textContent = spread.name;
      spreadButton.addEventListener("click", () => showSpreadDetails(spread, category));
      panel.appendChild(spreadButton);
    });

    const openPanel = () => {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
      arrow.style.transform = "rotate(180deg)";
      button.setAttribute("aria-expanded", "true");
    };

    button.addEventListener("click", () => {
      const isOpen = Boolean(panel.style.maxHeight);
      document.querySelectorAll(".accordion-content").forEach(item => {
        item.style.maxHeight = null;
      });
      document.querySelectorAll(".arrow").forEach(item => {
        item.style.transform = "rotate(0deg)";
      });
      document.querySelectorAll(".accordion-trigger").forEach(item => {
        item.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) openPanel();
    });

    if (categoryToOpen === category) setTimeout(openPanel, 10);
    catBlock.append(button, panel);
    container.appendChild(catBlock);
  });
}
