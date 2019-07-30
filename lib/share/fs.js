"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _bluebird = _interopRequireDefault(require("bluebird"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = _bluebird["default"].promisifyAll(_fs["default"]);

exports["default"] = _default;