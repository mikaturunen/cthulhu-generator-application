"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _q = require("q");

var Q = _interopRequireWildcard(_q);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Injector = function () {
    function Injector() {
        _classCallCheck(this, Injector);

        this.container = {};
        this.setupPromises = [];
    }

    _createClass(Injector, [{
        key: "isReady",
        value: function isReady() {
            return Q.all(this.setupPromises).then(function () {
                return true;
            }).catch(function () {
                return false;
            });
        }
    }, {
        key: "store",
        value: function store(name, content, setupFunction) {
            this.container[name] = {
                content: content,
                setupFunction: setupFunction
            };
            if (setupFunction !== undefined && !this.container[name].content[setupFunction]) {
                throw "No '" + setupFunction + "()' function in '" + name + "' present. Check your code.";
            }
        }
    }, {
        key: "get",
        value: function get(name) {
            var has = this.container[name];
            if (!has) {
                throw "No content with name " + name + " inside the container. Did you load the content and wait for ready to resolve?";
            }
            return has.content;
        }
    }, {
        key: "setup",
        value: function setup() {
            var _this = this;

            Object.keys(this.container).forEach(function (k) {
                return _this.resolveContentSetup(k, _this.container[k]);
            });
        }
    }, {
        key: "resolveContentSetup",
        value: function resolveContentSetup(key, has) {
            if (!has.setupFunction) {
                return;
            }
            this.setupPromises.push(has.content[has.setupFunction]());
        }
    }]);

    return Injector;
}();

;
exports.default = Injector;