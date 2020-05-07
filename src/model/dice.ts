"use strict";

import * as utl from "../util";

export default class Dice {
  protected _die: Array<number>;

  constructor() {
    this._die = [1, 2, 3, 4, 5, 6];
  }

  cast() {
    return utl.randomElement(this._die) + utl.randomElement(this._die);
  }
}

