"use strict";

const utils = require("../util.js");

class Dice {
  constructor() {
    this._die = [1, 2, 3, 4, 5, 6];
  }

  cast() {
    return utils.randomElement(this._die) +
      utils.randomElement(this._die);
  }
}

module.exports = Dice;