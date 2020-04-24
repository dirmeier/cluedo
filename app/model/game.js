"use strict";

const Board = require("./board.js");
const Cards = require("./cards.js");

class Game {
  constructor() {
    this._board = new Board();
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

  rooms() {
    return this._cards.rooms();
  }

  availableCards() {
    return this._cards.availableCards();
  }

  randomAvailableCard() {
    return this._cards.randomAvailableCard();
  }

  print() {
    const murder = this.murderCase();
    console.log(
      `${murder.victim.name} was killed by ${murder.murderer.name}` +
      ` with a ${murder.weapon.name.toLowerCase()}` +
      ` in the ${murder.room.name.toLowerCase()}.`
    );
  }

  isSolved(murderer, room, weapon) {
    console.log(murderer);
    console.log(room);
    console.log(weapon);
    const cs = this._cards.murderCase();
    console.log(cs);
    return cs.murderer.name === murderer[0] &&
      cs.room.name === room[0] &&
      cs.weapon.name === weapon[0];
  }
}

module.exports = Game;
