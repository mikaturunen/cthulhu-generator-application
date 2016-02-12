"use strict";

var _express = require("express");

var express = _interopRequireWildcard(_express);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var app = express();
app.get("/", function (request, response) {
    response.send("Hello, World!");
});
app.listen(3000, function () {
    console.log("Example app listening on port 3000!");
});