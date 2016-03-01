"use strict";

import log from "../log/log";

const production = process.env["NODE_ENV"] === "production" ? "production" : "development";

/**
 * Gets a given environmental variable.
 * @param {string} variable What environmental variable to get from underlying system.
 * @param {string} defaultValue Optional default value for cases where variable is not found. Defaults to "".
 * @param {boolean} printToConsole Optional default value to print the env variable to console.
 * @returns {string} Returns environmental variable value if it's present, otherwise default value.
 */
export function getEnvironmentalVariable(variable: string, defaultValue?: string, printToConsole?: boolean) {
	defaultValue = defaultValue ? defaultValue : "";
	printToConsole = printToConsole !== undefined ? printToConsole : true;

	if (!process.env[variable]) {
		log.error("Could not find environmental variable '" + variable + "', using value '" + defaultValue + "'.");
		return defaultValue;
	}

	let message = "Found environmental variable: '" + variable + "'";

	// There are some sensitive cases that we definitely do not want to publish the information of the env variable to the console
	if (printToConsole === true) {
		message += ", value '" + process.env[variable] + "'.";
	} else {
		message += ".";
	}

	log.trace(message);
	return process.env[variable];
};

/**
 * Prints out the production status into the log files so we know that when we are actually running in
 * development and when we are running in production.
 */
export function printProductionStatus() {
	log.info("Application running in '" + production + "' mode.");
};

/**
 * Truthy when running in production.
 * @returns {Boolean} True when NODE_ENV is 'production'.
 */
export function isInProduction() {
	return production === "production";
}

/**
 * Builds the mongo connection string from the environment variables.
 * @return {String} valid connection string to mongo db.
 */
export function getDatabaseConnectionString() {
	const user = getEnvironmentalVariable("DB_USER", "", false);
	const password = getEnvironmentalVariable("DB_PASSWORD", "", false);
	const url = getEnvironmentalVariable("DB_URL", "", false);
	const application = getEnvironmentalVariable("DB_APPLICATION", "", false);

	if (user === "" || password === "" || url === "") {
		throw "Application cannot run without defined DB_USER, DB_PASSWORD and DB_URL environment variables.";
	}

	return "mongodb://" + user + ":" + password + "@" + url + "/" + application;
}
