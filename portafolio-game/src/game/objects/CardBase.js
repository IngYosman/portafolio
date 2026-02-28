import Phaser from 'phaser';

/**
 * @abstract
 * Generic Card Base class for abstraction
 */
export class CardBase extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, data) {
        super(scene, x, y);
        this.width = width;
        this.height = height;
        this.data = data;
        this.scene = scene;
        this.originalY = y;
        this.animationFast = 150;

        // Internal state
        this.isFaceUp = false;
        this.isFocused = false;

        this.init();
    }

    init() {
        this.createCard();
        this.setupInteractions();
        this.startIdleAnimation();
    }

    /**@abstract */
    createCard() {
        // To be implemented by subclasses
    }

    setupInteractions() {
        this.setInteractive(new Phaser.Geom.Rectangle(-this.width / 2, -this.height / 2, this.width, this.height), Phaser.Geom.Rectangle.Contains);
        this.on('pointerdown', () => this.onCardClicked());
        this.on('pointerover', () => this.focus());
        this.on('pointerout', () => this.unfocus());
    }

    focus() {
        this.isFocused = true;
        this.setDepth(100);

        // Stop idle movement to avoid conflicts with the focus lift
        if (this.idleYTween) this.idleYTween.pause();

        this.scene.tweens.add({
            targets: this,
            y: this.originalY - 40, // Lift the card
            scale: 1.1,
            duration: 200,
            ease: 'Power2'
        });
    }

    unfocus() {
        this.isFocused = false;

        this.scene.tweens.add({
            targets: this,
            y: this.originalY,
            scale: 1,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                if (!this.isFocused) {
                    this.setDepth(0);
                    if (this.idleYTween) this.idleYTween.resume();
                }
            }
        });
    }



    onCardClicked() {
        this.flip();
    }

    flip() {
        if (this.flipTween) this.flipTween.stop();

        this.flipTween = this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            duration: 150,
            ease: 'Linear',
            onComplete: () => {
                this.isFaceUp = !this.isFaceUp;
                this.updateVisuals();

                this.scene.tweens.add({
                    targets: this,
                    scaleX: 1,
                    duration: 150,
                    ease: 'Linear'
                });
            }
        });
    }

    shake() {
        this.scene.tweens.add({
            targets: this,
            x: this.x + 5,
            duration: 50,
            yoyo: true,
            repeat: 3
        });
    }

    startIdleAnimation() {
        // Subtle floating move (Up and Down) - Named to control it during focus
        this.idleYTween = this.scene.tweens.add({
            targets: this,
            y: this.y - 8,
            duration: 1500 + Math.random() * 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Subtle rotation (Left to Right)
        this.idleRotateTween = this.scene.tweens.add({
            targets: this,
            angle: { from: -1.5, to: 1.5 },
            duration: 2000 + Math.random() * 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    // Removing duplicate scaleCard and depth methods as they are handled by focus/unfocus now
    // If you need them for other things, you can keep them but clean up the duplicates.


    /**@abstract */
    updateVisuals() {
        // To be implemented by subclasses
    }
}