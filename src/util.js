"use strict";
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array;
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
function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
function distinct(outer, inner) {
    return outer.filter((i) => !inner.includes(i));
}
export { randomElement, randomElements, shuffle, sleep, distinct, };
