"use strict";

var Log;
(function (Log) {
  function trace(message) {
    console.log("[debug]: " + message);
  }
  Log.trace = trace;

  function info(message) {
    console.log("[info ]: " + message);
  }
  Log.info = info;

  function error(message) {
    console.log("[error]: " + message);
  }
  Log.error = error;
})(Log || (Log = {}));
;
exports["default"] = Log;