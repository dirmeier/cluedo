"use strict";

const inquirer = require('inquirer');
const Model = require("./model.js");
const View = require("./view.js");

class Controller {
  constructor(nPlayers) {
    if (typeof nPlayers === "undefined" || nPlayers < 2)
      throw "Please provide nPlayers";
    this._model = new Model(nPlayers);
    this._run();
  }

  _printSetup() {
    for (let i = 0; i < this._model.players.length; i++)
      console.log(this._model.players[i].toString());
    console.log(this._model.murderCase());
  }

  _questions() {
    return [
      {
        type: 'checkbox',
        name: 'murderer',
        message: "Whodunnit?",
        choices: this._model.suspects(),
        validate: function (answer) {
          if (answer.length !== 1) {
            return 'You must choose exactly one suspect.';
          }
          return true;
        }
      },
      {
        type: 'checkbox',
        name: 'place',
        message: "Wheredunnit?",
        choices: this._model.places(),
        validate: function (answer) {
          if (answer.length !== 1) {
            return 'You must choose exactly one place.';
          }
          return true;
        }
      },
      {
        type: 'checkbox',
        name: 'weapon',
        message: "Withwhatdunnit?",
        choices: this._model.weapons(),
        validate: function (answer) {
          if (answer.length !== 1) {
            return 'You must choose exactly one weapon.';
          }
          return true;
        }
      }
    ];
  }

  _askCase() {
  }

  _run() {
    if (this._model.players.length === 0) {
      console.log("You all lost. Great job.");
      process.exit(0);
    }
    this._printSetup();
    console.log(`\nPlayer ${this._model.currentPlayer.name}'s turn`);
    inquirer.prompt({
      type: 'confirm',
      name: 'solve',
      message: 'Do you want to solve?',
      default: false
    }).then(answers => {
      if (answers.solve) {
        inquirer.prompt(this._questions()).then(answers => {
          const isSolved = this._model.solve(
            answers.murderer, answers.place, answers.weapon
          );
          if (isSolved) {
            console.log("Congrats! You won!");
            process.exit(0);
          } else {
            console.log("Boo! You are out!");
            this._model.removeCurrentPlayer();
            this._model.nextPlayer();
            this._run();
          }
        });
      } else {
        inquirer.prompt(this._questions()).then(answers => {
          this._model.nextPlayer();
          let holds = this._model.ask(
            answers.murderer, answers.room, answers.weapon);
          console.log(holds);
          this._model.nextPlayer();
          this._run();
        });
      }
    });
  }
}

module.exports = Controller;