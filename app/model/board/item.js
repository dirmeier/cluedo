"use strict";

define(function () {
    return {
      Item: class Item {
        constructor(name, color, path) {
          this._name = name;
          this._color = color;
          this._tile = null;
          this._path = path;
        }

        get color() {
          return this._color;
        }

        get name() {
          return this._name;
        }

        putOn(tile) {
          if (this._tile !== null)
            this._tile.deoccupy();
          this._tile = tile;
          this._tile.occupyWith(this);
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


