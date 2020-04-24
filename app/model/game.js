"use strict";

const Person = require("./person.js");
const Weapon = require("./weapon.js");
const Room = require("./room.js");
const util = require("../util");

const victim = new Person("Socrates", "black");

const suspects = [
  new Person("Plato", "red"),
  new Person("Critias", "green"),
  new Person("Alcibiades", "yellow"),
  new Person("Heraclitus", "purple"),
  new Person("Charmides", "blue"),
  new Person("Lysander", "white")
];

const weapons = [
  new Weapon("Cup of poison"),
  new Weapon("Dagger"),
  new Weapon("Treachery"),
  new Weapon("Sickle"),
  new Weapon("Rope"),
  new Weapon("Bow")
];

const rooms = [
  new Room("Agora"),
  new Room("Altar"),
  new Room("Diogenes' barrel"),
  new Room("Hill of the Muses"),
  new Room("Library"),
  new Room("Panthenon"),
  new Room("Sitting rock under a tree"),
  new Room("Theater"),
  new Room("Temple")
];

class Game {
  constructor(nPlayers) {
    this._murderer = util.randomElement(suspects);
    this._weapon = util.randomElement(weapons);
    this._room = util.randomElement(rooms);
    this._victim = victim;
    this._availableCards = [
      ...this._availableWeapons(),
      ...this._availableSuspects(),
      ...this._availableRooms()
    ];
  }

  murderCase() {
    return {
      victim: this._victim,
      murderer: this._murderer,
      weapon: this._weapon,
      room: this._room
    };
  }

  availableCards() {
    return this._availableCards;
  }

  randomAvailableCard() {
    const card = util.randomElement(this._availableCards);
    this._availableCards =
      this._availableCards.filter((i) => i.name !== card.name);
    return card;
  }

  _availableSuspects() {
    return suspects.filter((i) => i.name !== this._murderer.name);
  }

  _availableWeapons() {
    return weapons.filter((i) => i.name !== this._weapon.name);
  }

  _availableRooms() {
    return rooms.filter((i) => i.name !== this._room.name);
  }

  print() {
    const murder = this.murderCase();
    console.log(
      `${murder.victim.name} was killed by ${murder.murderer.name}` +
      ` with a ${murder.weapon.name.toLowerCase()}` +
      ` in the ${murder.room.name.toLowerCase()}.`
    );
  }
}

module.exports = Game;
