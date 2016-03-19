"use strict";

define("cthulhuCharacterList", [], () => {
	Polymer({
		is: "cthulhu-character-list",

		properties: {
			/**
			 * List of Characters the logged in user has.
			 */
			characters: {
				type: Array,
				value: () => <Character[]> [],
				observer: "_onCharactersChanged"
			}
		},

		_onCharactersChanged: (newValues: Character[], oldValues: Character[]) => console.log(newValues)
	});
});
