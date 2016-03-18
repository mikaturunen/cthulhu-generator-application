"use strict";

// ES6 Polyfill
require("babel-polyfill");

import * as path from "path";
import * as parser from "body-parser";
import express from "express";
import cookieParser from "cookie-parser";
import { createNewCharacter } from "./character/character";
import authentication from "./authentication/authentication";
import { printProductionStatus } from "./environment/environment";
import { addViewIndexRoutesForSpa } from "./routes/view-routes";
import profile from "./profile/profile";

const favicon = require("serve-favicon");
const app = express();

printProductionStatus();

// Make sure all our modules are initialized; we essentially could use a DI container here and make sure
// everything is in working order through the DI container but we'll do it this way for now. We'll switch
// to DI once it gets a bit more complicated. This will do for now just fine.

profile.setup()
	.then(() => {
		// All modules are now in working order, let the driving begin!

		// Using block-scoping for no real reason. Makes it easier to see what happens and where,
		// will probably move the separate blocks into their own files once they grow a bit more.

		// NOTE this is required by Heroku. Heroku heavily relies on environmental variables like this.
		{	// Setting app wide application
			// PORT is in Heroku hands, we do not touch it.
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
			addViewIndexRoutesForSpa(app);

			// Used for Google verification - do NOT remove this or cthulhu-charactres.herokuapp.com gets unverified by Google
			app.get("/google46f5c1efa1dd1848.html", (request: express.Request, response: express.Response) => {
				response.sendFile(path.join(__dirname, "../components/google46f5c1efa1dd1848.html"));
			});

			app.get("/getcharacter", (request: express.Request, response: express.Response) => {
				response.json(createNewCharacter());
			});

			authentication.authenticate(app);
		}

		// Starting the application
		app.listen(app.get("port"), () => {
			console.log("Cthulhu application listening on port:", app.get("port"));
		});
	})
	.catch(console.log);
