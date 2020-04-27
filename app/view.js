"use strict";

define(function (require) {
  const d3 = require("libs/d3");

  class View {
    constructor(model) {
      this._width = 600;
      this._height = 600;
      this._app = this._getApp();
      this._model = model;
      this._board = this._model.board;
      this._initBoard();
    }

    _getApp() {
      return d3.select("#app")
        .attr("align", "center")
        .style("width", this._width)
        .style("height", this._height);
    }

    _svg() {
      return this._app
        .append("svg")
        .attr("width", this._width )
        .attr("height", this._height / this._board.length);
    }

    _g(svg) {
      return svg.append("g");
    }

    _rect(el, row, col) {
      return el
        .append("rect")
        .attr("width", (this._width - 5) / (this._board[row].length))
        .attr("height", this._height / (this._board.length))
        .attr("x", ((this._width) / this._board[row].length) * col);
      //attr("points", "0,50 150,50 150,150 50,150");
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

    _path(el, rect, row, col) {
      if (col !== 0)
        return;
      return el
        .append("polyline")
        .attr("points", rect.attr('x') + ",0 0," + rect.attr("height") );
    }

    _initBoard() {
      const board = this._model.board;
      for (let i = 0; i < board.length; i++) {
        const svg = this._svg();
        for (let j = 0; j < board[i].length; j++) {
          const g = this._g(svg);
          const rect = this._rect(g, i, j);
          const text = this._text(g, rect, i, j);
          const path = this._path(g, rect, i, j);
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
