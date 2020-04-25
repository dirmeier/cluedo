"use strict";

const util = require("../util");
const Suspect = require("./cards/suspect.js");
const Weapon = require("./cards/weapon.js");
const Place = require("./cards/place.js");

const victim = new Suspect("Socrates");

const suspects = [
  new Suspect("Plato"),
  new Suspect("Critias"),
  new Suspect("Alcibiades"),
  new Suspect("Heraclitus"),
  new Suspect("Charmides"),
  new Suspect("Lysander")
].sort();

const weapons = [
  new Weapon("Cup of poison"),
  new Weapon("Dagger"),
  new Weapon("Treachery"),
  new Weapon("Sickle"),
  new Weapon("Rope"),
  new Weapon("Bow")
].sort();

const places = [
  new Place("Agora"),
  new Place("Altar"),
  new Place("Diogenes' barrel"),
  new Place("Hill of the Muses"),
  new Place("Library"),
  new Place("Panthenon"),
  new Place("Sitting rock under a tree"),
  new Place("Theater"),
  new Place("Temple")
].sort();

class Cards {
  constructor() {
    this._murderer = util.randomElement(suspects);
    this._weapon = util.randomElement(weapons);
    this._place = util.randomElement(places);
    this._victim = victim;

    this._availableCards = [
      ...this._availableWeapons(),
      ...this._availableSuspects(),
      ...this._availablePlaces()
    ];
  }

  murderCase() {
    return {
      victim: this._victim,
      murderer: this._murderer,
      place: this._place,
      weapon: this._weapon
    };
  }

  suspects() {
    return suspects;
  }

  weapons() {
    return weapons;
  }

  places() {
    return places;
  }

  randomAvailableCard() {
    const card = util.randomElement(this._availableCards);
    this._availableCards =
      this._availableCards.filter((i) => i.name !== card.name);
    return card;
  }

  get availableCards() {
    return this._availableCards;
  }

  set availableCards(cards) {
    this._availableCards = cards;
  }

  _availableSuspects() {
    return suspects.filter((i) => i.name !== this._murderer.name);
  }

  _availableWeapons() {
    return weapons.filter((i) => i.name !== this._weapon.name);
  }

  _availablePlaces() {
    return places.filter((i) => i.name !== this._place.name);
  }
}

module.exports = Cards;