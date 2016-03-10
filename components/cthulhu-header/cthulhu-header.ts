"use strict";

define("cthulhuHeader", [], () => {
	Polymer({
		is: "cthulhu-header",
		properties: {

		},

		/**
		 * Attemps to logout the user
		 */
		handleLogout: function() {
			window.location.href = "/logout";
		}
	});
});
