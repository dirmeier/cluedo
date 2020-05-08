"use strict";
export default class Card {
    constructor(name, path) {
        this.toString = () => {
            return `[Card ${this._name}]`;
        };
        this._name = name;
        this._path = path;
    }
    get name() {
        return this._name;
    }
    get path() {
        return this._path;
    }
}
