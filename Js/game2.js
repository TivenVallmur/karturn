// Este archivo no llama a inicializarJuego() directamente, porque lo hará el script.onload
// Pero sí expone la función globalmente para que pueda ser llamada tras la carga dinámica.

function inicializarJuego() {
console.log("Entre al inicializarJuego");

  const intervalo = setInterval(() => {

    console.log("Entre al setInterval");

    const categoria = localStorage.getItem("selectedCategory");
    const subcategoria = localStorage.getItem("selectedSubcategory");
    console.log("Categoría seleccionada:", categoria);
    console.log("Subcategoría seleccionada:", subcategoria);
    
    if (categoria && subcategoria) {
      clearInterval(intervalo); // Detener el ciclo

      console.log("Categoría seleccionada:", categoria);
      console.log("Subcategoría seleccionada:", subcategoria);

      const rutaJson = categoria !== "Desconocida"
        ? `Assets/data/${categoria}.json`
        : "Assets/data/verbos_irregulares.json";

      iniciarJuegoFiltrado(rutaJson, subcategoria);
    } else {
      console.log("Esperando localStorage...");
    }
  }, 100); // Verifica cada 100ms
}


// Variables para el estado del juego
let primeraCarta = null;
let segundaCarta = null;
let bloqueo = false;

// Recargar el juego al cambiar la orientación del dispositivo
window.addEventListener("orientationchange", () => {
  const categoria = localStorage.getItem("selectedCategory");
  const subcategoria = localStorage.getItem("selectedSubcategory");
  const rutaJson = categoria !== "Desconocida"
    ? `Assets/data/${categoria}.json`
    : "Assets/data/verbos_irregulares.json";

  iniciarJuegoFiltrado(rutaJson, subcategoria);
});

// Cargar y filtrar los datos del JSON
function iniciarJuegoFiltrado(jsonPath, subcategoria) {
  fetch(jsonPath)
    .then(res => res.json())
    .then(data => {
      console.log("Subcategoría seleccionada:", subcategoria);

      const datosFiltrados = data.filter(item =>
        item.subcategoria.trim().toLowerCase() === subcategoria.trim().toLowerCase()
      );

      console.log("Cartas filtradas:", datosFiltrados);
      renderizarCartas(datosFiltrados);
    })
    .catch(err => console.error("Error al cargar o procesar JSON:", err));
}

// Determinar la cantidad de cartas según el dispositivo
function obtenerCantidadCartas() {
  const esMovil = /Mobi|Android/i.test(navigator.userAgent);
  const esVertical = window.innerHeight > window.innerWidth;

  return (esMovil && esVertical) ? 20 : 24;
}

// Renderizar las cartas en el tablero
function renderizarCartas(data) {
  const board = document.getElementById("gameBoard");
  if (!board) {
    console.error("No se encontró el contenedor #gameBoard");
    return;
  }

  board.innerHTML = "";

  const cantidadCartas = obtenerCantidadCartas();
  const cantidadPares = cantidadCartas / 2;

  const unicos = [];
  const inglesVistos = new Set();

  data.forEach(item => {
    if (!inglesVistos.has(item.ingles)) {
      inglesVistos.add(item.ingles);
      unicos.push(item);
    }
  });

  const seleccion = unicos.sort(() => Math.random() - 0.5).slice(0, cantidadPares);
  const cartas = [...seleccion, ...seleccion].sort(() => Math.random() - 0.5);

  cartas.forEach(animal => {
    const flipCard = document.createElement("div");
    flipCard.className = "flip-card";

    const inner = document.createElement("div");
    inner.className = "flip-card-inner";

    // Parte frontal
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

    // Parte trasera
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
}

// Lógica del juego para comparar cartas
function manejarClickCarta(carta, animal) {
  if (bloqueo || carta.classList.contains("flipped")) return;

  carta.classList.add("flipped");

  // Solo si tienes la librería de voz incluida
  if (window.responsiveVoice) {
    responsiveVoice.speak(animal.ingles, "US English Female");
  }

  if (!primeraCarta) {
    primeraCarta = { carta, animal };
    return;
  }

  segundaCarta = { carta, animal };
  bloqueo = true;

  const esMatch = primeraCarta.animal.ingles === segundaCarta.animal.ingles;

  if (esMatch) {
    setTimeout(resetCartas, 500);
  } else {
    setTimeout(() => {
      primeraCarta.carta.classList.remove("flipped");
      segundaCarta.carta.classList.remove("flipped");
      resetCartas();
    }, 1000);
  }
}

function resetCartas() {
  primeraCarta = null;
  segundaCarta = null;
  bloqueo = false;
}


// 👇 Esta línea permite que inicializarJuego se pueda llamar después de cargar dinámicamente el script
window.inicializarJuego = inicializarJuego; 