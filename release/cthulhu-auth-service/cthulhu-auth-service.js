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
    var nonAuthenticatedRedirecToLogin = function nonAuthenticatedRedirecToLogin() {
        var routerElement = document.querySelector("app-router");

        routerElement.go("/login");
    };

    return new Promise(function (resolve, reject) {
        auth.then(function (isAuthed) {
            if (isAuthed === false) {
                nonAuthenticatedRedirecToLogin();
                reject("User not authorized.");
                return;
            }
            resolve({ isAuthenticated: isAuthed });
        }).catch(function (error) {
            console.log(error);
            reject("User not authorized.");
        });
    });
});