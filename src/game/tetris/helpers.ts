import { SHAPES, COLORS } from './constants';

// Returns a random shape and its color
export function getRandomShape() {
    const index = Math.floor(Math.random() * SHAPES.length);
    return {
        shape: SHAPES[index],
        color: COLORS[index]
    };
}

// collision of shape and the board
export function checkCollision(board: number[][], pieceShape: number[][], offsetX: number, offsetY: number): boolean {
    for (let y = 0; y < pieceShape.length; y++) {
        for (let x = 0; x < pieceShape[y].length; x++) {
            if (pieceShape[y][x]) {
                const newX = x + offsetX;
                const newY = y + offsetY;

                if (newX < 0 || newX >= board[0].length || newY >= board.length || (newY >= 0 && board[newY][newX] !== 0)) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Merges the shape 
export function mergePiece(board: number[][], pieceShape: number[][], offsetX: number, offsetY: number, color: number) {
    pieceShape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                board[y + offsetY][x + offsetX] = color;
            }
        });
    });
}

// Clears completed lines 
export function clearLines(board: number[][]): number {
    let linesCleared = 0;
    for (let y = board.length - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(board[0].length).fill(0));
            linesCleared++;
            y++; 
        }
    }
    return linesCleared;
}



// rotation of the shapes
export function rotatePiece(piece: number[][]): number[][] {
    const newPiece = piece[0].map((_, index) => piece.map(row => row[index]).reverse());
    return newPiece;
}