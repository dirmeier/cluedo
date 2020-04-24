"use strict";

const inquirer = require('inquirer');
const Model = require("./model.js");
const View = require("./view.js");

class Controller {
  constructor(nPlayers) {
    if (typeof nPlayers === "undefined" || nPlayers < 2)
      throw "Please provide nPlayers";
    this._nPlayers = nPlayers;
    this._model = new Model(nPlayers);
    this._printSetup();
    this._run();
  }

  _printSetup() {
    for (let i = 0; i < this._nPlayers; i++)
      console.log(this._model.players()[i]);
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
        name: 'room',
        message: "Wheredunnit?",
        choices: this._model.rooms(),
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
            return 'You must choose exactly one weapons.';
          }
          return true;
        }
      }
    ];
  }

  _askCase() {

  }

  _run() {
    inquirer.prompt({
      type: 'confirm',
      name: 'solve',
      message: 'Do you want to solve?',
      default: false
    }).then(answers => {
      if (answers.solve) {
        inquirer.prompt(this._questions()).then(answers => {
          console.log(answers);
          const isSolved = this._model.solve(
            answers.murderer, answers.room, answers.weapon
          );
          if (isSolved) {
            console.log("Congrats! You won!");
            process.exit(0);
          } else {
            console.log("Boo! You are out!");
            process.exit(1);
          }
        });
      } else {
        inquirer.prompt(this._questions()).then(answers => {
          console.log(answers);
          let holds = this._model.ask(
            answers.murderer, answers.room, answers.weapon);
          console.log(holds);
          this._run();
        });
      }
    });
  }
}

new Controller(5);

module.exports = Controller;