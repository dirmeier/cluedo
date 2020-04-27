"use strict";

define(function () {

  class Card {
    constructor(name) {
      this._name = name;
    }

    get name() {
      return this._name;
    }
  }

  Card.prototype.toString = function () {
    return `[${this.constructor.name} ${this._name}]`;
  };

  return Card;
});
