"use strict";

function shuffle(array: Array<any>): Array<any> {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const x = array[i];
    array[i] = array[j];
    array[j] = x;
  }
  return array;
}

function randomElements(array: Array<any>, cnt: number): Array<any> {
  if (cnt > array.length) throw "array length < sample count";
  const shuffled = shuffle(array);
  return shuffled.slice(0, cnt);
}

function randomElement(array: Array<any>): any {
  return randomElements(array, 1)[0];
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function distinct(outer: Array<string>, inner: Array<string>): Array<string> {
  return outer.filter((i) => !inner.includes(i));
}

export { randomElement, randomElements, shuffle, sleep, distinct };
