// // Mostrar u ocultar menú lateral
// function toggleSidebar() {
//   document.querySelector(".sidebar").classList.toggle("show");
// }

// fetch('Assets/data/categories.json')
//   .then(response => response.json())
//   .then(categories => {
//     const cardsContainer = document.querySelector('.cards-container');

//     categories.forEach(category => {
//       const card = document.createElement('div');
//       card.classList.add('card');

//       const categoryName = document.createElement('p');
//       // Reemplazar guiones bajos por espacios para mostrar bonito
//       const nombreFormateado = category.replace(/_/g, " ");
//       categoryName.textContent = nombreFormateado;

//       const selectButton = document.createElement('button');
//       selectButton.textContent = 'Seleccionar';
//       selectButton.addEventListener('click', () => {
//         startGame(category);
//       });

//       card.appendChild(categoryName);
//       card.appendChild(selectButton);
//       cardsContainer.appendChild(card);
//     });
//   });


// // Función que guarda la categoría seleccionada y redirige
// function startGame(category) {
//   localStorage.setItem('selectedCategory', category);
//   window.location.href = 'game.html';
// }
