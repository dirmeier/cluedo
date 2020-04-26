"use strict";

const Item = require("./item.js");

class Suspect extends Item {
  constructor(name, color) {
    super(name);
    this._color = color;
  }
}

Suspect.prototype.toString = function()
{
  return `[Suspect ${this._name}]`;
};

module.exports = Suspect;

