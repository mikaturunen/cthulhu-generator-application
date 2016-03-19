"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addViewIndexRoutesForSpa = addViewIndexRoutesForSpa;

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _environment = require("../environment/environment");

var _profile = require("../profile/profile");

var _profile2 = _interopRequireDefault(_profile);

var _character = require("../character/character");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var pathToIndexHtml = path.join(__dirname, "../../components/index.html");
function addViewIndexRoutesForSpa(app) {
    ["/", "/front", "/login"].forEach(function (route) {
        return app.get(route, function (request, response) {
            return response.sendFile(pathToIndexHtml);
        });
    });
    app.get("/profile", function (request, response) {
        if (request.isAuthenticated ? request.isAuthenticated() : false) {
            _profile2.default.get(request.user._json.id).then(function (profile) {
                return response.json(profile);
            }).catch(function () {
                return response.json({});
            });
        } else {
            response.status(401);
        }
    });
    app.get("/character", function (request, response) {
        if (request.isAuthenticated ? request.isAuthenticated() : false) {
            (function () {
                var newCharacter = (0, _character.createNewCharacter)();
                _profile2.default.get(request.user._json.id).then(function (userProfile) {
                    userProfile.characters.push(newCharacter);
                    console.log("Generated character");
                    return _profile2.default.upsert(userProfile);
                }).then(function (userProfile) {
                    console.log("profile:", userProfile);
                    response.json(userProfile);
                }).catch(function () {
                    return response.status(500);
                });
            })();
        } else {
            response.status(401);
        }
    });

    if ((0, _environment.isInProduction)() === true) {
        app.get("*", function (request, response) {
            return response.sendFile(pathToIndexHtml);
        });
    }
}
;