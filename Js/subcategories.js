// Obtener la categoría seleccionada
//const selectedCategory = localStorage.getItem("selectedCategory");

if (typeof selectedCategory === "undefined") {
  var selectedCategory = localStorage.getItem("selectedCategory"); // crearla si no existe
} else {
  selectedCategory = localStorage.getItem("selectedCategory"); // ya existe, solo actualizar
}


// Cargar las subcategorías desde el JSON
fetch('Assets/data/subcategories.json')
  .then(response => {
    if (!response.ok) throw new Error("No se pudo cargar el JSON");
    return response.json();
  })
  .then(data => {
    const itemsFiltrados = data.filter(item =>
      item.categoria.toLowerCase() === selectedCategory.toLowerCase()
    );

    const subcategoriasSet = new Set();
    itemsFiltrados.forEach(item => {
      subcategoriasSet.add(item.subcategoria);
    });

    const cardsContainer = document.querySelector('.cards-container');
    if (!cardsContainer) {
      console.error("No se encontró cards-container en el HTML");
      return;
    }

    // Crear una tarjeta para cada subcategoría
    subcategoriasSet.forEach(subcategoria => {
      const card = document.createElement('div');
      card.classList.add('card');

      const title = document.createElement('h3');
      title.textContent = subcategoria;

      const button = document.createElement('button');
      button.textContent = 'Seleccionar';
      button.classList.add('btn-select');

      button.addEventListener('click', () => {
        // Guardar la subcategoría en localStorage
        localStorage.setItem('selectedSubcategory', subcategoria);

        // Cargar la vista del juego
        cargarVista();
      });

      card.appendChild(title);
      card.appendChild(button);
      cardsContainer.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Error procesando las subcategorías:", error);
  });

// Función para cargar la vista del juego (game2)
function cargarVista() {
  const nombreVista = 'game2';

  fetch(`${nombreVista}.html`)
    .then(response => {
      if (!response.ok) throw new Error("Vista no encontrada");
      return response.text();
    })
    .then(html => {
      // Insertar HTML dinámicamente
      document.getElementById("view-section").innerHTML = html;

      // Quitar CSS anterior
      const cssExistente = document.getElementById("vista-css");
      if (cssExistente) cssExistente.remove();

      // Eliminar JS anterior
      const scriptExistente = document.getElementById("vista-js");
      if (scriptExistente) scriptExistente.remove();

      // Agregar nuevo CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `Css/${nombreVista.toLowerCase()}.css`;
      link.id = "vista-css";
      document.head.appendChild(link);

      // Cargar script JS y luego ejecutar inicializarJuego()
      const script = document.createElement("script");
      script.src = `Js/${nombreVista.toLowerCase()}.js`;
      script.id = "vista-js";
//script.defer = true;
      script.onload = () => {
        console.log("Script game2.js cargado");
        if (typeof inicializarJuego === 'function') {
          inicializarJuego();
        } else {
          console.error("No se encontró la función inicializarJuego");
        }
      };

      document.body.appendChild(script);
    })
    .catch(err => {
      console.error("Error cargando la vista:", err);
      document.getElementById("view-section").innerHTML = "<p>Error al cargar la vista.</p>";
    });
}