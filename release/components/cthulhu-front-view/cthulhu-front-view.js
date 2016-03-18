"use strict";

define("cthulhuFrontView", ["cthulhuAuthService"], function (auth) {
    auth.then(function (service) {
        if (service.isAuthenticated === false) {
            var routerElement = document.querySelector("app-router");

            routerElement.go("/login");
            return;
        }
        Polymer({
            is: "cthulhu-front-view",
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