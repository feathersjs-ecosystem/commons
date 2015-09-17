'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.defaultDispatcher = defaultDispatcher;
exports.setupEventHandlers = setupEventHandlers;
exports.setupMethodHandlers = setupMethodHandlers;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _arguments = require('../arguments');

var _arguments2 = _interopRequireDefault(_arguments);

function errorObject(e) {
  var result = {};
  Object.getOwnPropertyNames(e).forEach(function (key) {
    return result[key] = e[key];
  });
  return result;
}

// The position of the params parameters for a service method so that we can extend them
// default is 1
var paramsPositions = {
  find: 0,
  update: 2,
  patch: 2
};

// The default event dispatcher
exports.paramsPositions = paramsPositions;

function defaultDispatcher(data, params, callback) {
  callback(null, data);
}

// Set up event handlers for a given service using the event dispatching mechanism

function setupEventHandlers(info, service, path) {
  // If the service emits events that we want to listen to (Event mixin)
  if (typeof service.on !== 'function' || !service._serviceEvents) {
    return;
  }

  _lodash2['default'].each(service._serviceEvents, function (ev) {
    service.on(ev, function (data) {
      // Check if there is a method on the service with the same name as the event
      var dispatcher = typeof service[ev] === 'function' ? service[ev] : defaultDispatcher;
      var eventName = path + ' ' + ev;

      dispatcher(data, {}, function (error, dispatchData) {
        if (error) {
          socket[info.method]('error', error);
        } else if (dispatchData) {
          // Only dispatch if we have data
          info.connection().emit(eventName, dispatchData);
        }
      });
    });
  });
}

// Set up all method handlers for a service and socket.

function setupMethodHandlers(info, socket, service, path) {
  this.methods.forEach(function (method) {
    if (typeof service[method] !== 'function') {
      return;
    }

    var name = path + '::' + method;
    var params = info.params(socket);
    var position = typeof paramsPositions[method] !== 'undefined' ? paramsPositions[method] : 1;

    socket.on(name, function () {
      try {
        var args = (0, _arguments2['default'])(method, arguments);
        args[position] = _lodash2['default'].extend({ query: args[position] }, params);
        service[method].apply(service, args);
      } catch (e) {
        var callback = arguments[arguments.length - 1];
        if (typeof callback === 'function') {
          callback(errorObject(e));
        }
      }
    });
  });
}