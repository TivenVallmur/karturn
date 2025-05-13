// Obtener categoría desde la URL
const params = new URLSearchParams(window.location.search);
const categoria = params.get("categoria") || "Desconocida";
document.getElementById("categoria-nombre").textContent = categoria;

// Estado del juego
let primeraCarta = null;
let segundaCarta = null;
let bloqueo = false;

// Iniciar juego
renderizarCartasDesdeJSON("Assets/data/animales_set2.json");

function renderizarCartasDesdeJSON(jsonPath) {
  fetch(jsonPath)
    .then(res => res.json())
    .then(data => {
      const board = document.getElementById("gameBoard");
      board.innerHTML = "";

      const cartasDuplicadas = [...data, ...data];
      const cartasBarajadas = cartasDuplicadas.sort(() => Math.random() - 0.5);

      cartasBarajadas.forEach(animal => {
        const flipCard = document.createElement("div");
        flipCard.className = "flip-card";

        const inner = document.createElement("div");
        inner.className = "flip-card-inner";

        const front = document.createElement("div");
        front.className = "flip-card-front";

        const nombreIng = document.createElement("p");
        nombreIng.textContent = animal.ingles;
        nombreIng.classList.add("fw-bold");

        const imgFront = document.createElement("img");
        imgFront.src = animal.imagen;
        imgFront.alt = animal.ingles;

        const nombreEsp = document.createElement("p");
        nombreEsp.textContent = animal.espanol;

        front.append(nombreIng, imgFront, nombreEsp);

        const back = document.createElement("div");
        back.className = "flip-card-back";

        const imgBack = document.createElement("img");
        imgBack.src = "Assets/images/back.png";
        imgBack.alt = "Reverso";

        back.appendChild(imgBack);
        inner.append(front, back);
        flipCard.appendChild(inner);
        board.appendChild(flipCard);

        flipCard.addEventListener("click", () => {
          if (bloqueo || flipCard.classList.contains("flipped")) return;

          flipCard.classList.add("flipped");

          if (!primeraCarta) {
            primeraCarta = { card: flipCard, data: animal };
          } else {
            segundaCarta = { card: flipCard, data: animal };
            bloqueo = true;

            const coinciden = primeraCarta.data.ingles === segundaCarta.data.ingles;

            setTimeout(() => {
              if (!coinciden) {
                primeraCarta.card.classList.remove("flipped");
                segundaCarta.card.classList.remove("flipped");
              }
              primeraCarta = null;
              segundaCarta = null;
              bloqueo = false;
            }, 1000);
          }
        });
      });
    })
    .catch(err => console.error("Error cargando JSON:", err));
}
