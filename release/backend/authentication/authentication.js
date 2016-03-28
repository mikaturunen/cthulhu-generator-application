"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _passportGoogleOauth = require("passport-google-oauth");

var _passportGoogleOauth2 = _interopRequireDefault(_passportGoogleOauth);

var _connectMongo = require("connect-mongo");

var _connectMongo2 = _interopRequireDefault(_connectMongo);

var _log = require("../log/log");

var _log2 = _interopRequireDefault(_log);

var _environment = require("../environment/environment");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var strategyGoogle = _passportGoogleOauth2.default.OAuth2Strategy;
var mongoStore = (0, _connectMongo2.default)(_expressSession2.default);
var authCallbackRoute = "/auth/google/callback";
var productionCallbackUrl = "https://cthulhu-characters.herokuapp.com" + authCallbackRoute;
var developmentCallbackUrl = "http://localhost:3000" + authCallbackRoute;
;

var AuthenticationModule = function () {
    function AuthenticationModule(container) {
        _classCallCheck(this, AuthenticationModule);

        this.container = container;
    }

    _createClass(AuthenticationModule, [{
        key: "connectToExpress",
        value: function connectToExpress(app) {
            var profile = this.container.get("profile");
            _passport2.default.use(new strategyGoogle({
                clientID: (0, _environment.getEnvironmentalVariable)("GOOGLE_CLIENT_ID", "NO CLIENT ID IN PLACE, SETUP! OAUTH2 WILL NOT WORK!", false),
                clientSecret: (0, _environment.getEnvironmentalVariable)("GOOGLE_CLIENT_SECRET", "NO CLIENT SECRET IN PLACE, SETUP! OAUTH2 WILL NOT WORK!", false),
                callbackURL: (0, _environment.isInProduction)() ? productionCallbackUrl : developmentCallbackUrl
            }, function (accessToken, refreshToken, googleProfile, done) {
                var profileId = googleProfile._json.id;
                console.log("USER LOGGED IN, Profile #:", googleProfile._json.id, profileId);
                profile.get(profileId).then(function (savedProfile) {
                    if (!savedProfile) {
                        _log2.default.info("Profile does not exist. Creating profile for user:" + googleProfile.displayName);
                        return profile.upsert({
                            _id: profileId,
                            characters: []
                        });
                    } else {
                        _log2.default.info("Profile exists. Using existing one.");
                        return savedProfile;
                    }
                }).then(function (savedProfile) {
                    _log2.default.info("Profile OK: " + JSON.stringify(savedProfile, null, 2));
                    done(null, googleProfile);
                }).catch(function (error) {
                    _log2.default.error("User will not be logged into the system as an error occured:" + error);
                    done(error);
                });
            }));
            _passport2.default.serializeUser(function (user, done) {
                done(null, user);
            });
            _passport2.default.deserializeUser(function (obj, done) {
                done(null, obj);
            });
            app.use((0, _expressSession2.default)({
                resave: true,
                saveUninitialized: true,
                secret: (0, _environment.getEnvironmentalVariable)("SESSION_SECRET_KEY", "LOCAL_SESSION_SECRET-123", false),
                store: new mongoStore({
                    url: (0, _environment.getDatabaseConnectionString)(),
                    ttl: 14 * 24 * 60 * 60 }),
                cookie: {
                    maxAge: 604800000 * 2
                }
            }));
            app.use(_passport2.default.initialize());
            app.use(_passport2.default.session());
        }
    }, {
        key: "authenticate",
        value: function authenticate(app) {
            app.get("/auth/google", _passport2.default.authenticate("google", {
                scope: ["https://www.googleapis.com/auth/plus.login"]
            }));

            app.get(authCallbackRoute, _passport2.default.authenticate("google", {
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
        }
    }, {
        key: "isAuthenticated",
        value: function isAuthenticated(request) {
            return request.isAuthenticated ? request.isAuthenticated() : false;
        }
    }]);

    return AuthenticationModule;
}();

exports.default = AuthenticationModule;