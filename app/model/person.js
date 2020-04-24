const Card =  require("./card.js");

class Person extends Card  {
  constructor (name, color) {
    super(name);
    this.color = color;
  }
}

module.exports = Person;
