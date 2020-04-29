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

      this._suspects = Array.from(suspects);
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
        this.putOnRandomTile(this._suspects[i], places[i]);
      }
    }

    putOnRandomTile(piece, place) {
      const tile = this.getFreeTile(place);
      piece.putOn(tile);
      return tile;
    }

    _distributeWeaponsToRooms() {
      let places = this._getPlaces();
      places = utl.randomElements(places, this._weapons.length);
      for (let i = 0; i < this._weapons.length; i++) {
        this.putOnRandomTile(this._weapons[i], places[i]);
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

    computeNeighbors(pips, tile) {
      let stack = [tile];
      let neis = [];
      tile.distance = 0;

      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          this._adjacenyMatrix[i][j].visited = false;
        }
      }

      while (stack.length) {
        let node = stack.shift();
        neis.push(node);
        for (let nei of Object.values(node.neighbors)) {
          if (nei !== null &&
            !nei.occupied &&
            !nei.visited &&
            node.canReach(nei)) {
            nei.distance = node.distance + 1;
            nei.visited = true;
            if (nei.distance <= pips)
              stack.push(nei);
          }
        }
      }
      return neis;
    }

    computePath(oldTile, tile) {
      this._dijkstra(oldTile, tile);
      let path = [];
      let u = tile;
      while (u !== oldTile) {
        path.push(u);
        u = u.previous;
      }
      return path.reverse();
    }

    _dijkstra(oldTile, tile) {
      let Q = [];
      for (let i = 0; i < this._adjacenyMatrix.length; i++) {
        for (let j = 0; j < this._adjacenyMatrix[i].length; j++) {
          this._adjacenyMatrix[i][j].distance = 10000;
          this._adjacenyMatrix[i][j].previous = null;
          Q.push(this._adjacenyMatrix[i][j]);
        }
      }
      oldTile.distance = 0;

      while (Q.length) {
        const u = Q.reduce(function (i, j) {
          return i.distance < j.distance ? i : j;
        });
        Q = Q.filter(function (i) {return u.x !== i.x || i.y !== u.y;});

        if (u === tile) {
          return;
        }

        for (let v of Object.values(u.neighbors)) {
          if (v !== null && !v.occupied && u.canReach(v)) {
            const alt = u.distance + 1;
            if (alt < v.distance) {
              v.distance = alt;
              v.previous = u;
            }
          }
        }
      }
    }

    _getPlaces() {
      return Object.values(this._places)
        .filter((v) => v.type === "place");
    }

    getFreeTile(place) {
      const tls = utl.shuffle(place.tiles);
      for (let tl of tls) {
        if (!tl.occupied) return tl;
      }
    }

    movePiece(piece, place) {
      return this.putOnRandomTile(piece, place);
    }

    getPiece(name) {
      for (let piece of this.pieces) {
        if (piece.name === name)
          return piece;
      }
      return null;
    }
  }

  return Board;
});



