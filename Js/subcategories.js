// Leer categoría seleccionada del localStorage
const selectedCategory = localStorage.getItem("selectedCategory") || "animales";

// Cargar datos desde el JSON
fetch('Assets/data/subcategories.json')
  .then(response => {
    if (!response.ok) throw new Error("No se pudo cargar el JSON");
    return response.json();
  })
  .then(data => {
    // Filtrar solo los elementos que coinciden con la categoría seleccionada
    const itemsFiltrados = data.filter(item =>
      item.categoria.toLowerCase() === selectedCategory.toLowerCase()
    );

    // console.log("Categoría seleccionada:", selectedCategory);
    // console.log("Elementos filtrados:", itemsFiltrados);

    // Agrupar por subcategoría única
    const subcategoriasSet = new Set();
    itemsFiltrados.forEach(item => {
      subcategoriasSet.add(item.subcategoria);
    });

    // Acceder al contenedor de tarjetas
    const cardsContainer = document.querySelector('.cards-container');
    if (!cardsContainer) {
      console.error("No se encontró cards-container en el HTML");
      return;
    }

    // Crear tarjetas para cada subcategoría
    subcategoriasSet.forEach(subcategoria => {
      const card = document.createElement('div');
      card.classList.add('card');

      const title = document.createElement('h3');
      title.textContent = subcategoria;

      const button = document.createElement('button');
      button.textContent = 'Seleccionar';
      button.classList.add('btn-select');
      button.addEventListener('click', () => {
        localStorage.setItem('selectedSubcategory', subcategoria);
        // window.location.href = 'game2.html';
        //alert(`Subcategoría seleccionada: ${subcategoria}`);
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


  function cargarVista() {
    let nombreVista = 'game2';
  // Cargar HTML
  fetch(`${nombreVista}.html`)
    .then(response => {
      if (!response.ok) throw new Error("Vista no encontrada");
      return response.text();
    })
    .then(html => {
      document.getElementById("view-section").innerHTML = html;

      // Eliminar CSS anterior (si existe)
      const cssExistente = document.getElementById("vista-css");
      if (cssExistente) cssExistente.remove();

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