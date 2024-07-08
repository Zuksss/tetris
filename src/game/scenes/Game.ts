import Phaser from 'phaser';
import { BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE, SHAPES, COLORS } from '../tetris/constants';
import { getRandomShape, checkCollision, mergePiece, clearLines, rotatePiece } from '../tetris/helpers';

class Game extends Phaser.Scene {
    private board: number[][];
    private boardGraphics: Phaser.GameObjects.Graphics;
    private currentPiece: Phaser.GameObjects.Graphics;
    private pieceShape: number[][];
    private pieceX: number;
    private pieceY: number;
    private pieceColor: number;
    private heldPieceShape: number[][];
    private heldPieceGraphics: Phaser.GameObjects.Graphics;
    private holdText: Phaser.GameObjects.Text;
    private score: number;
    private scoreText: Phaser.GameObjects.Text;
    private tutorialText: Phaser.GameObjects.Text;
    private comboCount: number;
    private consecutiveLinesCleared: number;

    constructor() {
        super({ key: 'Game' });
        this.heldPieceShape = null;
        this.heldPieceGraphics = null;
        this.comboCount = 0;
        this.consecutiveLinesCleared = 0;
    }

    preload() {
        // Load assets if needed
    }

    create(data?: { heldPieceShape: number[][]; heldPieceColor: number }) {
        this.createTetrisBoard();
        this.spawnPiece();
        this.createScoreText();
        this.createHoldText();

        // for hold shape or swap
        if (data && data.heldPieceShape && data.heldPieceColor) {
            this.heldPieceShape = data.heldPieceShape;
            this.heldPieceColor = data.heldPieceColor;
            this.renderHoldPiece();
        }

        this.input.keyboard.on('keydown-LEFT', () => this.movePiece(-1));
        this.input.keyboard.on('keydown-RIGHT', () => this.movePiece(1));
        this.input.keyboard.on('keydown-DOWN', () => this.dropPiece());
        this.input.keyboard.on('keydown-UP', () => this.rotatePiece());
        this.input.keyboard.on('keydown-C', () => this.swapPiece());

        this.input.keyboard.on('keydown-SPACE', () => {
            while (!checkCollision(this.board, this.pieceShape, this.pieceX, this.pieceY + 1)) {
                this.pieceY++;
            }
            this.dropPiece(true);
        });

        this.time.addEvent({
            delay: 1000,
            callback: this.dropPiece,
            callbackScope: this,
            loop: true,
        });
    }

    createTetrisBoard() {
        this.board = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff, 1);

        const boardWidthPx = BOARD_WIDTH * BLOCK_SIZE;
        const boardHeightPx = BOARD_HEIGHT * BLOCK_SIZE;
        const boardX = (this.scale.width - boardWidthPx) / 2;
        const boardY = (this.scale.height - boardHeightPx) / 2;

        graphics.strokeRect(boardX, boardY, boardWidthPx, boardHeightPx);

