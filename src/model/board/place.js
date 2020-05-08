"use strict";
export default class Place {
    constructor(name, abbreviation, type, path) {
        this._name = name;
        this._abbreviation = abbreviation;
        this._path = path;
        this._type = type;
        this._tiles = [];
        this._isDrawn = false;
    }
    get isDrawn() {
        return this._isDrawn;
    }
    get isPlace() {
        return this._type === "place";
    }
    get type() {
        return this._type;
    }
    get name() {
        return this._name;
    }
    get ncol() {
        const cols = this._tiles.map(function (i) {
            return i.y;
        });
        return new Set(cols).size;
    }
    get nrow() {
        const rows = this._tiles.map(function (i) {
            return i.x;
        });
        return new Set(rows).size;
    }
    get path() {
        return this._path;
    }
    get tiles() {
        return this._tiles;
    }
    set isDrawn(drawn) {
        this._isDrawn = drawn;
    }
    add(tile) {
        this._tiles.push(tile);
    }
}
