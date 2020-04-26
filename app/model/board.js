"use strict";

const fs = require("fs");
const $ = require("lodash");

const Tile = require("./board/tile.js");
const Place = require("./board/place.js");
const Suspect = require("./board/suspect.js");
const Weapon = require("./board/weapon.js");

const utils = require("../util.js");

const suspects = [
  new Suspect("Plato", "red"),
  new Suspect("Critias", "green"),
  new Suspect("Alcibiades", "yellow"),
  new Suspect("Heraclitus", "purple"),
  new Suspect("Charmides", "blue"),
  new Suspect("Lysander", "white")
].sort();

const weapons = [
  new Weapon("Cup of poison"),
  new Weapon("Dagger"),
  new Weapon("Treachery"),
  new Weapon("Sickle"),
  new Weapon("Rope"),
  new Weapon("Bow")
].sort();

class Board {
  constructor(nSuspects) {
    this._adjacenyMatrix = this._initAdjacency();
    this._places = this._initPlaces();
    this._board = this._initBoard();

    this._suspects = utils.randomElements(suspects, nSuspects);
    this._weapons = Array.from(weapons);

    this._distributeSuspectsToRooms();
    this._distributePiecesToRooms();
  }

  _initAdjacency() {
    return JSON.parse(
      fs.readFileSync("./app/model/board/board.json", "utf8")
    );
  }

  _initPlaces() {
    let legend = JSON.parse(
      fs.readFileSync("./app/model/board/board_legend.json", "utf8")
    );
    let places = {};
    for (let leg of legend) {
      places[leg.legend] = new Place(leg.place, leg.legend, leg.type);
    }
    return places;
  }

  _initBoard() {
    let board = [];
    for (let i = 0; i < this._adjacenyMatrix.length; i++) {
      board[i] = [];
      for (let j = 0; j < this._adjacenyMatrix[i].length; j++) {
        const el = this._adjacenyMatrix[i][j].split("");
        const place = this._places[el[0]];
        board[i][j] = new Tile(el[0], place, i, j, el[1] || null);
        place.add(board[i][j]);
      }
    }

    for (let i = 0; i < this._adjacenyMatrix.length; i++) {
      for (let j = 0; j < this._adjacenyMatrix[i].length; j++) {
        if (i > 0)
          board[i][j].neighbors.up = board[i - 1][j] || null;
        if (i < this._adjacenyMatrix.length - 1)
          board[i][j].neighbors.down = board[i + 1][j] || null;
        if (j > 0)
          board[i][j].neighbors.left = board[i][j - 1] || null;
        if (j < this._adjacenyMatrix[i].length - 1)
          board[i][j].neighbors.right = board[i][j + 1] || null;
      }
    }

    return board;
  }

  _distributeSuspectsToRooms() {
    let places = this._getPlaces();
    places = utils.randomElements(places, this._suspects.length);
    for (let i = 0; i < this._suspects.length; i++) {
      const tile = this._getFreeTile(places[i]);
      this._suspects[i].position(places[i], tile);
      tile.occupyWith(this._suspects[i]);
    }
  }

  _distributePiecesToRooms() {
    let places = this._getPlaces();
    places = utils.randomElements(places, this._weapons.length);
    for (let i = 0; i < this._weapons.length; i++) {
      const tile = this._getFreeTile(places[i]);
      this._weapons[i].position(places[i], tile);
      tile.occupyWith(this._weapons[i]);
    }
  }

  _getPlaces() {
    return Object.values(this._places)
      .filter((v) => v.type === "place");
  }

  _getFreeTile(place) {
    const tls = $.shuffle(place.tiles);
    for (let tl of tls) {
      if (!tl.occupied) return tl;
    }
  }

  get board() {
    return this._board;
  }
}

module.exports = Board;
