"use strict";

import log from "../log/log";

/**
 * Gets a given environmental variable.
 * @param {string} variable What environmental variable to get from underlying system.
 * @param {string} defaultValue Optional default value for cases where variable is not found. Defaults to "".
 * @returns {string} Returns environmental variable value if it's present, otherwise default value.
 */
export function getEnvironmentalVariable(variable: string, defaultValue?: string) {
	const production = process.env["NODE_ENV"] === "production" ? "production" : "development";
	defaultValue = defaultValue ? defaultValue : "";

	if (!process.env[variable]) {
		log.error("[" + production + "] Could not find environmental variable: " + variable + ", value: " + defaultValue);
		return defaultValue;
	}

	log.trace("[" + production + "] Found environmental variable: " + variable + ", value: " + process.env[variable]);
	return process.env[variable];
};
