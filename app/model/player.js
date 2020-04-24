class Player {
  constructor () {
    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }
}

Player.prototype.toString = function()
{
  const crds = this.cards.join("\n\t");
  return `[Player \n\t${crds}]\n`;
};

module.exports = Player;
