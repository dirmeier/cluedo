"use strict";
import Item from "./item";
export default class Weapon extends Item {
    constructor(name, path) {
        super(name, path);
    }
    toString() {
        return `[Weapon ${this._name}]`;
    }
}
