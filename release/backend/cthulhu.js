"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _path = require("path");

var path = _interopRequireWildcard(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("babel-polyfill");

var app = (0, _express2.default)();

app.set("port", process.env.PORT || 3000);
app.use("/components", _express2.default.static(path.join(__dirname + "../components")));
app.get("/", function (request, response) {
    response.send("Hello, World!");
});
app.listen(app.get("port"), function () {
    console.log("Cthulhu application listening on port:", app.get("port"));
});