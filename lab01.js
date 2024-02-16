document.addEventListener('DOMContentLoaded', () => {
    const userInfo = document.getElementById('user-info');
    const userBoard = document.getElementById('user-board');
    const pcBoard = document.getElementById('pc-board');
    const newGameBtn = document.getElementById('new-game-btn');

    let userShips = [
        { name: "Carrier", size: 5, hits: 0, placed: false, positions: [] },
        { name: "Battleship", size: 4, hits: 0, placed: false, positions: [] },
        { name: "Cruiser", size: 3, hits: 0, placed: false, positions: [] },
        { name: "Submarine", size: 3, hits: 0, placed: false, positions: [] },
        { name: "Destroyer", size: 2, hits: 0, placed: false, positions: [] }
    ];
    let pcShips = JSON.parse(JSON.stringify(userShips)); // Deep copy for simplicity
    
    const gridSize = 10; // 10x10 grid
    let gameStarted = false;
    
    function createGrid(board) {
        board.innerHTML = ''; // Clear previous grid
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.dataset.index = i;
            cell.classList.add('cell'); // Add cell class for styling
            board.appendChild(cell);
        }
    }
    
    function randomizeShips(ships, board) {
        ships.forEach(ship => {
            let placed = false;
            while (!placed) {
                const vertical = Math.random() >= 0.5;
                const row = Math.floor(Math.random() * gridSize);
                const col = Math.floor(Math.random() * gridSize);
                const startIndex = vertical ? row * gridSize + col : col * gridSize + row;
                if (canPlaceShip(startIndex, ship.size, vertical, ships)) {
                    placeShip(startIndex, ship.size, vertical, ship, board);
                    placed = true;
                }
            }
        });
    }
    
    function canPlaceShip(startIndex, size, vertical, ships) {
        for (let i = 0; i < size; i++) {
            const index = vertical ? startIndex + i * gridSize : startIndex + i;
            if (index >= gridSize * gridSize || ships.some(s => s.positions.includes(index))) {
                return false; // Ship out of bounds or overlaps
            }
            if (!vertical && Math.floor(index / gridSize) !== Math.floor(startIndex / gridSize)) {
                return false; // Horizontal ship wraps to next row
            }
        }
        return true;
    }
    
    function placeShip(startIndex, size, vertical, ship, board) {
        for (let i = 0; i < size; i++) {
            const index = vertical ? startIndex + i * gridSize : startIndex + i;
            if (board === userBoard) { // Only add the 'ship' class to userBoard cells
                board.children[index].classList.add('ship');
            }
            ship.positions.push(index);
        }
        ship.placed = true;
    }
    
    function handleAttack(e, index) {
        if (gameStarted && !e.target.classList.contains('hit') && !e.target.classList.contains('miss')) {
            const hit = pcShips.some(ship => ship.positions.includes(index));
            e.target.classList.add(hit ? 'hit' : 'miss');
            if (hit) {
                updateShipStatus(index, pcShips);
            }
            checkGameOver();
        }
    }
    
    function updateShipStatus(index, ships) {
        ships.forEach(ship => {
            if (ship.positions.includes(index)) {
                ship.hits += 1;
                if (ship.hits === ship.size) {
                    userInfo.textContent = `${ship.name} sunk!`;
                    ship.sunk = true;
                }
            }
        });
    }
    
    function checkGameOver() {
        if (pcShips.every(ship => ship.sunk)) {
            userInfo.textContent = "Game Over! You win!";
            gameStarted = false;
        }
    }
    
    function initializeGame() {
        createGrid(userBoard);
        createGrid(pcBoard);
        randomizeShips(pcShips, pcBoard); // Randomize PC ships, keeping them hidden
        userShips.forEach(ship => {
            ship.hits = 0;
            ship.placed = false;
            ship.positions = []; // Reset positions
        });
        gameStarted = true;
        userInfo.textContent = "Place your ships!";
    }
    
    newGameBtn.addEventListener('click', initializeGame);
    
    initializeGame(); // Start a new game on page load for demonstration
});
