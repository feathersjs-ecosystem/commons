'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.setup = setup;
exports.service = service;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../utils');

var _helpers = require('./helpers');

// Common setup functionality taking the info object which abstracts websocket access

function setup(info) {
  var _this = this;

  var _setupEventHandlers = _helpers.setupEventHandlers.bind(this, info);

  this._commons = info;

  // For a new connection, set up the service method handlers
  info.connection().on('connection', function (socket) {
    var _setupMethodHandlers = _helpers.setupMethodHandlers.bind(_this, info, socket);
    // Process all registered services
    _lodash2['default'].each(_this.services, _setupMethodHandlers);
  });

  // Set up events and event dispatching
  _lodash2['default'].each(this.services, _setupEventHandlers);
}

// Socket mixin when a new service is registered

function service(path, obj) {
  var _this2 = this;

  var protoService = this._super.apply(this, arguments);
  var info = this._commons;

  // app._socketInfo will only be available once we are set up
  if (obj && info) {
    (function () {
      var _setupEventHandlers = _helpers.setupEventHandlers.bind(_this2, info);
      var _setupMethodHandlers = _helpers.setupMethodHandlers.bind(_this2, info);
      var location = (0, _utils.stripSlashes)(path);

      // Set up event handlers for this new service
      _setupEventHandlers(protoService, location);
      // For any existing connection add method handlers
      info.clients().forEach(function (socket) {
        return _setupMethodHandlers(socket, location, protoService);
      });
    })();
  }

  return protoService;
}

exports['default'] = { service: service, setup: setup };