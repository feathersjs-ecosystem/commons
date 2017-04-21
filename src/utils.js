export function stripSlashes (name) {
  return name.replace(/^(\/*)|(\/*)$/g, '');
}

export function each (obj, callback) {
  if (obj && typeof obj.forEach === 'function') {
    obj.forEach(callback);
  } else if (isObject(obj)) {
    Object.keys(obj).forEach(key => callback(obj[key], key));
  }
}

export function some (value, callback) {
  return Object.keys(value)
    .map(key => [ value[key], key ])
    .some(([val, key]) => callback(val, key));
}

export function every (value, callback) {
  return Object.keys(value)
    .map(key => [ value[key], key ])
    .every(([val, key]) => callback(val, key));
}

export function keys (obj) {
  return Object.keys(obj);
}

export function values (obj) {
  return _.keys(obj).map(key => obj[key]);
}

export function isMatch (obj, item) {
  return _.keys(item).every(key => obj[key] === item[key]);
}

export function isEmpty (obj) {
  return _.keys(obj).length === 0;
}

export function isObject (item) {
  return (typeof item === 'object' && !Array.isArray(item) && item !== null);
}

export function extend (...args) {
  return Object.assign(...args);
}

export function omit (obj, ...keys) {
  const result = _.extend({}, obj);
  keys.forEach(key => delete result[key]);
  return result;
}

export function pick (source, ...keys) {
  const result = {};
  keys.forEach(key => {
    result[key] = source[key];
  });
  return result;
}

export function merge (target, source) {
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        merge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }
  return target;
}

export const _ = {
  each,
  some,
  every,
  keys,
  values,
  isMatch,
  isEmpty,
  isObject,
  extend,
  omit,
  pick,
  merge
};

export const specialFilters = {
  $in (key, ins) {
    return current => ins.indexOf(current[key]) !== -1;
  },

  $nin (key, nins) {
    return current => nins.indexOf(current[key]) === -1;
  },

  $lt (key, value) {
    return current => current[key] < value;
  },

  $lte (key, value) {
    return current => current[key] <= value;
  },

  $gt (key, value) {
    return current => current[key] > value;
  },

  $gte (key, value) {
    return current => current[key] >= value;
  },

  $ne (key, value) {
    return current => current[key] !== value;
  }
};

export function select (params, ...otherFields) {
  const fields = params && params.query && params.query.$select;

  if (Array.isArray(fields) && otherFields.length) {
    fields.push(...otherFields);
  }

  const convert = result => {
    if (!Array.isArray(fields)) {
      return result;
    }

    return _.pick(result, ...fields);
  };

  return result => {
    if (Array.isArray(result)) {
      return result.map(convert);
    }

    return convert(result);
  };
}

export function matcher (originalQuery) {
  const query = _.omit(originalQuery, '$limit', '$skip', '$sort', '$select');

  return function (item) {
    if (query.$or && _.some(query.$or, or => matcher(or)(item))) {
      return true;
    }

    return _.every(query, (value, key) => {
      if (value !== null && typeof value === 'object') {
        return _.every(value, (target, filterType) => {
          if (specialFilters[filterType]) {
            const filter = specialFilters[filterType](key, target);
            return filter(item);
          }

          return false;
        });
      } else if (typeof item[key] !== 'undefined') {
        return item[key] === query[key];
      }

      return false;
    });
  };
}

export function sorter ($sort) {
  return function (first, second) {
    let comparator = 0;
    each($sort, (modifier, key) => {
      modifier = parseInt(modifier, 10);

      if (first[key] < second[key]) {
        comparator -= 1 * modifier;
      }

      if (first[key] > second[key]) {
        comparator += 1 * modifier;
      }
    });
    return comparator;
  };
}

export function makeUrl (path, app = {}) {
  const get = typeof app.get === 'function' ? app.get.bind(app) : () => {};
  const env = get('env') || process.env.NODE_ENV;
  const host = get('host') || process.env.HOST_NAME || 'localhost';
  const protocol = (env === 'development' || env === 'test' || (env === undefined)) ? 'http' : 'https';
  const PORT = get('port') || process.env.PORT || 3030;
  const port = (env === 'development' || env === 'test' || (env === undefined)) ? `:${PORT}` : '';

  path = path || '';

  return `${protocol}://${host}${port}/${stripSlashes(path)}`;
}
