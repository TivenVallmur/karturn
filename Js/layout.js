// Mostrar u ocultar menú lateral
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("show");
}

function cargarVista(nombreVista) {

  console.log(`Cargando vista: ${nombreVista}`);

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
    })
    .catch(err => {
      console.error("Error cargando la vista:", err);
      document.getElementById("view-section").innerHTML = "<p>Error al cargar la vista.</p>";
    });
}

function irAlInicio() {
  // Mostrar la introducción
  const intro = document.getElementById("welcome");
  if (intro) intro.style.display = "block";

  // Limpiar la vista dinámica
  const vista = document.getElementById("view-section");
  if (vista) vista.innerHTML = "";

  // Eliminar CSS y JS cargados dinámicamente
  const css = document.getElementById("vista-css");
  if (css) css.remove();

  const js = document.getElementById("vista-js");
  if (js) js.remove();

  // Limpiar selección previa
  localStorage.clear();
  localStorage.removeItem("selectedCategory");
  localStorage.removeItem("selectedSubcategory");
}

function ocultarIntro() {
  const intro = document.getElementById("welcome");
  if (intro) intro.style.display = "none";
}