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

      this._buttonsId = "buttons";
      this._infoText = "info_text";

      this._playerCardsList = "player_card_list";
      this._showCardsButton = "show_cards_button";

      this._castButtonId = "cast_die_button";
      this._accuseButtonId = "accuse_button";
      this._suggestButtonId = "suggest_button";
      this._finishMoveButtonId = "finish_move_button";

      this._selectListsId = "card_list";

      this._suspectsSelectDiv = "suspects_select_div";
      this._suspectsSelectList = "suspects_select_list";
      this._weaponsSelectDiv = "weapons_select_div";
      this._weaponsSelectList = "weapons_select_list";
      this._placesSelectDiv = "places_select_div";
      this._placeSelectList = "places_select_list";

      this._selectSuggestButtonId = "select_suggest_button";
      this._selectAccuseButtonId = "select_accuse_button";

      this._init();
      this._app = this._getApp();
      this._initBoard();
      this._initLegend();
      this._initHelp();
      this._printPlayer();

      this._paintedTiles = [];
    }

    _sleep(milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
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

    _initBoard() {
      this._initTiles();
      this._drawPieces("Suspects", this._board.suspects);
      this._drawPieces("Weapons", this._board.weapons);
    }

    _initTiles() {
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

    _svg() {
      return this._app
        .append("svg")
        .attr("width", this._width + 5)
        .attr("height", this._height / this._adj.length)
        .style("display", "flex");
    }

    _g(svg, row, col) {
      return svg.append("g").attr("id", "id_" + row + "_" + col);
    }

    _rect(el, tile, row, col) {
      return el
        .append("rect")
        .attr("id", "id_r_" + row + "_" + col)
        .attr("width", (this._width - 1) / (this._adj[row].length) - 1)
        .attr("height", (this._height - 1) / (this._adj.length) - 1)
        .attr("fill", "lightgray")
        .attr("x", ((this._width) / this._adj[row].length) * col)
        .attr("row", row)
        .attr("col", col);
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

    _drawPieces(piecesHeader, arr) {
      for (let piece of arr)
        this._drawPiece(piece.tile, piece);
    }

    _drawPiece(tile, piece) {
      d3.select("#id_" + tile.x + "_" + tile.y)
        .append("svg:image")
        .attr('x', ((this._width) / this._adj[tile.x].length) * tile.y)
        .attr("width", (this._width - 1) / (this._adj[tile.x].length) - 1)
        .attr("height", (this._height - 1) / (this._adj.length) - 1)
        .attr("xlink:href", piece.path);
    }

    _removePiece(tile) {
      d3.select("#id_" + tile.x + "_" + tile.y)
        .selectAll("image")
        .remove();
    }

    _initLegend() {
      const legend = d3.select("#legend")
        .append("h3")
        .html("Legend");
      this._initLegendForPieces("Players", this._board.suspects);
      this._initLegendForPieces("Weapons", this._board.weapons);
      this._initButtonDescription();
    }

    _initLegendForPieces(piecesHeader, arr) {
      d3.select('#legend')
        .append('h5')
        .html(piecesHeader);

      const ul = d3.select('#legend')
        .append('ul');

      for (let piece of arr) {
        const tile = piece.tile;
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

    _initButtonDescription() {
      d3.select('#legend')
        .append('h5')
        .html("Buttons");

      const ul = d3.select('#legend')
        .append('ul');

      const els = [
        "Cast die: throw two dice and move your figure on the board",
        "Accuse: name a suspect/place/weapon and possibly end the game",
        "Suggest: ask your co-players for a suspect/place/weapon card",
        "Next player: finish move and start next player's turn"
      ];

      ul.selectAll("li")
        .data(els)
        .enter()
        .append("li")
        .text(function (d) {return d;});
    }

    _initHelp() {
      const help = d3.select("#help")
        .style("width", this._width + 10);
      help.append("h3").html("Help");

      let div = help.append("div");
      div.attr("id", "player")
        .append("p")
        .append("u");
      div.append("input")
        .attr("id", this._showCardsButton)
        .attr("type", "submit")
        .attr("value", "Show cards");

      div.append("ul")
        .attr("id", this._playerCardsList)
        .style("display", "none");

      div = help.append("div")
        .attr("id", "info");
      div
        .append("p").attr("id", this._infoText);
      this._showInfo("You have the following options:");

      div = div
        .append("div")
        .attr("id", this._buttonsId);

      div.append("div")
        .append("input")
        .attr("id", this._castButtonId)
        .attr("type", "submit")
        .attr("value", "Cast die");

      div.append("div")
        .append("input")
        .attr("id", this._suggestButtonId)
        .attr("type", "submit")
        .attr("value", "Suggest");

      div.append("div")
        .append("input")
        .attr("id", this._accuseButtonId)
        .attr("type", "submit")
        .attr("value", "Accuse");

      div.append("div")
        .append("input")
        .attr("id", this._finishMoveButtonId)
        .attr("type", "submit")
        .attr("value", "Next player");

      d3.select("#info")
        .append("div")
        .attr("id", this._selectListsId)
        .style("text-align", "left");

      this._initSelectLists(
        "Suspects: ",
        this._suspectsSelectDiv,
        this._suspectsSelectList,
        this._model.cards.suspects);
      this._initSelectLists(
        "Weapons: ",
        this._weaponsSelectDiv,
        this._weaponsSelectList,
        this._model.cards.weapons);
      this._initSelectLists(
        "Places:",
        this._placesSelectDiv,
        this._placeSelectList,
        this._model.cards.places);

      d3.select("#info")
        .append("div")
        .append("input")
        .attr("id", this._selectSuggestButtonId)
        .attr("type", "submit")
        .attr("value", "Suggest")
        .style("display", "none");

      d3.select("#info")
        .append("div")
        .append("input")
        .attr("id", this._selectAccuseButtonId)
        .attr("type", "submit")
        .attr("value", "Accuse")
        .style("display", "none");
    }

    _initSelectLists(text, divID, listID, cards) {
      const div = d3
        .select("#" + this._selectListsId)
        .append("div")
        .attr("id", divID)
        .style("display", "none");

      div.append("label").attr("for", listID).text(text);
      const select = div
        .append("select").attr("id", listID);

      select
        .selectAll("option")
        .data(cards.sort())
        .enter()
        .append("option")
        .text(function (d) {return d.name; });
    }

    _printPlayer() {
      d3.select("#player")
        .select("p")
        .select("u")
        .text(`\n${this._model.currentPlayer.suspect.name}'s turn`);

      d3.select("#" + this._playerCardsList)
        .selectAll("li")
        .remove();

      const ul = d3.select("#" + this._playerCardsList);
      for (let card of this._model.currentPlayer.cards.sort()) {
        ul.append("li")
          .append("span")
          .text(card.name);
      }
    }

    drawExit() {
      d3.select("#help")
        .selectAll("div")
        .remove();
      d3.select("#help")
        .append("div")
        .text("You all lost. Good job.\nReload to play again.");
    }

    drawTiles(tiles, pips) {
      this._showInfo(`You cast: ${pips}. Make a move by clicking a field.`);
      for (let tile of this._paintedTiles)
        this._paintTile(tile.x, tile.y, "lightgray");
      for (let tile of tiles)
        this._paintTile(tile.x, tile.y, "#C79999");
      this._paintedTiles = tiles;
    }

    _paintTile(row, col, color) {
      return d3.select("#id_r_" + row + "_" + col).style("fill", color);
    }

    hideButtons() {
      for (let el of [
        this._castButtonId,
        this._accuseButtonId,
        this._suggestButtonId,
        this._finishMoveButtonId
      ]) {
        d3.select("#" + el).style("display", "none");
      }
    }

    _showInline(id) {
      d3.select("#" + id).style("display", "inline");
    }

    _hide(id) {
      d3.select("#" + id).style("display", "none");
    }

    async makeMove(tile, player, oldTile, path) {
      for (let tile of this._paintedTiles) {
        const ind = path.filter(
          function (i) {return i.x === tile.x & i.y === tile.y;});
        if (!ind.length) {
          this._paintTile(tile.x, tile.y, "lightgray");
        }
      }
      await this._sleep(500);
      let lastTile = oldTile;
      for (let mv of path) {
        this._drawPiece(mv, this._model.currentPlayer.suspect);
        this._removePiece(lastTile);
        lastTile = mv;
        this._paintTile(lastTile.x, lastTile.y, "lightgray");
        await this._sleep(500);
      }

      if (this._model.currentPlayer.isInPlace)
        this._showInline(this._suggestButtonId);
      this._showInline(this._accuseButtonId);
      this._showInline(this._finishMoveButtonId);
    }

    _showInfo(text) {
      d3.select("#" + this._infoText).text(text);
    }

    _getCheckedOption(id) {
      return d3
        .select("#" + id)
        .select("option:checked")
        .text();
    }

    showCards() {
      const cardsButton = d3.select("#" + this._showCardsButton);
      const list = d3.select("#" + this._playerCardsList);
      if (list.style("display") === "none") {
        list.style("display", "block");
        cardsButton.attr("value", "Hide cards");
      } else {
        list.style("display", "none");
        cardsButton.attr("value", "Show cards");
      }
    }

    showSuggestions() {
      this._showInfo("Select a suspect and a weapon:");
      d3.select("#" + this._suspectsSelectDiv).style("display", "block");
      d3.select("#" + this._weaponsSelectDiv).style("display", "block");
      d3.select("#" + this._selectSuggestButtonId).style("display", "inline");
    }

    showAccusations() {
      this._showInfo("Select a suspect, weapon and place:");
      d3.select("#" + this._suspectsSelectDiv).style("display", "block");
      d3.select("#" + this._weaponsSelectDiv).style("display", "block");
      d3.select("#" + this._placesSelectDiv).style("display", "block");
      d3.select("#" + this._selectAccuseButtonId).style("display", "inline");
    }

    showHolds(holds) {
      this._hide(this._suspectsSelectDiv);
      this._hide(this._weaponsSelectDiv);
      this._hide(this._selectSuggestButtonId);

      if (holds[0] !== null) {
        let c = holds.filter(function (i) {return i !== null;});
        this._showInfo(
          `${this._model.players[c[0]].suspect.name} shows you card:\n'${c[1]}'.
          You have the following options:`
        );
      }
      this._showInline(this._accuseButtonId);
      this._showInline(this._finishMoveButtonId);
    }

    updatePiece(removePiece, newTile) {

    }

    makeAccusation(isSolved) {
      this._hide(this._suspectsSelectDiv);
      this._hide(this._weaponsSelectDiv);
      this._hide(this._placesSelectDiv);
      this._hide(this._selectAccuseButtonId);

      if (isSolved)
        this._showInfo("Congrats! You won!" +
          " You saved the open society against its opponents." +
          " Restart the game by reloading the page.");
      else {
        this._showInfo("Boo! You are out!");
        this._showInline(this._finishMoveButtonId);
      }
    }

    nextPlayer() {
      this._printPlayer();
      this._showInfo("You have the following options:");
      this._showInline(this._castButtonId);
      this._showInline(this._suggestButtonId);
      this._showInline(this._accuseButtonId);
      this._showInline(this._finishMoveButtonId);
    }

    bindCast(handler) {
      d3.select("#" + this._castButtonId).on("click", handler);
    }

    bindMove(handler) {
      d3.selectAll("rect").on("click", function () {
        handler(d3.select(this).attr("row"), d3.select(this).attr("col"));
      });
    }

    bindShowCards(handler) {
      d3.select("#" + this._showCardsButton).on("click", handler);
    }

    bindSuggest(handler) {
      d3.select("#" + this._suggestButtonId).on("click", handler);
    }

    bindMakeSuggestion(handler) {
      const sl = this._suspectsSelectList;
      const wl = this._weaponsSelectList;
      const get = this._getCheckedOption;
      d3.select("#" + this._selectSuggestButtonId).on("click", function () {
          handler(get(sl), get(wl));
        }
      );
    }

    bindAccuse(handler) {
      d3.select("#" + this._accuseButtonId).on("click", handler);
    }

    bindMakeAccusation(handler) {
      const sl = this._suspectsSelectList;
      const wl = this._weaponsSelectList;
      const pl = this._placeSelectList;
      const get = this._getCheckedOption;
      d3.select("#" + this._selectAccuseButtonId).on("click", function () {
          handler(get(sl), get(wl), get(pl));
        }
      );
    }

    bindNextPlayer(handler) {
      d3.select("#" + this._finishMoveButtonId).on("click", handler);
    }

  }

  return View;
});
