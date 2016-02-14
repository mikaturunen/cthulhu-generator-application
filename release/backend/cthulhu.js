"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("babel-polyfill");

var app = (0, _express2.default)();
app.get("/", function (request, response) {
    response.send("Hello, World!");
});
app.listen(3000, function () {
    console.log("Example app listening on port 3000!");
});