// Mostrar u ocultar menú lateral
// function toggleSidebar() {
//   document.querySelector(".sidebar").classList.toggle("show");
// }

// Mostrar u ocultar menú lateral
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  sidebar.classList.toggle("show");

  // Mostrar u ocultar fondo oscuro
  if (sidebar.classList.contains("show")) {
    overlay.style.display = "block";
  } else {
    overlay.style.display = "none";
  }
}

// Cerrar el sidebar si se hace clic fuera de él
document.addEventListener("click", function (event) {
  const sidebar = document.querySelector(".sidebar");
  const toggleButton = document.querySelector(".sidebar-toggle");
  const overlay = document.getElementById("sidebar-overlay");

  if (!sidebar || !toggleButton || !overlay) return;

  const isOpen = sidebar.classList.contains("show");

  // Si el clic fue fuera del sidebar y del botón, y el sidebar está abierto
  if (
    isOpen &&
    !sidebar.contains(event.target) &&
    !toggleButton.contains(event.target)
  ) {
    sidebar.classList.remove("show");
    overlay.style.display = "none";
  }
});

function cargarVistaIndex() {
  //console.log(`Cargando vista: ${nombreVista}`);
  toggleSidebar();
  let nombreVista = 'index2';
  // Cargar HTML
  fetch(`${nombreVista}.html`)
    .then(response => {
      if (!response.ok) throw new Error("Vista no encontrada");
      return response.text();
    })
    .then(html => {
      ocultarIntro();

      document.getElementById("view-section").innerHTML = html;

      // Eliminar CSS anterior (si existe)
      const cssExistente = document.getElementById("vista-css");
      if (cssExistente) cssExistente.remove();

      // Eliminar JS anterior
      const scriptExistente = document.getElementById("vista-js");
      if (scriptExistente) scriptExistente.remove();

      // Insertar nuevo CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `Css/${nombreVista.toLowerCase()}.css`;
      link.id = "vista-css";
      document.head.appendChild(link);

      //Cargar el JS correspondiente
      const script = document.createElement("script");
      script.src = `Js/${nombreVista.toLowerCase()}.js`;
      script.id = "vista-js";
      script.defer = true;
      document.body.appendChild(script);

      // Limpiar selección previa
      localStorage.clear();
      localStorage.removeItem("selectedCategory");
      localStorage.removeItem("selectedSubcategory");
    })
    .catch(err => {
      console.error("Error cargando la vista:", err);
      document.getElementById("view-section").innerHTML = "<p>Error al cargar la vista.</p>";
    });
}

function irAlInicio() {
  // Limpiar selección previa
  localStorage.clear();
  localStorage.removeItem("selectedCategory");
  localStorage.removeItem("selectedSubcategory");

  window.location.reload();
}

function ocultarIntro() {
  const intro = document.getElementById("welcome");
  if (intro) intro.style.display = "none";
}