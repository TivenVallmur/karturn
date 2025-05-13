function startGame(category) {
  localStorage.setItem('selectedCategory', category);
  window.location.href = 'game.html';
}
