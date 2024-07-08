import Phaser from 'phaser';

class GameOverScene extends Phaser.Scene {
    private finalScore: number;

    constructor() {
        super({ key: 'GameOver' });
        this.finalScore = 0;
    }

    init(data: { score: number }) {
        this.finalScore = data.score;
    }

    preload() {
        this.load.setPath('assets/img');

        this.load.image('restartButton', 'restartbutton.png');    
    }

    create() {
        const { width, height } = this.scale;

        // Game Over text
        const gameOverText = this.add.text(width / 2, height / 5, 'Game Over', {
            fontSize: '75px',
            color: '#ffffff',
        });
        gameOverText.setOrigin(0.5);

        // Display final score
        const scoreText = this.add.text(width / 2, height / 3, `Score: ${this.finalScore}`, {
            fontSize: '50px',
            color: '#ffffff',
        });
        scoreText.setOrigin(0.5);

        // Restart button
        const restartButton = this.add.image(width / 2, height / 2, 'restartButton').setOrigin(0.5).setInteractive();
        restartButton.setDisplaySize(225, 150);

        const restartText = this.add.text(width / 2, height * 0.65, 'Restart', {
            fontSize: '40px',
            color: '#ffffff',
        });
        restartText.setOrigin(0.5);

        restartButton.on('pointerover', () => {
            restartButton.setTint(0xff7f7f);
        });

        restartButton.on('pointerout', () => {
            restartButton.clearTint();
        });

        restartButton.on('pointerup', () => {
            this.scene.start('Game');
        });
    }
}

export default GameOverScene;
