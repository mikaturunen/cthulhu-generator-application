"use strict";

var _ = require("lodash");

var StatRules;
(function (StatRules) {
    StatRules.dice = {
        ageModifier: { count: 1, max: 40, add: 0 },
        strength: { count: 3, max: 6, add: 0 },
        dexterity: { count: 3, max: 6, add: 0 },
        intelligence: { count: 2, max: 6, add: 6 },
        constitution: { count: 3, max: 6, add: 0 },
        appearance: { count: 3, max: 6, add: 0 },
        power: { count: 3, max: 6, add: 0 },
        size: { count: 2, max: 6, add: 6 },
        education: { count: 3, max: 6, add: 3 }
    };

    StatRules.calculations = {
        sanity: 0,
        idea: 0,
        luck: 0,
        knowledge: 0
    };

    StatRules.male = 0;

    StatRules.female = 1;

    function sexualOrientations() {
        return _.shuffle([].concat(Array(2).fill("homosexual")).concat(Array(3).fill("bisexual")).concat(Array(95).fill("heterosexual")));
    }
    StatRules.sexualOrientations = sexualOrientations;
    ;
    StatRules.statLimit = 90;

    function checkStats(stats) {
        return stats.strength + stats.dexterity + stats.intelligence + stats.constitution + stats.appearance + stats.power + stats.size + stats.education >= StatRules.statLimit;
    }
    StatRules.checkStats = checkStats;
    ;
    function calculateMissingStats(character) {
        character.stats.education += Math.floor(character.stats.ageModifier / 10);

        character.stats.sanity = character.stats.power * 5;
        character.stats.idea = character.stats.intelligence * 5;
        character.stats.luck = character.stats.power * 5;
        character.stats.knowledge = character.stats.education * 5;

        character.age = 6 + character.stats.education + character.stats.ageModifier;

        if (character.age > 40) {
            character.stats.dexterity -= 1;
        }
        if (character.age > 50) {
            character.stats.constitution -= 1;
        }
        if (character.age > 60) {
            character.stats.appearance -= 1;
        }
        if (character.age > 70) {
            character.stats.strength -= 1;
        }
    }
    StatRules.calculateMissingStats = calculateMissingStats;
    ;
})(StatRules || (StatRules = {}));
;
exports["default"] = StatRules;