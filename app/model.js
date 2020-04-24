"use strict";

const Person = require("./person.js");
const Weapon = require("./weapon.js");
const Room = require("./room.js");

const victim = new Person("Dr. Dirmeier", "black");

const suspects = [
  new Person("Miss Scarlett", "red"),
  new Person("Rev Green", "green"),
  new Person("Colonel Mustard", "yellow"),
  new Person("Professor Plum", "purple"),
  new Person("Mrs Peacock", "blue"),
  new Person("Mrs White", "white")
];

const weapons = [
  new Weapon("Candlestick"),
  new Weapon("Dagger"),
  new Weapon("Lead pip"),
  new Weapon("Revolver"),
  new Weapon("Rope"),
  new Weapon("Wrench")
];

const rooms = [
  new Room("Dinning Room"),
  new Room("Conservatory"),
  new Room("Kitchen"),
  new Room("Study"),
  new Room("Library"),
  new Room("Billiard Room"),
  new Room("Lounge"),
  new Room("Ballroom"),
  new Room("Hall"),
  new Room("Living Room"),
  new Room("Observatory"),
  new Room("Theater"),
  new Room("Guest House"),
  new Room("Patio"),
  new Room("Music Room")
];

function murder() {
  const murderer = suspects[
    Math.floor(Math.random() * suspects.length)
    ];
  const weapon = weapons[
    Math.floor(Math.random() * weapons.length)
    ];
  const room = rooms[
    Math.floor(Math.random() * rooms.length)
    ];

  return {
    victim: victim,
    murderer: murderer,
    weapon: weapon,
    room: room
  };
}

function print_murder(murder) {
  console.log(
    `${murder.victim.name} was killed by ${murder.murderer.name}` +
    ` with a ${murder.weapon.name.toLowerCase()}` +
    ` in the ${murder.room.name.toLowerCase()}.`
  );

}

module.exports = {
  murder,
  print_murder
};