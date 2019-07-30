"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webpack = require("webpack");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(dllConfig) {
  var output = dllConfig.output,
      entry = dllConfig.entry;

  if (!output || !entry) {
    throw new Error("Invalid Dll Config!");
  }

  var libraryName = output.library || "_dll_[name]_",
      outputPath = output.path;
  return {
    entry: entry,
    output: output,
    plugins: [new _webpack.DllPlugin({
      path: _path["default"].join(outputPath, "[name].manifest.json"),
      name: libraryName
    })]
  };
};

exports["default"] = _default;