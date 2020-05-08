"use strict";

export default class Card {
  protected _name: string;
  protected _path: string | null;

  constructor(name: string, path: string | null) {
    this._name = name;
    this._path = path;
  }

  get name(): string {
    return this._name;
  }

  get path(): string | null {
    return this._path;
  }

  toString = (): string => {
    return `[Card ${this._name}]`;
  };
}
