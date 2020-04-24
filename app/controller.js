const Model = require("./app/model.js");
const View = require("./app/view.js");

class Controller {
  constructor(nPlayers) {
    this.nPlayers = nPlayers;
    this.model = new Model(nPlayers);

    for (let i = 0; i < nPlayers; i++) {
      console.log(model.players()[i]);
    }
    console.log(model.murderCase());
  }
}