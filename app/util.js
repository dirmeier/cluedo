"use strict";

define(function (require) {
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  function randomElements(array, cnt) {
    if (cnt > array.length)
      throw "array length < sample count";
    const shuffled = shuffle(array);
    return shuffled.slice(0, cnt);
  }

  function randomElement(array) {
    return randomElements(array, 1)[0];
  }

  return {
    randomElement,
    randomElements,
    shuffle
  };
});
