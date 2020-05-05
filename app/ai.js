"use strict";

define(function (require) {
  const utl = require("util");
  const Player = require("player");

  class AI extends Player {
    constructor(name, suspect, game) {
      super(name, suspect);
      this._game = game;
      this._board = this._game.board;
      this._allWeapons = this._game.cards.weapons.map((i) => i.name);
      this._allSuspects = this._game.cards.suspects.map((i) => i.name);
      this._allPlaces = this._game.cards.places.map((i) => i.name);

      this._hasSeenPlaces = [];
      this._hasSeenWeapons = [];
      this._hasSeenSuspects = [];

      this._target = null;
    }

    get target() {
      return this._target;
    }

    get isAI() {
      return true;
    }

    get name() {
      return super.name + " (AI)";
    }

    addCard(card) {
      super.addCard(card);
      this.addSeenCard(card);
    }

    addSeenCard(card) {
      const cons = card.constructor.name;
      if (cons === "Suspect")
        this._hasSeenSuspects.push(card.name);
      else if (cons === "Weapon")
        this._hasSeenWeapons.push(card.name);
      else this._hasSeenPlaces.push(card.name);
    }

    wantToCast() {
      const hasSeenRoom = this._hasSeenPlaces.includes(
        this.suspect.tile.place.name);
      if (!hasSeenRoom)
        return Math.random() < .25;
      return Math.random() < .5;
    }

    getPath(pips) {
      if (this._target === null) {
        const hasNotSeenPlaces = utl.distinct(
          this._allPlaces, this._hasSeenPlaces);
        const randomPlaceString = utl.randomElement(hasNotSeenPlaces);
        const randomPlace = Object.values(this._board.places)
          .filter((i) => i.name === randomPlaceString);
        this._target = randomPlace[0];
      }

      // here we should implement the closest free tile not just any tile
      this._targetTile = this._board.getFreeTile(this._target);
      const entirePath = this._board.computePath(this.tile,
        this._targetTile
      );

      const moveablePath = entirePath.slice(0, pips);
      return moveablePath;
    }

    suggest() {
      const weaps = utl.randomElement(
        utl.distinct(this._allWeapons, this._hasSeenWeapons));
      const susps = utl.randomElement(
        utl.distinct(this._allSuspects, this._hasSeenSuspects));

      return {
        weapon: weaps,
        suspect: susps
      };
    }

    canAccuse() {
      const can = this._hasSeenPlaces.length + 1 === this._allPlaces.length &&
        this._hasSeenWeapons.length + 1 === this._allWeapons.length &&
        this._hasSeenSuspects.length + 1 === this._allSuspects.length;
      return can;
    }

    accuse() {
      const weapon = utl.distinct(this._allWeapons, this._hasSeenWeapons);
      const suspect = utl.distinct(this._allSuspects, this._hasSeenSuspects);
      const place = utl.distinct(this._allPlaces, this._hasSeenPlaces);

      return {
        weapon: weapon[0],
        suspect: suspect[0],
        place: place[0]
      };
    }
  }

  AI.prototype.toString = function () {
    const crds = this._cards.join("\n\t");
    const seenCrds = [
      ...this._hasSeenWeapons,
      ...this._hasSeenSuspects,
      ...this._hasSeenPlaces
    ].sort().join(", ");
    return `[AI ${this.suspect.name} \n\t${crds}\n\t[Seen ${seenCrds}]\n]`;
  };

  return AI;
});



