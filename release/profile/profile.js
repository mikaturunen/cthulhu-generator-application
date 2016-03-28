"use strict";

var environment_1 = require("../environment/environment");
var mongodb = require("mongodb");
var Q = require("q");
var mongoClient = mongodb.MongoClient;
var databaseCollectionName = "profile";
var ProfileModule = function () {
    function ProfileModule(container) {
        this.container = container;
    }

    ProfileModule.prototype.setup = function () {
        var _this = this;
        if (this.database) {
            return Q.resolve(true);
        }

        return Q.nfcall(mongoClient.connect, environment_1.getDatabaseConnectionString()).then(function (db) {
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
    };

    ProfileModule.prototype.upsert = function (document) {
        var _this = this;
        return this.collection.updateOne({
            _id: document._id
        }, document, {
            upsert: true
        }).then(function (result) {
            return _this.get(document._id);
        });
    };

    ProfileModule.prototype.get = function (_id) {
        return this.collection.find({ _id: _id }).toArray().then(function (profiles) {
            return profiles.length > 0 ? profiles[0] : undefined;
        });
    };
    return ProfileModule;
}();
exports["default"] = ProfileModule;