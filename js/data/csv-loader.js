function fetchCsv(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: results => {
        if (results.errors.length > 0) {
          reject(new Error(`Erreur de lecture CSV : ${results.errors[0].message}`));
          return;
        }
        resolve(results.data);
      },
      error: reject
    });
  });
}

function parseSpreadPositions(value, name) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Erreur de formatage JSON dans le tirage :", name);
    return [];
  }
}

function normalizeSpreadType(value) {
  const typeMap = {
    grille: "grid",
    circulaire: "circular",
    ovale: "oval"
  };
  const normalizedType = String(value ?? "").trim().toLowerCase();
  return typeMap[normalizedType] || normalizedType;
}

function normalizeExternalUrl(value) {
  const trimmedValue = String(value ?? "").trim();
  if (!trimmedValue) return "";

  try {
    const url = new URL(trimmedValue);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch (error) {
    return "";
  }
}

function normalizeArcanaRows(rows) {
  return rows
    .filter(row => row.Nom && row.Nom.trim())
    .map(row => ({
      ...row,
      Nom: row.Nom.trim(),
      Type: row.Type?.trim() || "",
      Details: normalizeExternalUrl(row.Details)
    }));
}

function normalizeSpreadRows(rows) {
  return rows
    .filter(row => row.Nom && row.Type && row.Positions)
    .map(row => ({
      category: row.Catégorie?.trim() || "Divers",
      name: row.Nom.trim(),
      description: row.Description?.trim() || "",
      type: normalizeSpreadType(row.Type),
      explanation: row.Explication?.trim() || "",
      positions: parseSpreadPositions(row.Positions, row.Nom),
      direction: row.Sens?.trim() || "",
      startAngle: row.Depart?.trim() || ""
    }));
}

function normalizeDeckRows(rows) {
  return rows
    .filter(row => row.Nom && row.Nom.trim())
    .map(row => ({
      type: row.Type?.trim() || "Tarot",
      name: row.Nom.trim(),
      image: row.Image?.trim() || ""
    }));
}
