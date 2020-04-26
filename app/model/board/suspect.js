"use strict";

define(function (require) {
  const Item = require("model/board/item");

  class Suspect extends Item.Item {
    constructor(name, color) {
      super(name);
      this._color = color;
    }
  }

  Suspect.prototype.toString = function () {
    return `[Suspect ${this._name}]`;
  };

  return Suspect;
});
