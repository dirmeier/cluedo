"use strict";

import Tile from "./tile";

export default class Place {
  protected _name: string;
  protected _abbreviation: string;
  protected _path: string | null;
  protected _type: string;
  protected _tiles: Array<Tile>;
  protected _isDrawn: boolean;

  constructor(name: string, abbreviation: string, type: string, path: string | null) {
    this._name = name;
    this._abbreviation = abbreviation;
    this._path = path;
    this._type = type;
    this._tiles = [];
    this._isDrawn = false;
  }

  get isDrawn(): boolean {
    return this._isDrawn;
  }

  get isPlace(): boolean {
    return this._type === "place";
  }

  get type(): string {
    return this._type;
  }

  get name(): string {
    return this._name;
  }

  get ncol(): number {
    const cols = this._tiles.map(function (i) {
      return i.y;
    });
    return new Set(cols).size;
  }

  get nrow(): number {
    const rows = this._tiles.map(function (i) {
      return i.x;
    });
    return new Set(rows).size;
  }

  get path(): string  | null{
    return this._path;
  }

  get tiles(): Array<Tile> {
    return this._tiles;
  }

  set isDrawn(drawn) {
    this._isDrawn = drawn;
  }

  add(tile: Tile): void {
    this._tiles.push(tile);
  }
}
