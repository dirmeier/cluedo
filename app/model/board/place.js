class Place {
  constructor(name, abbreviation) {
    this._name = name;
    this._abbreviation = abbreviation;
    this._tiles = [];
  }

  add(tile) {
    this._tiles.push(tile);
  }
}

module.exports = Place;
