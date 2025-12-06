import { Direction } from "./GameScreen";
import { TileValue } from "./TypesForGame";
import { Board } from "./TypesForGame";

let dimension = 4;

// Fucntion to determine the value of a new tile based on difficulty setting
let getNewTileValue = (): TileValue => {
    try {
        let difficulty = localStorage.getItem('2048_difficulty');
        if (difficulty === 'hard') {
            return 2;
        }
    } catch {
    }
    return Math.random() < 0.8 ? 2 : 4;
};

// Function to get all empty positions on the board
let getEmptyPositions = (board: Board): [number, number][] => {
    let empty: [number, number][] = [];
    for (let r = 0; r < dimension; r++) {
        for (let c = 0; c < dimension; c++) {
            if (board[r][c] === 0) {
                empty.push([r, c]);
            }
        }
    }
    return empty;
};

// Adding a new Tile to a random empty position on the board
// This function uses getEmptyPositions to find all empty spots and places a new tile
// Return a clone of the board with the new tile added
export function addRandomTile(board: Board): Board {
    let emptyPositions = getEmptyPositions(board);
    if (emptyPositions.length === 0) {
        return board;
    }
    let randomIndex = Math.floor(Math.random() * emptyPositions.length);
    let [row, col] = emptyPositions[randomIndex];
    let newBoard = structuredClone(board);
    newBoard[row][col] = getNewTileValue();
    return newBoard;
};

// Initializing the board with two random tiles, using addRandomTile functions
export function initializeBoardWithTwoTiles(): Board {
    let board: Board = new Array(dimension).fill(null).map(() => new Array(dimension).fill(0));
    board = addRandomTile(board);
    board = addRandomTile(board);
    return board;
};

// Checking if the game is over, if one of two conditions are met:
// 1. A tile with value 2048 is present
// 2. No empty positions and no possible merges
export function checkGameOver(board: Board): boolean {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (board[i][j] === 2048) {
                return true;
            }
        }
    }
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension - 1; j++) {
            if (board[i][j] === board[i][j + 1]) {
                return false;
            }
        }
    }
    for (let i = 0; i < dimension - 1; i++) {
        for (let j = 0; j < dimension; j++) {
            if (board[i][j] === board[i + 1][j]) {
                return false;
            }
        }
    }
    return true;
};

// Moving a single row to the left, merging tiles as needed
function moveRowLeft(row: TileValue[]): { newRow: TileValue[], score: number, moved: boolean } {
    let newScore = 0;
    let hasMoved = false;

    let filteredRow = row.filter(val => val !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
            filteredRow[i] *= 2;
            newScore += filteredRow[i];
            filteredRow.splice(i + 1, 1);
            hasMoved = true;
        }
    }

    let newRow = filteredRow.slice();
    while (newRow.length < dimension) {
        newRow.push(0);
    }

    if (!hasMoved) {
        for (let i = 0; i < dimension; i++) {
            if (row[i] !== 0 && row[i] !== newRow[i]) {
                hasMoved = true;
                break;
            }
        }
    }

    return { newRow, score: newScore, moved: hasMoved };
}

// Transposing the board (rows become columns and vice versa)
function transpose(board: Board): Board {
    let rows = board.length;
    let cols = board[0].length;
    let newBoard: Board = [];
    for (let j = 0; j < cols; j++) {
        let newRow: TileValue[] = [];
        
        for (let i = 0; i < rows; i++) {
            newRow.push(board[i][j]);
        }
        newBoard.push(newRow);
    }
    return newBoard;
}

// Reversing each row of the board
function reverseRows(board: Board): Board {
    let newBoard: Board = [];
    for (let element of board) {
        let originalRow = element;
        let newRow = originalRow.slice();
        newRow.reverse();
        newBoard.push(newRow);
    }
    return newBoard;
}

// Processing a move in the specified direction
// Use the combination of moveRowLeft, transpose, and reverseRows to handle all four directions
export function processMove(direction: Direction, currentBoard: Board): { newBoard: Board, scoreGained: number, moved: boolean } {
    let scoreGained = 0;
    let workingBoard = structuredClone(currentBoard);
    let hasMoved = false;


    if (direction === 'UP') {
        workingBoard = transpose(workingBoard);
    } else if (direction === 'DOWN') {
        workingBoard = reverseRows(transpose(workingBoard));
    } else if (direction === 'RIGHT') {
        workingBoard = reverseRows(workingBoard);
    }

    let newBoard: Board = [];
    for (let row of workingBoard) {
        let result = moveRowLeft(row);
        newBoard.push(result.newRow);
        scoreGained += result.score;
        if (result.moved) {
            hasMoved = true;
        }
    }

    if (direction === 'UP') {
        newBoard = transpose(newBoard);
    } else if (direction === 'DOWN') {
        newBoard = transpose(reverseRows(newBoard));
    } else if (direction === 'RIGHT') {
        newBoard = reverseRows(newBoard);
    }

    return { newBoard, scoreGained, moved: hasMoved };
}