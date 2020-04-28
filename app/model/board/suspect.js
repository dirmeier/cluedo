"use strict";

define(function (require) {
  const Item = require("model/board/item");

  class Suspect extends Item.Item {
    constructor(name, color, path) {
      super(name, color, path);
    }
  }

  Suspect.prototype.toString = function () {
    return `[Suspect ${this._name}]`;
  };

  return Suspect;
});
