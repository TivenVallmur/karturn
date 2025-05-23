const categoria = localStorage.getItem("selectedCategory") || "Desconocida";

document.getElementById("categoria-nombre").textContent = categoria;

// Reemplazar guiones bajos por espacios para mostrar bonito
const nombreFormateado = categoria.replace(/_/g, " ");
document.getElementById("categoria-nombre").textContent = nombreFormateado;

// Mostrar u ocultar menú lateral
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("show");
}

// Estado del juego
let primeraCarta = null;
let segundaCarta = null;
let bloqueo = false;

// Iniciar juego cargando dinámicamente el archivo
const rutaJson = categoria !== "Desconocida"
  ? `Assets/data/${categoria}.json`
  : "Assets/data/verbos_irregulares.json";

  renderizarCartasDesdeJSON(rutaJson);

function obtenerCantidadCartas() {
  const esMovil = /Mobi|Android/i.test(navigator.userAgent);
  const esVertical = window.innerHeight > window.innerWidth;

  if (esMovil && esVertical) return 20;
  return 24;
}


// Función para renderizar cartas
function renderizarCartasDesdeJSON(jsonPath) {
  fetch(jsonPath)
    .then(res => res.json())
    .then(data => {
      const board = document.getElementById("gameBoard");
      board.innerHTML = "";

      const cantidadCartas = obtenerCantidadCartas(); // 20 o 24
      const cantidadPares = cantidadCartas / 2;

      // ✅ Eliminar duplicados basados en el campo 'ingles'
      const unicos = [];
      const inglesVistos = new Set();

      data.forEach(item => {
        if (!inglesVistos.has(item.ingles)) {
          inglesVistos.add(item.ingles);
          unicos.push(item);
        }
      });

      // 🔄 Mezclar y tomar solo la cantidad necesaria de pares únicos
      const seleccion = unicos.sort(() => Math.random() - 0.5).slice(0, cantidadPares);

      // 🎯 Duplicar para formar los pares, y mezclar de nuevo
      const cartas = [...seleccion, ...seleccion].sort(() => Math.random() - 0.5);
      
      cartas.forEach(animal => {
        const flipCard = document.createElement("div");
        flipCard.className = "flip-card";

        const inner = document.createElement("div");
        inner.className = "flip-card-inner";

        // Parte frontal (cara descubierta)
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

        // Parte trasera (cara oculta)
        const back = document.createElement("div");
        back.className = "flip-card-back";

        const imgBack = document.createElement("img");
        imgBack.src = "Assets/images/back.png";
        imgBack.alt = "Reverso de carta";

        back.appendChild(imgBack);

        inner.append(front, back);
        flipCard.appendChild(inner);

        flipCard.addEventListener("click", () => manejarClickCarta(flipCard, animal));

        board.appendChild(flipCard);
      });
    })
    .catch(err => console.error("Error al cargar el JSON:", err));
}

window.addEventListener("orientationchange", () => {
  // Lógica para recargar el tablero dinámicamente
  renderizarCartasDesdeJSON(rutaJson);
});

// Lógica al hacer clic en una carta
function manejarClickCarta(carta, animal) {
  if (bloqueo || carta.classList.contains("flipped")) return;

  carta.classList.add("flipped");
  responsiveVoice.speak(animal.ingles, "US English Female");
  if (!primeraCarta) {
    primeraCarta = { carta, animal };
    return;
  }

  segundaCarta = { carta, animal };
  bloqueo = true;

  const esMatch = primeraCarta.animal.ingles === segundaCarta.animal.ingles;

  if (esMatch) {
    setTimeout(resetCartas, 500); // Espera breve para mantener flip visible
  } else {
    setTimeout(() => {
      primeraCarta.carta.classList.remove("flipped");
      segundaCarta.carta.classList.remove("flipped");
      resetCartas();
    }, 1000);
  }
}

// Reset de cartas
function resetCartas() {
  primeraCarta = null;
  segundaCarta = null;
  bloqueo = false;
}
