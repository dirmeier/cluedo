class Card {
  constructor (name) {
    this.name = name;
  }
}

Card.prototype.toString = function()
{
  return `[Card ${this.name}]`;
};

module.exports = Card;

