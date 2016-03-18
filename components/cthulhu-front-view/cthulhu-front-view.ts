"use strict";

interface RouterElement extends Element {
	go: (route: string, options?: any) => void;
}

define("cthulhuFrontView", [ "cthulhuAuthService" ], (auth: Promise<AuthService>) => {
	// We do not do anything until the authentication resolves
	auth.then(service => {
		if (service.isAuthenticated === false) {
			// this is ugly^2, combining casting and dom manipulation with query :(
			const routerElement = <RouterElement> document.querySelector("app-router");
			// redirect user to front page.
			// TODO might want to implement html5 push/pop states for correct url building after this
			routerElement.go("/login");
			return;
		}

		Polymer({
			is: "cthulhu-front-view",

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
