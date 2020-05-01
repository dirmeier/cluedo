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
      "path": glb.bouleuterion.path
    },
    {
      "legend": "D",
      "place": glb.barrel.name,
      "type": "place",
      "path": glb.barrel.path
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
      "path": glb.library.path
    },
    {
      "legend": "P",
      "place": glb.parthenon.name,
      "type": "place",
      "path": glb.parthenon.path
    },
    {
      "legend": "S",
      "place": glb.tree.name,
      "type": "place",
      "path": glb.tree.path
    },
    {
      "legend": "T",
      "place": glb.theater.name,
      "type": "place",
      "path": glb.theater.path
    },
    {
      "legend": "U",
      "place": glb.temple.name,
      "type": "place",
      "path": glb.temple.path
    },
    {
      "legend": "_",
      "place": "_",
      "type": "other",
      "path": glb.socrates.path
    },
    {
      "legend": ".",
      "place": "_",
      "type": "path"
    }
  ];
});
