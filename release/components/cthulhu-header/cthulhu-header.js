"use strict";

define("cthulhuHeader", [], function () {
    Polymer({
        is: "cthulhu-header",
        properties: {},

        handleLogout: function handleLogout() {
            window.location.href = "/location";
        }
    });
});