"use strict";

define(function () {
  class Controller {
    constructor(nPlayers, model, view) {
      if (typeof nPlayers === "undefined" || nPlayers < 2)
        throw "Please provide nPlayers";

      this._model = model;
      this._board = this._model.board;
      this._adj = this._board.adjacency;

      this._view = view;
      this._view.bindShowCards(this.showCards);
      this._view.bindCast(this.castDie);
      this._view.bindMove(this.move);
      this._view.bindSuggest(this.suggest);
      this._view.bindMakeSuggestion(this.makeSuggestion);
      this._view.bindAccuse(this.accuse);
      this._view.bindMakeAccusation(this.makeAccusation);
      this._view.bindNextPlayer(this.nextPlayer);

      this._isMove = false;
      this._log();
    }

    showCards = () => {
      this._view.showCards();
    };

    castDie = () => {
      this._isMove = true;
      const pips = this._model.castDie();
      const tiles = this._model.computeNeighbors(pips);
      this._view.drawTiles(tiles, pips);
      this._view.hideButtons();
    };

    move = (row, col) => {
      if (!this._isMove)
        return;

      const oldTile = this._model.currentPlayer.tile;
      const tile = this._adj[row][col];
      const path = this._model.computePath(oldTile, tile);

      this._view.makeMove(tile, this._model.currentPlayer, oldTile, path);
      this._model.currentPlayer.updatePosition(tile);
      this._isMove = false;
    };

    suggest = () => {
      this._view.hideButtons();
      this._view.showSuggestions();
    };

    makeSuggestion = (suspect, weapon) => {
      let holds = this._model.ask(
        suspect, this._model.currentPlayer.tile.place.name, weapon);

      // const suspectPiece = this._model.board.getPiece(suspect);
      // const weaponPiece = this._model.board.getPiece(weapon);

      // const newSuspectTile = this._model.board.movePiece(
      //   suspectPiece, this._model.currentPlayer.tile.place);
      // const newWeaponTile = this._model.board.movePiece(
      //   weaponPiece, this._model.currentPlayer.tile.place);

      this._view.showHolds(holds, this._model.currentPlayer.tile.place);
      // this._view.updatePiece(weaponPiece, newWeaponTile);
      // this._view.updatePiece(suspectPiece, newSuspectTile);
    };

    accuse = () => {
      this._view.hideButtons();
      this._view.showAccusations();
    };

    makeAccusation = (suspect, weapon, place) => {
      let isSolved = this._model.solve(
        suspect, place, weapon);
      this._view.makeAccusation(isSolved);
      if (!isSolved)
        this._model.removeCurrentPlayer();
      this._checkExit();
    };

    nextPlayer = () => {
      this._model.nextPlayer();
      this._view.nextPlayer();
      this._log();
    };

    _checkExit = () => {
      if (this._model.players.length === 0) {
        this._view.drawExit();
      }
    };

    _log = () => {
      console.log("------- new turn -------");
      for (let i = 0; i < this._model.players.length; i++)
        console.log(this._model.players[i].toString());
      console.log(this._model.murderCase());
    };
  }

  return Controller;
});

