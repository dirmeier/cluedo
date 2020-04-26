"use strict";

define(function (require) {
  const Item = require("model/board/item");

  class Weapon extends Item.Item {
    constructor(name) {
      super(name);
    }
  }

  Weapon.prototype.toString = function () {
    return `[Weapon ${this._name}]`;
  };

  return Weapon;
});
