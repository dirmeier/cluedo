"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class Controller {
    constructor(nPlayers, model, view) {
        this.ai_turn = () => __awaiter(this, void 0, void 0, function* () {
            if (this._model.currentPlayerIsAI)
                yield this._ai();
        });
        this._ai_think = () => __awaiter(this, void 0, void 0, function* () {
            const player = yield this._model.currentPlayer;
            yield this._view.aiMove(player);
            const cast = yield player.wantToCast();
            return cast;
        });
        this._ai_cast = () => __awaiter(this, void 0, void 0, function* () {
            const player = yield this._model.currentPlayer;
            const pips = yield this.castDie();
            const path = yield player.computeDestination(pips);
            yield this._view.aiCast(player);
            yield this._makeMove(this._model.currentPlayer.tile, path[path.length - 1], path);
        });
        this._ai_suggest = () => __awaiter(this, void 0, void 0, function* () {
            const player = yield this._model.currentPlayer;
            const sugg = yield player.suggest();
            yield this._view.aiSuggest(player, sugg);
            const holds = yield this.makeSuggestion(sugg.suspect, sugg.weapon);
            if (holds !== null)
                yield player.addSeenCard(holds.card);
        });
        this._ai_accuse = () => __awaiter(this, void 0, void 0, function* () {
            const player = yield this._model.currentPlayer;
            const acc = yield player.accuse();
            yield this._view.aiAccuse(player, acc);
            yield this.makeAccusation(acc.suspect, acc.weapon, acc.place);
        });
        this._ai = () => __awaiter(this, void 0, void 0, function* () {
            if (yield this._ai_think()) {
                yield this._ai_cast();
            }
            if (this._model.currentPlayer.isInPlace) {
                yield this._ai_suggest();
            }
            if (this._model.currentPlayer.wantsToAccuse()) {
                yield this._ai_accuse();
            }
            yield this._view.aiFinishMove();
        });
        this.castDie = () => {
            this._isMove = true;
            this._pips = this._model.cast();
            const tiles = this._model.tilesInRangeOfCurrPlayer(this._pips);
            this._view.drawTiles(tiles, this._pips, this._model.currentPlayer.isAI);
            this._view.hideButtons();
            return this._pips;
        };
        this.move = (row, col) => __awaiter(this, void 0, void 0, function* () {
            if (!this._isMove)
                return;
            const oldTile = yield this._model.getPlayerTile();
            const tile = yield this._model.getTile(row, col);
            const path = yield this._model.computePath(oldTile, tile);
            if (path.length > this._pips) {
                this._view.appendInfo("You cannot walk that far.");
            }
            else {
                yield this._makeMove(oldTile, tile, path);
            }
        });
        this._makeMove = (oldTile, tile, path) => __awaiter(this, void 0, void 0, function* () {
            yield this._view.makeMove(oldTile, tile, path);
            yield this._model.putCurrPlayerSuspectPieceOn(tile);
            this._isMove = false;
            if (!this._model.currentPlayer.isAI) {
                this._view.showSuggestButton();
                this._view.showAccuseButton();
                this._view.showFinishButton();
            }
        });
        this.suggest = () => {
            this._view.hideButtons();
            this._view.showSuggestions(this._model.currentPlayerIsAI);
        };
        this.makeSuggestion = (suspect, weapon) => __awaiter(this, void 0, void 0, function* () {
            let holds = yield this._model.ask(suspect, weapon);
            for (let itemName of [suspect, weapon]) {
                const tiles = yield this._model.moveToPlayerPlace(itemName);
                yield this._view.updatePiece(tiles.oldTile, tiles.newTile);
            }
            yield this._view.showHolds(holds, this._model.currentPlayerIsAI);
            if (!this._model.currentPlayerIsAI) {
                this._view.showAccuseButton();
                this._view.showFinishButton();
            }
            return holds;
        });
        this.accuse = () => {
            this._view.hideButtons();
            this._view.showAccusations(this._model.currentPlayerIsAI);
        };
        this.makeAccusation = (suspect, weapon, place) => __awaiter(this, void 0, void 0, function* () {
            let isSolved = yield this._model.isSolved(suspect, place, weapon);
            yield this._view.makeAccusation(isSolved);
            if (!isSolved) {
                yield this._model.removeCurrentPlayer();
                yield this._view.removePlayerFromLegend();
            }
            if (!this._model.currentPlayerIsAI) {
                this._view.showFinishButton();
            }
            this._checkExit();
        });
        this.nextPlayer = () => __awaiter(this, void 0, void 0, function* () {
            yield this._model.nextPlayer();
            yield this._view.nextPlayer();
            yield this._log();
            yield this.ai_turn();
        });
        this._checkExit = () => {
            if (this._model.players.length === 0) {
                this._view.drawExit();
            }
        };
        this._log = () => {
            for (let i = 0; i < this._model.players.length; i++)
                console.log(this._model.players[i].toString());
            console.log(this._model.murderCase());
        };
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
}
