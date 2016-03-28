"use strict";

var passport_1 = require("passport");
var express_session_1 = require("express-session");
var passport_google_oauth_1 = require("passport-google-oauth");
var connect_mongo_1 = require("connect-mongo");
var log_1 = require("../log/log");
var environment_1 = require("../environment/environment");
var strategyGoogle = passport_google_oauth_1["default"].OAuth2Strategy;
var mongoStore = connect_mongo_1["default"](express_session_1["default"]);
var authCallbackRoute = "/auth/google/callback";
var productionCallbackUrl = "https://cthulhu-characters.herokuapp.com" + authCallbackRoute;
var developmentCallbackUrl = "http://localhost:3000" + authCallbackRoute;
;
var AuthenticationModule = function () {
    function AuthenticationModule(container) {
        this.container = container;
    }

    AuthenticationModule.prototype.connectToExpress = function (app) {
        var profile = this.container.get("profile");
        passport_1["default"].use(new strategyGoogle({
            clientID: environment_1.getEnvironmentalVariable("GOOGLE_CLIENT_ID", "NO CLIENT ID IN PLACE, SETUP! OAUTH2 WILL NOT WORK!", false),
            clientSecret: environment_1.getEnvironmentalVariable("GOOGLE_CLIENT_SECRET", "NO CLIENT SECRET IN PLACE, SETUP! OAUTH2 WILL NOT WORK!", false),
            callbackURL: environment_1.isInProduction() ? productionCallbackUrl : developmentCallbackUrl
        }, function (accessToken, refreshToken, googleProfile, done) {
            var profileId = googleProfile._json.id;
            console.log("USER LOGGED IN, Profile #:", googleProfile._json.id, profileId);
            profile.get(profileId).then(function (savedProfile) {
                if (!savedProfile) {
                    log_1["default"].info("Profile does not exist. Creating profile for user:" + googleProfile.displayName);
                    return profile.upsert({
                        _id: profileId,
                        characters: []
                    });
                } else {
                    log_1["default"].info("Profile exists. Using existing one.");
                    return savedProfile;
                }
            }).then(function (savedProfile) {
                log_1["default"].info("Profile OK: " + JSON.stringify(savedProfile, null, 2));
                done(null, googleProfile);
            }).catch(function (error) {
                log_1["default"].error("User will not be logged into the system as an error occured:" + error);
                done(error);
            });
        }));
        passport_1["default"].serializeUser(function (user, done) {
            done(null, user);
        });
        passport_1["default"].deserializeUser(function (obj, done) {
            done(null, obj);
        });
        app.use(express_session_1["default"]({
            resave: true,
            saveUninitialized: true,
            secret: environment_1.getEnvironmentalVariable("SESSION_SECRET_KEY", "LOCAL_SESSION_SECRET-123", false),
            store: new mongoStore({
                url: environment_1.getDatabaseConnectionString(),
                ttl: 14 * 24 * 60 * 60 }),
            cookie: {
                maxAge: 604800000 * 2
            }
        }));
        app.use(passport_1["default"].initialize());
        app.use(passport_1["default"].session());
    };

    AuthenticationModule.prototype.authenticate = function (app) {
        app.get("/auth/google", passport_1["default"].authenticate("google", {
            scope: ["https://www.googleapis.com/auth/plus.login"]
        }));

        app.get(authCallbackRoute, passport_1["default"].authenticate("google", {
            successRedirect: "/",
            failureRedirect: "/"
        }));
        app.get("/logout", function (request, response) {
            if (request.logout !== undefined) {
                request.logout();
            }
            response.redirect("/");
        });
        app.get("/auth", function (request, response) {
            response.json(request.isAuthenticated ? request.isAuthenticated() : false);
        });
    };

    AuthenticationModule.prototype.isAuthenticated = function (request) {
        return request.isAuthenticated ? request.isAuthenticated() : false;
    };
    return AuthenticationModule;
}();
exports["default"] = AuthenticationModule;