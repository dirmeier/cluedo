"use strict";

define(function () {

  function dijkstra(src, target, matrix) {
    let Q = [];
    const distances = {};
    const previous = {};

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        distances[matrix[i][j].hashCode()] = 10000;
        previous[matrix[i][j].hashCode()] = null;
        Q.push(matrix[i][j]);
      }
    }
    distances[src.hashCode()] = 0;

    while (Q.length) {
      const u = Q.reduce(function (i, j) {
        return distances[i.hashCode()] < distances[j.hashCode()] ? i : j;
      });
      Q = Q.filter(function (i) {return u.x !== i.x || i.y !== u.y;});

      if (u === target) {
        return {
          previous: previous,
          distance: distances
        };
      }

      for (let v of Object.values(u.neighbors)) {
        if (v !== null && !v.occupied && u.canReach(v)) {
          const alt = distances[u.hashCode()] + 1;
          if (alt < distances[v.hashCode()]) {
            distances[v.hashCode()] = alt;
            previous[v.hashCode()] = u;
          }
        }
      }
    }

    return {
      previous: previous,
      distance: distances
    };
  }

  function computeNeighbors(pips, src, matrix) {
    let neis = [];
    const distances = {};
    distances[src.hashCode()] = 0;
    const visited = {};

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        visited[matrix[i][j].hashCode()] = false;
      }
    }

    let stack = [src];
    while (stack.length) {
      let node = stack.shift();
      neis.push(node);
      for (let nei of Object.values(node.neighbors)) {
        if (nei !== null &&
            !nei.occupied &&
            !visited[nei.hashCode()] &&
            node.canReach(nei)) {
          distances[nei.hashCode()] = distances[node.hashCode()] + 1;
          visited[nei.hashCode()] = true;
          if (distances[nei.hashCode()] <= pips)
            stack.push(nei);
        }
      }
    }

    return neis;
  }

  return {
    computeNeighbors,
    dijkstra
  };
});



