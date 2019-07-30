"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

var _makeDir = _interopRequireDefault(require("make-dir"));

var _readPkg = _interopRequireDefault(require("read-pkg"));

var _fs = _interopRequireDefault(require("./share/fs"));

var _path2 = require("./path");

var _logger = _interopRequireDefault(require("./share/logger"));

var _const = require("./share/const");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _default = function _default(settings) {
  var _settings$debug = settings.debug,
      debug = _settings$debug === void 0 ? false : _settings$debug,
      dllConfig = settings.dllConfig;
  var errLogger = (0, _logger["default"])(
  /* showLogs= */
  debug,
  /* level= */
  _const.LEVEL_ERROR);
  var infoLogger = (0, _logger["default"])(debug, _const.LEVEL_INFO);

  var prevPkgPath = _path["default"].join(_path2.cacheDir, "package.json.hash"),
      entries = Object.keys(dllConfig.entry).reduce(function (acc, curr) {
    return [].concat(_toConsumableArray(acc), _toConsumableArray(dllConfig.entry[curr]));
  }, []);
  /**
   * Simply compare the version identifier to judge whether the dependencies
   * have been upgraded.
   * 
   * @param {Object} oldPkg the cached package.json
   * @param {Object} pkg the current package.json
   * @param {Array} dependencies the dependecies that configured in dllConfig
   */


  var validateDependencies = function validateDependencies() {
    var oldPkg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var pkg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var dependencies = arguments.length > 2 ? arguments[2] : undefined;
    return dependencies.some(function (item) {
      infoLogger("oldPkgItem: ".concat(oldPkg[item]));
      infoLogger("pkgItem: ".concat(pkg[item]));
      infoLogger("itemName: ".concat(item));
      return oldPkg[item] !== pkg[item];
    });
  };

  return Promise.all([_fs["default"].lstatAsync(_path["default"].join(_path2.cacheDir, "package.json.hash"))["catch"](errLogger), _fs["default"].readFileAsync(prevPkgPath)["catch"](function (err) {
    errLogger(err);
    return null;
  }), (0, _readPkg["default"])(settings.context)["catch"](function (err) {
    errLogger(err);
    return null;
  })]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        buildHashDirExist = _ref2[0],
        prevPkgHash = _ref2[1],
        pkg = _ref2[2];

    prevPkgHash = prevPkgHash || "{}";
    infoLogger("prevPkgHash is ".concat(prevPkgHash));
    var oldPkg = JSON.parse(prevPkgHash.toString());
    var isPkgChanged = true; // infoLogger(`oldPkgHash is ${oldPkg.dependencies}`);
    // infoLogger(`pkgHash is ${pkg.dependencies}`);

    if (oldPkg) {
      isPkgChanged = validateDependencies(oldPkg, pkg.dependencies, entries);
    }

    infoLogger("isPkgChanged ? ".concat(isPkgChanged));

    if (buildHashDirExist && !isPkgChanged) {
      return true;
    }

    return (0, _makeDir["default"])(_path2.cacheDir).then(function () {
      _fs["default"].writeFileAsync(prevPkgPath, JSON.stringify(pkg.dependencies));
    }).then(function () {
      return false;
    });
  });
};

exports["default"] = _default;