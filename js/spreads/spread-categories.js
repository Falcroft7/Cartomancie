function showSpreadCategories(categoryToOpen = null) {
  renderPage("Méthodes de tirage", `<div id="spreadCategories" class="accordion"></div>`, showHome);
  const container = document.getElementById("spreadCategories");

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
      document.querySelectorAll(".accordion-content").forEach(item => {
        item.style.maxHeight = null;
      });
      document.querySelectorAll(".arrow").forEach(item => {
        item.style.transform = "rotate(0deg)";
      });
      document.querySelectorAll(".accordion-trigger").forEach(item => {
        item.setAttribute("aria-expanded", "false");
      });
      if (!panel.style.maxHeight) openPanel();
    });

    if (categoryToOpen === category) setTimeout(openPanel, 10);
    catBlock.append(button, panel);
    container.appendChild(catBlock);
  });
}
