"use strict";

define("cthulhuCharactersView", ["cthulhuAuthService"], function (auth) {
    auth.then(function (service) {
        Polymer({
            is: "cthulhu-characters-view",
            properties: {
                profile: {
                    type: Object
                }
            },
            onProfileError: function onProfileError(response) {
                console.log("Error getting profile:", response);
            }
        });
    });
});