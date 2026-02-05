/* =========== CARTE INDIVIDUELLE =========== */
function creerCarteArcane(arcane, retourAction) {
    const img = nomToImagePath(arcane);
    const card = document.createElement("div");
    card.className = "card";
    
    card.innerHTML = `
        <img src="${img}" alt="${arcane.Nom}" loading="lazy">
        <p>${arcane.Numero ? `${arcane.Numero} - ` : ""}${arcane.Nom}</p>
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

    const renderInfoSide = (label, valeur, icone) => {
        if (!valeur || valeur === "Non renseigné" || valeur === "") return "";
        return `
            <div class="info-side-item">
                <span class="info-side-icon">${icone}</span>
                <div class="info-side-texte">
                    <strong>${label}</strong>
                    <span>${valeur}</span>
                </div>
            </div>
        `;
    };

    const formatList = (txt) => {
        if (!txt || txt === "Non renseigné") return txt;
        return txt.split(/[,;]/).map(item => item.trim()).join('<br>');
    };
    
    const formatQuestions = (txt) => {
        if (!txt || txt === "Non renseigné") return "";
        return txt.replace(/\?\s*/g, "?<br><br>");
    };

    const renderDomaine = (label, texte, icone) => {
        if (!texte || texte === "Non renseigné") return "";
        return `
            <div class="domaine-item">
                <span class="domaine-icon">${icone}</span>
                <div class="domaine-texte">
                    <strong>${label} :</strong> ${texte}
                </div>
            </div>
        `;
    };

    const content = `
        <div class="fiche-arcane">
        
            ${arcane.Affirmation ? `
                <div class="full-width-block affirmation-container">
                    <p class="arcane-affirmation">"${arcane.Affirmation}"</p>
                </div>
            ` : ''}

            <div class="fiche-header-grid">
                <div class="fiche-left-column">
                    <div class="fiche-image">
                        <img src="${img}" alt="${arcane.Nom}" class="fiche-arcane-image" fetchpriority="high">
                    </div>
                    <div class="fiche-correspondances">
                        ${renderInfoSide("Élément", arcane["Elément"], "🌀")}
                        ${renderInfoSide("Signe", arcane["Signe astro"], "♈")}
                        ${renderInfoSide("Planète", arcane.Planète, "🪐")}
                        ${renderInfoSide("Chakra", arcane.Shakra, "💎")}
                        ${renderInfoSide("Oui/Non", arcane["Oui/Non"], "⚖️")}
                    </div>
                </div>
                
                <div class="fiche-significations">              
                    <div class="fiche-columns">
                        <div class="fiche-left">
                            <h3>Signification Positive</h3>
                            <p>${formatList(arcane["Signification Positive"])}</p>
                        </div>
                        <div class="fiche-right">
                            <h3>Signification Négative</h3>
                            <p>${formatList(arcane["Signification Négative"])}</p>
                        </div>
                    </div>
    
                    <div class="fiche-domaines">
                        <h3>Interprétations par domaine</h3>
                        ${renderDomaine("Amour", arcane["Amour"], "❤️")}
                        ${renderDomaine("Travail", arcane["Travail"], "💼")}
                        ${renderDomaine("Argent", arcane["Argent"], "💰")}
                        ${renderDomaine("Guidance", arcane["Guidance"], "✨")}
                    </div>
                </div>
            </div>

            ${arcane.Question ? `
                <div class="full-width-block question-container">
                    <div class="fiche-questions">
                        <h3>Réflexion intérieure</h3>
                        <p>• ${formatQuestions(arcane.Question)}</p>
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    renderPage(titre, content, retourFonction);
}
