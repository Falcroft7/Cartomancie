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

    const formatList = (txt) => {
        if (!txt || txt === "Non renseigné") return txt;
        return txt.split(/[,;]/).map(item => item.trim()).join('<br>');
    };

    const formatBadges = (txt) => {
        if (!txt || txt === "Non renseigné") return txt;
        return txt.split(/[,;]/).map(item => `<span class="badge-mot">${item.trim()}</span>`).join('');
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
            <div class="fiche-image">
                <img src="${img}" alt="${arcane.Nom}" class="fiche-arcane-image">
            </div>
            <div class="fiche-significations">
                <div class="mots-cles">
                    <h3>Mots clés</h3>
                    <div class="badges-wrapper">${formatBadges(arcane["Mots clés"])}</div>
                </div>
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
    `;

    renderPage(titre, content, retourFonction);
}
