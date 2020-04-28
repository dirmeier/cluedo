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

    _rect(el, tile, row, col) {
      return el
        .append("svg")
        .attr("id", "id_" + row + "_" + col)
        .append("rect")
        .attr("width", (this._width - 1) / (this._adj[row].length) - 1)
        .attr("height", (this._height - 1) / (this._adj.length) - 1)
        .attr("fill", "lightgray")
        .attr("x", ((this._width) / this._adj[row].length) * col);
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
          const rect = this._rect(g, tile, i, j);
          this._path(g, rect, tile);
        }
      }
    }

    _initPieces() {
      this._drawPieces("Suspects", this._board.suspects);
      this._drawPieces("Weapons", this._board.weapons);
    }

    _drawPieces(legend, arr) {
      d3.select('#legend')
        .append('h4')
        .html(legend)
        .style("width", this._width + 10);
      const ul = d3.select('#legend')
        .append('ul')
        .style("width", this._width + 10);
      for (let piece of arr) {
        const tile = piece.tile;
        d3.select("#id_" + tile.x + "_" + tile.y)
          .append("svg:image")
          .attr('x', ((this._width) / this._adj[tile.x].length) * tile.y)
          .attr("width", (this._width - 1) / (this._adj[tile.x].length) - 1)
          .attr("height", (this._height - 1) / (this._adj.length) - 1)
          .attr("xlink:href", piece.path);
        ul.append("li")
          .append("span")
          .text(piece.clazz + " " + piece.name + " ")
          .append("svg")
          .attr("width", (this._width - 1) / (this._adj[tile.x].length) - 1)
          .attr("height", (this._height - 1) / (this._adj.length) - 1)
          .append("svg:image")
          .attr("width", (this._width - 1) / (this._adj[tile.x].length) - 1)
          .attr("height", (this._height - 1) / (this._adj.length) - 1)
          .attr("xlink:href", piece.path);
      }
    }

    _initLegend() {
      const legend = d3.select("#legend")
        .append("h3")
        .style("width", this._width + 10)
        .html("Legend");
    }

    _initHelp() {
      const help = d3.select("#help")
        .style("width", this._width + 10)
        .html("<h3>Help</h3>");
    }

    drawExit() {
      d3.select("#help")
        .selectAll("div")
        .remove();
      d3.select("#help")
        .append("div")
        .text("You all lost. Good job.");
    }

    _removeHelpDivs() {
      d3.select("#help")
        .selectAll("div")
        .remove();
    }

    printPlayer() {
      this._removeHelpDivs();
      d3.select("#help")
        .append("div")
        .append("p")
        .append("u")
        .text(`\n${this._model.currentPlayer.suspect.name}'s turn`);
    }

    askToRoll(cast, stay) {
      const remove = this._removeHelpDivs;
      d3.select("#help")
        .append("p")
        .text(`Do you want to cast the dice or stay in the room?`);
      const div = d3.select("#help").append("div");
      div.append("input")
        .attr("type", "submit")
        .attr("value", "Cast die")
        .on("click", function () {
          // remove();
          cast();
        });
      div.append("input")
        .attr("type", "submit")
        .attr("id", "stay_in_room")
        .attr("value", "Stay")
        .on("click", function () {
          // remove();
          stay();
        });
    }
  }

  return View;
});
