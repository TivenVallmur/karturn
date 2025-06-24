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
  const intro = document.getElementById("intro-section");
  const welcome = document.getElementById("welcome");
  if (intro) intro.style.display = "none";
  if (welcome) welcome.style.display = "none";
}

function empezarJuego() {
  const intro = document.getElementById("intro-section");
  if (intro) intro.style.display = "none";

  cargarVistaIndex(); // va a index2.html (categorías)
}

// fetch('Assets/data/subcategories.json')
//   .then(response => {
//     if (!response.ok) throw new Error("No se pudo cargar el JSON");
//     return response.json();
//   })
//   .then(data => {
//     console.log("Subcategorías cargadas:");

//     data.forEach(item => {
//       const categoria = item.categoria || "(sin categoría)";
//       const subcategoria = item.subcategoria || "(sin subcategoría)";
//       const ingles = item.ingles || "(sin nombre en inglés)";

//       console.log(`📁 Categoría: ${categoria} | 📂 Subcategoría: ${subcategoria} | 📘 Inglés: ${ingles}`);
//     });
//   })
//   .catch(error => {
//     console.error("Error procesando las subcategorías:", error);
//   });

// fetch('Assets/data/subcategories.json')
//   .then(response => {
//     if (!response.ok) throw new Error("No se pudo cargar el JSON");
//     return response.json();
//   })
//   .then(async data => {
//     const conteoPorSubcategoria = {};
//     const nombresInglesSet = new Set();
//     const repetidos = new Set();
//     const sinImagenValida = [];
//     const erroresImagenes = [];

//     for (const item of data) {
//       const subcategoria = item.subcategoria || "(sin subcategoría)";
//       const nombreIngles = item.ingles || "(sin nombre en inglés)";
//       const imagen = item.imagen;

//       // Conteo por subcategoría
//       conteoPorSubcategoria[subcategoria] = (conteoPorSubcategoria[subcategoria] || 0) + 1;

//       // Duplicados
//       if (nombresInglesSet.has(nombreIngles)) {
//         repetidos.add(nombreIngles);
//       } else {
//         nombresInglesSet.add(nombreIngles);
//       }

//       // Validación de ruta
//       const tieneRutaValida = imagen && typeof imagen === "string" && imagen.trim().endsWith(".png");
//       if (!tieneRutaValida) {
//         sinImagenValida.push(nombreIngles);
//         continue;
//       }

//       // Validar existencia real del archivo sin generar errores visibles
//       try {
//         const response = await fetch(imagen, { method: 'HEAD' });
//         if (!response.ok) {
//           erroresImagenes.push(nombreIngles);
//         }
//       } catch {
//         erroresImagenes.push(nombreIngles);
//       }
//     }

//     // Resultados
//     console.log("📊 Conteo por subcategoría:");
//     Object.entries(conteoPorSubcategoria).forEach(([sub, count]) => {
//       console.log(`📂 ${sub}: ${count} elementos`);
//     });

//     if (repetidos.size > 0) {
//       console.warn("🔁 Repetidos:");
//       console.warn([...repetidos]);
//     } else {
//       console.log("✅ Sin nombres repetidos");
//     }

//     if (sinImagenValida.length > 0) {
//       console.warn("❌ Elementos con ruta inválida de imagen:");
//       console.warn(sinImagenValida);
//     } else {
//       console.log("✅ Todas las rutas tienen formato válido (.png)");
//     }

//     if (erroresImagenes.length > 0) {
//       console.warn("🖼️ Elementos cuya imagen no existe (404):");
//       console.warn(erroresImagenes);
//     } else {
//       console.log("✅ Todas las imágenes existen en disco.");
//     }
//   })
//   .catch(error => {
//     console.error("❗ Error procesando las subcategorías:", error);
//   });