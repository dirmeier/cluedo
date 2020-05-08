"use strict";
import * as utl from "../util";
import glb from "../global";
import Suspect from "./cards/suspect";
import Place from "./cards/place";
import Weapon from "./cards/weapon";
const victim = new Suspect("Socrates", null);
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
const places = [
    new Place(glb.agora.name, glb.agora.path),
    new Place(glb.barrel.name, glb.barrel.path),
    new Place(glb.bouleuterion.name, glb.bouleuterion.path),
    new Place(glb.hill.name, glb.hill.path),
    new Place(glb.library.name, glb.library.path),
    new Place(glb.parthenon.name, glb.parthenon.path),
    new Place(glb.temple.name, glb.temple.path),
    new Place(glb.theater.name, glb.theater.path),
    new Place(glb.tree.name, glb.tree.path),
];
class Cards {
    constructor() {
        this._murderer = utl.randomElement(suspects);
        this._weapon = utl.randomElement(weapons);
        this._place = utl.randomElement(places);
        this._victim = victim;
        this._availableCards = [
            ...this._availableWeapons(),
            ...this._availableSuspects(),
            ...this._availablePlaces(),
        ];
    }
    get suspects() {
        return suspects;
    }
    get weapons() {
        return weapons;
    }
    get places() {
        return places;
    }
    get availableCards() {
        return this._availableCards;
    }
    set availableCards(cards) {
        this._availableCards = cards;
    }
    murderCase() {
        return {
            victim: this._victim,
            murderer: this._murderer,
            place: this._place,
            weapon: this._weapon,
        };
    }
    randomAvailableCard() {
        const card = utl.randomElement(this._availableCards);
        this._availableCards = this._availableCards.filter((i) => i.name !== card.name);
        return card;
    }
    _availableSuspects() {
        return suspects.filter((i) => i.name !== this._murderer.name);
    }
    _availableWeapons() {
        return weapons.filter((i) => i.name !== this._weapon.name);
    }
    _availablePlaces() {
        return places.filter((i) => i.name !== this._place.name);
    }
}
export { Cards, suspects, weapons, places, };
