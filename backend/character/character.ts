"use strict";

import { roll } from "./die";
import rules from "./rules";
import { random } from "./random";

// We have no types for the json files and no reason at this point to write them, so we just blindly trust them :)
const occupation = require("./assets/occupation.json");
const  education = require("./assets/education.json");
const  firstNames = require("./assets/first-names.json");
const  lastNames = require("./assets/last-names.json");

const maxRecursionDepth = 5000;

// Do we want to support other genders than male and female?
const randomizeGender = () => random(0, 1) === rules.male ? "male" : "female";

const randomizeSexualOrientation = () =>  rules.sexualOrientations()[ random(0, 100) ];

const randomizeFirstName = (character: Character) => {
	const listOfFirstNames = character.gender === "male" ? firstNames.male : firstNames.female;
	return listOfFirstNames[ random(0, listOfFirstNames.length - 1) ];
};

const randomizeLastName = () => lastNames[ random(0, lastNames.length - 1) ];

const randomizeOccupation = (character: Character) => occupation[ random(0, occupation.length - 1) ];

const randomizeStats = (character: Character): Character => {
	const statRolls = [
		roll(rules.dice.strength),
		roll(rules.dice.dexterity),
		roll(rules.dice.intelligence),
		roll(rules.dice.constitution),
		roll(rules.dice.appearance),
		roll(rules.dice.power),
		roll(rules.dice.size),
		roll(rules.dice.education),
	];

	if (statRolls.reduce((previousDie: number, nextDie: number) => previousDie + nextDie) < rules.statLimit) {
		console.log("Total was under 90. Rerolling stats dies..");
        // If we have super bad luck, we fill flood the stack and explode around 15k iterations or so.
        // Pro move would be to originally call randomizeStats with setTimeout, 0 and keep doing so here,
        // it makes for poorly readable code but guarantees stack does not xplode due to having no tail recursion.
		return randomizeStats(character);
	}

    // Do we want to maintain immutable Character and not modify it's content inside this function? would
    // probably make more sense and make a bit more readable code. Now this function automatigally internally
    // mutates the Character object. Not that bad of a thing but we should probably aim to move away from that :)

    // Push age modifier back in and continue using the indices to read the stats. Probably more readable
    // and reliable manner would be to store them all in a separate variables but with that the above
    // if statement for rules.statLimit would be uber annoying to read + write
	character.stats.ageModifier = roll(rules.dice.ageModifier);
	character.stats.strength = statRolls[0];
	character.stats.dexterity = statRolls[1];
	character.stats.intelligence = statRolls[2];
	character.stats.constitution = statRolls[3];
	character.stats.appearance = statRolls[4];
	character.stats.power = statRolls[5];
	character.stats.size = statRolls[6];
	character.stats.education = statRolls[7];

	rules.calculateMissingStats(character);

	return character;
};

const randomizeEducation = (character: Character, depth = 0): string => {
	if (depth >= maxRecursionDepth) {
		return character.education;
	}
	if (depth === 0) {
		character.education = "None";
	}

	const educationIndex = random(0, education.length - 1);
	education[educationIndex].levels
		.sort((a: EducationLevel, b: EducationLevel) => b.value - a.value)
		.some((level: EducationLevel) => {
			if (level.value <= character.stats.education) {
				character.education = education[educationIndex].name + ", " +	 education[educationIndex].levels[0].level;
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

/**
 * Creates a simple Character stub for us to modify and handle.
 */
const createBaseCharacter = () => {
	return <Character> {
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
			knowledge: 0,
		},
	};
};

export function createNewCharacter() {
	let character = createBaseCharacter();

	randomizeStats(character);
	character.firstName = randomizeFirstName(character);
	character.lastName = randomizeLastName();
	character.education = randomizeEducation(character);
	character.occupation = randomizeOccupation(character);
	character.sexualOrientation = randomizeSexualOrientation();

	return character;
};
