"use strict";

const fs = require("fs");
const $ = require("lodash");

const Tile = require("./board/tile.js");
const Place = require("./board/place.js");

// const victim = new Suspect("Socrates");
//
// const suspects = [
//   new Suspect("Plato", "red"),
//   new Suspect("Critias", "green"),
//   new Suspect("Alcibiades", "yellow"),
//   new Suspect("Heraclitus", "purple"),
//   new Suspect("Charmides", "blue"),
//   new Suspect("Lysander", "white")
// ];


class Board {
  constructor() {
    this._adjacenyMatrix = JSON.parse(
      fs.readFileSync("./app/model/board/board.json", "utf8")
    );
    this._places = this._initPlaces();
    this._board = this._initBoard();
  }

  _initLegend() {
    let leg = JSON.parse(
      fs.readFileSync("./app/model/board/board_legend.json", "utf8")
    );
    let legend = {};
    for (let i = 0; i < leg.length; i++)
      legend[leg[i].legend] = leg[i].place;
    return legend;
  }

  _initPlaces() {
    const legend = this._initLegend();
    let places = {};
    for (let i in legend)
      places[i] = new Place(legend[i], i);
    return places;
  }

  _initBoard() {
    let board = [];
    for (let i = 0; i < this._adjacenyMatrix.length; i++) {
      board[i] = [];
      for (let j = 0; j < this._adjacenyMatrix[i].length; j++) {
        const el = this._adjacenyMatrix[i][j].split("");
        const room = this._places[el[0]];
        board[i][j] = new Tile(el[0], room, i, j, el[1] || null);
        room.add(board[i][j]);
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

  board() {
    return this._board;
  }
}

module.exports = Board;