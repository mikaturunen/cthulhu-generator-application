"use strict";

// ES6 Polyfill
require("babel-polyfill");

import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as parser from "body-parser";
import express from "express";
import { createNewCharacter } from "./character/character";
import authentication from "./authentication/authentication";

const favicon = require("serve-favicon");
const app = express();

// Using block-scoping for no real reason. Makes it easier to see what happens and where,
// will probably move the separate blocks into their own files once they grow a bit more.

// NOTE this is required by Heroku. Heroku heavily relies on environmental variables like this.
{	// Setting app wide application
	app.set("port", (process.env.PORT || 3000));
}

{	// Setting middlewares for Express
	app.use(cookieParser());
	app.use(parser.json());
	app.use(parser.urlencoded({ extended: true }));

	app.use(favicon(path.join(__dirname, "../components/favicon.ico")));
	app.use("/components", express.static(path.join(__dirname, "../components")));

	authentication.connectToExpress(app);
}

{	// Setting Express routes
	app.get("/", (request: express.Request, response: express.Response) => {
		response.sendFile(path.join(__dirname, "../components/index.html"));
	});

	app.get("/character", (request: express.Request, response: express.Response) => {
		response.json(createNewCharacter());
	});
}

// Starting the application
app.listen(app.get("port"), () => {
	console.log("Cthulhu application listening on port:", app.get("port"));
});
