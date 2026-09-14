function normalizeSuit(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getSuitLabel(arcanaSuit) {
  const labels = {
    epees: "Les Épées",
    coupes: "Les Coupes",
    batons: "Les Bâtons",
    deniers: "Les Deniers"
  };
  return labels[normalizeSuit(arcanaSuit)] || arcanaSuit;
}
