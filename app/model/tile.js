class Tile {
  constructor(name, room, i, j, gate) {
    this.name = name;
    this.room = room;
    this.i = i;
    this.j = j;
    this.gate = gate;
    this.isVisited = false;
    this.neighbors = {
      left: null, right: null, down: null, up: null
    };
  }
}

module.exports = Tile;

