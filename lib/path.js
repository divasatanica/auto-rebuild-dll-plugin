"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cacheDir = void 0;

var _findCacheDir = _interopRequireDefault(require("find-cache-dir"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var cacheDir = (0, _findCacheDir["default"])({
  name: 'auto-rebuild-dll-plugin'
});
exports.cacheDir = cacheDir;