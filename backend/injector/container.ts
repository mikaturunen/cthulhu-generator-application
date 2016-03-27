
import * as Q from "q";

class InjectorContainer implements InversionOfControlContainer {
	private container: { [name: string]: {
		// Of type any promise, we do not care how it implements it.
		setupFunction?: string,
		// Can we template the content with T somehow?
		content: any
	} };

	private setupPromise: Q.Promise<any>;

	constructor() {
		// Initialize empty container
		this.container = { };
	}

	/**
	 * Returns isReady promise for the container that will resolve once all async content has resolved.
	 * @returns {Q.Deferred<boolean>} Will reject on content initialization error with message, otherwise resolves to true.
	 */
	public isReady() {
		return this.setupPromise;
	}

	/**
	 * Stores content into the container.
	 */
	public store<T>(name: string, content: T, setupFunction?: string) {
		// TODO do we need to create support for potentially loading all the content in specific order and / or with specific dependencies?

		this.container[name] = {
			content: content,
			setupFunction: setupFunction
		};

		if (setupFunction !== undefined && !content.hasOwnProperty(setupFunction)) {
			throw "No " + setupFunction + " function in " + name + " present. Check your code.";
		}
	}

	/**
	 * Gets a given content with name. Throws if the content is not present.
	 * @param {string} name Name of the content to load.
	 * @param {T} Returns content of generics type. 
	 */
	public get<T>(name: string) {
		let content = <T> this.container[name].content;

		if (!content) {
			throw "No content with name " + name + " inside the container. Did you load the content and wait for ready to resolve?";
		}

		return content;
	}

	/**
	 * Setups all the given content and makes sure it's properly loaded. Essentially triggers the chain to get isReady
	 * into working condition.
	 */
	public setup() {
		// If the container has a setup function for given content, we call it, otherwise we just simply
		// Resolve a promise for missing setup function so it makes our living easier with the last promise

		this.setupPromise = Q.all(
			Object.keys(this.container)
			.map(
				k => this.container[k].setupFunction !== undefined ?
				this.container[k].content[this.container[k].setupFunction] :
				Q.resolve(true)
			)
		);
	}
};
