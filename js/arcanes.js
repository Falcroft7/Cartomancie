/* =========== CARTE INDIVIDUELLE =========== */
function creerCarteArcane(arcane, retourAction) {
    const img = nomToImagePath(arcane);
    const card = document.createElement("div");
    card.className = "card";
    
    const numeroAffiche = arcane.Numero ? `${arcane.Numero} - ` : "";
    
    card.innerHTML = `
        <img src="${img}" alt="${arcane.Nom}">
        <p>${numeroAffiche}${arcane.Nom}</p>
    `;
    
    card.onclick = () => affichArcane(arcane, retourAction);
    return card;
}

/* =========== LISTES ARCANES =========== */
function affichListeArcane(liste, titre, retourFonction) {
    const content = `<div id="cardsContainer" class="cards grid-container"></div>`;
    
    renderPage(titre, content, retourFonction);

    const container = document.getElementById("cardsContainer");
    
    liste.forEach(arcane => {
        const card = creerCarteArcane(arcane, () => affichListeArcane(liste, titre, retourFonction));
        container.appendChild(card);
    });
}

/* =========== LISTES SPÉCIFIQUES =========== */
function affichListeMajor() {
    affichListeArcane(listeMajors, "Arcanes Majeures", affichChoixSignifications);
}

function affichListeMinor(famille) {
    const filtered = listeMinors.filter(
        arcane => normalizeFamille(arcane.Famille) === normalizeFamille(famille)
    );
    affichListeArcane(filtered, `Arcanes Mineures - ${famille}`, affichChoixSignifications);
}

/* =========== FICHE ARCANE =========== */
function affichArcane(arcane, retourFonction) {
    const img = nomToImagePath(arcane);
    const titre = arcane.Numero && arcane.Numero.trim() 
                ? `${arcane.Numero} - ${arcane.Nom}` 
                : arcane.Nom;

    const content = `
        <div class="fiche-arcane">
            <div class="fiche-image">
                <img src="${img}" alt="${arcane.Nom}" class="fiche-arcane-image">
            </div>
            <div class="fiche-significations">
                <div class="mots-cles">
                    <h3>Mots clés</h3>
                    <p>${arcane["Mots clés"] || "Non renseigné"}</p>
                </div>
                <div class="fiche-left">
                    <h3>Signification Positive</h3>
                    <p>${arcane["Signification Positive"] || "Non renseigné"}</p>
                </div>
                <div class="fiche-right">
                    <h3>Signification Négative</h3>
                    <p>${arcane["Signification Négative"] || "Non renseigné"}</p>
                </div>
            </div>
        </div>
    `;

    renderPage(titre, content, retourFonction);
}
