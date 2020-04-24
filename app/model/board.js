"use strict";

const fs = require("fs");
const Tile = require("./tile.js");


class Board {
  constructor() {
    this._adjacenyMatrix = JSON.parse(fs.readFileSync("board.json", "utf8"));
    this._legend = this._initLegend();
    this._board = this._initBoard();
  }

  _initLegend() {
    let leg = JSON.parse(fs.readFileSync("board_legend.json", "utf8"));
    let legend = {};
    for (let i = 0; i < leg.length; i++) {
      legend[leg[i].legend] = leg[i].room;
    }
    return legend;
  }

  _initBoard() {
    let board = [];
    for (let i = 0; i < this._adjacenyMatrix.length; i++) {
      board[i] = [];
      for (let j = 0; j < this._adjacenyMatrix[i].length; j++) {
        let el = this._adjacenyMatrix[i][j].split("");
        board[i][j] = new Tile(el[0], this._legend[el[0]],  i, j, el[1] || null);
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

new Board();