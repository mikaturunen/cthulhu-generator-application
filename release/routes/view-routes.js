"use strict";

var path = require("path");
var environment_1 = require("../environment/environment");
var character_1 = require("../character/character");

var pathToIndexHtml = path.join(__dirname, "../../components/index.html");

function addViewIndexRoutesForSpa(app, container) {
    ["/", "/front", "/login"].forEach(function (route) {
        return app.get(route, function (request, response) {
            return response.sendFile(pathToIndexHtml);
        });
    });
    var profileModule = container.get("profile");
    var authenticationModule = container.get("authenticate");

    app.get("/profile", function (request, response) {
        if (!authenticationModule.isAuthenticated(request)) {
            response.status(401);
            return;
        }

        profileModule.get(request.user._json.id).then(function (profile) {
            return response.json(profile);
        }).catch(function () {
            return response.json({});
        });
    });

    app.post("/character", function (request, response) {
        if (!authenticationModule.isAuthenticated(request)) {
            response.status(401);
            return;
        }
        var newCharacter = character_1.createNewCharacter();
        profileModule.get(request.user._json.id).then(function (userProfile) {
            userProfile.characters.push(newCharacter);
            console.log("Generated character");
            return profileModule.upsert(userProfile);
        }).then(function (userProfile) {
            console.log("profile:", userProfile);
            response.json(userProfile);
        }).catch(function () {
            return response.status(500);
        });
    });

    if (environment_1.isInProduction() === true) {
        app.get("*", function (request, response) {
            return response.sendFile(pathToIndexHtml);
        });
    }
}
exports.addViewIndexRoutesForSpa = addViewIndexRoutesForSpa;
;