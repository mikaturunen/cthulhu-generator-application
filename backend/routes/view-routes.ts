"use strict";

import express from "express";
import * as path from "path";
import { isInProduction } from "../environment/environment";
import { createNewCharacter } from "../character/character";

// Add the injected content for type referencing
import ProfileModule from "../profile/profile";
import AuthenticationModule from "../authentication/authentication";

/**
 * Sole purpose of this file is to provide the routes for different "*-view" components in the front.
 * For example for path="/" we provide index.html, for path="/foobar" it provides index.html and so on..
 * Provide index.html for the front routes so the single page app frontend can then sort itself.
 */

const pathToIndexHtml = path.join(__dirname, "../../components/index.html");

// Note: we could also boldly just define that all routes not matching SOMETHING will return index.html
//       but it makes debugging different issue cases extremely difficult when you are only get index.html
//   	 for missing js files and such... Think how hard it would have been to debug the missing component .js
//   	 file cases with receiving index.html for all the js files :7

/**
 * Adds all the required frontend routes for Single Page App usage scenario.
 * @param {express.Application} app Application object from express().
 * @param {InversionOfControlContainer} container Container with all the modules loaded in.
 */
export function addViewIndexRoutesForSpa(app: express.Application, container: InversionOfControlContainer) {
	// Defining the routes we want to hook explicitly to index.html
	[
		"/",
		"/front",
		"/login"
	]
	.forEach(route => app.get(route, (request: express.Request, response: express.Response) =>
		response.sendFile(pathToIndexHtml)));

	let profileModule = container.get<ProfileModule>("profile");
	let authenticationModule = container.get<AuthenticationModule>("authentication");

	// Fetch logged in user profile, otherwise report 401 to user
	app.get("/profile", (request: express.Request, response: express.Response) => {
		if (!authenticationModule.isAuthenticated(request)) {
			response.status(401);
			return;
		}

		// TODO proper error sending to fron in .catch
		profileModule.get(request.user._json.id)
			.then(profile => response.json(profile))
			.catch(() => response.json({}));
	});

	// Route for creating new characters. Allowed only for logged in users as the character
	// gets added to the users own Profile
	app.get("/character", (request: express.Request, response: express.Response) => {
		if (!authenticationModule.isAuthenticated(request)) {
			response.status(401);
			return;
		}

		let newCharacter = createNewCharacter();
		profileModule.get(request.user._json.id)
			.then(userProfile => {
				userProfile.characters.push(newCharacter);
				console.log("Generated character");
				return profileModule.upsert(userProfile);
			})
			.then(userProfile => {
				console.log("profile:", userProfile);
				response.json(userProfile);
			})
			.catch(() => response.status(500));
	});

	// When in production, we offer index.html from all the routes so that front does
	// not explode when user navigates to /foo/bar/testing/asfadsf?€32423&421
	// instead we offer index.html and allow the front page to resolve the explosion.
	// -- in development we'll allow it to explode into pieces and we can better debug the issues.
	if (isInProduction() === true) {
		app.get("*", (request: express.Request, response: express.Response) =>
			response.sendFile(pathToIndexHtml));
	}
};
