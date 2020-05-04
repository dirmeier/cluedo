"use strict";

define(function (require) {
  const utl = require("util");
  const Player = require("player");

  class AI extends Player {
    constructor(name, suspect, model) {
      super(name, suspect);
      this._model = model;
      this._board = this._model.game.board;
      this._allWeapons = model.game.cards.weapons.map((i) => i.name);
      this._allSuspects = model.game.cards.suspects.map((i) => i.name);
      this._allPlaces = model.game.cards.places.map((i) => i.name);

      this._hasSeenPlaces = [];
      this._hasSeenWeapons = [];
      this._hasSeenSuspects = [];

      this._target = null;
    }

    addCard(card) {
      super.addCard();
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
        return false;
      return Math.random() < .5;
    }

    move(pips) {
      if (this._target === null) {
        const randomPlaceString = utl.randomElement(
          utl.distinct(this._allPlaces, this._hasSeenPlaces));
        const randomPlace = this._board.places.filter(
          (i) => i.name === randomPlaceString
        );
        this._target = randomPlace;
      }

      // here we should implement the closest free tile not just any tile
      this._targetTile = this._board.getFreeTile(this._target);
      const entirePath = this._board.computePath(this.tile,
        this._targetTile
      );

      return entirePath.slice(0, pips + 1);
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

    wantToAccuse() {
      return this._hasSeenPlaces.length + 1 === this._allPlaces.length &&
        this._hasSeenWeapons.length + 1 === this._allWeapons.length &&
        this._hasSeenSuspects.length + 1 === this._allSuspects.length;
    }

    accuse() {
      const weapon = weapons.filter(
        (i) => !this._hasSeenWeapons.includes(i));
      const suspect = suspects.filter(
        (i) => !this._hasSeenSuspects.includes(i));
      const place = places.filter(
        (i) => !this._hasSeenPlaces.includes(i));

      return {
        weapon: weapon,
        suspect: suspect,
        place: place
      };
    }
  }

  AI.prototype.toString = function () {
    const crds = this._cards.join("\n\t");
    return `[AI ${this.suspect.name} \n\t${crds}\n]`;
  };

  return AI;
});



