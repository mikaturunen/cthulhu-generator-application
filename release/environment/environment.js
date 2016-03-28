"use strict";

var log_1 = require("../log/log");
var production = process.env["NODE_ENV"] === "production" ? "production" : "development";

function getEnvironmentalVariable(variable, defaultValue, printToConsole) {
    defaultValue = defaultValue ? defaultValue : "";
    printToConsole = printToConsole !== undefined ? printToConsole : true;
    if (!process.env[variable]) {
        log_1["default"].error("Could not find environmental variable '" + variable + "', using value '" + defaultValue + "'.");
        return defaultValue;
    }
    var message = "Found environmental variable: '" + variable + "'";

    if (printToConsole === true) {
        message += ", value '" + process.env[variable] + "'.";
    } else {
        message += ".";
    }
    log_1["default"].trace(message);
    return process.env[variable];
}
exports.getEnvironmentalVariable = getEnvironmentalVariable;
;

function printProductionStatus() {
    log_1["default"].info("Application running in '" + production + "' mode.");
}
exports.printProductionStatus = printProductionStatus;
;

function isInProduction() {
    return production === "production";
}
exports.isInProduction = isInProduction;

function getDatabaseConnectionString() {
    var user = getEnvironmentalVariable("DB_USER", "", false);
    var password = getEnvironmentalVariable("DB_PASSWORD", "", false);
    var url = getEnvironmentalVariable("DB_URL", "", false);
    var application = getEnvironmentalVariable("DB_APPLICATION", "", false);
    if (user === "" || password === "" || url === "") {
        throw "Application cannot run without defined DB_USER, DB_PASSWORD and DB_URL environment variables.";
    }
    return "mongodb://" + user + ":" + password + "@" + url + "/" + application;
}
exports.getDatabaseConnectionString = getDatabaseConnectionString;