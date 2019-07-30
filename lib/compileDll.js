"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runCompiler = void 0;

var runCompiler = function runCompiler(getCompiler) {
  return new Promise(function (resolve, reject) {
    getCompiler().run(function (err, stats) {
      if (err) return reject(err);
      if (stats.compilation.errors.length) return reject(stats.compilation.errors);
      resolve(stats);
    });
  });
};

exports.runCompiler = runCompiler;