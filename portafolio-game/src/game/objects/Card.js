import { CardBase } from './CardBase';

export class Card extends CardBase {
    constructor(scene, x, y, width = 100, height = 140, data = {}) {
        data.suit = data.suit || 'hearts';
        data.rank = data.rank || 'A';
        super(scene, x, y, width, height, data);
    }

    createCard() {
        const { suit } = this.data;

        // Shadow
        this.shadow = this.scene.add.rectangle(6, 6, this.width, this.height, 0x000000, 0.2)
            .setOrigin(0.5);

        // Card body
        this.bg = this.scene.add.rectangle(0, 0, this.width, this.height, 0xffffff)
            .setStrokeStyle(4, 0x000000)
            .setOrigin(0.5);

        // Central Suit Symbol only (Removing corner rank texts as per "quitale los textos")
        const textColor = this.getColorBySuit(suit);
        this.centerSuit = this.scene.add.text(0, 0, this.getSuitSymbol(suit), {
            fontSize: (this.width * 0.4) + 'px',
            color: textColor
        }).setOrigin(0.5);

        this.add([this.shadow, this.bg, this.centerSuit]);

        this.updateVisuals();
    }

    getSuitSymbol(suit) {
        const symbols = {
            'hearts': '♥',
            'diamonds': '♦',
            'clubs': '♣',
            'spades': '♠'
        };
        return symbols[suit] || suit;
    }

    getColorBySuit(suit) {
        return (suit === 'hearts' || suit === 'diamonds') ? '#e74c3c' : '#2c3e50';
    }

    updateVisuals() {
        if (this.isFaceUp) {
            this.bg.setFillStyle(0xffffff);
            this.centerSuit.setVisible(true);
        } else {
            this.bg.setFillStyle(0x2c3e50);
            this.centerSuit.setVisible(false);
        }
    }

    play() {
        this.scene.tweens.add({
            targets: this,
            scale: 1.05,
            duration: 150,
            yoyo: true,
            ease: 'Back.easeOut'
        });
    }
}