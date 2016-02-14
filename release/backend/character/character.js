"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createNewCharacter = createNewCharacter;

var _die = require("./die");

var _rules = require("./rules");

var _rules2 = _interopRequireDefault(_rules);

var _random = require("./random");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var occupation = require("./assets/occupation.json");
var education = require("./assets/education.json");
var firstNames = require("./assets/first-names.json");
var lastNames = require("./assets/last-names.json");
var maxRecursionDepth = 5000;

var randomizeGender = function randomizeGender() {
    return (0, _random.random)(0, 1) === _rules2.default.male ? "male" : "female";
};
var randomizeSexualOrientation = function randomizeSexualOrientation() {
    return _rules2.default.sexualOrientations()[(0, _random.random)(0, 100)];
};
var randomizeFirstName = function randomizeFirstName(character) {
    var listOfFirstNames = character.gender === "male" ? firstNames.male : firstNames.female;
    return listOfFirstNames[(0, _random.random)(0, listOfFirstNames.length - 1)];
};
var randomizeLastName = function randomizeLastName() {
    return lastNames[(0, _random.random)(0, lastNames.length - 1)];
};
var randomizeOccupation = function randomizeOccupation(character) {
    return occupation[(0, _random.random)(0, occupation.length - 1)];
};
var randomizeStats = function randomizeStats(character) {
    var statRolls = [(0, _die.roll)(_rules2.default.dice.strength), (0, _die.roll)(_rules2.default.dice.dexterity), (0, _die.roll)(_rules2.default.dice.intelligence), (0, _die.roll)(_rules2.default.dice.constitution), (0, _die.roll)(_rules2.default.dice.appearance), (0, _die.roll)(_rules2.default.dice.power), (0, _die.roll)(_rules2.default.dice.size), (0, _die.roll)(_rules2.default.dice.education)];
    if (statRolls.reduce(function (previousDie, nextDie) {
        return previousDie + nextDie;
    }) < _rules2.default.statLimit) {
        console.log("Total was under 90. Rerolling stats dies..");

        return randomizeStats(character);
    }

    character.stats.ageModifier = (0, _die.roll)(_rules2.default.dice.ageModifier);
    character.stats.strength = statRolls[0];
    character.stats.dexterity = statRolls[1];
    character.stats.intelligence = statRolls[2];
    character.stats.constitution = statRolls[3];
    character.stats.appearance = statRolls[4];
    character.stats.power = statRolls[5];
    character.stats.size = statRolls[6];
    character.stats.education = statRolls[7];
    _rules2.default.calculateMissingStats(character);
    return character;
};
var randomizeEducation = function randomizeEducation(character) {
    var depth = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    if (depth >= maxRecursionDepth) {
        return character.education;
    }
    if (depth === 0) {
        character.education = "None";
    }
    var educationIndex = (0, _random.random)(0, education.length - 1);
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
function createNewCharacter() {
    var character = createBaseCharacter();
    randomizeStats(character);
    character.firstName = randomizeFirstName(character);
    character.lastName = randomizeLastName();
    character.education = randomizeEducation(character);
    character.occupation = randomizeOccupation(character);
    character.sexualOrientation = randomizeSexualOrientation();
    return character;
}
;