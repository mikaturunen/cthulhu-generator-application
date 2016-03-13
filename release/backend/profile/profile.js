"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _environment = require("../environment/environment");

var _mongodb = require("mongodb");

var mongodb = _interopRequireWildcard(_mongodb);

var _q = require("q");

var Q = _interopRequireWildcard(_q);

var _log = require("../log/log");

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var mongoClient = mongodb.MongoClient;
var databaseCollectionName = "profile";
var Profile;
(function (Profile) {
    var database = undefined;
    var collection = undefined;
    function setup() {
        return Q.nfcall(mongoClient.connect, (0, _environment.getDatabaseConnectionString)()).then(function (db) {
            database = db;
            return database;
        }).then(function () {
            return database.collections();
        }).then(function (collections) {
            if (collections.find(function (c) {
                return c.collectionName === databaseCollectionName;
            })) {
                return database.collection(databaseCollectionName);
            }
            return database.createCollection(databaseCollectionName);
        }).then(function (databaseCollection) {
            collection = databaseCollection;
            return true;
        });
    }
    Profile.setup = setup;
    function upsert(document) {
        collection.updateOne({
            _id: document._id
        }, document, {
            upsert: true
        }).then(function (result) {
            _log2.default.info(JSON.stringify(result, null, 2));
            return get(document._id);
        });
    }
    Profile.upsert = upsert;
    function get(_id) {
        return collection.find({ _id: _id }).toArray().then(function (profiles) {
            return profiles.length > 0 ? profiles[0] : undefined;
        });
    }
    Profile.get = get;
})(Profile || (Profile = {}));
exports.default = Profile;