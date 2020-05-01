define(function (require) {
  const Model = require("model");
  const View = require("view");
  const Controller = require('controller');
  const d3 = require("libs/d3");

  let div = d3.select("#app")
    .append("div")
    .attr("id", "landing_page")
    .attr("class", "introduction")
    .attr("align", "center");
  div.append("h1").text("Cluedo - ancient Greece edition");
  div.append("h2").text("Expose Socrates' murderer.");
  div.append("div").text(
    "This version of Cluedo playes in ancient Greece, where" +
    " Socrates, a true champion of the open society," +
    " has been murdered by one of his enemies." +
    " Players need to identify the murderer," +
    " the weapon the crime was committed with, and its place.");
  div = div.append("div")
    .style("margin-top", "10px")
    .attr("align", "center");
  div.append("input")
    .style("margin-right", "5px")
    .attr("type", "text")
    .attr("id", "intro_input")
    .attr("placeholder", "How many players?");

  div.append("button")
    .attr("class", "mdl-button mdl-button--raised mdl-js-ripple-effect")
    .attr("type", "submit")
    .attr("name", "action")
    .on("click", function () {
      let nmb = d3.select("#intro_input").property("value");
      try {
        if (nmb !== "" && !isNaN(nmb)) {
          nmb = parseInt(nmb);
          if (nmb > 5 || nmb < 2)
            throw null;
          _run(nmb);
        } else {
          throw null;
        }
      } catch (err) {
        d3.select("#intro_span")
          .text("Enter an integer between 2 and 6!")
          .style("color", "darkred");
      }
    })
    .text("Play");

  div.append("div")
    .style("margin-top", "10px")
    .append("span")
    .attr("id", "intro_span");

  const _run = (nPlayers) => {
    d3.select("#landing_page").style("display", "none");
    const model = new Model(nPlayers);
    const view = new View(model);
    new Controller(nPlayers, model, view);
  };
});