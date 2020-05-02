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

    get dice() {
      return this._dice;
    }

    get cards() {
      return this._cards;
    }

    get board() {
      return this._board;
    }

    murderCase() {
      return this._cards.murderCase();
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

    isSolved(murderer, place, weapon) {
      const cs = this._cards.murderCase();
      return cs.murderer.name === murderer &&
        cs.place.name === place &&
        cs.weapon.name === weapon;
    }

    computeNeighbors(pips, tile) {
      return this._board.computeNeighbors(pips, tile);
    }

    computePath(oldTile, tile) {
      return  this._board.computePath(oldTile, tile);
    }

  }

  return Game;
});




