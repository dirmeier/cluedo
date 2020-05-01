"use strict";

define(function (require) {
  const Item = require("model/board/item");

  class Suspect extends Item.Item {
    constructor(name, path) {
      super(name, path);
    }
  }

  Suspect.prototype.toString = function () {
    return `[Suspect ${this._name}]`;
  };

  return Suspect;
});
