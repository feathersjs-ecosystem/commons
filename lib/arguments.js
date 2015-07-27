'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getArguments;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var getCallback = function getCallback(args) {
  return typeof _lodash2['default'].last(args) === 'function' ? _lodash2['default'].last(args) : _lodash2['default'].noop;
};
var getParams = function getParams(args, position) {
  return typeof args[position] === 'object' ? args[position] : {};
};

var find = function find(args) {
  var callback = getCallback(args);
  var params = getParams(args, 0);

  if (args.length > 2) {
    throw new Error('Too many arguments for \'find\' service method');
  }

  return [params, callback];
};

var create = function create(args) {
  var data = args[0];
  var params = getParams(args, 1);
  var callback = getCallback(args);

  if (typeof data !== 'object') {
    throw new Error('First parameter for \'create\' must be an object');
  }

  if (args.length > 3) {
    throw new Error('Too many arguments for \'create\' service method');
  }

  return [data, params, callback];
};

var updateOrPatch = function updateOrPatch(name) {
  return function (args) {
    var id = args[0];
    var data = args[1];
    var callback = getCallback(args);
    var params = getParams(args, 2);

    if (typeof id === 'function') {
      throw new Error('First parameter for \'' + name + '\' can not be a function');
    }

    if (typeof data !== 'object') {
      throw new Error('No data provided for \'' + name + '\'');
    }

    if (args.length > 4) {
      throw new Error('Too many arguments for \'' + name + '\' service method');
    }

    return [id, data, params, callback];
  };
};

var getOrRemove = function getOrRemove(name) {
  return function (args) {
    var id = args[0];
    var params = getParams(args, 1);
    var callback = getCallback(args);

    if (args.length > 3) {
      throw new Error('Too many arguments for \'' + name + '\' service method');
    }

    if (id === 'function') {
      throw new Error('First parameter for \'' + name + '\' can not be a function');
    }

    return [id, params, callback];
  };
};

var findInCollection = function findInCollection(args) {
  var id = args[0];
  var collection = args[1];
  var callback = getCallback(args);
  var params = getParams(args, 2);

  if (typeof id === 'function') {
    throw new Error('First parameter for \'findInCollection\' can not be a function');
  }

  if (typeof collection !== 'string') {
    throw new Error('The collection for \'findInCollection\' should be a string');
  }

  if (args.length > 4) {
    throw new Error('Too many arguments for \'findInCollection\' service method');
  }

  return [id, collection, params, callback];
};

var addToCollection = function addToCollection(args) {
  var id = args[0];
  var collection = args[1];
  var data = args[2];
  var callback = getCallback(args);
  var params = getParams(args, 3);

  if (typeof id === 'function') {
    throw new Error('First parameter for \'addToCollection\' can not be a function');
  }

  if (typeof collection !== 'string') {
    throw new Error('The collection for \'addToCollection\' should be a string');
  }

  if (typeof data !== 'object') {
    throw new Error('No data provided for \'addToCollection\'');
  }

  if (args.length > 5) {
    throw new Error('Too many arguments for \'addToCollection\' service method');
  }

  return [id, collection, data, params, callback];
};

var removeFromOrGetInCollection = function removeFromOrGetInCollection(name) {
  return function (args) {
    var id = args[0];
    var collection = args[1];
    var documentId = args[2];
    var callback = getCallback(args);
    var params = getParams(args, 3);

    if (typeof id === 'function') {
      throw new Error('First parameter for \'' + name + '\' can not be a function');
    }

    if (typeof collection !== 'string') {
      throw new Error('The collection for \'' + name + '\' should be a string');
    }

    if (typeof documentId === 'function') {
      throw new Error('Third parameter for \'' + name + '\' can not be a function');
    }

    if (args.length > 5) {
      throw new Error('Too many arguments for \'' + name + '\' service method');
    }

    return [id, collection, documentId, params, callback];
  };
};

var converters = {
  find: find,

  create: create,

  update: updateOrPatch('update'),

  patch: updateOrPatch('patch'),

  get: getOrRemove('get'),

  remove: getOrRemove('remove'),

  findInCollection: findInCollection,

  addToCollection: addToCollection,

  getInCollection: removeFromOrGetInCollection('getInCollection'),

  removeFromCollection: removeFromOrGetInCollection('removeFromCollection')
};

exports.converters = converters;

function getArguments(method, args) {
  return converters[method](args);
}