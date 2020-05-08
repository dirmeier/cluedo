"use strict";
import * as utl from "./util";
import Player from "./player";
import Board from "./model/board";
import Dice from "./model/dice";
import { Cards } from "./model/cards";
import AI from "./ai";
export default class Model {
    constructor(nPlayers, nAI) {
        this._board = new Board();
        this._dice = new Dice();
        this._cards = new Cards();
        this._players = this._initPlayers(nPlayers, nAI);
        this._currentPlayer = this._players[0];
        this._dealCards();
    }
    get currentPlayerIsAI() {
        return this._currentPlayer.isAI;
    }
    get dice() {
        return this._dice;
    }
    get cards() {
        return this._cards;
    }
    get board() {
        return this._board;
    }
    get currentPlayer() {
        return this._currentPlayer;
    }
    get players() {
        return this._players;
    }
    get nPlayers() {
        return this._players.length;
    }
    _initPlayers(nPlayers, nAI) {
        const n = nPlayers + nAI;
        let players = [];
        const randomSuspects = utl.randomElements(this._board.suspects, n);
        let constructors = utl.shuffle([
            ...Array(nPlayers).fill(Player),
            ...Array(nAI).fill(AI),
        ]);
        for (let i = 0; i < n; i++) {
            players.push(new constructors[i](i, randomSuspects[i], this._board, this._cards));
            if (i > 0) {
                players[i - 1].next = players[i];
                players[i].prev = players[i - 1];
            }
            if (i === n - 1) {
                players[i].next = players[0];
                players[0].prev = players[i];
            }
        }
        return players;
    }
    _dealCards() {
        while (this._players.length) {
            for (let i = 0; i < this._players.length; i++) {
                if (this._cards.availableCards.length) {
                    this._players[i].addCard(this._cards.randomAvailableCard());
                }
                else {
                    return;
                }
            }
        }
    }
    ask(murderer, weapon) {
        return this._currentPlayer.ask(murderer, this._currentPlayer.tile.place.name, weapon);
    }
    cast() {
        return this._dice.cast();
    }
    computePath(oldTile, tile) {
        return this._board.computePath(oldTile, tile);
    }
    getTile(row, col) {
        const tile = this._board.adjacency[row][col];
        return tile;
    }
    getPlayerTile() {
        return this._currentPlayer.tile;
    }
    isSolved(murderer, place, weapon) {
        const cs = this._cards.murderCase();
        return (cs.murderer.name === murderer &&
            cs.place.name === place &&
            cs.weapon.name === weapon);
    }
    moveToPlayerPlace(pieceName) {
        const piece = this._board.getPiece(pieceName);
        const oldTile = piece.tile;
        const newTile = this._board.putOnRandomTile(piece, this._currentPlayer.tile.place);
        return {
            oldTile: oldTile,
            newTile: newTile,
        };
    }
    murderCase() {
        return this._cards.murderCase();
    }
    nextPlayer() {
        if (this.nPlayers === 0)
            return;
        this._currentPlayer = this._currentPlayer.next;
    }
    putCurrPlayerSuspectPieceOn(tile) {
        this._currentPlayer.suspect.putOn(tile);
    }
    removeCurrentPlayer() {
        if (this._players.length === 0) {
            return;
        }
        const cards = this._currentPlayer.cards;
        this._cards.availableCards = cards;
        const ne = this._currentPlayer.next;
        const pre = this._currentPlayer.prev;
        pre.next = ne;
        ne.prev = pre;
        this._players = this._players.filter((i) => i.name !== this._currentPlayer.name);
        this._dealCards();
    }
    tilesInRangeOfCurrPlayer(distance) {
        const tile = this.currentPlayer.suspect.tile;
        return this._board.computeNeighbors(distance, tile);
    }
}
