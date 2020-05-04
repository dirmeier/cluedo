"use strict";

define(function (require) {
  const utl = require("util");
  const Game = require("model/game");
  const Player = require("player");
  const AI = require("ai");

  class Model {
    constructor(nPlayers, nAI) {
      this._game = new Game(nPlayers + nAI);
      this._players = this._initPlayers(nPlayers, nAI);
      this._currentPlayer = this._players[0];

      this._dealCards();
    }

    _initPlayers(nPlayers, nAI) {
      const n = nPlayers + nAI;
      let players = [];
      const randomSuspects = utl.randomElements(this._game.board.suspects, n);
      let constructors = utl.shuffle(
        [...Array(nPlayers).fill(Player), ...Array(nAI).fill(AI)]
      );

      for (let i = 0; i < n; i++) {
        players.push(new constructors[i](i, randomSuspects[i], this._game));
        if (i > 0) {
          players[i - 1].next = players[i];
          players[i].prev = players[i - 1];
        }
        if (i === n - 1) {
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

    get game() {
      return this._game;
    }

    get currentPlayer() {
      return this._currentPlayer;
    }

    get players() {
      return this._players;
    }

    computeNeighbors(distance) {
      return this._game.computeNeighbors(distance,
        this.currentPlayer.suspect.tile);
    }

    computePath(oldTile, tile) {
      return this._game.computePath(oldTile, tile);
    }

    nextPlayer() {
      if (this._players.length === 0)
        return;
      this._currentPlayer = this._currentPlayer.next;
    }

    murderCase() {
      return this._game.murderCase();
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

