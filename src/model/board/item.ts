"use strict";

import Tile from "./tile";

export default class Item {
  protected _name: string;
  protected _tile: Tile | null;
  protected _path: string | null;

  constructor(name: string, path: string | null) {
    this._name = name;
    this._path = path;
    this._tile = null;
  }

  get name(): string {
    return this._name;
  }

  get path(): string | null {
    return this._path;
  }

  get tile(): Tile | null {
    return this._tile;
  }

  set tile(tile: Tile | null) {
    this._tile = tile;
  }

  putOn(tile: Tile): void {
    if (this._tile !== null) this._tile.deoccupy();
    this._tile = tile;
    this._tile.occupyWith(this);
  }
}
