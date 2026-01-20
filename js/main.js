/* =========== CHARGEMENT CSV =========== */
Papa.parse(csvArcanesUrl, {
  download: true,
  header: true,
  complete: function (results) {
    const all = results.data.filter(r => r.Nom && r.Nom.trim());
    listeMajors = all.filter(r => r.Type === "Majeure");
    listeMinors = all.filter(r => r.Type === "Mineure");    
    affichHome();
  }
});

Papa.parse(csvTiragesUrl, {
  download: true,
  header: true,
  complete: function (results) {
    const listeTirages = results.data
      .filter(r => r.Nom && r.Type && r.Positions)
      .map(r => {
        let positions = [];

        try { positions = JSON.parse(r.Positions); }
        catch (e) { console.error("Erreur JSON Positions :", r.Nom, r.Positions); }

        return {
          categorie: r.Catégorie?.trim(),
          nom: r.Nom.trim(),
          description: r.Description?.trim(),
          type: r.Type.trim(),
          explication: r.Explication?.trim(),
          positions
        };
      });

    tiragesCategorie = {};
    listeTirages.forEach(t => {
      if (!tiragesCategorie[t.categorie]) {
        tiragesCategorie[t.categorie] = [];
      }
      tiragesCategorie[t.categorie].push(t);
    });
  }
});
