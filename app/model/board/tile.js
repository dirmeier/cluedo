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

    draw() {
      let draw = "";
      if (this._gate !== null) {

      }

      if (this._isOccupied && (this._neighbors.down === null ||
        this._neighbors.down._name !== this._name)) {
        draw += "%";

      } else if (this._isOccupied && this._gate !== null) {
        draw += "&";
      } else if (this._isOccupied) {
        draw += "x";
      } else if (this._neighbors.down === null ||
        (this._neighbors.down._name !== this._name &&
          this._gate === null && this._neighbors.down._gate === null)) {
        draw += "_";
      } else if (this._neighbors.down._name !== this._name &&
        this._gate === null && this._neighbors.down._gate === "<") {
        draw += "_";
      } else if (this._gate !== null) {
        draw += "i";
      } else {
        draw += " ";
      }
      if (this._neighbors.right._name !== this._name &&
        this._gate === null &&
        this._neighbors.right._gate === null) {
        draw += "|";
      } else draw += ",";

      return draw;
    }
  }

  return Tile;
});

