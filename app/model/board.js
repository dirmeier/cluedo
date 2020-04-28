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
    new Suspect("Plato", "red", "app/view/plato.jpeg"),
    new Suspect("Critias", "green", "app/view/critias.jpeg"),
    new Suspect("Alcibiades", "yellow", "app/view/alcibiades.jpeg"),
    new Suspect("Heraclitus", "purple", "app/view/heraclitus.jpeg"),
    new Suspect("Charmides", "blue", "app/view/charmides.jpeg"),
    new Suspect("Lysander", "orange", "app/view/lysander.jpeg")
  ].sort();

  const weapons = [
    new Weapon("Cup of poison", "green", "app/view/poison.jpeg"),
    new Weapon("Dagger", "purple", "app/view/dagger.png"),
    new Weapon("Treachery", "red", "app/view/treachery.png"),
    new Weapon("Sickle", "black", "app/view/sickle.jpeg"),
    new Weapon("Rope", "brown", "app/view/rope.jpeg"),
    new Weapon("Bow", "yellow", "app/view/bow.png")
  ].sort();

  class Board {
    constructor(nSuspects) {
      this._places = this._initPlaces();
      this._adjacenyMatrix = this._initBoard();

      this._suspects = utl.randomElements(suspects, nSuspects).sort();
      this._weapons = Array.from(weapons);

      this._distributeSuspectsToRooms();
      this._distributeWeaponsToRooms();
    }

    get adjacency() {
      return this._adjacenyMatrix;
    }

    _initPlaces() {
      let places = {};
      for (let leg of legend) {
        places[leg.legend] = new Place(leg.place, leg.legend, leg.type);
      }
      return places;
    }

    _initBoard() {
      let adj = [];
      for (let i = 0; i < board.length; i++) {
        adj[i] = [];
        for (let j = 0; j < board[i].length; j++) {
          const el = board[i][j].split("");
          const place = this._places[el[0]];
          adj[i][j] = new Tile(el[0], place, i, j, el[1] || null);
          place.add(adj[i][j]);
        }
      }

      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (i > 0)
            adj[i][j].neighbors.up = adj[i - 1][j] || null;
          if (i < board.length - 1)
            adj[i][j].neighbors.down = adj[i + 1][j] || null;
          if (j > 0)
            adj[i][j].neighbors.left = adj[i][j - 1] || null;
          if (j < board[i].length - 1)
            adj[i][j].neighbors.right = adj[i][j + 1] || null;
        }
      }

      return adj;
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

    _distributeWeaponsToRooms() {
      let places = this._getPlaces();
      places = utl.randomElements(places, this._weapons.length);
      for (let i = 0; i < this._weapons.length; i++) {
        const tile = this._getFreeTile(places[i]);
        this._weapons[i].position(places[i], tile);
        tile.occupyWith(this._weapons[i]);
      }
    }

    get pieces() {
      return this._suspects.concat(this._weapons);
    }

    get suspects() {
      return this._suspects;
    }

    get weapons() {
      return this._weapons;
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

  }

  return Board;
});



