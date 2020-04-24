class Player {
  constructor(i) {
    this.i = i;
    this._next = null;
    this._cards = [];
  }

  addCard(card) {
    this._cards.push(card);
  }

  getNext() {
    return this._next;
  }

  setNext(next) {
    this._next = next;
  }

  ask(murderer, room, weapon) {
    let player = this._next;
    while (player !== this) {
      let hasMurder = player.holds(murderer);
      let hasRoom = player.holds(room);
      let hasWeapon = player.holds(weapon);

      if (hasMurder || hasRoom || hasWeapon)
        return [player.i, hasMurder, hasRoom, hasWeapon];
      else
        player = player.getNext();

    }
    return [null, false, false, false];
  }

  holds(item) {
    return this._cards.filter((i) => i.name === item).length > 0;
  }
}

Player.prototype.toString = function () {
  const crds = this.cards.join("\n\t");
  return `[Player \n\t${crds}]\n`;
};

module.exports = Player;
