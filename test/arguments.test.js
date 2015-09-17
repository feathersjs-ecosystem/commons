import assert from 'assert';
import _ from 'lodash';
import getArguments from '../src/arguments';

describe('Argument normalization tests', () => {
  const params = { test: 'param' };
  const callback = function() {};

  it('find', () => {
    let normal = [ params, callback ];
    let args = getArguments('find', normal);

    assert.deepEqual(args, normal);

    args = getArguments('find', [ params ]);
    assert.deepEqual(args, [ params, _.noop ]);

    args = getArguments('find', [callback]);
    assert.deepEqual(args, [ {}, callback ]);
    
    args = getArguments('find', []);
    assert.deepEqual(args, [ {}, _.noop ]);

    try {
      getArguments('find', normal.concat(['too many']));
    } catch(e) {
      assert.equal(e.message, `Too many arguments for 'find' service method`);
    }
  });

  it('get', () => {
    let normal = [1, params, callback];
    let args = getArguments('get', normal);

    assert.deepEqual(args, normal);

    args = getArguments('get', [2, params]);
    assert.deepEqual(args, [2, params, _.noop]);

    args = getArguments('get', [3, callback]);
    assert.deepEqual(args, [3, {}, callback]);

    args = getArguments('get', [4]);
    assert.deepEqual(args, [4, {}, _.noop]);

    try {
      getArguments('get', [callback]);
    } catch(e) {
      assert.equal(e.message, `First parameter for 'get' can not be a function`);
    }

    try {
      getArguments('get', normal.concat(['too many']));
    } catch(e) {
      assert.equal(e.message, `Too many arguments for 'get' service method`);
    }
  });

  it('remove', () => {
    let normal = [1, params, callback];
    let args = getArguments('remove', normal);

    assert.deepEqual(args, normal);

    args = getArguments('remove', [2, params]);
    assert.deepEqual(args, [2, params, _.noop]);

    args = getArguments('remove', [3, callback]);
    assert.deepEqual(args, [3, {}, callback]);

    args = getArguments('remove', [4]);
    assert.deepEqual(args, [4, {}, _.noop]);

    try {
      args = getArguments('remove', [callback]);
    } catch(e) {
      assert.equal(e.message, `First parameter for 'remove' can not be a function`);
    }

    try {
      getArguments('remove', normal.concat(['too many']));
    } catch(e) {
      assert.equal(e.message, `Too many arguments for 'remove' service method`);
    }
  });

  it('create', () => {
    let data = { test: 'Data' };
    let normal = [data, params, callback];
    let args = getArguments('create', normal);

    assert.deepEqual(args, normal);

    args = getArguments('create', [data, callback]);
    assert.deepEqual(args, [data, {}, callback]);

    args = getArguments('create', [data, params]);
    assert.deepEqual(args, [data, params, _.noop]);

    args = getArguments('create', [data]);
    assert.deepEqual(args, [data, {}, _.noop]);

    try {
      getArguments('create', [callback]);
    } catch(e) {
      assert.equal(e.message, `First parameter for 'create' must be an object`);
    }

    try {
      getArguments('create', normal.concat(['too many']));
    } catch(e) {
      assert.equal(e.message, `Too many arguments for 'create' service method`);
    }
  });

  it('update', () => {
    let data = { test: 'Data' };
    let normal = [1, data, params, callback];
    let args = getArguments('update', normal);

    assert.deepEqual(args, normal);

    args = getArguments('update', [2, data, callback]);
    assert.deepEqual(args, [2, data, {}, callback]);

    args = getArguments('update', [3, data, params]);
    assert.deepEqual(args, [3, data, params, _.noop]);

    args = getArguments('update', [4, data]);
    assert.deepEqual(args, [4, data, {}, _.noop]);

    try {
      getArguments('update', [callback]);
    } catch(e) {
      assert.equal(e.message, `First parameter for 'update' can not be a function`);
    }

    try {
      getArguments('update', [5]);
    } catch(e) {
      assert.equal(e.message, `No data provided for 'update'`);
    }

    try {
      getArguments('update', normal.concat(['too many']));
    } catch(e) {
      assert.equal(e.message, `Too many arguments for 'update' service method`);
    }
  });

  it('patch', () => {
    let data = { test: 'Data' };
    let normal = [1, data, params, callback];
    let args = getArguments('patch', normal);

    assert.deepEqual(args, normal);

    args = getArguments('patch', [2, data, callback]);
    assert.deepEqual(args, [2, data, {}, callback]);

    args = getArguments('patch', [3, data, params]);
    assert.deepEqual(args, [3, data, params, _.noop]);

    args = getArguments('patch', [4, data]);
    assert.deepEqual(args, [4, data, {}, _.noop]);

    try {
      getArguments('patch', [callback]);
    } catch(e) {
      assert.equal(e.message, `First parameter for 'patch' can not be a function`);
    }

    try {
      getArguments('patch', [5]);
    } catch(e) {
      assert.equal(e.message, `No data provided for 'patch'`);
    }

    try {
      getArguments('patch', normal.concat(['too many']));
    } catch(e) {
      assert.equal(e.message, `Too many arguments for 'patch' service method`);
    }
  });

  it('findInCollection', () => {
    let collection = 'users';
    let normal = [1, collection, params, callback];
    let args = getArguments('findInCollection', normal);

    assert.deepEqual(args, normal);

    args = getArguments('findInCollection', [2, collection, callback]);
    assert.deepEqual(args, [2, collection, {}, callback]);

    args = getArguments('findInCollection', [3, collection, params]);
    assert.deepEqual(args, [3, collection, params, _.noop]);

    args = getArguments('findInCollection', [4, collection]);
    assert.deepEqual(args, [4, collection, {}, _.noop]);

    try {
      getArguments('findInCollection', [callback]);
    } catch(e) {
      assert.equal(e.message, `First parameter for 'findInCollection' can not be a function`);
    }

    try {
      getArguments('findInCollection', [5]);
    } catch(e) {
      assert.equal(e.message, `The collection for 'findInCollection' should be a string`);
    }

    try {
      getArguments('findInCollection', normal.concat(['too many']));
    } catch(e) {
      assert.equal(e.message, `Too many arguments for 'findInCollection' service method`);
    }
  });

  it('addToCollection', () => {
    let collection = 'users';
    let data = { test: 'Data' };
    let normal = [1, collection, data, params, callback];
    let args = getArguments('addToCollection', normal);

    assert.deepEqual(args, normal);

    args = getArguments('addToCollection', [2, collection, data, callback]);
    assert.deepEqual(args, [2, collection, data, {}, callback]);

    args = getArguments('addToCollection', [3, collection, data, params]);
    assert.deepEqual(args, [3, collection, data, params, _.noop]);

    args = getArguments('addToCollection', [4, collection, data]);
    assert.deepEqual(args, [4, collection, data, {}, _.noop]);

    try {
      getArguments('addToCollection', [callback]);
    } catch(e) {
      assert.equal(e.message, `First parameter for 'addToCollection' can not be a function`);
    }

    try {
      getArguments('addToCollection', [5]);
    } catch(e) {
      assert.equal(e.message, `The collection for 'addToCollection' should be a string`);
    }

    try {
      getArguments('addToCollection', [6, collection]);
    } catch(e) {
      assert.equal(e.message, `No data provided for 'addToCollection'`);
    }

    try {
      getArguments('addToCollection', normal.concat(['too many']));
    } catch(e) {
      assert.equal(e.message, `Too many arguments for 'addToCollection' service method`);
    }
  });

  it('getInCollection', () => {
    let collection = 'users';
    let normal = [1, collection, 1, params, callback];
    let args = getArguments('getInCollection', normal);

    assert.deepEqual(args, normal);

    args = getArguments('getInCollection', [2, collection, 2, callback]);
    assert.deepEqual(args, [2, collection, 2, {}, callback]);

    args = getArguments('getInCollection', [3, collection, 3, params]);
    assert.deepEqual(args, [3, collection, 3, params, _.noop]);

    args = getArguments('getInCollection', [4, collection, 4]);
    assert.deepEqual(args, [4, collection, 4, {}, _.noop]);

    try {
      getArguments('getInCollection', [callback]);
    } catch(e) {
      assert.equal(e.message, `First parameter for 'getInCollection' can not be a function`);
    }

    try {
      getArguments('getInCollection', [5]);
    } catch(e) {
      assert.equal(e.message, `The collection for 'getInCollection' should be a string`);
    }

    try {
      getArguments('getInCollection', [6, 'users', callback]);
    } catch(e) {
      assert.equal(e.message, `Third parameter for 'getInCollection' can not be a function`);
    }

    try {
      getArguments('getInCollection', normal.concat(['too many']));
    } catch(e) {
      assert.equal(e.message, `Too many arguments for 'getInCollection' service method`);
    }
  });

  it('removeFromCollection', () => {
    let collection = 'users';
    let normal = [1, collection, 1, params, callback];
    let args = getArguments('removeFromCollection', normal);

    assert.deepEqual(args, normal);

    args = getArguments('removeFromCollection', [2, collection, 2, callback]);
    assert.deepEqual(args, [2, collection, 2, {}, callback]);

    args = getArguments('removeFromCollection', [3, collection, 3, params]);
    assert.deepEqual(args, [3, collection, 3, params, _.noop]);

    args = getArguments('removeFromCollection', [4, collection, 4]);
    assert.deepEqual(args, [4, collection, 4, {}, _.noop]);

    try {
      getArguments('removeFromCollection', [callback]);
    } catch(e) {
      assert.equal(e.message, `First parameter for 'removeFromCollection' can not be a function`);
    }

    try {
      getArguments('removeFromCollection', [5]);
    } catch(e) {
      assert.equal(e.message, `The collection for 'removeFromCollection' should be a string`);
    }

    try {
      getArguments('removeFromCollection', [6, 'users', callback]);
    } catch(e) {
      assert.equal(e.message, `Third parameter for 'removeFromCollection' can not be a function`);
    }

    try {
      getArguments('removeFromCollection', normal.concat(['too many']));
    } catch(e) {
      assert.equal(e.message, `Too many arguments for 'removeFromCollection' service method`);
    }
  });
});
