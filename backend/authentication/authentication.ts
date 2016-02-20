"use strict";

// Probably would be a good idea to fix the typefiles for the commont typings so we could
// use the default export as "import passport from 'passport'".

import express from "express";
import passport from "passport";
import session from "express-session";
import passportGoogle from "passport-google-oauth";
import { getEnvironmentalVariable } from "../environment/environment";

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
				// This URL needs to be configured into the local /etc/host to point to 127.0.0.1 so local env works with
				// google ->
				callbackURL: "http://localhost:3000/return"
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
	 */
	export function authenticate() {
		return passport.authenticate("google", {
			// Temp urls, just here for my personal testing :)
			successRedirect: "/ok",
			failureRedirect: "/"
		});
	}
}

export default Authentication;
