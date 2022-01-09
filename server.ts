const express = require("express");
const bodyParser = require("body-parser");
let rules = require("./rules.json");

const app = express();
const port = 3000;

let jsonParser = bodyParser.json();

app.post("/passwords", jsonParser, (req: any, res: any) => {
  let { password } = req.body;
  if (password) { 
    let validation = passwordValidation(password);
    if (validation === true) {
      res.status(204).send();
    } else {
      res.status(400).send(validation);
    }
  } else {
    res.status(400).send("Password is required");
  }
});

app.listen(port, () => {
  console.log(`Stared listening at http://localhost:${port}`);
});

function passwordValidation(password: string): boolean | string[] {
  let errors: string[] = [];
  for (let rule in rules) {
    let currentRule = rules[rule];
    let regex = new RegExp(currentRule.regex, "gs");
    // print rule key 
    if (rule !== "maxConsecutiveCharacters") {
      if (!regex.test(password)) errors.push(currentRule.message);
    } else if (regex.test(password)) errors.push(currentRule.message);
  }
  if (errors.length > 0) {
    return errors;
  } else {
    return true;
  }
}

