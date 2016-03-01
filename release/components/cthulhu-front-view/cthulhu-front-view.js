"use strict";

define("cthulhuFrontView", ["cthulhuAuthService"], function (auth) {
    auth.then(function (service) {
        if (service.isAuthenticated === false) {
            var routerElement = document.querySelector("app-router");

            routerElement.go("/home", { replace: true });
            return;
        }
        Polymer({
            is: "cthulhu-front-view",
            properties: {}
        });
    });
});