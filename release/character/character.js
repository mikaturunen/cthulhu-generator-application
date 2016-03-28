"use strict";

var die_1 = require("./die");
var rules_1 = require("./rules");
var random_1 = require("./random");

var occupation = require("./assets/occupation.json");
var education = require("./assets/education.json");
var firstNames = require("./assets/first-names.json");
var lastNames = require("./assets/last-names.json");
var maxRecursionDepth = 5000;

var randomizeGender = function randomizeGender() {
    return random_1.random(0, 1) === rules_1["default"].male ? "male" : "female";
};
var randomizeSexualOrientation = function randomizeSexualOrientation() {
    return rules_1["default"].sexualOrientations()[random_1.random(0, 100)];
};
var randomizeFirstName = function randomizeFirstName(character) {
    var listOfFirstNames = character.gender === "male" ? firstNames.male : firstNames.female;
    return listOfFirstNames[random_1.random(0, listOfFirstNames.length - 1)];
};
var randomizeLastName = function randomizeLastName() {
    return lastNames[random_1.random(0, lastNames.length - 1)];
};
var randomizeOccupation = function randomizeOccupation(character) {
    return occupation[random_1.random(0, occupation.length - 1)];
};
var randomizeStats = function randomizeStats(character) {
    var statRolls = [die_1.roll(rules_1["default"].dice.strength), die_1.roll(rules_1["default"].dice.dexterity), die_1.roll(rules_1["default"].dice.intelligence), die_1.roll(rules_1["default"].dice.constitution), die_1.roll(rules_1["default"].dice.appearance), die_1.roll(rules_1["default"].dice.power), die_1.roll(rules_1["default"].dice.size), die_1.roll(rules_1["default"].dice.education)];
    if (statRolls.reduce(function (previousDie, nextDie) {
        return previousDie + nextDie;
    }) < rules_1["default"].statLimit) {
        console.log("Total was under 90. Rerolling stats dies..");

        return randomizeStats(character);
    }

    character.stats.ageModifier = die_1.roll(rules_1["default"].dice.ageModifier);
    character.stats.strength = statRolls[0];
    character.stats.dexterity = statRolls[1];
    character.stats.intelligence = statRolls[2];
    character.stats.constitution = statRolls[3];
    character.stats.appearance = statRolls[4];
    character.stats.power = statRolls[5];
    character.stats.size = statRolls[6];
    character.stats.education = statRolls[7];
    rules_1["default"].calculateMissingStats(character);
    return character;
};
var randomizeEducation = function randomizeEducation(character, depth) {
    if (depth === void 0) {
        depth = 0;
    }
    if (depth >= maxRecursionDepth) {
        return character.education;
    }
    if (depth === 0) {
        character.education = "None";
    }
    var educationIndex = random_1.random(0, education.length - 1);
    education[educationIndex].levels.sort(function (a, b) {
        return b.value - a.value;
    }).some(function (level) {
        if (level.value <= character.stats.education) {
            character.education = education[educationIndex].name + ", " + education[educationIndex].levels[0].level;
            return true;
        } else {
            return false;
        }
    });
    if (character.education !== "None") {
        return character.education;
    } else {
        return randomizeEducation(character, depth + 1);
    }
};

var createBaseCharacter = function createBaseCharacter() {
    return {
        age: 0,
        gender: randomizeGender(),
        sexualOrientation: "",
        firstName: "",
        lastName: "",
        occupation: "",
        education: "",
        stats: {
            ageModifier: 1,
            strength: 1,
            dexterity: 1,
            intelligence: 1,
            constitution: 1,
            appearance: 1,
            power: 1,
            size: 1,
            education: 1,
            sanity: 0,
            idea: 0,
            luck: 0,
            knowledge: 0
        }
    };
};

var generatePoopGuid = function generatePoopGuid() {
    return function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }();
};
function createNewCharacter() {
    var character = createBaseCharacter();
    randomizeStats(character);
    character.firstName = randomizeFirstName(character);
    character.lastName = randomizeLastName();
    character.education = randomizeEducation(character);
    character.occupation = randomizeOccupation(character);
    character.sexualOrientation = randomizeSexualOrientation();
    character.guid = generatePoopGuid();
    return character;
}
exports.createNewCharacter = createNewCharacter;
;