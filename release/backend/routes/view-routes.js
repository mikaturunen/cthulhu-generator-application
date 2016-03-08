"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addViewIndexRoutesForSpa = addViewIndexRoutesForSpa;

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _environment = require("../environment/environment");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var pathToIndexHtml = path.join(__dirname, "../../components/index.html");
function addViewIndexRoutesForSpa(app) {
    ["/", "/front", "/login"].forEach(function (route) {
        return app.get(route, function (request, response) {
            return response.sendFile(pathToIndexHtml);
        });
    });

    if ((0, _environment.isInProduction)() === true) {
        app.get("*", function (request, response) {
            return response.sendFile(pathToIndexHtml);
        });
    }
}
;