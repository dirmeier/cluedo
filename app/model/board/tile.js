"use strict";

define(function () {

  class Tile {
    constructor(name, room, i, j, gate) {
      this._name = name;
      this._room = room;
      this._i = i;
      this._j = j;
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

    get name() {
      return this._name;
    }

    get gate() {
      return this._gate;
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

    occupyWith(item) {
      this._occupant = item;
      this._isOccupied = true;
    }

    get occupant() {
      return this._occupant;
    }

    isOtherRoomAndNoGate(neighbor) {
      return this.isOtherRoom(neighbor) && this.isNoGate(neighbor);
    }

    isOtherRoomAndGate(neighbor) {
      return this.isOtherRoom(neighbor) && this.isGate();
    }

    isOtherRoomAndNoNeighborVerticalGate(neighbor) {
      return this.isOtherRoom(neighbor)
         && neighbor.isVerticalGate();
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
  }

  return Tile;
});

