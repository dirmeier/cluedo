"use strict";

const Item = require("./item.js");

class Suspect extends Item {
  constructor(name, color) {
    super(name);
    this._color = color;
  }
}

module.exports = Suspect;

