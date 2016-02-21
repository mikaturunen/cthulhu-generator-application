"use strict";

import express from "express";
import * as path from "path";

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
 */
export function addViewIndexRoutesForSpa(app: express.Application) {
	app.get("/", (request: express.Request, response: express.Response) =>
		response.sendFile(pathToIndexHtml));

	app.get("/front", (request: express.Request, response: express.Response) =>
		response.sendFile(pathToIndexHtml));
};
