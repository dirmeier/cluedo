
const fs = require("fs");

let d = fs.readFileSync("./board.csv", "utf8")
  .trim()
  .split("\n")
  .map((i) => i.split(","));

for (let i = 0; i < d.length; i++) {
  for (let j = 0; j < d[i].length; j++) {
    if (d[i][j] === "C") d[i][j] = "D";
    else if (d[i][j] === "CN") d[i][j] = "D";
    else if (d[i][j] === "CR") d[i][j] = "D>";
    else if (d[i][j] === "W") d[i][j] = ".";
    else if (d[i][j] === "R") d[i][j] = "B";
    else if (d[i][j] === "RD") d[i][j] = "Bv";
    else if (d[i][j] === "RN") d[i][j] = "B";
    else if (d[i][j] === "L") d[i][j] = "L";
    else if (d[i][j] === "L") d[i][j] = "L^";
    else if (d[i][j] === "LL") d[i][j] = "L<";
    else if (d[i][j] === "LD") d[i][j] = "Lv";
    else if (d[i][j] === "LN") d[i][j] = "L";
    else if (d[i][j] === "S") d[i][j] = "S";
    else if (d[i][j] === "SL") d[i][j] = "S<";
    else if (d[i][j] === "SN") d[i][j] = "S";
    else if (d[i][j] === "B") d[i][j] = "A";
    else if (d[i][j] === "BR") d[i][j] = "A>";
    else if (d[i][j] === "BD") d[i][j] = "Av";
    else if (d[i][j] === "BN") d[i][j] = "A";
    else if (d[i][j] === "X") d[i][j] = "_";
    else if (d[i][j] === "H") d[i][j] = "T";
    else if (d[i][j] === "HN") d[i][j] = "T";
    else if (d[i][j] === "HU") d[i][j] = "T^";
    else if (d[i][j] === "HL") d[i][j] = "T<";
    else if (d[i][j] === "HN") d[i][j] = "T";
    else if (d[i][j] === "K") d[i][j] = "U";
    else if (d[i][j] === "KN") d[i][j] = "U";
    else if (d[i][j] === "KR") d[i][j] = "U>";
    else if (d[i][j] === "D") d[i][j] = "P";
    else if (d[i][j] === "DN") d[i][j] = "P";
    else if (d[i][j] === "DU") d[i][j] = "P^";
    else if (d[i][j] === "DR") d[i][j] = "P>";
    else if (d[i][j] === "D") d[i][j] = "P";
    else if (d[i][j] === "O") d[i][j] = "H";
    else if (d[i][j] === "OL") d[i][j] = "H<";
    else if (d[i][j] === "ON") d[i][j] = "H";
  }
}

for (let i = 0; i < d.length; i++) {
  for (let j = 0; j < d[i].length; j++) {
    l = d[i][j].length;
    process.stdout.write(d[i][j] + " ".repeat(3 - l));
  }
  console.log();
}

var s= fs.readFileSync("board.json", "utf8");
s = JSON.parse(s);

console.log(s);