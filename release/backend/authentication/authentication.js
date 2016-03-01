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

var _connectMongo = require("connect-mongo");

var _connectMongo2 = _interopRequireDefault(_connectMongo);

var _environment = require("../environment/environment");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var strategyGoogle = _passportGoogleOauth2.default.OAuth2Strategy;
var mongoStore = (0, _connectMongo2.default)(_expressSession2.default);
var authCallbackRoute = "/auth/google/callback";
var productionCallbackUrl = "https://cthulhu-characters.herokuapp.com" + authCallbackRoute;
var developmentCallbackUrl = "http://localhost:3000" + authCallbackRoute;
var Authentication;
(function (Authentication) {
    function connectToExpress(app) {
        _passport2.default.use(new strategyGoogle({
            clientID: (0, _environment.getEnvironmentalVariable)("GOOGLE_CLIENT_ID", "NO CLIENT ID IN PLACE, SETUP! OAUTH2 WILL NOT WORK!", false),
            clientSecret: (0, _environment.getEnvironmentalVariable)("GOOGLE_CLIENT_SECRET", "NO CLIENT SECRET IN PLACE, SETUP! OAUTH2 WILL NOT WORK!", false),
            callbackURL: (0, _environment.isInProduction)() ? productionCallbackUrl : developmentCallbackUrl
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
    Authentication.connectToExpress = connectToExpress;

    function authenticate(app) {
        ;

        app.get("/auth/google", _passport2.default.authenticate("google", {
            scope: ["https://www.googleapis.com/auth/plus.login"]
        }));

        app.get(authCallbackRoute, _passport2.default.authenticate("google", {
            successRedirect: "/front",
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
    Authentication.authenticate = authenticate;
})(Authentication || (Authentication = {}));
exports.default = Authentication;