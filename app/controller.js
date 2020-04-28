"use strict";

define(function () {
  class Controller {
    constructor(nPlayers, model, view) {
      if (typeof nPlayers === "undefined" || nPlayers < 2)
        throw "Please provide nPlayers";

      this._model = model;
      this._board = this._model.board;
      this._adj = this._board.adjacency;

      this._view = view;
      this._view.controller = this;
      this._view.bindCast(this.castDie);
      this._view.bindStay(this.stay);
      this._view.bindMove(this.move);

      this._run();
    }

    castDie = () => {
      const pips = this._model.castDie();
      this._view.hasCast(pips);
      const tiles = this._model.computePaths(pips);
      this._view.drawTiles(tiles);
    };

    stay = () => {
      console.log("asdasd");
    };

    move = (row, col) => {
      const tile = this._adj[row][col];
      const oldTile = this._model.currentPlayer.tile;
      this._view.makeMove(tile, this._model.currentPlayer, oldTile);
      this._model.currentPlayer.updatePosition(tile);
    };

    _printSetup = () => {
      for (let i = 0; i < this._model.players.length; i++)
        console.log(this._model.players[i].toString());
      console.log(this._model.murderCase());
    };

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
        this._view.drawExit();
      }
    }

    // _solve(answers) {
    //   const isSolved = this._model.solve(
    //     answers.murderer[0], answers.place[0], answers.weapon[0]
    //   );
    //   if (isSolved) {
    //     console.log("Congrats! You won!");
    //     process.exit(0);
    //   } else {
    //     console.log("Boo! You are out!");
    //     this._model.removeCurrentPlayer();
    //     this._model.nextPlayer();
    //     this._run();
    //   }
    // }
    //
    // _makeSuggestion(answers) {
    //   let holds = this._model.ask(
    //     answers.murderer[0],
    //     this._model.currentPlayer.position,
    //     answers.weapon[0]);
    //   console.log(holds);
    //   this._model.nextPlayer();
    //   this._run();
    // }
    //
    // _askToSolve() {
    //   inquirer.prompt({
    //     type: 'confirm',
    //     name: 'solve',
    //     message: 'Do you want to solve?',
    //     default: false
    //   }).then(answers => {
    //     if (answers.solve) {
    //       inquirer.prompt(this._accusation()).then(answers => {
    //         this._solve(answers);
    //       });
    //     }
    //   });
    // }

    _run = () => {
      this._checkExit();
      this._printSetup();
      this._view.printPlayer();
      //   inquirer.prompt({
      //     type: 'confirm',
      //     name: 'cast',
      //     message: 'Do you want to cast the dies or stay in the room?',
      //     default: false
      //   }).then(answers => {
      //     if (answers.cast) {
      //
      //     }
      //     if (this._model.currentPlayer.position.type === "place") {
      //       inquirer.prompt(this._suggestion()).then(answers => {
      //         this._makeSuggestion(answers);
      //       });
      //     }
      //     this._askToSolve();
      //   });
    }
  }

  return Controller;
});

