"use strict";

interface RouterElement extends Element {
	go: (route: string, options?: any) => void;
}

define("cthulhuCharactersView", [ "cthulhuAuthService" ], (auth: Promise<AuthService>) => {
	// We do not do anything until the authentication resolves
	auth.then(service => {
		if (service.isAuthenticated === false) {
			// this is ugly^2, combining casting and dom manipulation with query :(
			const routerElement = <RouterElement> document.querySelector("app-router");
			// redirect user to front page.
			routerElement.go("/login");
			return;
		}

		Polymer({
			is: "cthulhu-characters-view",

			properties: {
				profile: {
					type: Object
				}
			},

			onProfileError: function(response: string) {
				console.log("Error getting profile:", response);
			}
		});
	});
});
