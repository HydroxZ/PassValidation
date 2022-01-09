var express = require("express");
var bodyParser = require("body-parser");
var rules = require("./rules.json");
var app = express();
var port = 3000;
var jsonParser = bodyParser.json();
app.post("/passwords", jsonParser, function (req, res) {
    var password = req.body.password;
    if (password) {
        var validation = passwordValidation(password);
        if (validation === true) {
            res.status(204).send();
        }
        else {
            res.status(400).send(validation);
        }
    }
    else {
        res.status(400).send("Password is required");
    }
});
app.listen(port, function () {
    console.log("Stared listening at http://localhost:".concat(port));
});
function passwordValidation(password) {
    var errors = [];
    for (var rule in rules) {
        var currentRule = rules[rule];
        var regex = new RegExp(currentRule.regex, "gs");
        // print rule key 
        if (rule !== "maxConsecutiveCharacters") {
            if (!regex.test(password))
                errors.push(currentRule.message);
        }
        else if (regex.test(password))
            errors.push(currentRule.message);
    }
    if (errors.length > 0) {
        return errors;
    }
    else {
        return true;
    }
}
//# sourceMappingURL=server.js.map