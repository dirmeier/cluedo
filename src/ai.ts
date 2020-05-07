"use strict";

import * as utl from "./util";
import {Cards} from "./model/cards";
import Tile from "./model/board/tile";
import Player from "./player";
import Board from "./model/board";
import Suspect from "./model/board/suspect";
import Card from "./model/cards/card";
import Place from "./model/board/place";

export default class AI extends Player {
  protected _board: Board;
  protected _allWeapons: Array<string>;
  protected _allSuspects: Array<string>;
  protected _allPlaces: Array<string>;

  protected _hasSeenPlaces: Array<string>;
  protected _hasSeenWeapons: Array<string>;
  protected _hasSeenSuspects: Array<string>;

  protected _target: Place;

  constructor(name: string, suspect: Suspect, board: Board, cards: Cards) {
    super(name, suspect);
    this._board = board;
    this._allWeapons = cards.weapons.map((i) => i.name);
    this._allSuspects = cards.suspects.map((i) => i.name);
    this._allPlaces = cards.places.map((i) => i.name);

    this._hasSeenPlaces = [];
    this._hasSeenWeapons = [];
    this._hasSeenSuspects = [];

    this._target = null;
  }

  get isAI() {
    return true;
  }

  get name() {
    return super.name + " (AI)";
  }

  get target() {
    return this._target;
  }

  addCard(card: Card) {
    super.addCard(card);
    this.addSeenCard(card);
  }

  addSeenCard(card: Card) {
    const cons = card.constructor.name;
    if (cons === "Suspect")
      this._hasSeenSuspects.push(card.name);
    else if (cons === "Weapon")
      this._hasSeenWeapons.push(card.name);
    else this._hasSeenPlaces.push(card.name);
  }

  wantToCast(): boolean {
    if (!this.isInPlace) return true;
    const hasSeenRoom = this._hasSeenPlaces.includes(
      this.suspect.tile.place.name
    );
    if (!hasSeenRoom) return Math.random() < 0.25;
    return Math.random() < 0.5;
  }

  computeDestination(pips: number): Array<Tile> {
    if (this._target === null) {
      const hasNotSeenPlaces = utl.distinct(
        this._allPlaces,
        this._hasSeenPlaces
      );
      const randomPlaceString = utl.randomElement(hasNotSeenPlaces);
      const randomPlace = Object.values(this._board.places).filter(
        (i) => i.name === randomPlaceString
      );
      this._target = randomPlace[0];
    }

    // here we should implement the closest free tile not just any tile
    const targetTile = this._board.getFreeTile(this._target);
    const entirePath = this._board.computePath(this.tile, targetTile);

    const moveablePath = entirePath.slice(0, pips);
    return moveablePath;
  }

  suggest() {
    const weaps = utl.randomElement(
      utl.distinct(this._allWeapons, this._hasSeenWeapons)
    );
    const susps = utl.randomElement(
      utl.distinct(this._allSuspects, this._hasSeenSuspects)
    );

    return {
      weapon: weaps,
      suspect: susps,
    };
  }

  wantsToAccuse(): boolean {
    const can =
      this._hasSeenPlaces.length + 1 === this._allPlaces.length &&
      this._hasSeenWeapons.length + 1 === this._allWeapons.length &&
      this._hasSeenSuspects.length + 1 === this._allSuspects.length;
    return can;
  }

  accuse() {
    const weapon = utl.distinct(this._allWeapons, this._hasSeenWeapons);
    const suspect = utl.distinct(this._allSuspects, this._hasSeenSuspects);
    const place = utl.distinct(this._allPlaces, this._hasSeenPlaces);

    return {
      weapon: weapon[0],
      suspect: suspect[0],
      place: place[0],
    };
  }

  toString(): string {
    const crds = this._cards.join("\n\t");
    const seenCrds = [
      ...this._hasSeenWeapons,
      ...this._hasSeenSuspects,
      ...this._hasSeenPlaces,
    ].sort()
      .join(", ");

    return `[AI ${this.suspect.name} \n\t${crds}\n\t[Seen ${seenCrds}]\n]`;
  }
}

