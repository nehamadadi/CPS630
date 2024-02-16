document.addEventListener('DOMContentLoaded', function() {
    const userBoard = document.getElementById('user-board');
    const pcBoard = document.getElementById('pc-board');
    const info = document.getElementById('info');
    const newGameBtn = document.getElementById('new-game-btn');
    const toggleDirectionBtn = document.getElementById('toggle-direction-btn');
  
    let userShips = [
      { size: 5, name: "carrier", positions: [], placed: false },
      { size: 4, name: "battleship", positions: [], placed: false },
      { size: 3, name: "cruiser", positions: [], placed: false },
      { size: 3, name: "submarine", positions: [], placed: false },
      { size: 2, name: "destroyer", positions: [], placed: false }
    ];
  
    let pcShips = [
      { size: 5, positions: [] },
      { size: 4, positions: [] },
      { size: 3, positions: [] },
      { size: 3, positions: [] },
      { size: 2, positions: [] }
    ];
  
    let direction = 'horizontal';
    let gameEnded = false;
  
    toggleDirectionBtn.addEventListener('click', function() {
      direction = direction === 'horizontal' ? 'vertical' : 'horizontal';
      toggleDirectionBtn.textContent = `Toggle Direction (${direction.charAt(0).toUpperCase() + direction.slice(1)})`;
    });
  
    createGrid(userBoard, true);
    createGrid(pcBoard, false);
    initializeGame();
  
    document.querySelectorAll('.ship').forEach(ship => {
      ship.addEventListener('dragstart', handleDragStart);
    });
  
    function handleDragStart(e) {
      e.dataTransfer.setData('text/plain', e.target.id);
    }
  
    userBoard.addEventListener('dragover', e => {
      e.preventDefault(); // Necessary to allow dropping
    });
  
    userBoard.addEventListener('drop', handleDrop);
  
    function handleDrop(e) {
      e.preventDefault();
      if (gameEnded) return;
  
      const shipId = e.dataTransfer.getData('text/plain');
      const ship = document.getElementById(shipId);
      const size = parseInt(ship.getAttribute('data-length'));
      const cellIndex = parseInt(e.target.dataset.index);
      
      if (canPlaceShipAt(cellIndex, size, direction, userShips)) {
        placeShip(shipId, cellIndex, size, direction);
        ship.remove(); // Remove the ship from the selection area
      } else {
        alert("Cannot place ship here.");
      }
    }
  
    function canPlaceShipAt(index, size, direction, ships) {
      // Implement your logic to check if a ship can be placed at the specified index
      // This is a placeholder logic, replace with your actual logic
      return true;
    }
  
    function placeShip(shipId, startIndex, size, direction) {
      const shipObject = userShips.find(s => s.name === shipId);
      if (!shipObject) {
        alert("Ship not found: " + shipId);
        return;
      }
  
      const newPositions = [];
      for (let i = 0; i < size; i++) {
        const index = direction === 'horizontal' ? startIndex + i : startIndex + i * 10;
        if (index >= 100 || userBoard.children[index].classList.contains('ship')) {
          alert("Invalid ship placement.");
          return;
        }
        newPositions.push(index);
      }
  
      newPositions.forEach(index => {
        userBoard.children[index].classList.add('ship');
        shipObject.positions.push(index);
      });
      shipObject.placed = true;
  
      if (userShips.every(ship => ship.placed)) {
        info.textContent = "All ships placed. Start the game!";
        // enablePCBoard(); // Uncomment this when the PC board is set up and ready for the game
      }
    }
  
    function createGrid(board, isUser) {
      for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        board.appendChild(cell);
      }
    }
  
    function initializeGame() {
      userShips.forEach(ship => {
        ship.positions = [];
        ship.placed = false;
      });
      pcShips.forEach(ship => {
        ship.positions = [];
      });
      gameEnded = false;
      info.textContent = "Place your ships!";
      // Clear the board visually
      Array.from(userBoard.children).forEach(cell => cell.classList.remove('ship', 'hit', 'miss'));
      Array.from(pcBoard.children).forEach(cell => cell.classList.remove('ship', 'hit', 'miss'));
    }
  
    newGameBtn.addEventListener('click', initializeGame);
  });
  