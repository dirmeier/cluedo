"use strict";

class Tile {
  constructor(name, room, i, j, gate) {
    this._name = name;
    this._room = room;
    this._i = i;
    this._j = j;
    this._gate = gate;
    this._isOccupied = false;
    this._occupant = null;
    this._neighbors = {up: null, down: null, left: null, right: null};
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

  draw() {
    let draw = "";
    if (this._gate !== null) {

    }
    if (this._neighbors.left === null) {
      draw += "|";
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
    }
    else if (this._gate !== null) {
      draw += "i";
    } else {
      draw += " ";
    }
    if (this._neighbors.right === null) {
      draw += "|";
    } else if (this._neighbors.right._name !== this._name && this._gate === null &&
      this._neighbors.right._gate === null) {
      draw += "|";
    } else draw += ",";
    process.stdout.write(draw);
  }
}

module.exports = Tile;

