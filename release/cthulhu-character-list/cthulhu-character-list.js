"use strict";

define("cthulhuCharacterList", [], function () {
    Polymer({
        is: "cthulhu-character-list",
        properties: {
            characters: {
                type: Array,
                value: function value() {
                    return [];
                },
                observer: "_onCharactersChanged"
            }
        },
        _onCharactersChanged: function _onCharactersChanged(newValues, oldValues) {
            return console.log(newValues);
        }
    });
});