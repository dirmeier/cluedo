"use strict";

import * as d3 from "d3";
import Model from "./model";
import View from "./view";
import Controller from "./controller";

const introPlayersInputButton = "intro_players_input";
const introAiInputButton = "intro_ai_input";

const _parse = (id: string): number | null => {
  const nmb = d3.select("#" + id).property("value");
  try {
    if (nmb !== "" && !isNaN(nmb)) {
      if (nmb > 5 || nmb < 0) throw null;
      else return parseInt(nmb);
    } else {
      throw null;
    }
  } catch (err) {
    d3.select("#intro_span")
      .text("Enter integers in range [1, 6] only!")
      .style("color", "darkred");
  }

  return null;
};

const _run = async (nPlayers: number, nAI: number): Promise<void> => {
  d3.select("#landing_page").style("display", "none");
  const model = await new Model(nPlayers, nAI);
  const view = await new View(model);
  await new Controller(nPlayers + nAI, model, view);
};

(function (): void {
  let div = d3
    .select("#app")
    .append("div")
    .attr("id", "landing_page")
    .attr("class", "introduction")
    .attr("align", "center");

  div.append("h1").text("Cluedo - ancient Greece edition");
  div.append("h2").text("Expose Socrates' murderer.");
  div
    .append("div")
    .text(
      "This version of Cluedo plays in ancient Greece, where" +
        " Socrates, a true champion of the open society," +
        " has been murdered by one of his enemies." +
        " Players need to identify the murderer," +
        " the weapon the crime was committed with, and its place."
    );
  div = div.append("div").style("margin-top", "10px").attr("align", "center");

  div
    .append("input")
    .style("margin-right", "10px")
    .attr("type", "text")
    .style("width", "350px")
    .style("height", "40px")
    .style("display", "inline-block")
    .attr("id", introPlayersInputButton)
    .attr("class", "nes-input")
    .attr("placeholder", "How many players?");

  div
    .append("input")
    .attr("type", "text")
    .style("width", "350px")
    .style("height", "40px")
    .style("display", "inline-block")
    .attr("id", introAiInputButton)
    .attr("class", "nes-input")
    .attr("placeholder", "How many AIs?");

  div
    .append("button")
    .style("margin-top", "10px")
    .attr("class", "nes-btn")
    .style("height", "40px")
    .style("display", "inline-block")
    .attr("type", "button")
    .attr("name", "action")
    .on("click", function () {
      const nmbPl = _parse(introPlayersInputButton);
      const nmbAi = _parse(introAiInputButton);
      if (nmbPl !== null && nmbAi !== null) {
        if (nmbPl + nmbAi > 6) {
          d3.select("#intro_span")
            .text("Number of players + AIs needs to be <= 6!")
            .style("color", "darkred");
        } else {
          _run(nmbPl, nmbAi);
        }
      }
    })
    .text("Play");

  div
    .append("div")
    .style("margin-top", "10px")
    .append("span")
    .attr("id", "intro_span");
})();
