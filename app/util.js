"use strict";

const _ = require("lodash");

function randomElement(array) {
  return randomElements(array, 1);
}

function randomElements(array, cnt) {
  if (cnt > array.length)
    throw "array length < sample count";
  return _.sampleSize(array, cnt);
}

module.exports = {
  randomElement,
  randomElements
};