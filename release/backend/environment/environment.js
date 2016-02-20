"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getEnvironmentalVariable = getEnvironmentalVariable;
function getEnvironmentalVariable(variable, defaultValue) {
    var production = process.env["NODE_ENV"] === "production" ? "production" : "development";
    defaultValue = defaultValue ? defaultValue : "";
    if (!process.env[variable]) {
        console.log("[" + production + "] Could not find environmental variable: " + variable + ", value: " + defaultValue);
        return defaultValue;
    }
    console.log("[" + production + "] Found environmental variable: " + variable + ", value: " + process.env[variable]);
    return process.env[variable];
}
;