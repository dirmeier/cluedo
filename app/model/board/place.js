"use strict";

define(function () {
  class Place {
    constructor(name, abbreviation, type) {
      this._name = name;
      this._abbreviation = abbreviation;
      this._type = type;
      this._tiles = [];
    }

    add(tile) {
      this._tiles.push(tile);
    }

    get type() {
      return this._type;
    }

    get tiles() {
      return this._tiles;
    }
  }

  return Place;
});
