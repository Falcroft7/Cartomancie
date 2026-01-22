/* =========== FONCTION DE CHARGEMENT GÉNÉRIQUE =========== */
// On transforme Papa.parse en une Promise pour pouvoir "l'attendre"
function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error)
    });
  });
}

/* =========== INITIALISATION DE L'APPLICATION =========== */
async function initApp() {
  try {
    // On lance les deux téléchargements en parallèle
    const [dataArcanes, dataTirages] = await Promise.all([
      fetchCSV(csvArcanesUrl),
      fetchCSV(csvTiragesUrl)
    ]);

    // 1. Traitement des Arcanes
    const allArcanes = dataArcanes.filter(r => r.Nom && r.Nom.trim());
    listeMajors = allArcanes.filter(r => r.Type === "Majeure");
    listeMinors = allArcanes.filter(r => r.Type === "Mineure");

    // 2. Traitement des Tirages
    const listeTirages = dataTirages
      .filter(r => r.Nom && r.Type && r.Positions)
      .map(r => {
        let positions = [];
        try { positions = JSON.parse(r.Positions); }
        catch (e) { console.error("Erreur JSON :", r.Nom); }

        return {
          categorie: r.Catégorie?.trim() || "Divers",
          nom: r.Nom.trim(),
          description: r.Description?.trim() || "",
          type: r.Type.trim(),
          explication: r.Explication?.trim() || "",
          positions
        };
      });

    // Groupement par catégorie
    tiragesCategorie = {};
    listeTirages.forEach(t => {
      if (!tiragesCategorie[t.categorie]) tiragesCategorie[t.categorie] = [];
      tiragesCategorie[t.categorie].push(t);
    });

    // 3. Une fois que tout est en mémoire, on affiche l'accueil
    affichHome();

  } catch (error) {
    console.error("Erreur fatale au chargement :", error);
    render("<p>Erreur lors du chargement des données. Veuillez vérifier votre connexion.</p>");
  }
}

// Lancement au démarrage
initApp();
