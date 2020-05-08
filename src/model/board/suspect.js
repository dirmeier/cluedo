"use strict";
import Item from "./item";
export default class Suspect extends Item {
    constructor(name, path) {
        super(name, path);
    }
    toString() {
        return `[Suspect ${this._name}]`;
    }
}
