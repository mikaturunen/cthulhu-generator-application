"use strict";

// Probably would be a good idea to fix the typefiles for the commont typings so we could
// use the default export as "import passport from 'passport'".

import express from "express";
import passport from "passport";
import session from "express-session";
import passportGoogle from "passport-google-oauth";
import connectMongo from "connect-mongo";
import profile from "../profile/profile";
import log from "../log/log";

import {
	getEnvironmentalVariable,
	isInProduction,
	getDatabaseConnectionString
} from "../environment/environment";

const strategyGoogle = passportGoogle.OAuth2Strategy;
const mongoStore = connectMongo(session);
const authCallbackRoute = "/auth/google/callback";
const productionCallbackUrl = "https://cthulhu-characters.herokuapp.com" + authCallbackRoute;
const developmentCallbackUrl = "http://localhost:3000" + authCallbackRoute;

// There are several other types inside the InternalGoogleoProfile too but I'm not going to type them
// as we have no need for them -- this type is only used inside this file.
interface InternalGoogleoProfile {
	displayName: string;
	_json: {
		id: string;
	};
};

namespace Authentication {
	/**
	 * Connects the Passport middleware and and the strategies into Express.
	 * @param {Express.Application} app Express Application
	 */
	export function connectToExpress(app: express.Application) {
		passport.use(new strategyGoogle({
				// NOTE the real ID's are hidden in build servers and in developers environment,
				// 		never pushed to Git. Find them in our private conversations :)
				clientID: getEnvironmentalVariable("GOOGLE_CLIENT_ID", "NO CLIENT ID IN PLACE, SETUP! OAUTH2 WILL NOT WORK!", false),
				clientSecret: getEnvironmentalVariable("GOOGLE_CLIENT_SECRET", "NO CLIENT SECRET IN PLACE, SETUP! OAUTH2 WILL NOT WORK!", false),
				callbackURL: isInProduction() ? productionCallbackUrl : developmentCallbackUrl
			},
			(
				accessToken: string,
				refreshToken: string,
				googleProfile: InternalGoogleoProfile,
				done: (error: string, user?: InternalGoogleoProfile) => void
			) => {
				// Find user profile matching the google provider id and if it's not present, automatically create
				// empty profile for user.

				let profileId = googleProfile._json.id;
				console.log("USER LOGGED IN, Profile #:", googleProfile._json.id, profileId);
				profile.get(profileId).then((savedProfile: Profile) => {
					if (!savedProfile) {
						log.info("Profile does not exist. Creating profile for user:" + googleProfile.displayName);
						return profile.upsert({
							_id: profileId,
							characters: []
						});
					} else {
						log.info("Profile exists. Using existing one.");
						return savedProfile;
					}
				})
				.then((savedProfile: Profile) => {
					log.info("Profile OK: " + JSON.stringify(savedProfile, null, 2));
					done(null, googleProfile);
				})
				.catch((error: string) => {
					log.error("User will not be logged into the system as an error occured:" + error);
					done(error);
				});
			}
		));

		passport.serializeUser((user: any, done: (error: Error, user: any) => void) => {
			// console.log("Serialize:", user);
			done(null, user);
		});

		passport.deserializeUser((obj: any, done: (error: Error, obj: any) => void) => {
			// console.log("Deserialize:", obj);
			done(null, obj);
		});

		app.use(session({
			resave: true,
			saveUninitialized: true,
			secret: getEnvironmentalVariable("SESSION_SECRET_KEY", "LOCAL_SESSION_SECRET-123", false),
			store: new mongoStore({
				url: getDatabaseConnectionString(),
				ttl: 14 * 24 * 60 * 60 // = 14 days. Default
			}),
			cookie: {
				// 2 weeks in milliseconds, 14 days -- the above ttl is not in milliseconds!
				// These two essentially should match. TTL will clear the value from db and this will expire the local cooke.
				// Obviously if local cookie works and session is expired it does not work but it's good practice to match them.
				maxAge: 604800000 * 2
			}
		}));
		app.use(passport.initialize());
		app.use(passport.session());
	}

	/**
	 * Authenticates the request against google's authentication strategy.
	 * @param {express.Application} app Express application created with express().
	 */
	export function authenticate(app: express.Application) {
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
		app.get(authCallbackRoute, passport.authenticate("google", {
			successRedirect: "/",
			failureRedirect: "/"
		}));

		app.get("/logout", (request: express.Request, response: express.Response) => {
			if (request.logout !== undefined) {
				request.logout();
			}

			response.redirect("/");
		});

		app.get("/auth", (request: express.Request, response: express.Response) => {
			response.json(request.isAuthenticated ? request.isAuthenticated() : false);
		});
	}
}

export default Authentication;
