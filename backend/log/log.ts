"use strict";

// TODO use external logging module, currently just providing a unifieid front

/**
 * Logging namespace. Provides functionality for all of our logging needs. Plug this baby into
 * something that we can directly use from heroku and push the logs into an external system. I ain't
 * reading some shitty /system/log crap over SSH. I want sexy dashboards with magix and sexy colors!
 */
namespace Log {
	/**
	 * Trace level logging. Low level logging, something that's not really required for production but nice
	 * during the debugging or devepment process.
	 * @param {string} message Message to log.
	 */
	export function trace(message: string) {
		console.log("[debug ]: " + message);
	}

	/**
	 * Info level logging. Most of the logs should be on info level. Will show up from production.
	 * @param {string} message Message to log.
	 */
	export function info(message: string) {
		console.log("[info ]: " + message);
	}

	/**
	 * Error level logging. When somethings goes wrong and needs to be logged, use this.
	 * @param {string} message Message to log.
	 */
	export function error(message: string) {
		console.log("[error]: " + message);
	}
};

export default Log;
