"use strict";

define(function (require) {
  const d3 = require("libs/d3");

  class View {
    constructor(model) {
      this._width = 600;
      this._height = 600;
      this._model = model;
      this._board = this._model.board;
      this._adj = this._board.adjacency;
      this._players = this._model.players;

      this._init();
      this._app = this._getApp();
      this._initLegend();
      this._initHelp();
      this._initBoard();
      this._initPieces();

    }

    _init() {
      d3.select("#app").attr("class", "row").attr("align", "center");
      d3.select("#app")
        .append("h1").text("Cluedo - ancient Greece edition");
      d3.select("#app")
        .append("h2").text("Find Socrates' murderer.");
      d3.select("#app")
        .append("div")
        .attr("id", "legend")
        .attr("class", "column well")
        .style("width", 250);
      d3.select("#app")
        .append("div")
        .attr("id", "board")
        .attr("class", "column")
        .style("width", this._width + 10)
        .style("height", this._height);
      d3.select("#app")
        .append("div")
        .attr("id", "help")
        .attr("class", "column well")
        .style("width", 250);
    }

    _getApp() {
      return d3.select("#board");
    }

    _svg() {
      return this._app
        .append("svg")
        .attr("width", this._width + 5)
        .attr("height", this._height / this._adj.length)
        .style("display", "flex");
    }

    _g(svg, row, col) {
      return svg.append("g");
    }

    _rect(el,tile, row, col) {
      return el
        .append("rect")
        .attr("width", (this._width - 1) / (this._adj[row].length) - 1)
        .attr("height", (this._height - 1) / (this._adj.length) - 1)
        .attr("fill", "lightgray")
        .attr("x", ((this._width) / this._adj[row].length) * col);
    }

    _circle(el, row, col) {
      const w = ((this._width / this._adj[row].length)) - 1;
      return el
        .append("circle")
        .attr("cx", ((this._width) / this._adj[row].length) * col + w / 2)
        .attr("cy", ((this._height - 1) / (this._adj.length) - 1) / 2)
        .attr("r", 10)
        .attr("fill", "transparent")
        .attr("id", "s_id_" + row + "_" + col);
    }

    _smallRect(el, row, col) {
      const w = ((this._width / this._adj[row].length)) - 1;
      return el
        .append("rect")
        .attr("width", ((this._width - 1) / (this._adj[row].length) - 1) / 2)
        .attr("height", ((this._height - 1) / (this._adj.length) - 1) / 2)
        .attr("x", ((this._width) / this._adj[row].length) * col + w / 4)
        .attr("y", ((this._height - 1) / (this._adj.length) - 1) / 4)
        .attr("fill", "transparent")
        .attr("id", "w_id_" + row + "_" + col);
    }

    _text(el, rect, row, col) {
      const w = ((this._width / this._adj[row].length)) / 8;
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
      for (let i = 0; i < this._adj.length; i++) {
        const svg = this._svg();
        for (let j = 0; j < this._adj[i].length; j++) {
          const tile = this._adj[i][j];
          const g = this._g(svg, i, j);
          const rect = this._rect(g,tile, i, j);
          const circle = this._circle(g, i, j);
          const smallrect = this._smallRect(g, i, j);
          //this._text(g, rect, i, j);
          this._path(g, rect, tile);
        }
      }
    }

    _initPieces() {
      const ul = d3.select('#legend').append('ul')
        .style("width", this._width + 10);
      for (let piece of this._board.pieces) {
        const tile = piece.tile;
        d3.select("#" + piece.c + "_" + "id_" + tile.x + "_" + tile.y)
          .style("fill", piece.color);
        ul.append("li")
          .append("span")
          .text(piece.clazz + " " + piece.name + " ")
          .append("svg")
          .attr("height", 15)
          .attr("width", 15)
          .style("vertical-align", "bottom")
          .append(piece.style)
          .attr("height", 15)
          .attr("width", 15)
          .attr("cx", 6)
          .attr("cy", 7)
          .attr("r", 6)
          .attr('fill', piece.color);
      }
    }

    _initLegend() {
      const legend = d3.select("#legend")
        .style("width", this._width + 10)
        .html("<h3>Legend</h3>");
    }

    _initHelp() {
      const help = d3.select("#help")
        .style("width", this._width + 10)
        .html("<h3>Help</h3>");
    }

    drawExit() {
      d3.select("#help")
        .selectAll()
        .remove();
      d3.select("#help")
        .append("div")
        .text("You all lost. Good job.");
    }
  }

  return View;
});
