"use strict";

define(function () {
  class Place {
    constructor(name, abbreviation, type, path) {
      this._name = name;
      this._abbreviation = abbreviation;
      this._path = path;
      this._type = type;
      this._tiles = [];
      this._isDrawn = false;
    }

    get nrow() {
      const rows = this._tiles.map(function(i) {
        return i.x
      });
      return (new Set(rows)).size;
    }

    get ncol() {
      const cols = this._tiles.map(function(i) {
        return i.y
      });
      return (new Set(cols)).size;
    }

    get minTileY() {
      const mi = this._tiles.map(function(i) {
        return i.y
      });
      return Math.min(Math.min(...mi));
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

    get name() {
      return this._name;
    }

    get abbreviation( ) {
      return this._abbreviation;
    }

    get path() {
      return this._path;
    }

    get isDrawn() {
      return this._isDrawn;
    }

    set isDrawn(drawn) {
      this._isDrawn = drawn;
    }

    get tiles() {
      return this._tiles;
    }

    get isPlace() {
      return  this._type === "place";
    }

  }

  return Place;
});
