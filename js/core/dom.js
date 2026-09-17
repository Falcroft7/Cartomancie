let activePageCleanup = null;

function renderApp(html) {
  const appContainer = document.getElementById("app");
  if (!appContainer) return;

  activePageCleanup?.();
  activePageCleanup = null;
  appContainer.classList.remove("fade-in");
  void appContainer.offsetWidth;
  appContainer.innerHTML = html;
  appContainer.classList.add("fade-in");
}

function registerViewCleanup(cleanup) {
  activePageCleanup = cleanup;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderPage(title, contentHTML, backAction, description = "", headerActionHTML = "") {
  const descHTML = description
    ? `<div class="spread-description">${escapeHTML(description)}</div>`
    : "";

  renderApp(`
    <div class="sticky-nav">
      <a href="#" id="backButton" class="back-button">⬅ Retour</a>
    </div>
    <div class="page-content">
      <div class="page-heading">
        <h2>${escapeHTML(title)}</h2>
        ${headerActionHTML}
      </div>
      ${descHTML}
      <div class="page-body">${contentHTML}</div>
    </div>
  `);

  document.getElementById("backButton")?.addEventListener("click", event => {
    event.preventDefault();
    backAction();
  });
  window.scrollTo(0, 0);
}
