"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _passport = require("passport");

var passport = _interopRequireWildcard(_passport);

var _expressSession = require("express-session");

var session = _interopRequireWildcard(_expressSession);

var _passportGoogleOauth = require("passport-google-oauth");

var passportGoogle = _interopRequireWildcard(_passportGoogleOauth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var strategyGoogle = passportGoogle.OAuth2Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
passport.use(new strategyGoogle({
    clientID: process.env["GOOGLE_CLIENT_ID"],
    clientSecret: process.env["GOOGLE_CLIENT_SECRET"],

    callbackURL: "http://www.example.com/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
    console.log("Profile #:", profile);
    done(null, profile);
}));
var Authentication;
(function (Authentication) {
    function connectToExpress(app) {
        app.use(session({
            secret: "TEST-123"
        }));
        app.use(passport.initialize());
        app.use(passport.session());
    }
    Authentication.connectToExpress = connectToExpress;
    function authenticate() {
        return passport.authenticate("google", {
            successRedirect: "/ok",
            failureRedirect: "/"
        });
    }
    Authentication.authenticate = authenticate;
})(Authentication || (Authentication = {}));
exports.default = Authentication;