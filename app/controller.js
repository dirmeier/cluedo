"use strict";

define(function () {

  class Controller {
    constructor(nPlayers, model, view) {
      if (typeof nPlayers === "undefined" || nPlayers < 1)
        throw "Please provide nPlayers";

      this._model = model;
      this._view = view;
      this._view.bindCast(this.castDie);
      this._view.bindMove(this.move);
      this._view.bindSuggest(this.suggest);
      this._view.bindMakeSuggestion(this.makeSuggestion);
      this._view.bindAccuse(this.accuse);
      this._view.bindMakeAccusation(this.makeAccusation);
      this._view.bindNextPlayer(this.nextPlayer);
      this._view.bindStartGame(this.ai_turn);

      this._isMove = false;
      this._pips = -1;
      this._log();
    }

    ai_turn = async () => {
      if (this._model.currentPlayer.isAI)
        await this._ai();
    };

    _ai_think = async () => {
      const player = this._model.currentPlayer;
      await this._view.aiMove(player);
      const cast = player.wantToCast();
      return cast;
    };

    _ai_cast = async () => {
      const player = this._model.currentPlayer;
      const pips = await this.castDie();
      const path = await player.getPath(pips);
      await this._view.aiCast(player);
      await this._makeMove(
        this._model.currentPlayer.tile, path[path.length - 1], path);
    };

    _ai_suggest = async () => {
      const player = this._model.currentPlayer;
      const sugg = player.suggest();
      await this._view.aiSuggest(player, sugg);
      const holds = await this.makeSuggestion(sugg.suspect, sugg.weapon);

      if (holds !== null)
        player.addSeenCard(holds.card);
    };

    _ai_accuse = async () => {
      const player = this._model.currentPlayer;
      const acc = await player.accuse();
      await this._view.aiAccuse(player, acc);
      await this.makeAccusation(acc.suspect, acc.weapon, acc.place);
    };

    _ai = async () => {
      if (await this._ai_think()) {
        await this._ai_cast();
      }

      if (this._model.currentPlayer.isInPlace) {
        await this._ai_suggest();
      }

      if (this._model.currentPlayer.wantsToAccuse()) {
        await this._ai_accuse();
      }

      await this._view.finishAIMove();
    };

    castDie = () => {
      this._isMove = true;
      this._pips = this._model.cast();
      const tiles = this._model.tilesInRangeOfCurrPlayer(this._pips);

      this._view.drawTiles(tiles, this._pips, this._model.currentPlayer.isAI);
      this._view.hideButtons();

      return this._pips;
    };

    move = async (row, col) => {
      if (!this._isMove)
        return;

      const oldTile = this._model.getPlayerTile();
      const tile = this._model.getTile(row, col);
      const path = this._model.computePath(oldTile, tile);

      if (path.length > this._pips) {
        this._view.appendInfo("You cannot walk that far.");
      } else {
        await this._makeMove(oldTile, tile, path);
      }
    };

    _makeMove = async (oldTile, tile, path) => {
      await this._view.makeMove(oldTile, tile, path);

      this._model.putCurrPlayerSuspectPieceOn(tile);
      this._isMove = false;

      if (!this._model.currentPlayer.isAI) {
        this._view.showSuggestButton();
        this._view.showAccuseButton();
        this._view.showFinishButton();
      }
    };

    suggest = () => {
      this._view.hideButtons();
      this._view.showSuggestions(this._model.currentPlayer.isAI);
    };

    makeSuggestion = async (suspect, weapon) => {
      let holds = await this._model.ask(suspect, weapon);

      for (let itemName of [suspect, weapon]) {
        const tiles = this._model.moveToPlayerPlace(itemName);
        this._view.updatePiece(tiles.oldTile, tiles.newTile);
      }

      await this._view.showHolds(holds, this._model.currentPlayer.isAI);
      if (!this._model.currentPlayer.isAI) {
        this._view.showAccuseButton();
        this._view.showFinishButton();
      }

      return holds;
    };

    accuse = () => {
      this._view.hideButtons();
      this._view.showAccusations(this._model.currentPlayer.isAI);
    };

    makeAccusation = async (suspect, weapon, place) => {
      let isSolved = this._model.isSolved(suspect, place, weapon);
      await this._view.makeAccusation(isSolved);

      if (!isSolved) {
        this._model.removeCurrentPlayer();
        this._view.removePlayerFromLegend();
      }

      if (!this._model.currentPlayer.isAI) {
        this._view.showFinishButton();
      }
      this._checkExit();
    };

    nextPlayer = async () => {
      await this._model.nextPlayer();
      await this._view.nextPlayer();
      await this._log();
      await this.ai_turn();
    };

    _checkExit = () => {
      if (this._model.players.length === 0) {
        this._view.drawExit();
      }
    };

    _log = () => {
      for (let i = 0; i < this._model.players.length; i++)
        console.log(this._model.players[i].toString());
      console.log(this._model.murderCase());
    };
  }

  return Controller;
});

