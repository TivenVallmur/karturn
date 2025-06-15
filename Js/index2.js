// Cargar las categorías desde el archivo JSON y crear tarjetas
fetch('Assets/data/categories.json')
  .then(response => response.json())
  .then(categories => {
    const cardsContainer = document.querySelector('.cards-container');
    // console.log(`Cargando vista para la categoría: ${categories}`);
    // console.log(categories);
    categories.forEach(category => {
      //console.log(`Cargando vista para la categoría: ${category}`);
      const card = document.createElement('div');
      card.classList.add('card');

      const categoryName = document.createElement('p');
      // Reemplazar guiones bajos por espacios para mostrar bonito
      const nombreFormateado = category.replace(/_/g, " ");
      categoryName.textContent = nombreFormateado;

      const selectButton = document.createElement('button');
      selectButton.textContent = 'Seleccionar';
      selectButton.addEventListener('click', () => {
        //startGame(category);
        cargarVista()
        //console.log(`Cargando vista para la categoría: ${category}`);
      });

      card.appendChild(categoryName);
      card.appendChild(selectButton);
      cardsContainer.appendChild(card);
    });
  });

  function cargarVista() {
    let nombreVista = 'subcategories';
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

// Función que guarda la categoría seleccionada y redirige
function startGame(category) {
  localStorage.setItem('selectedCategory', category);
  window.location.href = 'game.html';
}
