"use strict";
import * as utl from "../util";
import * as alg from "../algorithm";
import glb from "../global";
import legend from "./board/board_legend";
import board from "./board/board";
import Suspect from "./board/suspect";
import Weapon from "./board/weapon";
import Tile from "./board/tile";
import Place from "./board/place";
const suspects = [
    new Suspect(glb.alcibiades.name, glb.alcibiades.path),
    new Suspect(glb.charmides.name, glb.charmides.path),
    new Suspect(glb.critias.name, glb.critias.path),
    new Suspect(glb.heraclitus.name, glb.heraclitus.path),
    new Suspect(glb.lysander.name, glb.lysander.path),
    new Suspect(glb.plato.name, glb.plato.path),
];
const weapons = [
    new Weapon(glb.bow.name, glb.bow.path),
    new Weapon(glb.dagger.name, glb.dagger.path),
    new Weapon(glb.poison.name, glb.poison.path),
    new Weapon(glb.rope.name, glb.rope.path),
    new Weapon(glb.sickle.name, glb.sickle.path),
    new Weapon(glb.treachery.name, glb.treachery.path),
];
export default class Board {
    constructor() {
        this._weapons = Array.from(weapons);
        this._suspects = Array.from(suspects);
        this._places = this._initPlaces();
        this._adjacenyMatrix = this._initBoard();
        this._distributeSuspectsToRooms();
        this._distributeWeaponsToRooms();
    }
    get adjacency() {
        return this._adjacenyMatrix;
    }
    get pieces() {
        return this._suspects.concat(this._weapons);
    }
    get suspects() {
        return this._suspects;
    }
    get weapons() {
        return this._weapons;
    }
    get places() {
        return this._places;
    }
    _initPlaces() {
        let places = new Map();
        for (let leg of legend) {
            const pl = new Place(leg.place, leg.legend, leg.type, leg.path);
            places.set(leg.legend, pl);
        }
        return places;
    }
    _initBoard() {
        let adj = [];
        for (let i = 0; i < board.length; i++) {
            adj[i] = [];
            for (let j = 0; j < board[i].length; j++) {
                const el = board[i][j].split("");
                const place = this._places.get(el[0]);
                adj[i][j] = new Tile(el[0], place, i, j, el[1] || null);
                if (place)
                    place.add(adj[i][j]);
            }
        }
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (i > 0)
                    adj[i][j].neighbors.set("up", adj[i - 1][j] || null);
                if (i < board.length - 1)
                    adj[i][j].neighbors.set("down", adj[i + 1][j] || null);
                if (j > 0)
                    adj[i][j].neighbors.set("left", adj[i][j - 1] || null);
                if (j < board[i].length - 1)
                    adj[i][j].neighbors.set("right", adj[i][j + 1] || null);
            }
        }
        return adj;
    }
    _distributeSuspectsToRooms() {
        let places = this._getPlaces();
        places = utl.randomElements(places, this._suspects.length);
        for (let i = 0; i < this._suspects.length; i++) {
            this.putOnRandomTile(this._suspects[i], places[i]);
        }
    }
    _distributeWeaponsToRooms() {
        let places = this._getPlaces();
        places = utl.randomElements(places, this._weapons.length);
        for (let i = 0; i < this._weapons.length; i++) {
            this.putOnRandomTile(this._weapons[i], places[i]);
        }
    }
    _getPlaces() {
        return Object
            .values(this._places)
            .filter((v) => v.type === "place");
    }
    putOnRandomTile(piece, place) {
        const tile = this.getFreeTile(place);
        piece.putOn(tile);
        return tile;
    }
    getFreeTile(place) {
        const tls = utl.shuffle(place.tiles);
        for (let tl of tls) {
            if (!tl.occupied)
                return tl;
        }
    }
    getPiece(name) {
        for (let piece of this.pieces) {
            if (piece.name === name)
                return piece;
        }
        return null;
    }
    computePath(src, target) {
        const ret = alg.dijkstra(src, target, this._adjacenyMatrix);
        let path = [];
        let u = target;
        while (u !== src) {
            path.push(u);
            u = ret.previous.get(u.hashCode());
        }
        return path.reverse();
    }
    computeNeighbors(distance, tile) {
        return alg.computeNeighbors(distance, tile, this._adjacenyMatrix);
    }
}