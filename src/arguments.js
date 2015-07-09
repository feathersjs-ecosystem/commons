import _ from 'lodash';

const getCallback = args => typeof _.last(args) === 'function' ? _.last(args) : _.noop;
const getParams = (args, position) => typeof args[position] === 'object' ? args[position] : {};

const find = args => {
  let callback = getCallback(args);
  let params = getParams(args, 0);

  if(args.length > 2) {
    throw new Error(`Too many arguments for 'find' service method`);
  }

  return [ params, callback ];
};

const create = args => {
  let data = args[0];
  let params = getParams(args, 1);
  let callback = getCallback(args);

  if(typeof data !== 'object') {
    throw new Error(`First parameter for 'create' must be an object`);
  }

  if(args.length > 3) {
    throw new Error(`Too many arguments for 'create' service method`);
  }

  return [ data, params, callback ];
};

const updateOrPatch = name => {
  return function(args) {
    let id = args[0];
    let data = args[1];
    let callback = getCallback(args);
    let params = getParams(args, 2);

    if(typeof id === 'function') {
      throw new Error(`First parameter for '${name}' can not be a function`);
    }

    if(typeof data !== 'object') {
      throw new Error(`No data provided for '${name}'`);
    }

    if(args.length > 4) {
      throw new Error(`Too many arguments for '${name}' service method`);
    }

    return [ id, data, params, callback ];
  };
};

const getOrRemove = name => {
  return function(args) {
    let id = args[0];
    let params = getParams(args, 1);
    let callback = getCallback(args);

    if(args.length > 3) {
      throw new Error(`Too many arguments for '${name}' service method`);
    }

    if(id === 'function') {
      throw new Error(`First parameter for '${name}' can not be a function`);
    }

    return [ id, params, callback ];
  };
};

const addToOrFindInCollection = name => {
  return function (args) {
    let id = args[0];
    let collection = args[1];
    let callback = getCallback(args);
    let params = getParams(args, 2);

    if (typeof id === 'function') {
      throw new Error(`First parameter for '${name}' can not be a function`);
    }

    if (typeof collection !== 'string') {
      throw new Error(`The collection for '${name}' should be a string`);
    }

    if (args.length > 4) {
      throw new Error(`Too many arguments for '${name}' service method`);
    }

    return [ id, collection, params, callback ];
  };
};

const removeFromOrGetInCollection = name => {
  // id, collection, itemId, params, callback)
  return function (args) {
    let id = args[0];
    let collection = args[1];
    let callback = getCallback(args);
    let documentId = getParams(args, 2);
    let params = getParams(args, 3);

    if (typeof id === 'function') {
      throw new Error(`First parameter for '${name}' can not be a function`);
    }

    if (typeof collection !== 'string') {
      throw new Error(`The collection for '${name}' should be a string`);
    }

    if (typeof documentId === 'function') {
      throw new Error(`Third parameter for '${name}' can not be a function`);
    }

    if (args.length > 5) {
      throw new Error(`Too many arguments for '${name}' service method`);
    }

    return [ id, collection, documentId, params, callback ];
  };
};

export const converters = {
  find: find,

  create: create,

  update: updateOrPatch('update'),

  patch: updateOrPatch('patch'),

  get: getOrRemove('get'),

  remove: getOrRemove('remove'),

  findInCollection: addToOrFindInCollection('findInCollection'),

  addToCollection: addToOrFindInCollection('addToCollection'),

  getInCollection: removeFromOrGetInCollection('getInCollection'),

  removeFromCollection: removeFromOrGetInCollection('removeFromCollection')
};

export default function getArguments(method, args) {
  return converters[method](args);
}
