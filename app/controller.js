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
      this._view.bindShowCards(this.showCards);
      this._view.bindCast(this.castDie);
      this._view.bindMove(this.move);
      this._view.bindSuggest(this.suggest);
      this._view.bindMakeSuggestion(this.makeSuggestion);

      this._isMove = false;
      this._run();
    }

    showCards = () => {
      this._view.showCards();
    };

    castDie = () => {
      this._isMove = true;
      const pips = this._model.castDie();
      this._view.printCastMessage(pips);
      const tiles = this._model.computeNeighbors(pips);
      this._view.drawTiles(tiles);
      this._view.hideButtons();
    };

    move = (row, col) => {
      if (!this._isMove)
        return;
      const oldTile = this._model.currentPlayer.tile;
      const tile = this._adj[row][col];
      const path = this._model.computePath(oldTile, tile);

      this._view.makeMove(tile, this._model.currentPlayer, oldTile, path);
      this._model.currentPlayer.updatePosition(tile);
      this._isMove = false;
    };

    suggest = () => {
      this._view.hideButtons();
      this._view.showSuggestions();
    };

    makeSuggestion = (suspect, weapon) => {
      let holds = this._model.ask(
        suspect, this._model.currentPlayer.tile.place.name, weapon);
      this._view.showHolds(holds);
    };

    _printSetup = () => {
      for (let i = 0; i < this._model.players.length; i++)
        console.log(this._model.players[i].toString());
      console.log(this._model.murderCase());
    };

    _checkExit = () => {
      if (this._model.players.length === 0) {
        this._view.drawExit();
      }
    };

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

