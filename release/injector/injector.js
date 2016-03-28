"use strict";

var Q = require("q");
var Injector = function () {
    function Injector() {
        this.container = {};
        this.setupPromises = [];
    }

    Injector.prototype.isReady = function () {
        return Q.all(this.setupPromises).then(function () {
            return true;
        }).catch(function () {
            return false;
        });
    };

    Injector.prototype.store = function (name, content, setupFunction) {
        this.container[name] = {
            content: content,
            setupFunction: setupFunction
        };
        if (setupFunction !== undefined && !this.container[name].content[setupFunction]) {
            throw "No '" + setupFunction + "()' function in '" + name + "' present. Check your code.";
        }
    };

    Injector.prototype.get = function (name) {
        var has = this.container[name];
        if (!has) {
            throw "No content with name " + name + " inside the container. Did you load the content and wait for ready to resolve?";
        }
        return has.content;
    };

    Injector.prototype.setup = function () {
        var _this = this;
        Object.keys(this.container).forEach(function (k) {
            return _this.resolveContentSetup(k, _this.container[k]);
        });
    };

    Injector.prototype.resolveContentSetup = function (key, has) {
        if (!has.setupFunction) {
            return;
        }
        this.setupPromises.push(has.content[has.setupFunction]());
    };
    return Injector;
}();
;
exports["default"] = Injector;