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
      this._distance = 0;
      this._visited = false;
      this._previous = null
    }

    get place() {
      return this._place;
    }

    get previous() {
      return this._previous;
    }

    set previous(p) {
      this._previous = p;
    }

    get visited() {
      return this._visited;
    }

    set visited(v) {
      this._visited = v;
    }

    get distance() {
      return this._distance;
    }

    set distance(d) {
      this._distance = d;
    }

    get x() {
      return this._x;
    }

    get y() {
      return this._y;
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

    deoccupy() {
      this._occupant = null;
      this._isOccupied = false;
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

    canReach(neighbor) {
      return neighbor !== null && (this._name === neighbor._name ||
        this.isGate() || neighbor.isGate());
    }

  }

  return Tile;
});

