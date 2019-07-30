"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _const = require("./const");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * 
 * @param {Boolean} showLogs Show logs or not
 * @param {Number} level Logs Level
 * @returns {(msg: String) => String}
 */
var createLogger = function createLogger(showLogs, level) {
  var _LEVEL_DEBUG$LEVEL_WA;

  var msgPrefix = (_LEVEL_DEBUG$LEVEL_WA = {}, _defineProperty(_LEVEL_DEBUG$LEVEL_WA, _const.LEVEL_DEBUG, "Debug"), _defineProperty(_LEVEL_DEBUG$LEVEL_WA, _const.LEVEL_WARN, "Warn"), _defineProperty(_LEVEL_DEBUG$LEVEL_WA, _const.LEVEL_INFO, "Info"), _defineProperty(_LEVEL_DEBUG$LEVEL_WA, _const.LEVEL_ERROR, "Error"), _LEVEL_DEBUG$LEVEL_WA)[level] || "Info";

  if (!showLogs) {
    return function (msg) {
      return msg;
    };
  }

  return function (msg) {
    console.log("[".concat(msgPrefix, "] AutoRebuildDllPlugin:"), msg);
    return msg;
  };
};

var _default = createLogger;
exports["default"] = _default;