import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Card } from '../objects/Card';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
    }

    create() {
        this.cards = [];
        const suits = ['hearts', 'spades', 'diamonds', 'clubs', 'hearts'];
        const ranks = ['A', 'K', 'Q', 'J', '10'];

        const startX = this.cameras.main.width / 2 - 300;
        const centerY = this.cameras.main.height / 2;

        // Create a hand of 5 cards
        for (let i = 0; i < 5; i++) {
            const card = new Card(this, startX + (i * 50), centerY, 120, 170, {
                suit: suits[i],
                rank: ranks[i]
            });
            this.add.existing(card);
            this.cards.push(card);
        }

        // Animate all cards with a stagger effect
        this.time.delayedCall(100, () => {
            this.animateAllCards();
        });

        EventBus.emit('current-scene-ready', this);
    }

    animateAllCards() {
        this.cards.forEach((card, index) => {
            this.time.delayedCall(index * 80, () => {
                card.flip();
                card.shake();
            });
        });
    }
}
