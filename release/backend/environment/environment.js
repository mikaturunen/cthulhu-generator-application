"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getEnvironmentalVariable = getEnvironmentalVariable;
exports.printProductionStatus = printProductionStatus;

var _log = require("../log/log");

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var production = process.env["NODE_ENV"] === "production" ? "production" : "development";
function getEnvironmentalVariable(variable, defaultValue) {
    defaultValue = defaultValue ? defaultValue : "";
    if (!process.env[variable]) {
        _log2.default.error("Could not find environmental variable '" + variable + "', value '" + defaultValue + "'.");
        return defaultValue;
    }
    _log2.default.trace("Found environmental variable: '" + variable + "', value '" + process.env[variable] + "'.");
    return process.env[variable];
}
;
function printProductionStatus() {
    _log2.default.info("Application running in '" + production + "' mode.");
}
;