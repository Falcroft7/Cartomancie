/* =========== URLS DES SOURCES =========== */
const csvArcanesUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjeBMuYH_nr0z9h1GL9FnU_2XzEeNMZQ4dVsCMeQVZfw5tXacWxY9VC_GdbONB2ZCzo4EVsnrGHwtC/pub?output=csv";
const csvTiragesUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjeBMuYH_nr0z9h1GL9FnU_2XzEeNMZQ4dVsCMeQVZfw5tXacWxY9VC_GdbONB2ZCzo4EVsnrGHwtC/pub?gid=1625499577&single=true&output=csv";

/* =========== VARIABLES DE DONNÉES GLOBALES =========== */
let listeMajors = [];
let listeMinors = [];
let tiragesCategorie = {};

/* =========== CHARGEMENT =========== */
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

async function initApp() {
  try {
    const [dataArcanes, dataTirages] = await Promise.all([
      fetchCSV(csvArcanesUrl),
      fetchCSV(csvTiragesUrl)
    ]);

    const allArcanes = dataArcanes.filter(r => r.Nom && r.Nom.trim());
    listeMajors = allArcanes.filter(r => r.Type === "Majeure");
    listeMinors = allArcanes.filter(r => r.Type === "Mineure");

    const listeTirages = dataTirages
      .filter(r => r.Nom && r.Type && r.Positions)
      .map(r => {
        let positions = [];
        try { 
          positions = JSON.parse(r.Positions); 
        } catch (e) { 
          console.error("Erreur de formatage JSON dans le tirage :", r.Nom); 
        }

        return {
          categorie: r.Catégorie?.trim() || "Divers",
          nom: r.Nom.trim(),
          description: r.Description?.trim() || "",
          type: r.Type.trim(),
          explication: r.Explication?.trim() || "",
          positions: positions,
          sens: r.Sens?.trim() || "", 
          depart: r.Départ?.trim() || ""
        };
      });

    tiragesCategorie = {};
    listeTirages.forEach(t => {
      if (!tiragesCategorie[t.categorie]) {
        tiragesCategorie[t.categorie] = [];
      }
      tiragesCategorie[t.categorie].push(t);
    });

    affichHome();

  } catch (error) {
    console.error("Erreur fatale au chargement :", error);
    render(`
      <div style="text-align:center; padding: 50px;">
        <p>✨ Les astres sont momentanément indisponibles... ✨</p>
        <p style="font-size: 0.8em; color: gray;">(Erreur de connexion aux données)</p>
      </div>
    `);
  }
}

initApp();
