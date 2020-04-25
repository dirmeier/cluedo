class Tile {
  constructor(name, room, i, j, gate) {
    this._name = name;
    this._room = room;
    this._i = i;
    this._j = j;
    this._gate = gate;
    this._isOccupied = false;
    this._neighbors = {
      left: null, right: null, down: null, up: null
    };
  }

  get neighbors() {
    return this._neighbors;
  }

}

module.exports = Tile;

