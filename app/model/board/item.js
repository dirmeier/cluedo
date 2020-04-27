"use strict";

define(function () {
    return {
      Item: class Item {
        constructor(name, color) {
          this._name = name;
          this._color = color;
          this._place = null;
          this._tile = null;
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

        get tile() {
          return this._tile;
        }

        get c() {
          return "i";
        }

        get clazz() {
          return this.constructor.name;
        }

        get style(){};
      }
    };
  }
);


