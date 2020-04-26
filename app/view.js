"use strict";

define(function () {
  class View {
    constructor(model) {
      this._width = 650;
      this._height = 650;
      this._app = this._getElement('#app');
      this._model = model;
      this._board = this._model.board;
      this._initBoard();
    }

    _getElement(selector) {
      return document.querySelector(selector);
    }

    _createElement(tag) {
      const svgns = "http://www.w3.org/2000/svg";
      return document.createElementNS(svgns, tag);
    }

    _svg() {
      const svg = this._createElement("svg");
      this._app.appendChild(svg);
      svg.setAttribute("width", this._width - 5);
      svg.setAttribute("height", 10);
      return svg;
    }

    _rect(row) {
      const rect = this._createElement("rect");
      rect.setAttribute("width", (this._width - 5) / this._board[row].length);
      rect.setAttribute("height", 20);
      rect.setAttribute("x", ((this._width - 15) / this._board[row].length) * row);
      return rect;
    }

    _initBoard() {
      const board = this._model.board;
      for (let i = 0; i < board.length; i++) {
        const svg = this._svg();
        for (let j = 0; j < board[i].length; j++) {
          const tile = board[i][j].draw();
          const rect = this._rect(i);
          svg.append(rect);
        }
      }

      // const rect2 = this._createElement("rect");
      // rect2.setAttributeNS(null, 'x', '50');
      // rect2.setAttributeNS(null, 'height', '50');
      // rect2.setAttributeNS(null, 'width', '50');

      // attach it to the container
      // svg.appendChild(rect);
      // svg.appendChild(rect2);

    }

    _draw() {
      const board = this._model.board;
      for (let i = 0; i < board.length; i++) {
        let draws = "";
        let holds = "";
        for (let j = 0; j < board[i].length; j++) {
          draws += board[i][j].draw();
          if (board[i][j].occupied)
            holds += board[i][j].occupant;
        }
        console.log(draws + "\t" + holds);
      }
    }
  }

  return View;
});
