function setupOverlay(overlay) {
  overlay._previousActiveElement = document.activeElement;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeOverlay();
  });
  overlay._escapeHandler = event => {
    if (event.key === "Escape") closeOverlay();
  };
  document.addEventListener("keydown", overlay._escapeHandler);
  overlay.querySelector(".overlay-close-button")?.focus();
}

function closeOverlay() {
  const overlay = document.getElementById("revealOverlay");
  if (!overlay) return;
  clearTimeout(overlay._timerId);
  clearTimeout(overlay._removeTimerId);
  document.removeEventListener("keydown", overlay._escapeHandler);
  overlay.classList.add("fade-out");
  overlay._removeTimerId = setTimeout(() => {
    overlay.remove();
    overlay._previousActiveElement?.focus();
  }, 500);
}

function closeExistingOverlay() {
  const overlay = document.getElementById("revealOverlay");
  if (!overlay) return;
  clearTimeout(overlay._timerId);
  clearTimeout(overlay._removeTimerId);
  document.removeEventListener("keydown", overlay._escapeHandler);
  overlay.remove();
}

function getCardBackImagePath() {
  return APP_CONFIG.cardBackImagePath;
}

window.addEventListener("DOMContentLoaded", () => {
  const preload = new Image();
  preload.src = getCardBackImagePath();
}, { once: true });
