"use strict";

require("babel-polyfill");
var path = require("path");
var parser = require("body-parser");
var express_1 = require("express");
var cookie_parser_1 = require("cookie-parser");
var character_1 = require("./character/character");
var environment_1 = require("./environment/environment");
var view_routes_1 = require("./routes/view-routes");

var injector_1 = require("./injector/injector");
var profile_1 = require("./profile/profile");
var authentication_1 = require("./authentication/authentication");
var favicon = require("serve-favicon");
var app = express_1["default"]();
environment_1.printProductionStatus();
var container = new injector_1["default"]();
container.store("profile", new profile_1["default"](container), "setup");
container.store("authenticate", new authentication_1["default"](container));
container.setup();
container.isReady().then(function () {
    var authentication = container.get("authenticate");

    app.disable("x-powered-by");

    {
        app.set("port", process.env.PORT || 3000);
    }
    {
        app.use(cookie_parser_1["default"]());
        app.use(parser.json());
        app.use(parser.urlencoded({ extended: true }));
        app.use(favicon(path.join(__dirname, "../components/favicon.ico")));
        app.use("/components", express_1["default"].static(path.join(__dirname, "../components")));

        authentication.connectToExpress(app);
    }
    {
        view_routes_1.addViewIndexRoutesForSpa(app, container);

        app.get("/google46f5c1efa1dd1848.html", function (request, response) {
            response.sendFile(path.join(__dirname, "../components/google46f5c1efa1dd1848.html"));
        });
        app.get("/getcharacter", function (request, response) {
            response.json(character_1.createNewCharacter());
        });
        authentication.authenticate(app);
    }

    app.listen(app.get("port"), function () {
        console.log("Cthulhu application listening on port:", app.get("port"));
    });
}).catch(console.log);