"use strict";

define(function () {

  class Tile {
    constructor(name, place, x, y, gate) {
      this._name = name;
      this._place = place;
      this._x = x;
      this._y = y;
      this._direction = {
        '>': false,
        '<': false,
        '^': false,
        'v': false
      };
      this._gate = gate;
      if (this._gate !== null)
        this._direction[this._gate] = true;
      this._isOccupied = false;
      this._occupant = null;
      this._neighbors = {up: null, down: null, left: null, right: null};
    }

    get gate() {
      return this._gate;
    }

    get name() {
      return this._name;
    }

    get neighbors() {
      return this._neighbors;
    }

    get occupant() {
      return this._occupant;
    }

    get occupied() {
      return this._isOccupied;
    }

    get place() {
      return this._place;
    }

    get x() {
      return this._x;
    }

    get y() {
      return this._y;
    }

    set occupied(occupied) {
      this._isOccupied = occupied;
    }

    // Todo: is it a bug not to 'release' old item item?
    occupyWith(item) {
      this._occupant = item;
      this._isOccupied = true;
    }

    // Todo: is it a bug not to 'release' occupant's tile?
    deoccupy() {
      this._occupant = null;
      this._isOccupied = false;
    }

    isOtherRoomAndNoGate(neighbor) {
      return this.isOtherRoom(neighbor) && this.isNoGate(neighbor);
    }

    isOtherRoomAndNoNeighborVerticalGate(neighbor) {
      return this.isOtherRoom(neighbor) && neighbor.isVerticalGate();
    }

    isOtherRoom(neighbor) {
      return neighbor !== null && neighbor.name !== this.name;
    }

    isGate() {
      return this.gate !== null;
    }

    isVerticalGate() {
      return this.isGateRight() || this.isGateLeft();
    }

    isGateRight() {
      return this._direction[">"];
    }

    isGateLeft() {
      return this._direction["<"];
    }

    isNoGate(neighbor) {
      return neighbor !== null && this.gate === null && neighbor.gate === null;
    }

    canReach(neighbor) {
      return neighbor !== null && (this._name === neighbor._name ||
        this.isGate() || neighbor.isGate());
    }

  }

  Tile.prototype.hashCode = function () {
    const k = String(this.x) + "/" + String(this.y);
    let hash = 0;
    for (let i = 0; i < k.length; i++) {
      let chr = k.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  };

  return Tile;
});

