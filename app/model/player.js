class Player {
  constructor(i, suspect) {
    this.name = i;
    this._next = null;
    this._prev = null;
    this._suspect = suspect;
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

  ask(murderer, place, weapon) {
    let player = this._next;
    while (player !== this) {
      if (player.holds(murderer))
        return [player.name, murderer, null, null];
      else if (player.holds(place))
        return [player.name, null, place, null];
      else if (player.holds(weapon))
        return [player.name, null, weapon];
      else
        player = player.next;
    }
    return [null, false, false, false];
  }

  holds(item) {
    return this._cards.filter((i) => i.name === item).length > 0;
  }

  position() {
    // tODO
    this._suspect.tile;
  }

}

Player.prototype.toString = function () {
  const crds = this._cards.join("\n\t");
  return `[Player ${this.name} \n\t${crds}\n]`;
};

module.exports = Player;
