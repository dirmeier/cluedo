"use strict";

define(function (require) {
  const d3 = require("libs/d3");
  const utl = require("util");
  const glb = require("global");

  class View {
    constructor(model) {
      this._legendWidth = 250;
      this._legendHeight = 550;
      this._helpWidth = 250;
      this._width = 500;
      this._height = 500;

      this._model = model;
      this._board = this._model.board;
      this._adj = this._board.adjacency;
      this._suspectPieces = this._board.suspects;
      this._weaponPieces = this._board.weapons;
      this._placesPieces = this._board.places;
      this._playerPiecesNames = this._model.players.map(
        function (i) { return i.suspect.name; }
      );

      this._athenaDiv = "athena_div";
      this._boardDiv = "board_div";
      this._infoDiv = "info_div";

      this._legendNextButton = "legend_next_button";
      this._legendIntroHelp = "legend_intro_help";
      this._introTextIndex = 0;
      this._sectionLegend = "section_legend";
      this._sectionLegendMarginRight = ["-75px", "-75px", "-75px", "-75px"];
      this._sectionLegendMarginTop = ["-75px", "-75px", "-100px", "-100px"];
      this._introTexts = [
        "Welcome. I am the goddess Athena, patron of the city of Athens, and " +
        "I come with bad news. One of my favorite disciples, Socrates, has been murdered.",

        "To not let this crime go unpunished, I instructed three of his acquaintances," +
        this._playerPiecesNames.slice(0, -1).join(", ") + " and " + this._playerPiecesNames.pop() +
        " (one for each player), to expose his murderer.",

        "The crime has been committed by 1 of " + this._suspectPieces.length + " suspects " +
        "with 1 of " + this._weaponPieces.length + " weapons " +
        "which are distributed in different places in Athens. I assume the murder has been " +
        "committed in one of these places.",
        "Each round a player can 'cast a die' to move between places, make a 'suggestion' to " +
        "get information about suspects/weapons/places and 'accuse' someone to end the game. " +
        "Now, please help me and solve the crime.",
        null
      ];

      this._infoHeader = "info_header";
      this._infoText = "info_text";
      this._buttonsId = "buttons";

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

      this._paintedTiles = [];

      this._buildElements();
      this._initAthena();
      this._init();
    }

    _buildElements() {
      const app = d3.select("#app")
        .attr("class", "row")
        .attr("align", "center");

      app.append("h1").text("Cluedo - ancient Greece edition");
      app.append("h2").text("Expose Socrates' murderer.");

      app.append("div")
        .attr("id", this._athenaDiv)
        .attr("class", "column left")
        .attr("align", "right");

      app.append("div")
        .attr("id", this._boardDiv)
        .attr("class", "column")
        .style("width", this._width + 10)
        .style("height", this._height);

      app.append("div")
        .attr("id", this._infoDiv)
        .attr("class", "column right");
    }

    _initAthena() {
      let section = d3.select("#" + this._athenaDiv);

      section = section.append("section")
        .attr("class", "message-list");

      section.append("section")
        .attr("id", this._sectionLegend)
        .attr("class", "message -right column")
        .style("width", "300px")
        .append("div")
        .attr("class", "nes-balloon from-right")
        .append("p")
        .attr("id", this._legendIntroHelp)
        .style("font-size", "10px");

      section.append("svg")
        .attr('height', this._legendHeight)
        .attr('width', this._legendWidth)
        .append("svg:image")
        .attr('height', this._legendHeight)
        .attr("xlink:href", glb.athena.path);

      const init = this._init;
      this._newButton(d3.select("#" + this._athenaDiv),
        this._legendNextButton, "Next")
        .on("click", function () {
          init();
        });
    }

    _init = () => {
      const idx = this._introTextIndex;
      d3.select("#" + this._sectionLegend)
        .style("margin-right", this._sectionLegendMarginRight[idx])
        .style("margin-top", this._sectionLegendMarginTop[idx]);
      if (idx < this._introTexts.length)
        this._showText(this._legendIntroHelp, this._introTexts[idx]);
      if (idx === 2) {
        this._initBoard();
      } else if (idx === this._introTexts.length - 1) {
        d3.select("#" + this._legendNextButton).style("display", "none");
        this._initInfo();
        this._printPlayer();
      }
      this._introTextIndex++;
    };

    _showText(id, text) {
      d3.select("#" + id).text(text);
    }

    _initBoard() {
      this._initTiles();
      this._drawPieces("Suspects", this._board.suspects);
      this._drawPieces("Weapons", this._board.weapons);
      this._drawSocrates();
    }

    _initTiles() {
      const main = d3.select("#" + this._boardDiv)
        .append("svg")
        .attr("width", this._width + 5)
        .attr("height", this._height + 5);
      for (let i = 0; i < this._adj.length; i++) {
        const svg = this._row(main, i);
        for (let j = 0; j < this._adj[i].length; j++) {
          const tile = this._adj[i][j];
          const g = this._g(svg, i, j);
          this._initPlace(g, i, j, tile, tile.place);
          const rect = this._rect(g, tile, i, j);
          this._path(g, rect, tile);
        }
      }
    }

    _row(main, i) {
      return main
        .append("g")
        .attr("width", this._width + 5)
        .attr("transform",
          "translate(0," + i * (this._height / this._adj.length) + ")")
        .style("display", "flex");
    }

    _g(svg, row, col) {
      return svg
        .append("g")
        .attr("id", "id_" + row + "_" + col);
    }

    _initPlace(el, row, col, tile, place) {
      if (place.isDrawn || !place.isPlace)
        return;
      place.isDrawn = true;
      el.append("svg:image")
        .attr('x', ((this._width) / this._adj[row].length) * col)
        .attr("height", ((this._height - 1) / (this._adj.length) - 1) * place.nrow)
        .attr("xlink:href", place.path);
    }

    _rect(el, tile, row, col) {
      return el
        .append("rect")
        .attr("id", "id_r_" + row + "_" + col)
        .attr("width", (this._width - 1) / (this._adj[row].length) - 1)
        .attr("height", (this._height - 1) / (this._adj.length) - 1)
        .attr("fill", "lightgray")
        .attr("fill-opacity", 0.5)
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

    _drawSocrates() {
      const row = 7;
      const col = 9;
      const place = this._board.places["_"];
      const g = d3.select("#id_" + row + "_" + col);
      g.append("svg:image")
        .attr('x', ((this._width) / this._adj[row].length) * col)
        .attr("height", ((this._height - 1) / (this._adj.length) - 1) * place.nrow)
        .attr("xlink:href", place.path);
      for (let tile of place.tiles) {
        d3.select("#id_r_" + tile.x + "_" + tile.y)
          .attr("fill", "transparent");
      }
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
        .style("width", this._legendWidth)
        .append("h3")
        .html("Legend");
      this._initLegendForPieces("Players",
        this._model.players.map(function (i) {return i.suspect;}));
      this._initLegendForPieces("Suspects", this._board.suspects.sort());
      this._initLegendForPieces("Weapons", this._board.weapons.sort());
      this._initLegendForPieces("Places",
        Object.values(this._board.places).sort());
      this._initButtonDescription();
    }

    _initLegendForPieces(piecesHeader, arr) {
      d3.select('#legend')
        .append('h5')
        .html(piecesHeader);

      const ul = d3.select('#legend')
        .append('ul')
        .attr("id", "legend_" + piecesHeader);

      this._initLegendPieceList("legend_" + piecesHeader, arr);
    }

    _initLegendPieceList(id, arr) {
      const ul = d3.select("#" + id);
      ul.selectAll("li").remove();
      for (let piece of arr) {
        if (piece.name === "_") continue;
        ul.append("li")
          .append("span")
          .text(piece.name + " ")
          .append("svg")
          .attr("width", 30)
          .attr("height", 30)
          .append("svg:image")
          .attr("width", 30)
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
        "Suggest: ask your co-players for a suspect/place/weapon card",
        "Accuse: name a suspect/place/weapon and possibly end the game",
        "Next player: finish move and start next player's turn"
      ];

      ul.selectAll("li")
        .data(els)
        .enter()
        .append("li")
        .text(function (d) {return d;});
    }

    _newButton(el, id, text) {
      return el.append("button")
        .attr("class", "nes-btn")
        .attr("type", "button")
        .attr("name", "action")
        .attr("id", id)
        .text(text);
    }

    _initInfo() {
      const info = d3.select("#" + this._infoDiv)
        .style("width", this._helpWidth);
      info.append("h3").html("Info");

      let div = info.append("div");
      const show = this.showCards;
      this._newButton(div, this._showCardsButton, "Show cards")
        .style("margin-bottom", "20px")
        .on("click", function () {
          show();
        });

      div.append("ul")
        .attr("id", this._playerCardsList)
        .style("display", "none");

      div = info.append("div").attr("id", this._infoHeader);
      div.append("p").attr("id", this._infoText);
      this._showInfo("You have the following options:");

      div = div.append("div").attr("id", this._buttonsId);
      this._newButton(div.append("div"), this._castButtonId, "Cast die");
      this._newButton(div.append("div"), this._suggestButtonId, "Suggest");
      this._newButton(div.append("div"), this._accuseButtonId, "Accuse");
      this._newButton(div.append("div"), this._finishMoveButtonId, "Next player");

      d3.select("#"  +  this._infoHeader)
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
      //
      // div = d3.select("#info").append("div");
      // let button = this._newButton(div, this._selectSuggestButtonId, "Suggest");
      // button.style("display", "none");
      //
      // div = d3.select("#info").append("div");
      // button = this._newButton(div, this._selectAccuseButtonId, "Accuse");
      // button.style("display", "none");
    }

    _initSelectLists(text, divID, listID, cards) {
      const div = d3
        .select("#" + this._selectListsId)
        .append("div")
        .attr("align", "center")
        .attr("id", divID)
        .style("display", "none");

      const select = div
        .append("select")
        .attr("align", "center")
        .attr("id", listID);

      select.selectAll("option")
        .data(cards.sort())
        .enter()
        .append("option")
        .attr("value", function (d) {return d.name; })
        .text(function (d) {return d.name; });

      // div.append("div")
      //   .attr("class")
      //   .append("i")
      //   .attr("class", "material-icons").text("arrow_drop_down");

    }

    _printPlayer() {
      d3.select("#" + this._sectionLegend)
        .style("margin-right", "-200px")
        .style("margin-top", "30px");
      d3.select("#" + this._legendIntroHelp)
        .style("width", "120px")
        .text(`${this._model.currentPlayer.suspect.name}'s turn`);

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
        .text("You all lost. Good job");
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
      await utl.sleep(500);
      let lastTile = oldTile;
      for (let mv of path) {
        this._drawPiece(mv, this._model.currentPlayer.suspect);
        this._removePiece(lastTile);
        lastTile = mv;
        this._paintTile(lastTile.x, lastTile.y, "lightgray");
        await utl.sleep(500);
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

    showCards = () => {
      const cardsButton = d3.select("#" + this._showCardsButton);
      const list = d3.select("#" + this._playerCardsList);
      if (list.style("display") === "none") {
        list.style("display", "block");
        cardsButton.attr("value", "Hide cards");
      } else {
        list.style("display", "none");
        cardsButton.attr("value", "Show cards");
      }
    };

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
          `${c[0]} shows you card:\n'${c[1]}'.
          You have the following options:`
        );
      }
      this._showInline(this._accuseButtonId);
      this._showInline(this._finishMoveButtonId);
    }

    updatePiece(oldTile, newTile) {
      this._drawPiece(newTile, newTile.occupant);
      this._removePiece(oldTile);
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

    removePlayerFromLegend() {
      this._initLegendPieceList("legend_Players",
        this._model.players.map(function (i) {return i.suspect;}));
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
