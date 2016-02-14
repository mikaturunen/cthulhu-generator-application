"use strict";

// ES6 Polyfill
require("babel-polyfill");

import express from "express";

const app = express();

app.set("port", (process.env.PORT || 3000));

app.get("/", (request: express.Request, response: express.Response) => {
    response.send("Hello, World!");
});

app.listen(app.get("port"), () => {
    console.log("Cthulhu application listening on port:", app.get("port"));
});
