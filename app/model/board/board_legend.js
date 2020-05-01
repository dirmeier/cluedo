"use strict";

define(function (require) {
  const glb = require("global");

  return [
    {
      "legend": "A",
      "place": glb.agora.name,
      "type": "place",
      "path": "app/view/agora.jpeg"
    },
    {
      "legend": "B",
      "place": glb.bouleuterion.name,
      "type": "place",
      "path": "app/view/bouleuterion.jpeg"
    },
    {
      "legend": "D",
      "place": glb.barrel.name,
      "type": "place",
      "path": "app/view/barrel.jpeg"
    },
    {
      "legend": "H",
      "place": glb.hill.name,
      "type": "place",
      "path": glb.hill.path
    },
    {
      "legend": "L",
      "place": glb.library.name,
      "type": "place",
      "path": "app/view/library.jpeg"
    },
    {
      "legend": "P",
      "place": glb.parthenon.name,
      "type": "place",
      "path": "app/view/parthenon.jpeg"
    },
    {
      "legend": "S",
      "place": glb.tree.name,
      "type": "place",
      "path": "app/view/tree.jpeg"
    },
    {
      "legend": "T",
      "place": glb.theater.name,
      "type": "place",
      "path": "app/view/theater.jpeg"
    },
    {
      "legend": "U",
      "place": glb.temple.name,
      "type": "place",
      "path": "app/view/temple.jpeg"
    },
    {
      "legend": "_",
      "place": "_",
      "type": "other",
      "path": "app/view/socrates.jpeg"
    },
    {
      "legend": ".",
      "place": "_",
      "type": "path"
    }
  ];
});
