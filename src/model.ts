"use strict";

import * as utl from "./util";
import Player from "./player";
import Board from "./model/board";
import Dice from "./model/dice";
import { Cards } from "./model/cards";
import AI from "./ai";
import Tile from "./model/board/tile";
import Card from "./model/cards/card";
import Suspect from "./model/cards/suspect";
import Place from "./model/cards/place";
import Weapon from "./model/cards/weapon";

export default class Model {
  protected _board: Board;
  protected _dice: Dice;
  protected _cards: Cards;

  protected _players: Array<Player>;
  protected _currentPlayer: Player;

  constructor(nPlayers: number, nAI: number) {
    this._board = new Board();
    this._dice = new Dice();
    this._cards = new Cards();
    this._players = this._initPlayers(nPlayers, nAI);
    this._currentPlayer = this._players[0];
    this._dealCards();
  }

  get currentPlayerIsAI(): boolean {
    return this._currentPlayer.isAI;
  }

  get dice(): Dice {
    return this._dice;
  }

  get cards(): Cards {
    return this._cards;
  }

  get board(): Board {
    return this._board;
  }

  get currentPlayer(): Player {
    return this._currentPlayer;
  }

  get players(): Array<Player> {
    return this._players;
  }

  get nPlayers(): number {
    return this._players.length;
  }

  _initPlayers(nPlayers: number, nAI: number): Array<Player> {
    const n = nPlayers + nAI;
    const players = [];
    const randomSuspects = utl.randomElements(this._board.suspects, n);
    const constructors = utl.shuffle([
      ...Array(nPlayers).fill(Player),
      ...Array(nAI).fill(AI)
    ]);

    for (let i = 0; i < n; i++) {
      players.push(
        new constructors[i](i, randomSuspects[i], this._board, this._cards)
      );
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

  _dealCards(): void {
    while (this._players.length) {
      for (let i = 0; i < this._players.length; i++) {
        if (this._cards.availableCards.length) {
          this._players[i].addCard(this._cards.randomAvailableCard());
        } else {
          return;
        }
      }
    }
  }

  ask(murderer: string, weapon: string): { player: string; card: Card } {
    return this._currentPlayer.ask(
      murderer,
      this._currentPlayer.tile.place.name,
      weapon
    );
  }

  cast(): number {
    return this._dice.cast();
  }

  computePath(oldTile: Tile, tile: Tile): Array<Tile> {
    return this._board.computePath(oldTile, tile);
  }

  getTile(row: number, col: number): Tile {
    const tile = this._board.adjacency[row][col];
    return tile;
  }

  getPlayerTile(): Tile {
    return this._currentPlayer.tile;
  }

  isSolved(murderer: string, place: string, weapon: string): boolean {
    const cs = this._cards.murderCase();
    return (
      cs.murderer.name === murderer &&
      cs.place.name === place &&
      cs.weapon.name === weapon
    );
  }

  moveToPlayerPlace(pieceName: string): { oldTile: Tile; newTile: Tile } {
    const piece = this._board.getPiece(pieceName);
    const oldTile = piece.tile;

    const newTile = this._board.putOnRandomTile(
      piece,
      this._currentPlayer.tile.place
    );

    return {
      oldTile: oldTile,
      newTile: newTile
    };
  }

  murderCase(): {
    victim: Suspect;
    murderer: Suspect;
    place: Place;
    weapon: Weapon;
  } {
    return this._cards.murderCase();
  }

  nextPlayer(): void {
    if (this.nPlayers === 0) return;
    this._currentPlayer = this._currentPlayer.next;
  }

  putCurrPlayerSuspectPieceOn(tile: Tile): void {
    this._currentPlayer.suspect.putOn(tile);
  }

  removeCurrentPlayer(): void {
    if (this._players.length === 0) {
      return;
    }

    const cards = this._currentPlayer.cards;
    this._cards.availableCards = cards;

    const ne = this._currentPlayer.next;
    const pre = this._currentPlayer.prev;
    pre.next = ne;
    ne.prev = pre;

    this._players = this._players.filter(
      (i) => i.name !== this._currentPlayer.name
    );

    this._dealCards();
  }

  tilesInRangeOfCurrPlayer(distance: number): Array<Tile> {
    const tile = this.currentPlayer.suspect.tile;
    return this._board.computeNeighbors(distance, tile);
  }
}
