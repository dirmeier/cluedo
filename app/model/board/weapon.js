"use strict";

const Item = require("./item.js");

class Weapon extends Item {
  constructor(name) {
    super(name);
  }
}

Weapon.prototype.toString = function()
{
  return `[Weapon ${this._name}]`;
};

module.exports = Weapon;

