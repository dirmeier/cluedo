"use strict";

define(function (require) {
  const utl = require("util");

  const Tile = require("model/board/tile");
  const Place = require("model/board/place");
  const Suspect = require("model/board/suspect");
  const Weapon = require("model/board/weapon");

  const board = require("model/board/board");
  const legend = require("model/board/board_legend");

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

      this._suspects = utl.randomElements(suspects, nSuspects);
      this._weapons = Array.from(weapons);

      this._distributeSuspectsToRooms();
      this._distributePiecesToRooms();
    }

    _initAdjacency() {
      return board;
    }

    _initPlaces() {
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
      places = utl.randomElements(places, this._suspects.length);
      for (let i = 0; i < this._suspects.length; i++) {
        const tile = this._getFreeTile(places[i]);
        this._suspects[i].position(places[i], tile);
        tile.occupyWith(this._suspects[i]);
      }
    }

    _distributePiecesToRooms() {
      let places = this._getPlaces();
      places = utl.randomElements(places, this._weapons.length);
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
      const tls = utl.shuffle(place.tiles);
      for (let tl of tls) {
        if (!tl.occupied) return tl;
      }
    }

    get board() {
      return this._board;
    }
  }

  return Board;
});



