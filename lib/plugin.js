"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));

var _normalizeConfig = _interopRequireDefault(require("./normalizeConfig"));

var _logger = _interopRequireDefault(require("./share/logger"));

var _validateCache = _interopRequireDefault(require("./validateCache"));

var _compileDll = require("./compileDll");

var _const = require("./share/const");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AutoRebuildDllPlugin =
/*#__PURE__*/
function () {
  function AutoRebuildDllPlugin(settings) {
    _classCallCheck(this, AutoRebuildDllPlugin);

    this._settings = settings;
  }

  _createClass(AutoRebuildDllPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var settings = Object.assign(compiler.options, this._settings);
      var errLogger = (0, _logger["default"])(
      /* showLog= */
      settings.debug,
      /* level= */
      _const.LEVEL_ERROR);
      var dllConfig = settings.dllConfig;

      if ((0, _isEmpty["default"])(dllConfig.entry)) {
        return;
      }

      var rebuildDll = function rebuildDll(compiler, callback) {
        (0, _validateCache["default"])(settings).then(function (isValid) {
          if (isValid) {
            return callback();
          }

          return Promise.resolve().then(function () {
            return (0, _compileDll.runCompiler)(function () {
              return (0, _webpack["default"])((0, _normalizeConfig["default"])(dllConfig));
            });
          }).then(function () {
            return callback();
          });
        })["catch"](errLogger);
      };

      compiler.hooks.run.tapAsync("AutoRebuildDllPlugin", rebuildDll);
    }
  }]);

  return AutoRebuildDllPlugin;
}();

var _default = AutoRebuildDllPlugin;
exports["default"] = _default;