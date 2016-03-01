"use strict";

define("cthulhuAuthService", [], function () {
    var auth = new Promise(function (resolve, reject) {
        Polymer({
            is: "cthulhu-auth-service",

            onAuthenticationResponse: function onAuthenticationResponse(response) {
                return resolve(response.detail.xhr.response);
            },
            onAuthenticationError: function onAuthenticationError(response) {
                return reject(response);
            }
        });
    });

    return new Promise(function (resolve, reject) {
        auth.then(function (isAuthed) {
            return resolve({ isAuthenticated: isAuthed });
        }).catch(function (error) {
            return resolve({ isAuthenticated: false });
        });
    });
});