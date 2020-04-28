define(function (require) {
  const Model = require("model");
  const View = require("view");
  const Controller = require('controller');

  const nPlayers = 4;
  const model = new Model(nPlayers);
  const view = new View(model);

  new Controller(nPlayers, model, view);
});