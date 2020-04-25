"use strict";

class Tile {
  constructor(name, room, i, j, gate) {
    this._name = name;
    this._room = room;
    this._i = i;
    this._j = j;
    this._gate = gate;
    this._isOccupied = false;
    this._neighbors = {};
  }

  get neighbors() {
    return this._neighbors;
  }

  set occupied(occupied) {
    this._isOccupied = occupied;
  }

  get occupied() {
    return this._isOccupied;
  }
}

module.exports = Tile;

