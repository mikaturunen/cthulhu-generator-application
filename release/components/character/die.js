"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.roll = roll;

var _random = require("./random");

function roll(dice) {
    var throws = [];

    for (var i = 0; i < dice.count; i++) {
        throws.push((0, _random.random)(1, dice.max));
    }
    return throws.reduce(function (n, p) {
        return n + p;
    }) + dice.add;
}