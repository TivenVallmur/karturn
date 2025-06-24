// Este archivo no llama a inicializarJuego() directamente, porque lo hará el script.onload
// Pero sí expone la función globalmente para que pueda ser llamada tras la carga dinámica.

function inicializarJuego() {
  const intervalo = setInterval(() => {
    const categoria = localStorage.getItem("selectedCategory");
    const subcategoria = localStorage.getItem("selectedSubcategory");
        
    if (categoria && subcategoria) {
      clearInterval(intervalo); // Detener el ciclo

      const rutaJson = categoria !== "Desconocida"
        ? `Assets/data/${categoria}.json`
        : "Assets/data/verbos_irregulares.json";

      iniciarJuegoFiltrado(rutaJson, subcategoria);
    } else {
      console.log("Esperando localStorage...");
    }

    reiniciarTemporizador();
    iniciarTemporizador();

  }, 100); // Verifica cada 100ms
}


// Variables para el estado del juego
let primeraCarta = null;
let segundaCarta = null;
let bloqueo = false;
let GlbCantidadPares = 0; // Variable global para la cantidad de pares
// Variables para controlar intentos
let nivel = 1;
let intentosRestantes = 11 - Math.max(nivel, 1); // mínimo 1
let esperandoPareja = false;
let cartaRepetidaTemporal = null;
let cartasEncontradas = [];
// Objeto para contar cuántas veces se ha volteado cada carta (por su nombre en inglés)
let contadorVolteos = {};

// Variables para el temporizador
let tiempoMaximo = 90; // segundos
let intervaloTemporizador;
let tiempoRestante = tiempoMaximo;



// Recargar el juego al cambiar la orientación del dispositivo
window.addEventListener("orientationchange", () => {
  const categoria = localStorage.getItem("selectedCategory");
  const subcategoria = localStorage.getItem("selectedSubcategory");
  const rutaJson = categoria !== "Desconocida"
    ? `Assets/data/${categoria}.json`
    : "Assets/data/verbos_irregulares.json";

  iniciarJuegoFiltrado(rutaJson, subcategoria);
});

// Inicializa valores según nivel
function iniciarNivel(n) {
  nivel = n;

  // Nivel 1 => 10 intentos, hasta mínimo 3
  intentosRestantes = Math.max(10 - (nivel - 1), 3); 
  esperandoPareja = false;
  cartaRepetidaTemporal = null;
  cartasEncontradas = [];
  console.log(`🔁 Nivel ${nivel} iniciado con ${intentosRestantes} intentos.`);
}

// Cargar y filtrar los datos del JSON
function iniciarJuegoFiltrado(jsonPath, subcategoria) {
  fetch(jsonPath)
    .then(res => res.json())
    .then(data => {
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
  GlbCantidadPares = cantidadPares; // Guardar la cantidad de pares globalmente 
  const unicos = [];
  const inglesVistos = new Set();

  data.forEach(item => {
    if (!inglesVistos.has(item.ingles)) {
      inglesVistos.add(item.ingles);
      unicos.push(item);
    }
  });

  const seleccion = unicos.sort(() => Math.random() - 0.5).slice(0, cantidadPares);
  //const cartas = [...seleccion, ...seleccion].sort(() => Math.random() - 0.5);
  const cartas = [...seleccion, ...seleccion].map(obj => ({ ...obj })).sort(() => Math.random() - 0.5);

  cartas.forEach((animal, index) => {

    // Asignamos un ID único temporal a cada carta usando el índice
    animal._tempId = `carta_${index}`;
    console.log(`🆔 ID generado: ${animal._tempId} - ${animal.ingles}`);

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

  // Contar volteos por ID único temporal
  contadorVolteos[animal._tempId] = (contadorVolteos[animal._tempId] || 0) + 1;


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
    // Al encontrar pareja
    cartasEncontradas.push(primeraCarta.animal.ingles);
    resetCartas();
    bloqueo = false;
    esperandoPareja = false;

    // Verificar si se ganó el juego
    if (cartasEncontradas.length === GlbCantidadPares) {
       setTimeout(() => {ShowMessageWin();}, 1000); // Esperar un poco antes de mostrar el mensaje
    }
  } else {
    // Si no es pareja
    setTimeout(() => {
      primeraCarta.carta.classList.remove("flipped");
      segundaCarta.carta.classList.remove("flipped");

      const idCarta = primeraCarta.animal._tempId;

      // Solo restamos intento si ya se había volteado esta carta antes y volvió a fallar
      if (contadorVolteos[idCarta] >= 2) {
        intentosRestantes--;
        console.log(`❌ Fallo tras repetir carta "${idCarta}". Intentos restantes: ${intentosRestantes}`);

        if (intentosRestantes <= 0) {
          ShowMessageLose();
        }
      }

      resetCartas();
    }, 1000);
  }

}

function resetCartas() {
  primeraCarta = null;
  segundaCarta = null;
  bloqueo = false;
}

function mostrarModal(titulo, mensaje, callbackReplay, callbackHome) {
  const modal = document.getElementById("gameModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const btnReplay = document.getElementById("btnReplay");
  const btnHome = document.getElementById("btnHome");

  modalTitle.textContent = titulo;
  modalMessage.textContent = mensaje;
  modal.classList.remove("hidden");

  btnReplay.onclick = () => {
    modal.classList.add("hidden");
    callbackReplay();
  };

  btnHome.onclick = () => {
    modal.classList.add("hidden");
    callbackHome();
  };
}


function ShowMessageWin() {
  clearInterval(intervaloTemporizador);
  mostrarModal(
    "🎉 YOU WIN!",
    "Do you want to play again?",
    () => {
      inicializarJuego();
      iniciarNivel(nivel);
    },
    () => {
      irAlInicio();
    }
  );
}

function ShowMessageLose() {
  clearInterval(intervaloTemporizador);
  mostrarModal(
    "🤖 GAME OVER",
    "Do you want to try again?",
    () => {
      inicializarJuego();
      iniciarNivel(nivel);
    },
    () => {
      irAlInicio();
    }
  );
}

function iniciarTemporizador() {
  const temporizadorElemento = document.getElementById("temporizador");
  temporizadorElemento.style.display = "";

  intervaloTemporizador = setInterval(() => {
    tiempoRestante--;
    if (temporizadorElemento) {
      temporizadorElemento.textContent = `⏱️ Time left: ${tiempoRestante}s`;
    }

    if (tiempoRestante <= 0) {
      clearInterval(intervaloTemporizador);
      ShowMessageLose();
    }
  }, 1000);
}

function reiniciarTemporizador() {
  clearInterval(intervaloTemporizador);
  tiempoRestante = tiempoMaximo;
}


// 👇 Esta línea permite que inicializarJuego se pueda llamar después de cargar dinámicamente el script
window.inicializarJuego = inicializarJuego; 