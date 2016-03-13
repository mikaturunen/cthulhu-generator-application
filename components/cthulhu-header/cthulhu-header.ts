"use strict";

define("cthulhuHeader", [], () => {
	Polymer({
		is: "cthulhu-header",

		properties: {
		},

		/**
		 * Handles the user logging out of the application.
		 */
		handleLogout: function() {
			// We also skip over the single page application and force a refresh to make sure
			// the cookie gets cleared from the browser once the backend tells it to do so. Refresh guarantees this.
			window.location.href = "/location";
		}
	});
});
