"use strict";

define(function (require) {
  const Item = require("model/board/item");

  class Weapon extends Item.Item {
    constructor(name, color) {
      super(name, color);
    }

    get c() {
      return "w";
    }

    get style() {
      return "rect";
    }
  }

  Weapon.prototype.toString = function () {
    return `[Weapon ${this._name}]`;
  };

  return Weapon;
});
