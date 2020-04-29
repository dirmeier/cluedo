"use strict";

define(function () {
  class Player {
    constructor(name, suspect) {
      this._name = name;
      this._next = null;
      this._prev = null;
      this._suspect = suspect;
      this._cards = [];
    }

    get name() {
      return this._name;
    }

    get isInPlace() {
        return this._suspect.tile.place.type === "place";
    }

    get suspect() {
      return this._suspect;
    }

    addCard(card) {
      this._cards.push(card);
    }

    get cards() {
      return this._cards;
    }

    get next() {
      return this._next;
    }

    set next(next) {
      this._next = next;
    }

    get prev() {
      return this._prev;
    }

    set prev(prev) {
      this._prev = prev;
    }

    ask(murderer, place, weapon) {
      let player = this._next;
      while (player !== this) {
        if (player.holds(murderer))
          return [player.suspect.name, murderer, null, null];
        else if (player.holds(place))
          return [player.suspect.name, null, place, null];
        else if (player.holds(weapon))
          return [player.suspect.name, null, weapon];
        else
          player = player.next;
      }
      return [null, false, false, false];
    }

    holds(item) {
      return this._cards.filter((i) => i.name === item).length > 0;
    }

    get tile() {
      return this._suspect.tile;
    }

    updatePosition(tile) {
      this._suspect.putOn(tile);
    }

  }

  Player.prototype.toString = function () {
    const crds = this._cards.join("\n\t");
    return `[Player ${this.suspect.name} \n\t${crds}\n]`;
  };

  return Player;
});

