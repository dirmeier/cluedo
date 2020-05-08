"use strict";

import Model from "./model";
import View from "./view";
import AI from "./ai";
import Tile from "./model/board/tile";
import Card from "./model/cards/card";

export default class Controller {
  protected _model: Model;
  protected _view: View;
  protected _isMove: boolean;
  protected _pips: number;

  constructor(nPlayers: number, model: Model, view: View) {
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

  ai_turn = async (): Promise<void> => {
    if (this._model.currentPlayerIsAI) await this._ai();
  };

  _ai_think = async (): Promise<boolean> => {
    const player = await (this._model.currentPlayer as AI);
    await this._view.aiMove(player);
    const cast = await player.wantToCast();
    return cast;
  };

  _ai_cast = async (): Promise<void> => {
    const player = await (this._model.currentPlayer as AI);
    const pips = await this.castDie();
    const path = await player.computeDestination(pips);
    await this._view.aiCast(player);
    await this._makeMove(
      this._model.currentPlayer.tile,
      path[path.length - 1],
      path
    );
  };

  _ai_suggest = async (): Promise<void> => {
    const player = await (this._model.currentPlayer as AI);
    const sugg = await player.suggest();
    await this._view.aiSuggest(player, sugg);
    const holds = await this.makeSuggestion(sugg.suspect, sugg.weapon);

    if (holds !== null) await player.addSeenCard(holds.card);
  };

  _ai_accuse = async (): Promise<void> => {
    const player = await (this._model.currentPlayer as AI);
    const acc = await player.accuse();
    await this._view.aiAccuse(player, acc);
    await this.makeAccusation(acc.suspect, acc.weapon, acc.place);
  };

  _ai = async (): Promise<void> => {
    if (await this._ai_think()) {
      await this._ai_cast();
    }

    if (this._model.currentPlayer.isInPlace) {
      await this._ai_suggest();
    }

    if ((this._model.currentPlayer as AI).wantsToAccuse()) {
      await this._ai_accuse();
    }

    await this._view.aiFinishMove();
  };

  castDie = (): number => {
    this._isMove = true;
    this._pips = this._model.cast();
    const tiles = this._model.tilesInRangeOfCurrPlayer(this._pips);

    this._view.drawTiles(tiles, this._pips, this._model.currentPlayer.isAI);
    this._view.hideButtons();

    return this._pips;
  };

  move = async (row: number, col: number): Promise<void> => {
    if (!this._isMove) return;

    const oldTile = await this._model.getPlayerTile();
    const tile = await this._model.getTile(row, col);
    const path = await this._model.computePath(oldTile, tile);

    if (path.length > this._pips) {
      this._view.appendInfo("You cannot walk that far.");
    } else {
      await this._makeMove(oldTile, tile, path);
    }
  };

  _makeMove = async (
    oldTile: Tile,
    tile: Tile,
    path: Array<Tile>
  ): Promise<void> => {
    await this._view.makeMove(oldTile, tile, path);

    await this._model.putCurrPlayerSuspectPieceOn(tile);
    this._isMove = false;

    if (!this._model.currentPlayer.isAI) {
      this._view.showSuggestButton();
      this._view.showAccuseButton();
      this._view.showFinishButton();
    }
  };

  suggest = (): void => {
    this._view.hideButtons();
    this._view.showSuggestions(this._model.currentPlayerIsAI);
  };

  makeSuggestion = async (
    suspect: string,
    weapon: string
  ): Promise<{ player: string; card: Card }> => {
    const holds = await this._model.ask(suspect, weapon);

    for (const itemName of [suspect, weapon]) {
      const tiles = await this._model.moveToPlayerPlace(itemName);
      await this._view.updatePiece(tiles.oldTile, tiles.newTile);
    }

    await this._view.showHolds(holds, this._model.currentPlayerIsAI);
    if (!this._model.currentPlayerIsAI) {
      this._view.showAccuseButton();
      this._view.showFinishButton();
    }

    return holds;
  };

  accuse = (): void => {
    this._view.hideButtons();
    this._view.showAccusations(this._model.currentPlayerIsAI);
  };

  makeAccusation = async (
    suspect: string,
    weapon: string,
    place: string
  ): Promise<void> => {
    const isSolved = await this._model.isSolved(suspect, place, weapon);
    await this._view.makeAccusation(isSolved);

    if (!isSolved) {
      await this._model.removeCurrentPlayer();
      await this._view.removePlayerFromLegend();
    }

    if (!this._model.currentPlayerIsAI) {
      this._view.showFinishButton();
    }
    this._checkExit();
  };

  nextPlayer = async (): Promise<void> => {
    await this._model.nextPlayer();
    await this._view.nextPlayer();
    await this._log();
    await this.ai_turn();
  };

  _checkExit = (): void => {
    if (this._model.players.length === 0) {
      this._view.drawExit();
    }
  };

  _log = (): void => {
    for (let i = 0; i < this._model.players.length; i++)
      console.log(this._model.players[i].toString());
    console.log(this._model.murderCase());
  };
}
