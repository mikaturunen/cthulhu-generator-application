"use strict";

// Probably would be a good idea to fix the typefiles for the commont typings so we could
// use the default export as "import passport from 'passport'".

import express from "express";
import * as passport from "passport";
import * as session from "express-session";
import * as passportGoogle from "passport-google-oauth";

const strategyGoogle = passportGoogle.OAuth2Strategy;

/*
 * To support persistent login sessions, Passport needs to be able to
 * serialize users into and deserialize users out of the session.  Typically,
 * this will be as simple as storing the user ID when serializing, and finding
 * the user by ID when deserializing.  However, since this example does not
 * have a database of user records, the complete Google profile is serialized
 * and deserialized.
 */

passport.serializeUser((user: any, done: (error: Error, user: any) => void) => {
	done(null, user);
});

passport.deserializeUser((obj: any, done: (error: Error, obj: any) => void) => {
	done(null, obj);
});

passport.use(new strategyGoogle({
		// NOTE the real ID's are hidden in build servers and in developers environment,
		// 		never pushed to Git.
		clientID: process.env["GOOGLE_CLIENT_ID"],
		clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
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

namespace Authentication {
	/**
	 * Connects the Passport middleware and and the strategies into Express.
	 * @param {Express.Application} app Express Application
	 */
	export function connectToExpress(app: express.Application) {
		app.use(session({
			secret: "TEST-123"
		}));
		app.use(passport.initialize());
		app.use(passport.session());
	}

	export function authenticate() {
		return passport.authenticate("google", {
			// Temp urls, just here for my personal testing :)
			successRedirect: "/ok",
			failureRedirect: "/"
		});
	}
}

export default Authentication;
