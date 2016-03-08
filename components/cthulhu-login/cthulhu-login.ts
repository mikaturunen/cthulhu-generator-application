"use strict";

// NOTE why are we using "function()" inside Polmer when declaring functions and attaching
// 		them to element? Why not handleRedirectLogin: () => ? This is due to () => handling
// 		this dirreferently and we want to maintain access to Polymer with this.*

define("cthulhuLogin", [], () => {
	Polymer({
		is: "cthulhu-login",

		/**
		 * Attemps to login the user into the Google specific login url
		 */
		handleRedirectLogin: function() {
			window.location.href = "/auth/google";
		}
	});
});
