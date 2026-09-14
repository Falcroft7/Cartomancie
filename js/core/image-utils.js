function getArcanaImagePath(arcana) {
  const sanitize = value => String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’‘]/g, "")
    .replace(/-/g, "_")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "_");

  if (arcana.Type === "Majeure") {
    return `Images/Major/${sanitize(arcana.Nom)}.png`;
  }

  if (arcana.Type === "Mineure") {
    const valueMatch = String(arcana.Nom ?? "").match(/^(.+?) d[e’']?/i);
    if (!valueMatch) return APP_CONFIG.placeholderImagePath;
    const value = sanitize(valueMatch[1]);
    const arcanaSuit = sanitize(arcana.Famille);
    return `Images/${arcanaSuit}/${value}_${arcanaSuit}.png`;
  }

  return APP_CONFIG.placeholderImagePath;
}

function getSafeImagePath(path, fallback = APP_CONFIG.placeholderImagePath) {
  const pattern = /^Images\/[\w-]+(?:\/[\w-]+)*\.(?:png|jpe?g|webp|gif)$/i;
  return pattern.test(String(path ?? "")) ? path : fallback;
}

function setupImage(image, path, altText, fallback = APP_CONFIG.placeholderImagePath) {
  image.src = getSafeImagePath(path, fallback);
  image.alt = altText || "Image indisponible";
  image.addEventListener("error", () => {
    image.src = fallback;
  }, { once: true });
}
