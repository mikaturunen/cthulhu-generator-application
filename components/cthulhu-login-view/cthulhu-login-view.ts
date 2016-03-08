"use strict";

define("cthulhuLoginView", [ "cthulhuAuthService" ], (auth: Promise<AuthService>) => {
	// We do not do anything until the authentication resolves
	auth.then(service => {
		if (service.isAuthenticated === true) {
			// this is ugly^2, combining casting and dom manipulation with query :(
			const routerElement = <RouterElement> document.querySelector("app-router");
			// redirect user to front page.
			// TODO might want to implement html5 push/pop states for correct url building after this
			routerElement.go("/front");
			return;
		}

		Polymer({
			is: "cthulhu-login-view",
			properties: {
			}
		});
	});
});
