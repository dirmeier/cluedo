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

  _who() {
    return {
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
    };
  }

  _where() {
    return {
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
    };
  }

  _what() {
    return {
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
    };
  }

  _suggestion() {
    return [this._who(), this._what()];
  }

  _accusation() {
    return [this._who(), this._where(), this._what()];
  }

  _checkExit() {
    if (this._model.players.length === 0) {
      console.log("You all lost. Great job.");
      process.exit(0);
    }
  }

  _solve(answers) {
    const isSolved = this._model.solve(
      answers.murderer[0], answers.place[0], answers.weapon[0]
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
  }

  _makeSuggestion(answers) {
    let holds = this._model.ask(
      answers.murderer[0],
      this._model.currentPlayer.position,
      answers.weapon[0]);
    console.log(holds);
    this._model.nextPlayer();
    this._run();
  }

  _askToSolve() {
    inquirer.prompt({
      type: 'confirm',
      name: 'solve',
      message: 'Do you want to solve?',
      default: false
    }).then(answers => {
      if (answers.solve) {
        inquirer.prompt(this._accusation()).then(answers => {
          this._solve(answers);
        });
      }
    });
  }

  _run() {
    this._checkExit();
    this._printSetup();
    console.log(`\nPlayer ${this._model.currentPlayer.name}'s turn`);

    inquirer.prompt({
      type: 'confirm',
      name: 'cast',
      message: 'Do you want to cast the dies or stay in the room?',
      default: false
    }).then(answers => {
      if (answers.cast) {

      }
      if (this._model.currentPlayer.position.type === "place") {
        inquirer.prompt(this._suggestion()).then(answers => {
          this._makeSuggestion(answers);
        });
      }
      this._askToSolve();
    });
  }
}

module.exports = Controller;