define(function (require) {
  const controller = require('./controller.js');
  s = new controller.Simon();
  s.print();
});