"use strict";

var random_1 = require("./random");
function roll(dice) {
    var throws = [];

    for (var i = 0; i < dice.count; i++) {
        throws.push(random_1.random(1, dice.max));
    }
    return throws.reduce(function (n, p) {
        return n + p;
    }) + dice.add;
}
exports.roll = roll;