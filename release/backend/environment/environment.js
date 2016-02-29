"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getEnvironmentalVariable = getEnvironmentalVariable;
exports.printProductionStatus = printProductionStatus;
exports.isInProduction = isInProduction;
exports.getDatabaseConnectionString = getDatabaseConnectionString;

var _log = require("../log/log");

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var production = process.env["NODE_ENV"] === "production" ? "production" : "development";
function getEnvironmentalVariable(variable, defaultValue, printToConsole) {
    defaultValue = defaultValue ? defaultValue : "";
    printToConsole = printToConsole ? printToConsole : true;
    if (!process.env[variable]) {
        _log2.default.error("Could not find environmental variable '" + variable + "', value '" + defaultValue + "'.");
        return defaultValue;
    }
    var message = "Found environmental variable: '" + variable + "'";

    if (printToConsole) {
        message += ", value '" + process.env[variable] + "'.";
    } else {
        message += ".";
    }
    _log2.default.trace(message);
    return process.env[variable];
}
;
function printProductionStatus() {
    _log2.default.info("Application running in '" + production + "' mode.");
}
;
function isInProduction() {
    return production === "production";
}
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