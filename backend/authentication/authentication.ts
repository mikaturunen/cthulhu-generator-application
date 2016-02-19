"use strict";

// Probably would be a good idea to fix the typefiles for the commont typings so we could
// use the default export as "import passport from 'passport'".

import express from "express";
import passport from "passport";
import session from "express-session";
import passportGoogle from "passport-google-oauth";

const strategyGoogle = passportGoogle.OAuth2Strategy;

passport.use(new strategyGoogle({
		// NOTE the real ID's are hidden in build servers and in developers environment,
		// 		never pushed to Git.
		clientID: process.env["GOOGLE_CLIENT_ID"] || "cat",
		clientSecret: process.env["GOOGLE_CLIENT_SECRET"] || "doge",
		// This URL needs to be configured into the local /etc/host
		callbackURL: "http://www.example.com/auth/google/callback"
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

namespace Authentication {
	/**
	 * Connects the Passport middleware and and the strategies into Express.
	 * @param {Express.Application} app Express Application
	 */
	export function connectToExpress(app: express.Application) {
		app.use(session({
			secret: "TEST-123",
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
