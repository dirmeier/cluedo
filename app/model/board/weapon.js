"use strict";

define(function (require) {
  const Item = require("model/board/item");

  class Weapon extends Item.Item {
    constructor(name,  path) {
      super(name, path);
    }
  }

  Weapon.prototype.toString = function () {
    return `[Weapon ${this._name}]`;
  };

  return Weapon;
});
