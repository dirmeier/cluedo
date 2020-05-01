"use strict";

define(function () {
  class Card {
    constructor(name, path) {
      this._name = name;
      this._path = path
    }

    get name() {
      return this._name;
    }
    get path() {
      return this._path;
    }
  }

  Card.prototype.toString = function () {
    return `[Card ${this._name}]`;
  };

  return Card;
});
