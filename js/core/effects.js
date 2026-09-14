function createStars() {
  if (document.getElementById("stars-container")) return;

  const starsContainer = document.createElement("div");
  starsContainer.id = "stars-container";
  document.body.appendChild(starsContainer);

  for (let index = 0; index < 20; index += 1) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    const size = Math.random() * 1.5 + 0.5;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty("--duration", `${Math.random() * 8 + 7}s`);
    star.style.setProperty("--max-opacity", Math.random() * 0.5 + 0.2);
    star.style.animationDelay = `${Math.random() * 20}s`;
    starsContainer.appendChild(star);
  }
}

window.addEventListener("DOMContentLoaded", createStars, { once: true });
