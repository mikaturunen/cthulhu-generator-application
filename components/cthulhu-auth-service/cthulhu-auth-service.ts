"use strict";

define("cthulhuAuthService", [], () => {
	// Create separate promise for the actual auth information
	const auth = new Promise<boolean>((
			resolve: (isAuthenticated: boolean) => void,
			reject: (error: string) => void
		) => {

		// TODO we might need to do support for authorization

		Polymer({
			is: "cthulhu-auth-service",
			// TODO type response 'any' properly
			onAuthenticationResponse: (response: any) => resolve(response.detail.xhr.response),
			onAuthenticationError: (response: string) => reject(response)
		});
	});

	// Create promise for the whole service and return it so outside sources can use it.
	return new Promise<AuthService>((
			resolve: (service: AuthService) => void,
			reject: (service: AuthService) => void
		) => {

		auth.then(isAuthed => resolve({ isAuthenticated: isAuthed }))
			.catch(error => resolve({ isAuthenticated: false }));
	});
});
