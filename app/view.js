"use strict";

define(function () {
  class View {
    constructor(model) {
      this._app = this._getElement('#app');
      this._model = model;
      this._initBoard();
    }

    _getElement(selector) {
      return document.querySelector(selector);
    }

    _createElement(tag) {
      var svgns = "http://www.w3.org/2000/svg";
      return document.createElementNS(svgns, tag);
    }

    _initBoard() {

      // create the svg element
      const svg1 = this._createElement("svg");


      // set width and height
      svg1.setAttribute("width", "100");
      svg1.setAttribute("height", "100");

      // create a circle
      const rect = this._createElement("rect");
      rect.setAttributeNS(null, 'height', '50');
      rect.setAttributeNS(null, 'width', '50');
      rect.setAttributeNS(null, 'fill', 'red');
    //<rect x="50" y="50" width="50" height="50" fill="black" />

      const rect2 = this._createElement("rect");
      rect2.setAttributeNS(null, 'x', '50');
      rect2.setAttributeNS(null, 'height', '50');
      rect2.setAttributeNS(null, 'width', '50');
      rect2.setAttributeNS(null, 'fill', 'red');

      // attach it to the container
      svg1.appendChild(rect);
      svg1.appendChild(rect2);

      // attach container to document
      this._app.appendChild(svg1);

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
