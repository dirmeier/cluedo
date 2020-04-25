"use strict";

const Game = require("./model/game.js");
const Player = require("./model/player.js");

class Model {
  constructor(nPlayers) {
    this._game = new Game();

    this._players = [];
    for (let i = 0; i < nPlayers; i++) {
      this._players.push(new Player(i));
      if (i > 0) {
        this._players[i - 1].next = this._players[i];
        this._players[i].prev = this._players[i - 1];
      }
      if (i === nPlayers - 1) {
        this._players[i].next = this._players[0];
        this._players[0].prev = this._players[i];
      }
    }
    this._currentPlayer = this._players[0];

    this._dealCards();
  }

  _dealCards() {
    while (1) {
      for (let i = 0; i < this._players.length; i++) {
        if (this._game.availableCards.length) {
            this._players[i].addCard(this._game.randomAvailableCard());
        } else {
          return
        }
      }
    }
  }

  nextPlayer() {
    this._currentPlayer = this._currentPlayer.next;
  }

  get currentPlayer() {
    return this._currentPlayer;
  }

  get players() {
    return this._players;
  }

  murderCase() {
    return this._game.murderCase();
  }

  suspects() {
    return this._game.suspects();
  }

  weapons() {
    return this._game.weapons();
  }

  places() {
    return this._game.places();
  }

  solve(murderer, place, weapon) {
    return this._game.isSolved(murderer, place, weapon);
  }

  ask(murderer, place, weapon) {
    return this._currentPlayer.ask(murderer, place, weapon);
  }

  removeCurrentPlayer() {
    const cards = this._currentPlayer.cards;

    const ne = this._currentPlayer.next;
    const pre = this._currentPlayer.prev;
    pre.next = ne;
    ne.prev = pre;

    this._players = this._players.filter(
      (i) => i.name !== this._currentPlayer.name);

    this._game.availableCards = cards;
    this._dealCards();
  }

}


module.exports = Model;