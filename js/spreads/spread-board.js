function formatSpreadExplanation(value) {
  if (!value) return "";
  return escapeHTML(value).replace(/^([^:\n]+):/gm, "<strong>$1 :</strong>");
}

function shuffleArcanaCards(cards) {
  const shuffled = [...cards];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function saveSpreadReading(spread, drawnCards) {
  const savedReadings = JSON.parse(localStorage.getItem("cartomancieReadings") || "[]");
  savedReadings.unshift({
    date: new Date().toISOString(),
    spreadName: spread.name,
    cards: drawnCards.map(({ arcana, position, reversed }) => ({
      cardName: arcana.Nom,
      position: position.label || position.titleTop || "Position",
      reversed
    }))
  });
  localStorage.setItem("cartomancieReadings", JSON.stringify(savedReadings.slice(0, 20)));
}

function showSpreadDetails(spread, category) {
  const content = `
    <div class="spread-draw-controls">
      <button type="button" id="saveSpreadButton" disabled>
        Sauvegarder le tirage
        <span class="save-confirmation-icon" aria-hidden="true">✓</span>
        <span class="visually-hidden" id="saveConfirmationLabel"></span>
      </button>
    </div>
    <div class="spread-board"></div>
    <div class="spread-explanation">${formatSpreadExplanation(spread.explanation)}</div>
  `;
  renderPage(spread.name, content, () => showSpreadCategories(category), spread.description);

  const board = document.querySelector(".spread-board");
  const spreadType = String(spread.type || "").toLowerCase().trim();
  const positions = Array.isArray(spread.positions) ? spread.positions : [];
  const spreadClass = ["grid", "circular", "oval"].includes(spreadType) ? spreadType : "grid";
  board.className = `spread-board ${spreadClass}`;

  if (positions.length === 0) {
    board.textContent = "Ce tirage n'a pas de positions configurées.";
    return;
  }

  const animationTimers = [];
  let boardObserver = null;
  let drawnCards = [];
  let positionSpreadCards = () => {};

  const appendCard = (position, index, drawnCard) => {
    const card = document.createElement("div");
    card.className = "spread-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Révéler ${position.label || "la carte"}`);
    card.dataset.revealed = "false";
    card._drawnCard = drawnCard;
    if (drawnCard.reversed) card.classList.add("reversed");
    if (String(position.horizontal).toLowerCase().trim() === "true") {
      card.classList.add("horizontal");
    }

    const inclination = Number.parseFloat(position.inclinaison);
    if (Number.isFinite(inclination)) {
      card.style.setProperty("--angle-inclinaison", `${inclination}deg`);
      card.classList.add("rotated");
    }

    if (position.titleTop) {
      const title = document.createElement("div");
      title.className = "spread-card-title";
      title.textContent = position.titleTop;
      card.appendChild(title);
    }

    const flipper = document.createElement("div");
    flipper.className = "spread-card-flipper";

    const back = document.createElement("div");
    back.className = "spread-card-face spread-card-back";
    const backImage = document.createElement("img");
    setupImage(backImage, APP_CONFIG.cardBackImagePath, "Dos de carte");
    back.appendChild(backImage);

    const front = document.createElement("div");
    front.className = "spread-card-face spread-card-front";
    const frontImage = document.createElement("img");
    setupImage(frontImage, getArcanaImagePath(drawnCard.arcana), drawnCard.arcana.Nom || "Carte révélée");
    front.appendChild(frontImage);
    flipper.append(back, front);

    const label = document.createElement("p");
    label.textContent = position.label || "";
    card.append(flipper, label);
    board.appendChild(card);

    const revealCard = () => {
      if (card.dataset.revealed === "true") return;
      card.dataset.revealed = "true";
      card.classList.add("revealed");
      card.setAttribute("aria-label", `${position.label || "Carte"} révélée`);
    };
    card.addEventListener("click", revealCard);
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        revealCard();
      }
    });

    animationTimers.push(setTimeout(() => card.classList.add("visible"), 200 + index * 300));
  };

  const positionGridCards = () => {
    const maxY = Math.max(...positions.map(position => Number.parseInt(position.y, 10) || 0));
    board.style.display = "grid";
    board.style.gridTemplateRows = `repeat(${maxY + 1}, 130px)`;
    Array.from(board.children).forEach((card, index) => {
      const position = positions[index];
      card.style.gridColumn = (Number.parseInt(position.x, 10) || 0) + 1;
      card.style.gridRow = (Number.parseInt(position.y, 10) || 0) + 1;
      card.style.zIndex = index + 1;
      const offsetX = Number.parseFloat(position.offsetX) || 0;
      const offsetY = Number.parseFloat(position.offsetY) || 0;
      if (offsetX || offsetY) {
        card.classList.add("offset");
        card.style.setProperty("--offsetX", `${offsetX}px`);
        card.style.setProperty("--offsetY", `${offsetY}px`);
      }
    });
  };

  if (spreadType === "grid") {
    board.style.display = "none";
  }

  if (spreadType === "circular" || spreadType === "oval") {
    positionSpreadCards = () => requestAnimationFrame(() => {
      const centerX = board.clientWidth / 2;
      const centerY = board.clientHeight / 2;
      if (!centerX || !centerY) return;
      const start = Number.parseFloat(spread.startAngle);
      const direction = spread.direction?.toLowerCase().trim() === "anti" ? -1 : 1;
      const angleStart = Number.isFinite(start) ? start : -90;
      const angleStep = 360 / positions.length;
      const radiusX = spreadType === "oval" ? centerX * 0.85 : Math.min(centerX, centerY) * 0.7;
      const radiusY = spreadType === "oval" ? centerY * 0.7 : radiusX;

      Array.from(board.children).forEach((card, index) => {
        const angle = (angleStart + index * angleStep * direction) * Math.PI / 180;
        card.style.left = `${centerX + radiusX * Math.cos(angle)}px`;
        card.style.top = `${centerY + radiusY * Math.sin(angle)}px`;
      });
    });

    boardObserver = new ResizeObserver(positionSpreadCards);
    boardObserver.observe(board);
    positionSpreadCards();
  }

  const saveButton = document.getElementById("saveSpreadButton");

  const dealSpread = () => {
    board.innerHTML = "";
    animationTimers.forEach(clearTimeout);
    animationTimers.length = 0;
    const includeReversed = localStorage.getItem("cartomancieIncludeReversed") === "true";
    const deck = shuffleArcanaCards([...majorArcanaList, ...minorArcanaList]);
    drawnCards = deck.slice(0, positions.length).map((arcana, index) => ({
      arcana,
      position: positions[index],
      reversed: includeReversed && Math.random() < 0.5
    }));
    drawnCards.forEach((drawnCard, index) => appendCard(drawnCard.position, index, drawnCard));
    if (spreadType === "grid") positionGridCards();
    if (spreadType === "circular" || spreadType === "oval") positionSpreadCards();
    board.style.display = "";
    saveButton.disabled = false;
  };

  saveButton.addEventListener("click", () => {
    if (drawnCards.length === 0) return;
    try {
      saveSpreadReading(spread, drawnCards);
      saveButton.classList.add("is-saved");
      saveButton.querySelector("#saveConfirmationLabel").textContent = "Tirage sauvegardé";
    } catch (error) {
      console.error("Impossible de sauvegarder ce tirage.", error);
    }
  });

  dealSpread();

  registerViewCleanup(() => {
    boardObserver?.disconnect();
    animationTimers.forEach(clearTimeout);
  });
}
