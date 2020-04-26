"use strict";

class Item {
  constructor(name) {
    this._name = name;
    this._place = null;
    this._tile = null;
  }

  position(place, tile) {
    this._place = place;
    this._tile = tile;
    this._tile.occupied = true;
  }

}

Item.prototype.toString = function()
{
  return `[Item ${this._name}]`;
};

module.exports = Item;

