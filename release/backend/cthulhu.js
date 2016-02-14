"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("babel-polyfill");

var app = (0, _express2.default)();
app.set("port", process.env.PORT || 3000);
app.get("/", function (request, response) {
    response.send("Hello, World!");
});
app.listen(app.get("port"), function () {
    console.log("Cthulhu application listening on port:", app.get("port"));
});