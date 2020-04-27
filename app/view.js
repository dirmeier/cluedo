"use strict";

define(function (require) {
  const d3 = require("libs/d3");

  class View {
    constructor(model) {
      this._width = 700;
      this._height = 700;
      this._app = this._getApp();
      this._model = model;
      this._board = this._model.board;
      this._players = this._model.players;

      this._initBoard();
      this._initPlayers();
    }

    _getApp() {
      return d3.select("#app")
        .attr("align", "center")
        .style("width", this._width + 10)
        .style("height", this._height);
    }

    _svg() {
      return this._app
        .append("svg")
        .attr("width", this._width + 5)
        .attr("height", this._height / this._board.length);
    }

    _g(svg) {
      return svg.append("g");
    }

    _rect(el, row, col) {
      return el
        .append("rect")
        .attr("width", (this._width - 1) / (this._board[row].length) - 1)
        .attr("height", (this._height - 1) / (this._board.length) - 1)
        .attr("x", ((this._width) / this._board[row].length) * col)
        .attr("row", row)
        .attr("col", col);
    }

    _text(el, rect, row, col) {
      const w = ((this._width / this._board[row].length)) / 8;
      return el
        .append("text")
        .text("(" + row + "," + col + ")")
        .attr('fill', 'black')
        .attr("x", parseFloat(rect.attr('x')) + w)
        .attr("y", rect.attr('y') + 12)
        .attr('font-size', '8')
        .attr('fill', 'black');
    }

    _path(el, rect, tile) {

      const x = parseFloat(rect.attr('x'));
      const w = parseFloat(rect.attr('width'));
      const h = parseFloat(rect.attr('height'));

      if (tile.neighbors.left === null)
        el.append("polyline").attr(
          "points", "0.5,0 0.5," + h);
      else if (tile.neighbors.right === null)
        el.append("polyline").attr(
          "points", (x + w) + ",0 " + (x + w) + "," + h);

      if (tile.isOtherRoomAndNoGate(tile.neighbors.right)) {
        el.append("polyline").attr(
          "points", (x + w) + ",0 " + (x + w) + "," + h);
      }

      if (tile.isOtherRoomAndNoGate(tile.neighbors.down)) {
        el.append("polyline").attr(
          "points", (x) + ",  " + (h - 2) + " " + (x + w) + "," + (h - 2));
      }

      if (tile.isOtherRoomAndNoNeighborVerticalGate(tile.neighbors.down)) {
        el.append("polyline").attr(
          "points", (x) + ",  " + (h - 2) + " " + (x + w) + "," + (h - 2));
      }

      if (tile.isGateRight() && tile.isOtherRoom(tile.neighbors.down)) {
        el.append("polyline").attr(
          "points", (x) + ",  " + (h - 2) + " " + (x + w) + "," + (h - 2));
      }

      if (tile.neighbors.up === null)
        el.append("polyline").attr(
          "points", x + ",0.5 " + (x + w) + ",0.5");
      else if (tile.neighbors.down === null)
        el.append("polyline").attr(
          "points", x + ",  " + (h - 2) + " " + (x + w) + "," + (h - 2));
    }

    _initBoard() {
      const board = this._model.board;
      for (let i = 0; i < board.length; i++) {
        const svg = this._svg();
        for (let j = 0; j < board[i].length; j++) {
          const tile = board[i][j];
          const g = this._g(svg);
          const rect = this._rect(g, i, j);
          this._text(g, rect, i, j);
          this._path(g, rect, tile);
        }
      }
    }

    

    _draw() {
      const board = this._model.board;
      for (let i = 0; i < board.length; i++) {
        let draws = "";
        let holds = "";
        for (let j = 0; j < board[i].length; j++) {
          draws += board[i][j].draw();
          if (board[i][j].occupied)
            holds += board[i][j].occupant;
        }
        console.log(draws + "\t" + holds);
      }
    }
  }

  return View;
});
