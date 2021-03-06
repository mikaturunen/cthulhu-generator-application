"use strict";

define("cthulhuLoginView", ["cthulhuAuthService"], function (auth) {
    auth.then(function (service) {
        if (service.isAuthenticated === true) {
            var routerElement = document.querySelector("app-router");

            routerElement.go("/front");
            return;
        }
        Polymer({
            is: "cthulhu-login-view",
            properties: {}
        });
    });
});