"use strict";

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _bodyParser = require("body-parser");

var parser = _interopRequireWildcard(_bodyParser);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _character = require("./character/character");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

require("babel-polyfill");

var favicon = require("serve-favicon");
var app = (0, _express2.default)();

{
    app.set("port", process.env.PORT || 3000);
}
{
    app.use((0, _cookieParser2.default)());
    app.use(parser.json());
    app.use(parser.urlencoded({ extended: true }));
    app.use(favicon(path.join(__dirname, "../components/favicon.ico")));
    app.use("/components", _express2.default.static(path.join(__dirname, "../components")));
}
{
    app.get("/", function (request, response) {
        response.sendFile(path.join(__dirname, "../components/index.html"));
    });

    app.get("/google46f5c1efa1dd1848.html", function (request, response) {
        response.sendFile(path.join(__dirname, "../components/google46f5c1efa1dd1848.html"));
    });

    app.get("/character", function (request, response) {
        response.json((0, _character.createNewCharacter)());
    });
}

app.listen(app.get("port"), function () {
    console.log("Cthulhu application listening on port:", app.get("port"));
});