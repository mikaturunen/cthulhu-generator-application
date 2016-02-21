"use strict";

// Probably would be a good idea to fix the typefiles for the commont typings so we could
// use the default export as "import passport from 'passport'".

import express from "express";
import passport from "passport";
import session from "express-session";
import passportGoogle from "passport-google-oauth";
import {
	getEnvironmentalVariable,
	isInProduction
} from "../environment/environment";

const strategyGoogle = passportGoogle.OAuth2Strategy;

namespace Authentication {
	/**
	 * Connects the Passport middleware and and the strategies into Express.
	 * @param {Express.Application} app Express Application
	 */
	export function connectToExpress(app: express.Application) {
		passport.use(new strategyGoogle({
				// NOTE the real ID's are hidden in build servers and in developers environment,
				// 		never pushed to Git. Find them in our private conversations :)
				clientID: getEnvironmentalVariable("GOOGLE_CLIENT_ID", "NO CLIENT ID IN PLACE, SETUP! OAUTH2 WILL NOT WORK!"),
				clientSecret: getEnvironmentalVariable("GOOGLE_CLIENT_SECRET", "NO CLIENT SECRET IN PLACE, SETUP! OAUTH2 WILL NOT WORK!"),
				callbackURL: isInProduction() ?
					"https://cthulhu-characters.herokuapp.com/auth/google/callback" :
					"http://localhost:3000/auth/google/callback"
			},
			(
				accessToken: string,
				refreshToken: string,
				profile: any,
				done: (error: string, user: any) => void
			) => {
				// TODO get user from database, currently we just return the whole google profile
				console.log("Profile #:", profile);
				done(null, profile);
			}
		));

		passport.serializeUser((user: any, done: (error: Error, user: any) => void) => {
			console.log("Serialize:", user);
			done(null, user);
		});

		passport.deserializeUser((obj: any, done: (error: Error, obj: any) => void) => {
			console.log("Deserialize:", obj);
			done(null, obj);
		});

		app.use(session({
			secret: getEnvironmentalVariable("SESSION_SECRET_KEY", "LOCAL_SESSION_SECRET-123"),
			resave: true,
			saveUninitialized: true
		}));
		app.use(passport.initialize());
		app.use(passport.session());
	}

	/**
	 * Authenticates the request against google's authentication strategy.
	 * @param {express.Application} app Express application created with express().
	 */
	export function authenticate(app: express.Application) {
		interface LogoutRequest extends express.Request {
			logout: () => void;
		};

		// Use passport.authenticate() as route middleware to authenticate the
		// request.  The first step in Google authentication will involve
		// redirecting the user to google.com.  After authorization, Google
		// will redirect the user back to this application at /auth/google/callback
		app.get("/auth/google", passport.authenticate("google", {
			scope: [
				"https://www.googleapis.com/auth/plus.login"
			]
		}));

		// Use passport.authenticate() as route middleware to authenticate the
		// request. If authentication fails, the user will be redirected back to the
		// login page. Otherwise, the primary route function function will be called,
		// which, in this example, will redirect the user to the home page.
		app.get("/auth/google/callback", passport.authenticate("google", {
			successRedirect: "/front",
			failureRedirect: "/"
		}));

		app.get("/logout", (request: LogoutRequest, response: express.Response) => {
			request.logout();
			response.redirect("/");
		});
	}
}

export default Authentication;
