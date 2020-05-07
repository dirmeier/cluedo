"use strict";

import Item from "./item";
import Place from "./place";

export default class Tile {
  protected _name: string;
  protected _place: Place | undefined;
  protected _x: number;
  protected _y: number;
  protected _gate: string | null;
  protected _direction: any;
  protected _isOccupied: boolean;
  protected _occupant: any;
  protected _neighbors: Map<string, Tile | null>;

  constructor(name: string, place: Place | undefined, x: number, y: number, gate: string | null) {
    this._name = name;
    this._place = place;
    this._x = x;
    this._y = y;
    this._direction = {
      ">": false,
      "<": false,
      "^": false,
      v: false,
    };
    this._gate = gate;
    if (this._gate !== null)
      this._direction[this._gate] = true;
    this._isOccupied = false;
    this._occupant = null;
    this._neighbors = new Map<string, Tile | null>(
      [["up", null], ["down", null], ["left", null], ["right", null]]
    );
  }

  get gate(): string | null {
    return this._gate;
  }

  get name(): string {
    return this._name;
  }

  get neighbors(): Map<string, Tile | null> {
    return this._neighbors;
  }

  get occupant(): any {
    return this._occupant;
  }

  get occupied(): boolean {
    return this._isOccupied;
  }

  get place(): Place | undefined {
    return this._place;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  set occupied(occupied) {
    this._isOccupied = occupied;
  }

  // Todo: is it a bug not to 'release' old item item?
  occupyWith(item: Item) {
    this._occupant = item;
    this._isOccupied = true;
  }

  // Todo: is it a bug not to 'release' occupant's tile?
  deoccupy() {
    this._occupant = null;
    this._isOccupied = false;
  }

  isOtherRoomAndNoGate(neighbor: Tile) {
    return this.isOtherRoom(neighbor) && this.isNoGate(neighbor);
  }

  isOtherRoomAndNoNeighborVerticalGate(neighbor: Tile) {
    return this.isOtherRoom(neighbor) && neighbor.isVerticalGate();
  }

  isOtherRoom(neighbor: Tile) {
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

  isNoGate(neighbor: Tile) {
    return neighbor !== null && this.gate === null && neighbor.gate === null;
  }

  canReach(neighbor: Tile): boolean {
    return (
      neighbor !== null &&
      (this._name === neighbor._name || this.isGate() || neighbor.isGate())
    );
  }

  hashCode(): number {
    const k = String(this.x) + "/" + String(this.y);
    let hash = 0;
    for (let i = 0; i < k.length; i++) {
      let chr = k.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  }
}
