"use strict";

class View {
  constructor(model) {
    this._model = model;
    this._draw();
  }

  _draw() {
    const board = this._model.board;
    for (let i = 0; i < board.length; i++) {
      let holds = [];
      for (let j = 0; j < board[i].length; j++) {
        board[i][j].draw();
        if (board[i][j].occupied) holds.push(board[i][j].occupant);
      }
      for (let hold of holds)
        process.stdout.write(hold.toString());
      console.log();
    }
  }
}

module.exports = View;