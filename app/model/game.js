"use strict";

define(function (require) {
  const Board = require("model/board");
  const Cards = require("model/cards");
  const Dice = require("model/dice");

  class Game {
    constructor(nSuspects) {
      this._board = new Board(nSuspects);
      this._dice = new Dice();
      this._cards = new Cards();
    }

    murderCase() {
      return this._cards.murderCase();
    }

    suspects() {
      return this._cards.suspects();
    }

    weapons() {
      return this._cards.weapons();
    }

    places() {
      return this._cards.places();
    }

    get availableCards() {
      return this._cards.availableCards;
    }

    set availableCards(cards) {
      this._cards.availableCards = cards;
    }

    randomAvailableCard() {
      return this._cards.randomAvailableCard();
    }

    castDie() {
      return this._dice.cast();
    }

    get board() {
      return this._board;
    }

    print() {
      const murder = this.murderCase();
      console.log(
        `${murder.victim.name} was killed by ${murder.murderer.name}` +
        ` with a ${murder.weapon.name.toLowerCase()}` +
        ` in the ${murder.room.name.toLowerCase()}.`
      );
    }

    isSolved(murderer, place, weapon) {
      const cs = this._cards.murderCase();
      return cs.murderer.name === murderer &&
        cs.place.name === place &&
        cs.weapon.name === weapon;
    }
  }

  return Game;
});




