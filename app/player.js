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

    get cards() {
      return this._cards;
    }

    get isAI() {
      return false;
    }

    get isInPlace() {
      return this._suspect.tile.place.type === "place";
    }

    get name() {
      return this._suspect.name;
    }

    get next() {
      return this._next;
    }

    get prev() {
      return this._prev;
    }

    get suspect() {
      return this._suspect;
    }

    get tile() {
      return this._suspect.tile;
    }

    set prev(prev) {
      this._prev = prev;
    }

    set next(next) {
      this._next = next;
    }

    addCard(card) {
      this._cards.push(card);
    }

    ask(murderer, place, weapon) {
      let player = this._next;
      while (player !== this) {
        for (let el of [murderer, place, weapon]) {
          let hold = player.holds(el);
          if (hold.length > 0) {
            return {
              player: player.suspect.name,
              card: hold[0],
            };
          }
        }
        player = player.next;
      }
      return null;
    }

    holds(item) {
      return this._cards.filter((i) => i.name === item);
    }
  }

  Player.prototype.toString = function () {
    const crds = this._cards.join("\n\t");
    return `[Player ${this.suspect.name} \n\t${crds}\n]`;
  };

  return Player;
});
