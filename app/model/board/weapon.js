"use strict";

define(function (require) {
  const Item = require("model/board/item");

  class Weapon extends Item.Item {
    constructor(name, color, path) {
      super(name, color, path);
    }
  }

  Weapon.prototype.toString = function () {
    return `[Weapon ${this._name}]`;
  };

  return Weapon;
});
