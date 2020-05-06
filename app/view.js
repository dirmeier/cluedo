"use strict";

define(function (require) {
  const d3 = require("libs/d3");
  const utl = require("util");
  const glb = require("global");

  class View {
    constructor(model) {
      this._athenaHeight = 400;
      this._athenaWidth = 200;
      this._legendWidth = 250;
      this._legendHeight = 550;
      this._helpWidth = 250;
      this._width = 600;
      this._height = 600;

      this._model = model;
      this._board = this._model.board;
      this._adj = this._board.adjacency;
      this._suspectPieces = this._board.suspects;
      this._weaponPieces = this._board.weapons;
      this._playerPiecesNames = this._model.players.map(
        function (i) {
          return i.suspect.name;
        }
      );

      this._accuseButtonId = "accuse_button";
      this._athenaDiv = "athena_div";
      this._boardDiv = "board_div";
      this._buttonsId = "buttons";
      this._castButtonId = "cast_die_button";
      this._finishMoveButtonId = "finish_move_button";
      this._infoDiv = "info_div";
      this._infoHeader = "info_header";
      this._infoText = "info_text";
      this._introTextIndex = 0;
      this._legendDiv = "legend_div";
      this._legendNextButton = "legend_next_button";
      this._legendIntroHelp = "legend_intro_help";
      this._placesSelectDiv = "places_select_div";
      this._placeSelectList = "places_select_list";
      this._playerCardsList = "player_card_list";
      this._revealCardButton = "show_revealed_card_button";
      this._revealCardParagraph = "show_revealed_card_paragraph";
      this._sectionLegend = "section_legend";
      this._showCardsButton = "show_cards_button";
      this._suggestButtonId = "suggest_button";
      this._selectListsId = "card_list";
      this._selectSuggestButtonId = "select_suggest_button";
      this._selectAccuseButtonId = "select_accuse_button";
      this._suspectsSelectDiv = "suspects_select_div";
      this._suspectsSelectList = "suspects_select_list";
      this._weaponsSelectDiv = "weapons_select_div";
      this._weaponsSelectList = "weapons_select_list";

      this._sectionLegendMarginRight = ["-75px", "-75px", "-75px", "-75px"];
      this._sectionLegendMarginTop = ["0px", "0px", "-25px", "-25px"];
      this._introTexts = [
        "Welcome. I am the goddess Athena, patron of the city of Athens, and " +
        "I come with bad news. One of my favorite disciples, Socrates, has been murdered.",

        "To not let this crime go unpunished, I instructed some of his acquaintances," +
        this._playerPiecesNames.slice(0, -1).join(", ") + " and " + this._playerPiecesNames.pop() +
        " (one for each player), to expose his murderer.",

        "The crime has been committed by 1 of " + this._suspectPieces.length + " suspects " +
        "with 1 of " + this._weaponPieces.length + " weapons " +
        "which are distributed in different places in Athens. I assume the murder has been " +
        "committed in one of these places.",

        "Each round a player can 'cast a die' to move between places, make a 'suggestion' to " +
        "get information about suspects/weapons/places and 'accuse' someone to end the game. " +
        "Now, please help me and expose the murder and save the open society.",

        null
      ];
      this._paintedTiles = [];

      this._buildElements();
      this._initAthena();
      this._initBoard();
      this._initInfo();
      this._initLegend();
      this._intro();
    }

    _buildElements() {
      const app = d3.select("#app")
        .append("div")
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
        .style("display", "none")
        .style("width", this._width + 10)
        .style("height", this._height);

      app.append("div")
        .attr("id", this._infoDiv)
        .attr("class", "column right")
        .style("display", "none");

      d3.select("#app")
        .append("div")
        .attr("class", "row")
        .attr("align", "center")
        .attr("id", this._legendDiv)
        .style("display", "none");
    }

    _initAthena() {
      let section = d3.select("#" + this._athenaDiv);

      section = section.append("section")
        .attr("class", "message-list");

      const bl = section.append("section")
        .attr("id", this._sectionLegend)
        .attr("class", "message -right column")
        .style("width", "300px");

      bl.append("div")
        .attr("class", "nes-balloon from-right hide-when-small")
        .append("p")
        .attr("id", this._legendIntroHelp)
        .style("font-size", "10px");

      bl.append("div")
        .attr("class", "nes-balloon from-right show-when-small")
        .append("p")
        .text("Unfortunately your display is too small to play." +
          " Save the open society another time.")
        .style("font-size", "10px");

      section.append("svg")
        .attr("height", 500)
        .attr("width", this._athenaWidth)
        .append("svg:image")
        .attr("height", this._athenaHeight)
        .attr("width", this._athenaWidth)
        .attr("y",100)
        .attr("xlink:href", glb.athena.path);

      this._newButton(
        d3.select("#" + this._athenaDiv), this._legendNextButton, "Next")
        .attr("class", "nes-btn hide-when-small");
    }

    _intro = () => {
      const idx = this._introTextIndex;
      d3.select("#" + this._sectionLegend)
        .style("margin-right", this._sectionLegendMarginRight[idx])
        .style("margin-top", this._sectionLegendMarginTop[idx]);
      if (idx < this._introTexts.length)
        this._showText(this._legendIntroHelp, this._introTexts[idx]);
      if (idx === 2) {
        d3.select("#" + this._boardDiv).style("display", "block");
      } else if (idx === this._introTexts.length - 1) {
        d3.select("#" + this._legendNextButton).style("display", "none");
        d3.select("#" + this._infoDiv).style("display", "block");
        d3.select("#" + this._legendDiv).style("display", "block");
        this._printPlayer();
      }
      this._introTextIndex++;
      return this._introTextIndex;
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
        .append("div")
        .attr("class", "hide-when-small")
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
        .attr("transform", "translate(0," + i * (this._height / this._adj.length) + ")")
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
        .attr("x", ((this._width) / this._adj[row].length) * col)
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
      const x = parseFloat(rect.attr("x"));
      const w = parseFloat(rect.attr("width"));
      const h = parseFloat(rect.attr("height"));

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
        .attr("x", ((this._width) / this._adj[row].length) * col)
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
        .attr("x", ((this._width) / this._adj[tile.x].length) * tile.y)
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
      
      this._initLegendForPieces("Players",
        this._model.players.map(function (i) {
          return i.suspect;
        }));
      this._initLegendForPieces("Suspects", this._board.suspects.sort());
      this._initLegendForPieces("Weapons", this._board.weapons.sort());
      this._initLegendForPieces("Places",
        Object.values(this._board.places).sort());
      this._initButtonDescription();
    }

    _initLegendForPieces(piecesHeader, arr) {
      let div = d3.select("#" + this._legendDiv)
        .append("div")
        .attr("class", "small-column hide-when-small");
      div.append("h5").html(piecesHeader);
      div.append("ul").attr("id", "legend_" + piecesHeader);
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
      const div = d3.select("#" + this._legendDiv)
        .append("div")
        .attr("class", "small-column hide-when-small");

      div.append("h5").html("Buttons");

      const ul = div.append("ul");
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
        .text(function (d) {
          return d;
        });
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
        .style("width", this._helpWidth)
        .append("div")
        .attr("class", "hide-when-small");
      info.append("h3").html("Info");

      let div = info.append("div");
      let show = this.showCards;
      this._newButton(div, this._showCardsButton, "Show cards")
        .style("margin-bottom", "20px")
        .on("click", function () {
          show();
        });

      div.append("ul").attr("id", this._playerCardsList).style("display", "none");
      div = info.append("div").attr("id", this._infoHeader);
      div.append("div")
        .style("overflow", "hidden")
        .append("p")
        .attr("id", this._infoText);
      this.showInfo("You have the following options:");

      div = d3.select("#" + this._infoHeader).append("div");
      let showw = this.showRevealCard;
      let button = this._newButton(div, this._revealCardButton, "Reveal card");
      button.style("display", "none")
        .on("click", function () {
          showw();
        });
      div.append("p").attr("id", this._revealCardParagraph).style("display", "none");

      div = d3.select("#" + this._infoHeader).append("div").attr("id", this._buttonsId);
      this._newButton(div.append("div"), this._castButtonId, "Cast die");
      this._newButton(div.append("div"), this._suggestButtonId, "Suggest");
      this._newButton(div.append("div"), this._accuseButtonId, "Accuse");
      this._newButton(div.append("div"), this._finishMoveButtonId, "Next player");

      d3.select("#" + this._infoHeader)
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

      div = d3.select("#" + this._infoHeader).append("div");
      button = this._newButton(
        div, this._selectSuggestButtonId, "Suggest");
      button.style("display", "none");

      div = d3.select("#" + this._infoHeader).append("div");
      button = this._newButton(
        div, this._selectAccuseButtonId, "Accuse");
      button.style("display", "none");
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
        .attr("value", function (d) {
          return d.name;
        })
        .text(function (d) {
          return d.name;
        });
    }

    _printPlayer() {
      d3.select("#" + this._sectionLegend)
        .style("margin-right", "-20px")
        .style("margin-top", "50px");
      d3.select("#" + this._legendIntroHelp)
        .style("width", "120px")
        .text(`${this._model.currentPlayer.name}'s turn`);

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
      d3.select("#" + this._infoDiv)
        .selectAll("div")
        .remove();
      d3.select("#" + this._infoDiv)
        .append("div")
        .text("You all lost. Good job. Reload the page if you want to give it another try.\n");
    }

    drawTiles(tiles, pips, isAI) {
      if (isAI)
        this.appendInfo(`${this._model.currentPlayer.name} cast: ${pips}.\n`);
      else
        this.showInfo(`${this._model.currentPlayer.name} cast: ${pips}.\n`);
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
      for (let id of [
        this._castButtonId,
        this._accuseButtonId,
        this._suggestButtonId,
        this._finishMoveButtonId,
        this._revealCardButton
      ]) {
        this._hide(id);
      }
    }

    showInline(id) {
      d3.select("#" + id).style("display", "inline");
    }

    _hide(id) {
      d3.select("#" + id).style("display", "none");
    }

    async wait(ms) {
      await utl.sleep(ms);
    }

    _getCheckedOption(id) {
      return d3
      .select("#" + id)
      .select("option:checked")
      .text();
    }

    async makeMove(oldTile, tile, path) {
      for (let tile of this._paintedTiles) {
        const ind = path.filter(
          function (i) {
            return i.x === tile.x & i.y === tile.y;
          });
        if (!ind.length) {
          this._paintTile(tile.x, tile.y, "lightgray");
        }
      }
      await this.wait(500);
      let lastTile = oldTile;
      for (let mv of path) {
        await this._drawPiece(mv, this._model.currentPlayer.suspect);
        await this._removePiece(lastTile);
        lastTile = mv;
        await this._paintTile(lastTile.x, lastTile.y, "lightgray");
        await this.wait(500);
      }
    }

    appendInfo(text) {
      const app = d3.select("#" + this._infoText).text() + " " + text;
      this.showInfo(app);
    }

    showInfo(text) {
      d3.select("#" + this._infoText).text(text);
    }

    showCards = () => {
      const cardsButton = d3.select("#" + this._showCardsButton);
      const list = d3.select("#" + this._playerCardsList);
      if (list.style("display") === "none") {
        list.style("display", "block");
        cardsButton.text("Hide cards");
      } else {
        list.style("display", "none");
        cardsButton.text("Show cards");
      }
    };

    showRevealCard = () => {
      const revealButton = d3.select("#" + this._revealCardButton);
      const par = d3.select("#" + this._revealCardParagraph);
      if (par.style("display") === "none") {
        par.style("display", "block");
        revealButton.text("Hide card");
      } else {
        par.style("display", "none");
        revealButton.text("Reveal card");
      }
    };

    showSuggestions(isAI) {
      if (!isAI)
        this.showInfo("Select a suspect and a weapon:");
      d3.select("#" + this._suspectsSelectDiv).style("display", "block");
      d3.select("#" + this._weaponsSelectDiv).style("display", "block");
      d3.select("#" + this._selectSuggestButtonId).style("display", "inline");
    }

    showAccusations(isAI) {
      if (!isAI)
        this.showInfo("Select a suspect, weapon and place:");
      d3.select("#" + this._suspectsSelectDiv).style("display", "block");
      d3.select("#" + this._weaponsSelectDiv).style("display", "block");
      d3.select("#" + this._placesSelectDiv).style("display", "block");
      d3.select("#" + this._selectAccuseButtonId).style("display", "inline");
    }

    async showHolds(holds, isAI) {
      this._hide(this._suspectsSelectDiv);
      this._hide(this._weaponsSelectDiv);
      this._hide(this._selectSuggestButtonId);
      const pl = this._model.currentPlayer.name;
      if (holds !== null) {
        if (!isAI) {
          this.showInfo(`${holds.player} showed ${pl} a card.`);
          d3.select("#" + this._revealCardButton).style("display", "inline");
          d3.select("#" + this._revealCardParagraph).text(holds.card.name);
        } else {
          this.appendInfo(`${holds.player} showed ${pl} a card.`);
        }
      } else {
        this.appendInfo(`${pl} didn't receive any card.`);
      }
      if (isAI)
        await this.wait(2000);
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
        this.showInfo("Congrats! You won!" +
          " You saved the open society against its opponents." +
          " Restart the game by reloading the page.");
      else {
        this.showInfo("Boo! You are out!");
      }
    }

    removePlayerFromLegend() {
      this._initLegendPieceList("legend_Players",
        this._model.players.map(function (i) {
          return i.suspect;
        }));
    }

    nextPlayer() {
      this._printPlayer();
      this.showInfo("You have the following options:");
      let func = this._hide;

      if (this._model.nPlayers > 1)
        func = this.showInline;

      func(this._castButtonId);
      func(this._suggestButtonId);
      func(this._finishMoveButtonId);
      this.showInline(this._accuseButtonId);
    }

    aiFinishMove() {
      this.appendInfo(`${this._model.currentPlayer.name} finishes his turn'.`);
      this.showFinishButton();
    }

    async aiMove(player) {
      this.hideButtons();
      this.showInfo(player.name + " is firing some neurons.");
      await this.wait(2000);
    }

    async aiCast(player) {
      await this.appendInfo(player.name + " wants to cast a die.");
      await this.wait(2000);
      this.appendInfo(
        `${player.name} decides to move ` +
        `to place '${player.target.name}'.`);
      await this.wait(2000);
    }

    async aiAccuse(player, acc) {
      this.appendInfo(`${player.name.name} wants to make am accusation.`);
      await this.wait(2000);
      this.appendInfo(
        `${player.name} accuses '${acc.suspect}' who he thinks committed 
          the murder in '${acc.place}' with '${acc.weapon}'.`
      );
      await this.wait(2000);
    }

    async aiSuggest(player, sugg) {
      this.appendInfo(`${player.name} wants to make a suggestion.`);
      await this.wait(2000);
      this.appendInfo(
        `${player.name} believes '${sugg.suspect}' 
           committed the murder in '${player.tile.place.name}' 
           with '${sugg.weapon}'.`
      );
      await this.wait(2000);
    }

    showSuggestButton() {
      if (this._model.currentPlayer.isInPlace)
        this.showInline(this._suggestButtonId);
    }

    showAccuseButton() {
      this.showInline(this._accuseButtonId);
    }

    showFinishButton() {
      this.showInline(this._finishMoveButtonId);
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

    bindStartGame(handler) {
      const init = this._intro;
      const text = this._introTexts;
      d3.select("#" + this._legendNextButton).on("click",
        function () {
          const idx = init();
          if (idx === text.length) handler();
        }
      );
    }
  }

  return View;
});
