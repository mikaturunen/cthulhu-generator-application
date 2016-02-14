"use strict";

// ES6 Polyfill
require("babel-polyfill");

import express from "express";
import * as path from "path";

const app = express();

// NOTE this is required by Heroku. Heroku heavily relies on environmental variables like this.
app.set("port", (process.env.PORT || 3000));

app.use("/components", express.static(path.join(__dirname, "../components")));

app.get("/", (request: express.Request, response: express.Response) => {
    response.sendFile(path.join(__dirname, "../components/index.html"));
});

app.listen(app.get("port"), () => {
    console.log("Cthulhu application listening on port:", app.get("port"));
});
