"use strict";

import Tile from "./model/board/tile";

function dijkstra(
  src: Tile,
  target: Tile,
  matrix: Tile[][]
): { previous: Map<number, Tile >; distance: Map<number, number> } {
  let Q: Array<Tile> = [];
  const previous = new Map<number, Tile >();
  const distances = new Map<number, number>();

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      distances.set(matrix[i][j].hashCode(), 10000);
      previous.set(matrix[i][j].hashCode(), null);
      Q.push(matrix[i][j]);
    }
  }
  distances.set(src.hashCode(), 0);

  while (Q.length) {
    const u: Tile = Q.reduce(function (i, j) {
      return distances.get(i.hashCode()) < distances.get(j.hashCode()) ? i : j;
    });
    Q = Q.filter(function (i) {
      return u.x !== i.x || i.y !== u.y;
    });

    if (u === target) {
      return {
        previous: previous,
        distance: distances
      };
    }

    for (const v of u.neighbors.values()) {
      if (v !== null && !v.occupied && u.canReach(v)) {
        const alt = distances.get(u.hashCode()) + 1;

        if (alt < distances.get(v.hashCode())) {
          distances.set(v.hashCode(), alt);
          previous.set(v.hashCode(), u);
        }
      }
    }
  }

  return {
    previous: previous,
    distance: distances
  };
}

function computeNeighbors(
  pips: number,
  src: Tile,
  matrix: Tile[][]
): Array<Tile> {
  const neis: Array<Tile> = [];
  const distances = new Map<number, number>();
  const visited = new Map<number, boolean>();
  distances.set(src.hashCode(), 0);

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      visited.set(matrix[i][j].hashCode(), false);
    }
  }

  const stack = [src];
  while (stack.length) {
    const node = stack.shift();
    neis.push(node);
    for (const nei of node.neighbors.values()) {
      if (
        nei !== null &&
        !nei.occupied &&
        !visited.get(nei.hashCode()) &&
        node.canReach(nei)
      ) {
        distances.set(nei.hashCode(), distances.get(node.hashCode()) + 1);
        visited.set(nei.hashCode(), true);
        if (distances.get(nei.hashCode()) <= pips) stack.push(nei);
      }
    }
  }

  return neis;
}

export { computeNeighbors, dijkstra };
