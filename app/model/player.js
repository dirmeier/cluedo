class Player {
  constructor(i) {
    this.name = i;
    this._next = null;
    this._prev = null;
    this._cards = [];
  }

  addCard(card) {
    this._cards.push(card);
  }

  get cards() {
    return this._cards;
  }

  get next() {
    return this._next;
  }

  set next(next) {
    this._next = next;
  }

  get prev() {
    return this._prev;
  }

  set prev(prev) {
    this._prev = prev;
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
        player = player.next;
    }
    return [null, false, false, false];
  }

  holds(item) {
    return this._cards.filter((i) => i.name === item).length > 0;
  }
}

Player.prototype.toString = function () {
  const crds = this._cards.join("\n\t");
  return `[Player \n\t${crds}\n]`;
};

module.exports = Player;
