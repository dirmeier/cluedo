"use strict";

import Item from "./item";

export default class Suspect extends Item {
  constructor(name: string, path: string | null) {
    super(name, path);
  }

  toString(): string {
    return `[Suspect ${this._name}]`;
  }
}
