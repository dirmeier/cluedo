"use strict";

define(function(require) {
  const utl = require("util");

  const Suspect = require("model/cards/suspect");
  const Weapon = require("model/cards/weapon");
  const Place = require("model/cards/place");

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
      this._murderer = utl.randomElement(suspects);
      this._weapon = utl.randomElement(weapons);
      this._place = utl.randomElement(places);
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
      const card = utl.randomElement(this._availableCards);
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

  return Cards;

});

