"use strict";
export default class Item {
    constructor(name, path) {
        this._name = name;
        this._path = path;
        this._tile = null;
    }
    get name() {
        return this._name;
    }
    get path() {
        return this._path;
    }
    get tile() {
        return this._tile;
    }
    set tile(tile) {
        this._tile = tile;
    }
    putOn(tile) {
        if (this._tile !== null)
            this._tile.deoccupy();
        this._tile = tile;
        this._tile.occupyWith(this);
    }
}
