"use strict";

define(function () {

  class Controller {
    constructor(nPlayers, model, view) {
      if (typeof nPlayers === "undefined" || nPlayers < 1)
        throw "Please provide nPlayers";

      this._model = model;
      this._game = this._model.game;
      this._dice = this._game.dice;
      this._board = this._game.board;
      this._adj = this._board.adjacency;

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

    async _ai_think() {
      const player = this._model.currentPlayer;
      this._view.hideButtons();
      this._view.showInfo(player.name + " is firing some neurons.");
      const wantToCastDie = player.wantToCast();
      await this._view.wait(2000);
      return wantToCastDie;
    }

    async _ai_cast() {
      const player = this._model.currentPlayer;
      await this._view.appendInfo(player.name + " wants to cast a die.");
      await this._view.wait(2000);
      const pips = this.castDie();
      const path = player.getPath(pips);
      await this._view.wait(2000);
      this._view.appendInfo(
        `${player.name} decides to move ` +
        `to place '${player.target.name}'.`);
      await this._view.wait(2000);
      await this._makeMove(
        this._model.currentPlayer.tile, path[path.length - 1], path);
    }

    async _ai_suggest() {
      const player = this._model.currentPlayer;
      this._view.appendInfo(`${player.name} wants to make a suggestion.`);
      await this._view.wait(2000);
      const sugg = player.suggest();
      this._view.appendInfo(
        `${player.name} believes '${sugg.suspect}' 
           committed the murder in '${player.tile.place.name}' 
           with '${sugg.weapon}'.`
      );
      await this._view.wait(2000);
      const holds = this.makeSuggestion(sugg.suspect, sugg.weapon);
      if (holds !== null)
        player.addSeenCard(holds.card);
      await this._view.wait(2000);
    }

    async _ai_accuse() {
      const player = this._model.currentPlayer;
      const acc = await player.accuse();
      this._view.appendInfo(`${player.name} wants to make am accusation.`);
      await this._view.wait(2000);
      this._view.appendInfo(
        `${player.name} accuses '${acc.suspect}' who he thinks committed 
          the murder in '${acc.place}' with '${acc.weapon}'.`
      );
      await this.makeAccusation(acc.suspect, acc.weapon, acc.place);
      await this._view.wait(2000);
    }

    async _ai() {
      const player = this._model.currentPlayer;
      const wantToCastDie = await this._ai_think();

      if (wantToCastDie) {
        await this._ai_cast();
      }

      if (player.isInPlace) {
        await this._ai_suggest();
      }

      if (player.canAccuse()) {
        await this._ai_accuse();
      }

      await this._view.appendInfo(`${player.name} finishes his turn'.`);
      this._view.showFinishButton();
      await this._view.wait(2000);
    }

    castDie = () => {
      this._isMove = true;
      const pips = this._dice.cast();
      const tiles = this._model.computeNeighbors(pips);

      this._view.drawTiles(tiles, pips, this._model.currentPlayer.isAI);
      this._view.hideButtons();

      this._pips = pips;
      return pips;
    };

    move = (row, col) => {
      if (!this._isMove)
        return;

      const oldTile = this._model.currentPlayer.tile;
      const tile = this._adj[row][col];
      const path = this._model.computePath(oldTile, tile);

      if (path.length > this._pips) {
        this._view.appendInfo("You cannot walk that far.");
      } else {
        this._makeMove(oldTile, tile, path);
      }
    };

    _makeMove(oldTile, tile, path) {
      this._view.makeMove(tile, this._model.currentPlayer, oldTile, path);

      if (!this._model.currentPlayer.isAI) {
        this._view.showSuggestButton();
        this._view.showAccuseButton();
        this._view.showFinishButton();
      }

      this._model.currentPlayer.suspect.putOn(tile);
      this._isMove = false;
    }

    suggest = () => {
      this._view.hideButtons();
      this._view.showSuggestions(this._model.currentPlayer.isAI);
    };

    makeSuggestion = (suspect, weapon) => {
      let holds = this._model.ask(
        suspect, this._model.currentPlayer.tile.place.name, weapon);

      const suspectPiece = this._board.getPiece(suspect);
      const weaponPiece = this._board.getPiece(weapon);
      const oldSuspectTile = suspectPiece.tile;
      const oldWeaponTile = weaponPiece.tile;

      const newSuspectTile = this._board.putOnRandomTile(
        suspectPiece, this._model.currentPlayer.tile.place);
      const newWeaponTile = this._board.putOnRandomTile(
        weaponPiece, this._model.currentPlayer.tile.place);

      this._view.showHolds(holds, this._model.currentPlayer.isAI);

      if (!this._model.currentPlayer.isAI) {
        this._view.showAccuseButton();
        this._view.showFinishButton();
      }

      this._view.updatePiece(oldWeaponTile, newWeaponTile);
      this._view.updatePiece(oldSuspectTile, newSuspectTile);

      return holds;
    };

    accuse = () => {
      this._view.hideButtons();
      this._view.showAccusations(this._model.currentPlayer.isAI);
    };

    makeAccusation = (suspect, weapon, place) => {
      let isSolved = this._model.solve(
        suspect, place, weapon);
      this._view.makeAccusation(isSolved);

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
      console.log("------- new turn -------");
      for (let i = 0; i < this._model.players.length; i++)
        console.log(this._model.players[i].toString());
      console.log(this._model.murderCase());
    };
  }

  return Controller;
});

