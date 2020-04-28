"use strict";

define(function (require) {
  const Game = require("model/game");
  const Player = require("model/player");

  class Model {
    constructor(nPlayers) {
      this._game = new Game(nPlayers);
      this._players = this._initPlayers(nPlayers);
      this._currentPlayer = this._players[0];

      this._dealCards();
    }

    _initPlayers(nPlayers) {
      let players = [];
      for (let i = 0; i < nPlayers; i++) {
        players.push(new Player(i, this._game.board.suspects[i]));
        if (i > 0) {
          players[i - 1].next = players[i];
          players[i].prev = players[i - 1];
        }
        if (i === nPlayers - 1) {
          players[i].next = players[0];
          players[0].prev = players[i];
        }
      }
      return players;
    }

    _dealCards() {
      while (this._players.length) {
        for (let i = 0; i < this._players.length; i++) {
          if (this._game.availableCards.length) {
            this._players[i].addCard(this._game.randomAvailableCard());
          } else {
            return;
          }
        }
      }
    }

    castDie() {
      return this._game.dice.cast();
    }

    get board() {
      return this._game.board;
    }

    computePaths(pips) {
      return this._game.computePaths(pips, this.currentPlayer.suspect.tile);
    }

    nextPlayer() {
      if (this._players.length === 0)
        return;
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
      if (this._players.length === 0) {
        return;
      }

      const cards = this._currentPlayer.cards;
      this._game.availableCards = cards;

      const ne = this._currentPlayer.next;
      const pre = this._currentPlayer.prev;
      pre.next = ne;
      ne.prev = pre;

      this._players = this._players.filter(
        (i) => i.name !== this._currentPlayer.name);

      this._dealCards();
    }
  }

  return Model;
});

