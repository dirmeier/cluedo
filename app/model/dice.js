"use strict";

define(function (require) {
  const utl = require("util");

  class Dice {
    constructor() {
      this._die = [1, 2, 3, 4, 5, 6];
    }

    cast() {
      return utl.randomElement(this._die) +
        utl.randomElement(this._die);
    }
  }

  return Dice;
});
