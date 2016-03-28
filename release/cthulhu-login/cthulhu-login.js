"use strict";

define("cthulhuLogin", [], function () {
    Polymer({
        is: "cthulhu-login",

        handleRedirectLogin: function handleRedirectLogin() {
            window.location.href = "/auth/google";
        }
    });
});