        this.boardGraphics = graphics;
        this.renderBoard();
    }

    createScoreText() {
        this.score = 0;
        this.scoreText = this.add.text(100, 16, `Score: ${this.score}`, {
            fontSize: '32px',
            color: 'white',
        });

        // Controls
        this.tutorialText = this.add.text(100, 60, `Controls: 
            \nLeft/Right arrow keys to move 
            \nDown arrow key to drop
            \nUp arrow key to rotate
            \nC to swap pieces
            \nSpacebar to drop immediately`, {
            fontSize: '18px',
            color: 'yellow',
        });
    }

    createHoldText() {
        const holdTextX = this.scale.width - 350;
        const holdTextY = 20;

        this.holdText = this.add.text(holdTextX, holdTextY, `Hold:`, {
            fontSize: '32px',
            color: 'white',
        });

        this.renderHoldPiece();
    }

    spawnPiece() {
        const { shape, color } = getRandomShape();
        this.pieceShape = shape;
        this.pieceColor = color;
        this.pieceX = Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2);
        this.pieceY = 0;

        this.renderPiece(this.pieceX, this.pieceY, shape, color);
    }

    renderPiece(x: number, y: number, shape: number[][], color: number) {
        if (this.currentPiece) {
            this.currentPiece.destroy();
        }

        const pieceGraphics = this.add.graphics({ fillStyle: { color } });

        shape.forEach((row, py) => {
            row.forEach((cell, px) => {
                if (cell) {
                    pieceGraphics.fillStyle(color, 1);
                    pieceGraphics.fillRect((x + px) * BLOCK_SIZE, (y + py) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            });
        });

        const boardX = (this.scale.width - BOARD_WIDTH * BLOCK_SIZE) / 2;
        const boardY = (this.scale.height - BOARD_HEIGHT * BLOCK_SIZE) / 2;

        pieceGraphics.x = boardX;
        pieceGraphics.y = boardY;

        this.currentPiece = pieceGraphics;
    }

    renderBoard() {
        this.boardGraphics.clear();
        this.boardGraphics.lineStyle(2, 0xffffff, 1);

        const boardWidthPx = BOARD_WIDTH * BLOCK_SIZE;
        const boardHeightPx = BOARD_HEIGHT * BLOCK_SIZE;
        const boardX = (this.scale.width - boardWidthPx) / 2;
        const boardY = (this.scale.height - boardHeightPx) / 2;

        this.boardGraphics.strokeRect(boardX, boardY, boardWidthPx, boardHeightPx);

        this.board.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell !== 0) {
                    this.boardGraphics.fillStyle(cell, 1);
                    this.boardGraphics.fillRect(
                        boardX + x * BLOCK_SIZE,
                        boardY + y * BLOCK_SIZE,
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    );
                }
            });
        });
    }

    movePiece(dir: number) {
        const newX = this.pieceX + dir;

        if (!checkCollision(this.board, this.pieceShape, newX, this.pieceY)) {
            this.pieceX = newX;
            this.renderPiece(this.pieceX, this.pieceY, this.pieceShape, this.pieceColor);
        }
    }

    dropPiece(immediate = false) {
        const newY = this.pieceY + 1;

        if (!checkCollision(this.board, this.pieceShape, this.pieceX, newY)) {
            this.pieceY = newY;
            this.renderPiece(this.pieceX, this.pieceY, this.pieceShape, this.pieceColor);
        } else {
            mergePiece(this.board, this.pieceShape, this.pieceX, this.pieceY, this.pieceColor);
            const linesCleared = clearLines(this.board);

            if (linesCleared > 0) {
                // Increment consecutive lines cleared
                this.consecutiveLinesCleared += linesCleared;

                const points = this.calculateScore(linesCleared) + this.calculateComboBonus();
                this.displayPlusPoints(points, this.consecutiveLinesCleared);
                this.score += points;
            } else {
                this.consecutiveLinesCleared = 0;
            }

            this.scoreText.setText(`Score: ${this.score}`);
            this.renderBoard();
            this.spawnPiece();
            if (checkCollision(this.board, this.pieceShape, this.pieceX, this.pieceY)) {
                this.scene.start('GameOver', { score: this.score, heldPieceShape: this.heldPieceShape, heldPieceColor: this.heldPieceColor });
            }
        }
    }

    calculateScore(linesCleared: number): number {
        let basePoints = 0;

        switch (linesCleared) {
            case 1:
                basePoints = 100; // 1 line
                break;
            case 2:
                basePoints = 300; // 2 lines
                break;
            case 3:
                basePoints = 500; // 3 lines
                break;
            case 4:
                basePoints = 800; // 4 lines
                break;
            default:
                basePoints = 0;
                break;
        }

        // Add combo bonus
        const comboBonus = this.calculateComboBonus();
        const totalPoints = basePoints + comboBonus;

        return totalPoints;
    }

    calculateComboBonus(): number {
        let comboBonus = 0;

        // Award combo bonus if consecutive lines cleared are 5 or more
        if (this.consecutiveLinesCleared >= 5) {
            comboBonus = (this.consecutiveLinesCleared - 4) * 50; // 5 lines or more start giving bonus
        }

        return comboBonus;
    }

    rotatePiece() {
        const rotatedShape = rotatePiece(this.pieceShape);
        if (!checkCollision(this.board, rotatedShape, this.pieceX, this.pieceY)) {
            this.pieceShape = rotatedShape;
            this.renderPiece(this.pieceX, this.pieceY, this.pieceShape, this.pieceColor);
        }
    }

    swapPiece() {
        if (this.heldPieceShape === null) {
            this.heldPieceShape = this.pieceShape;
            this.heldPieceColor = this.pieceColor;
            this.spawnPiece();
        } else {
            // Swap the held piece 
            const tempShape = this.heldPieceShape;
            const tempColor = this.heldPieceColor;
            this.heldPieceShape = this.pieceShape;
            this.heldPieceColor = this.pieceColor;
            this.pieceShape = tempShape;
            this.pieceColor = tempColor;
            this.pieceX = Math.floor(BOARD_WIDTH / 2) - Math.floor(this.pieceShape[0].length / 2);
            this.pieceY = 0;
            this.renderPiece(this.pieceX, this.pieceY, this.pieceShape, this.pieceColor);
            this.renderHoldPiece();
        }
    }

    renderHoldPiece() {
        if (this.heldPieceGraphics) {
            this.heldPieceGraphics.destroy();
        }

        if (this.heldPieceShape) {
            const holdPieceGraphics = this.add.graphics();
            holdPieceGraphics.fillStyle(this.heldPieceColor, 1);

            this.heldPieceShape.forEach((row, py) => {
                row.forEach((cell, px) => {
                    if (cell) {
                        holdPieceGraphics.fillRect(
                            this.holdText.x + px * BLOCK_SIZE,
                            this.holdText.y + this.holdText.height + py * BLOCK_SIZE,
                            BLOCK_SIZE,
                            BLOCK_SIZE
                        );
                    }
                });
            });

            this.heldPieceGraphics = holdPieceGraphics;
        }
    }

    displayPlusPoints(points: number, comboCount: number) {
        const pointsText = this.add.text(this.scoreText.x + this.scoreText.width + 10, this.scoreText.y, `+${points} (Combo x${comboCount})`, {
            fontSize: '32px',
            color: 'green',
        });

        this.tweens.add({
            targets: pointsText,
            y: pointsText.y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power1',
            onComplete: () => {
                pointsText.destroy();
            }
        });
    }
}

export default Game;
