"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _environment = require("../environment/environment");

var _mongodb = require("mongodb");

var mongodb = _interopRequireWildcard(_mongodb);

var _q = require("q");

var Q = _interopRequireWildcard(_q);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mongoClient = mongodb.MongoClient;
var databaseCollectionName = "profile";

var ProfileModule = function () {
    function ProfileModule(container) {
        _classCallCheck(this, ProfileModule);

        this.container = container;
    }

    _createClass(ProfileModule, [{
        key: "setup",
        value: function setup() {
            var _this = this;

            if (this.database) {
                return Q.resolve(true);
            }

            return Q.nfcall(mongoClient.connect, (0, _environment.getDatabaseConnectionString)()).then(function (db) {
                _this.database = db;
                return _this.database;
            }).then(function () {
                return _this.database.collections();
            }).then(function (collections) {
                if (collections.find(function (c) {
                    return c.collectionName === databaseCollectionName;
                })) {
                    return _this.database.collection(databaseCollectionName);
                }
                return _this.database.createCollection(databaseCollectionName);
            }).then(function (databaseCollection) {
                _this.collection = databaseCollection;
                return true;
            });
        }
    }, {
        key: "upsert",
        value: function upsert(document) {
            var _this2 = this;

            return this.collection.updateOne({
                _id: document._id
            }, document, {
                upsert: true
            }).then(function (result) {
                return _this2.get(document._id);
            });
        }
    }, {
        key: "get",
        value: function get(_id) {
            return this.collection.find({ _id: _id }).toArray().then(function (profiles) {
                return profiles.length > 0 ? profiles[0] : undefined;
            });
        }
    }]);

    return ProfileModule;
}();

exports.default = ProfileModule;