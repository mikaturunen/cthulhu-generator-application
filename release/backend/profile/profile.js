"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _environment = require("../environment/environment");

var _mongodb = require("mongodb");

var mongodb = _interopRequireWildcard(_mongodb);

var _q = require("q");

var Q = _interopRequireWildcard(_q);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var mongoClient = mongodb.MongoClient;
var Profile;
(function (Profile) {
    var database = undefined;
    function setup() {
        return Q.nfcall(mongoClient.connect, (0, _environment.getDatabaseConnectionString)()).then(function (db) {
            database = db;
            return Q.resolve(database);
        }).then(function () {
            return database.collections();
        }).then(function (collections) {
            console.log("found collections:", collections.map(function (c) {
                return c.collectionName;
            }));
        });
    }
    Profile.setup = setup;
})(Profile || (Profile = {}));
exports.default = Profile;