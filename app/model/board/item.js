"use strict";

define(function () {
    return {
      Item: class Item {
        constructor(name, color, path) {
          this._name = name;
          this._color = color;
          this._place = null;
          this._tile = null;
          this._path = path;
        }

        get color() {
          return this._color;
        }

        get name() {
          return this._name;
        }

        position(place, tile) {
          this._place = place;
          this._tile = tile;
          this._tile.occupied = true;
        }

        set tile(tile) {
          this._tile = tile;
        }

        get tile() {
          return this._tile;
        }

        get clazz() {
          return this.constructor.name;
        }

        get path() {
          return this._path;
        }
      }
    };
  }
);


