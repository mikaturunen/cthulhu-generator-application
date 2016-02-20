"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _passportGoogleOauth = require("passport-google-oauth");

var _passportGoogleOauth2 = _interopRequireDefault(_passportGoogleOauth);

var _environment = require("../environment/environment");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var strategyGoogle = _passportGoogleOauth2.default.OAuth2Strategy;
var Authentication;
(function (Authentication) {
    function connectToExpress(app) {
        _passport2.default.use(new strategyGoogle({
            clientID: (0, _environment.getEnvironmentalVariable)("GOOGLE_CLIENT_ID", "NO CLIENT ID IN PLACE, SETUP! OAUTH2 WILL NOT WORK!"),
            clientSecret: (0, _environment.getEnvironmentalVariable)("GOOGLE_CLIENT_SECRET", "NO CLIENT SECRET IN PLACE, SETUP! OAUTH2 WILL NOT WORK!"),

            callbackURL: "http://localhost:3000/return"
        }, function (accessToken, refreshToken, profile, done) {
            console.log("Profile #:", profile);
            done(null, profile);
        }));
        _passport2.default.serializeUser(function (user, done) {
            console.log("Serialize:", user);
            done(null, user);
        });
        _passport2.default.deserializeUser(function (obj, done) {
            console.log("Deserialize:", obj);
            done(null, obj);
        });
        app.use((0, _expressSession2.default)({
            secret: (0, _environment.getEnvironmentalVariable)("SESSION_SECRET_KEY", "LOCAL_SESSION_SECRET-123"),
            resave: true,
            saveUninitialized: true
        }));
        app.use(_passport2.default.initialize());
        app.use(_passport2.default.session());
    }
    Authentication.connectToExpress = connectToExpress;

    function authenticate() {
        return _passport2.default.authenticate("google", {
            successRedirect: "/ok",
            failureRedirect: "/"
        });
    }
    Authentication.authenticate = authenticate;
})(Authentication || (Authentication = {}));
exports.default = Authentication;