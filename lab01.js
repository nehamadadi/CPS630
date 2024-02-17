document.addEventListener('DOMContentLoaded', function() {
    createGrid('playerGrid');
    createGrid('computerGrid');
    placeShips('playerGrid');
    placeShips('computerGrid');
    initializeGame();

    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', resetGame);
});

function createGrid(gridId) {
    const grid = document.getElementById(gridId);
    for (let i = 0; i < 100; i++) {
        let cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        grid.appendChild(cell);
    }
}

function placeShips(gridId) {
    const ships = [5, 4, 3, 3, 2];
    ships.forEach(shipSize => {
        let placed = false;
        while (!placed) {
            placed = placeSingleShip(document.getElementById(gridId), shipSize);
        }
    });
}

function placeSingleShip(grid, shipSize) {
    let placed = false;
    while (!placed) {
        let orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        let randomCell = Math.floor(Math.random() * 100);
        let row = Math.floor(randomCell / 10);
        let col = randomCell % 10;

        if ((orientation === 'horizontal' && col <= 10 - shipSize) ||
            (orientation === 'vertical' && row <= 10 - shipSize)) {
            let canPlaceShip = true;

            for (let i = 0; i < shipSize; i++) {
                let index = orientation === 'horizontal' ? randomCell + i : randomCell + i * 10;
                if (grid.children[index].classList.contains('occupied')) {
                    canPlaceShip = false;
                    break;
                }
            }

            if (canPlaceShip) {
                for (let i = 0; i < shipSize; i++) {
                    let index = orientation === 'horizontal' ? randomCell + i : randomCell + i * 10;
                    grid.children[index].classList.add('occupied', `ship-${shipSize}`);
                }
                placed = true;
            }
        }
    }
    return placed;
}

function initializeGame() {
    const computerCells = document.querySelectorAll('#computerGrid .cell');
    computerCells.forEach(cell => {
        cell.addEventListener('click', playerAttack);
    });
}

// Keep track of the hits and misses
let playerHits = 0;
let playerMisses = 0;
let computerHits = 0;
let computerMisses = 0;

function playerAttack(event) {
    const cell = event.target;
    if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
        return;
    }

    if (cell.classList.contains('occupied')) {
        cell.classList.add('hit');
        playerHits++;
        updateStats('player');
        if (checkWin('computerGrid')) {
            endGame(true);
            return;
        }
    } else {
        cell.classList.add('miss');
        playerMisses++;
        updateStats('player');
    }

    cell.removeEventListener('click', playerAttack);
    setTimeout(computerTurn, 1000);
}

function computerTurn() {
    let attackMade = false;
    const playerCells = document.querySelectorAll('#playerGrid .cell');
    while (!attackMade) {
        const randomIndex = Math.floor(Math.random() * playerCells.length);
        const cell = playerCells[randomIndex];

        if (!cell.classList.contains('hit') && !cell.classList.contains('miss')) {
            if (cell.classList.contains('occupied')) {
                cell.classList.add('hit');
                computerHits++;
                updateStats('computer');
                if (checkWin('playerGrid')) {
                    endGame(false);
                    return;
                }
            } else {
                cell.classList.add('miss');
                computerMisses++;
                updateStats('computer');
            }
            attackMade = true;
        }
    }
}

function checkWin(gridId) {
    const ships = [5, 4, 3, 3, 2];
    for (const shipSize of ships) {
        const shipCells = document.querySelectorAll(`#${gridId} .cell.occupied.ship-${shipSize}`);
        if (!Array.from(shipCells).every(cell => cell.classList.contains('hit'))) {
            return false;
        }
    }
    return true;
}

function endGame(playerWins) {
    const gameStatus = document.getElementById('gameStatus');
    const message = playerWins ? 'Congratulations, you win!' : 'Game over, you lose!';
    
    gameStatus.textContent = message;
    gameStatus.style.display = 'block';
    
    document.querySelectorAll('#computerGrid .cell').forEach(cell => {
        cell.removeEventListener('click', playerAttack);
    });
}

function resetGame() {
    window.location.reload(); // This will reload the page, consider implementing a more nuanced reset functionality
}

function updateStats(playerType) {
    if (playerType === 'player') {
        document.getElementById('playerHits').textContent = `Player Hits: ${playerHits}`;
        document.getElementById('playerMisses').textContent = `Player Misses: ${playerMisses}`;
    } else if (playerType === 'computer') {
        document.getElementById('computerHits').textContent = `Computer Hits: ${computerHits}`;
        document.getElementById('computerMisses').textContent = `Computer Misses: ${computerMisses}`;
    }
}
