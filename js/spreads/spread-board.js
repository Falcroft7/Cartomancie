function formatSpreadExplanation(value) {
  if (!value) return "";
  return escapeHTML(value).replace(/^([^:\n]+):/gm, "<strong>$1 :</strong>");
}

function showSpreadDetails(spread, category) {
  const content = `
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

  const appendCard = (position, index) => {
    const card = document.createElement("div");
    card.className = "spread-card";
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

    const image = document.createElement("img");
    setupImage(image, APP_CONFIG.cardBackImagePath, "Dos de carte");
    image.className = "spread-card-image";

    const label = document.createElement("p");
    label.textContent = position.label || "";
    card.append(image, label);
    board.appendChild(card);

    animationTimers.push(setTimeout(() => card.classList.add("visible"), 200 + index * 300));
  };

  positions.forEach(appendCard);

  if (spreadType === "grid") {
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
  }

  if (spreadType === "circular" || spreadType === "oval") {
    const positionSpreadCards = () => requestAnimationFrame(() => {
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

  registerViewCleanup(() => {
    boardObserver?.disconnect();
    animationTimers.forEach(clearTimeout);
  });
}
