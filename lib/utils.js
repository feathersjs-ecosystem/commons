'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.stripSlashes = stripSlashes;

function stripSlashes(name) {
  return name.replace(/^(\/*)|(\/*)$/g, '');
}