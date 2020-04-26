"use strict";

define(function () {

  class Card {
    constructor(name) {
      this._name = name;
    }
  }

  Card.prototype.toString = function () {
    return `[${this.constructor.name} ${this._name}]`;
  };

  return Card;
});
