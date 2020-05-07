"use strict";

import Item from "./item";

export default class Weapon extends Item {
  constructor(name: string, path: string) {
    super(name, path);
  }

  toString(): string {
    return `[Weapon ${this._name}]`;
  }
}
