"use strict";

define(function () {
    return {
      Item: class Item {
        constructor(name, path) {
          this._name = name;
          this._tile = null;
          this._path = path;
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


