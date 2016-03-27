
/**
 * Inversion of Control container.
 */
interface InversionOfControlContainer {
	/**
	 * Should resolve to true when all the content inside has resolved and can be used.
	 */
	isReady: Q.Promise<boolean>;

	/*
	 * Should store the content with the name the user gives it. Does not allow overloading the same name.
	 * {string} name Name of the content.
	 * {T} content Object to store inside the IoC container.
	 */
	store: <T>(name: string, content: T) => void;

	/*
	 * Should returns the content the user requests, throws on errors.
	 * @param {string} name Name of the content to get.
	 * @returns {T} Returns Object the user requested. Throws error if not available.
	 */
	get: <T>(name: string) => T;
}
