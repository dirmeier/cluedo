"use strict";

const Game = require("./model/game.js");
const Player = require("./model/player.js");

class Model {
  constructor(nPlayers) {
    this._game = new Game(nPlayers);
    this._players = [];
    for (let i = 0; i < nPlayers; i++)
      this._players.push(new Player());
    this._dealCards();
  }
  _dealCards() {
    while (1) {
      for (let i = 0; i < this._players.length; i++) {
        if (this._game.availableCards().length) {
            this._players[i].addCard(this._game.randomAvailableCard());
        } else {
          return
        }
      }
    }
  }

  players() {
    return this._players;
  }

  murderCase() {
    return this._game.murderCase();
  }

}


module.exports = Model;