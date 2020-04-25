"use strict";

const Item = require("./item.js");

class Weapon extends Item {
  constructor(name) {
    super(name);
  }
}

module.exports = Weapon;

