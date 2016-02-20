"use strict";

import log from "../log/log";

const production = process.env["NODE_ENV"] === "production" ? "production" : "development";

/**
 * Gets a given environmental variable.
 * @param {string} variable What environmental variable to get from underlying system.
 * @param {string} defaultValue Optional default value for cases where variable is not found. Defaults to "".
 * @returns {string} Returns environmental variable value if it's present, otherwise default value.
 */
export function getEnvironmentalVariable(variable: string, defaultValue?: string) {
	defaultValue = defaultValue ? defaultValue : "";

	if (!process.env[variable]) {
		log.error("Could not find environmental variable '" + variable + "', value '" + defaultValue + "'.");
		return defaultValue;
	}

	log.trace("Found environmental variable: '" + variable + "', value '" + process.env[variable] + "'.");
	return process.env[variable];
};

/**
 * Prints out the production status into the log files so we know that when we are actually running in
 * development and when we are running in production.
 */
export function printProductionStatus() {
	log.info("Application running in '" + production + "' mode.");
};
