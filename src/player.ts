"use strict";

import Suspect from "./model/board/suspect";
import Card from "./model/cards/card";
import Tile from "./model/board/tile";

export default class Player {
  protected _name: string;
  protected _next: Player;
  protected _prev: Player;
  protected _suspect: Suspect;
  protected _cards: Array<Card>;

  constructor(name: string, suspect: Suspect) {
    this._name = name;
    this._next = null;
    this._prev = null;
    this._suspect = suspect;
    this._cards = [];
  }

  get cards(): Array<Card> {
    return this._cards;
  }

  get isAI(): boolean {
    return false;
  }

  get isInPlace(): boolean {
    return this._suspect.tile.place.type === "place";
  }

  get name(): string {
    return this._suspect.name;
  }

  get next(): Player {
    return this._next;
  }

  get prev(): Player {
    return this._prev;
  }

  get suspect(): Suspect {
    return this._suspect;
  }

  get tile(): Tile {
    return this._suspect.tile;
  }

  set prev(prev) {
    this._prev = prev;
  }

  set next(next) {
    this._next = next;
  }

  addCard(card: Card): void {
    this._cards.push(card);
  }

  ask(murderer: string, place: string, weapon: string) {
    let player = this._next;
    while (player !== this) {
      for (let el of [murderer, place, weapon]) {
        let hold = player.holds(el);
        if (hold.length > 0) {
          return {
            player: player.suspect.name,
            card: hold[0],
          };
        }
      }
      player = player.next;
    }

    return null;
  }

  holds(item: string): Array<Card> {
    return this._cards.filter((i) => i.name === item);
  }

  toString(): string {
    const crds = this._cards.join("\n\t");
    return `[Player ${this.suspect.name} \n\t${crds}\n]`;
  }
}

