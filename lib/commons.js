'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _arguments = require('./arguments');

var _arguments2 = _interopRequireDefault(_arguments);

var _socketsIndex = require('./sockets/index');

var _socketsIndex2 = _interopRequireDefault(_socketsIndex);

var _utils = require('./utils');

exports['default'] = {
  socket: _socketsIndex2['default'],
  getArguments: _arguments2['default'],
  stripSlashes: _utils.stripSlashes
};
module.exports = exports['default'];