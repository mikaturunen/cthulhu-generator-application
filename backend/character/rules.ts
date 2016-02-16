"use strict";

// TODO fetch lodash types from definitelytyped github repo
const _ = require("lodash");

/**
 * Set of rules (we consider the dice set to be part of the rules) we are publishing from the module
 * @module Rules
 */
namespace StatRules {
    /**
     * List of Dice and how they should be rolled for different stats
     */
	export const dice = {
	// 1d40
		ageModifier: { count: 1, max: 40, add: 0 },
		strength: { count: 3, max: 6, add: 0 },
		dexterity: { count: 3, max: 6, add: 0 },
		intelligence: { count: 2, max: 6, add: 6 },
		constitution: { count: 3, max: 6, add: 0 },
		appearance: { count: 3, max: 6, add: 0 },
		power: { count: 3, max: 6, add: 0 },
		size: { count: 2, max: 6, add: 6 },
		education: { count: 3, max: 6, add: 3 },
	};

    /**
     * Specific calculations we are after.
     * @type {any}
     */
	export const calculations = {
		sanity: 0,
		idea: 0,
		luck: 0,
		knowledge: 0,
	};

    /**
     * Number for male.
     * @type {number}
     */
	export const male = 0;

    /**
     * Number for female.
     * @type {number}
     */
	export const female = 1;

    /**
     * List of sexual orientations: 3% bisexual, 2% homosexual, 95% heterosexual - gets shuffled plus index is randomized
     * @type {string[]}
     */
	export function sexualOrientations() {
		return  _.shuffle([ ]
			.concat(Array(2).fill("homosexual"))
			.concat(Array(3).fill("bisexual"))
			.concat(Array(95).fill("heterosexual"))
		);
	};

	export const statLimit = 90;

	// TODO: Refactor better name?
	export function checkStats(stats: CharacterStats) {
		return stats.strength + stats.dexterity + stats.intelligence + stats.constitution + stats.appearance +
		stats.power + stats.size + stats.education >= statLimit;
	};

	export function calculateMissingStats(character: Character) {
		// Education
		character.stats.education += Math.floor(character.stats.ageModifier / 10);
		// Sanity, idea, luck and knowledge
		character.stats.sanity = character.stats.power * 5;
		character.stats.idea = character.stats.intelligence * 5;
		character.stats.luck = character.stats.power * 5;
		character.stats.knowledge = character.stats.education * 5;

		// Age = 6+Edu+AgeMod
		character.age = 6 + character.stats.education + character.stats.ageModifier;

		// Age has negative effects on differet stats depending on how old the character is
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
	};
};

export default StatRules;
