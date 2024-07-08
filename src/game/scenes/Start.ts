import Phaser from 'phaser';

class Start extends Phaser.Scene {
    constructor() {
        super({ key: 'Start' });
    }

    preload() {
        //assets img
        this.load.setPath('assets/img');
        
        this.load.image('startButton', 'startbutton.png');
        this.load.image('background', 'background.jpg');

    }

    create() {
        //background
        const background = this.add.image(0, 0, 'background').setOrigin(0);
        background.setDisplaySize(this.scale.width, this.scale.height);

        //game title 
        this.add.text(this.scale.width / 2, this.scale.height / 5, 'TETRIS GAME', { fontSize: '75px', color: '#ffff'}).setOrigin(0.5);

        const startButton = this.add.image(this.scale.width / 2, this.scale.height / 3, 'startButton').setOrigin(0.5).setInteractive();
        startButton.setDisplaySize(350,150);

        this.add.text(this.scale.width / 2, this.scale.height / 1.5, 'Press Start to Play', { fontSize: '50px', color: '#ffff'}).setOrigin(0.5);

        // hover for button
        startButton.on('pointerover', () => {
            startButton.setTint(0x44ff44);
        });

        // event listener for start button
        startButton.on('pointerdown', ()=> {
            this.scene.start('Game');
        });

        startButton.on('pointerout', () => {
            startButton.clearTint()
        });
    }
}

export default Start;