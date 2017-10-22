/* eslint no-use-before-define: 0 */
/* eslint no-param-reassign: 0 */

const RESERVED = /^__(.+?)__$/;

module.exports = function Given(callback) {
  function define(key, getter, options = {}) {
    const env = given.__env__;
    const { cache } = options;

    env[key] = undefined;

    function handler() {
      if (cache === false) return getter();
      if (env[key]) return env[key];

      env[key] = getter();
      return env[key];
    }

    Object.defineProperty(given, key, {
      enumerable: true,
      configurable: true,
      get: () => {
        if (handler.in) throw new Error(`Given2: Recursive dependency in given "${key}"`);

        handler.in = true;
        const value = handler();
        delete handler.in;
        return value;
      },
      set: (value) => { env[key] = value; },
    });
  }

  function given(key, getter, options = {}) {
    if (RESERVED.test(key)) {
      throw new Error(`Given2: "${key}" key is reserved`);
    }

    if (typeof getter !== 'function') {
      if (typeof options === 'function') {
        [getter, options] = [options, getter];
      } else {
        throw new Error('Given2: Second argument should be function');
      }
    }

    if (typeof callback !== 'function') {
      define(key, getter, options);
    } else {
      callback(() => define(key, getter, options));
    }
  }

  delete given.length;
  delete given.name;
  delete given.apply;
  delete given.call;
  delete given.caller;
  delete given.bind;
  delete given.arguments;
  delete given.constructor;
  delete given.toString;
  delete given.toString;
  delete given.asPromise;
  delete given.toString;
  delete given.hasOwnProperty;
  delete given.isPrototypeOf;
  delete given.propertyIsEnumerable;
  delete given.toLocaleString;
  delete given.valueOf;

  Object.defineProperty(given, '__env__', {
    configurable: false,
    enumerable: false,
    writable: true,
    value: {},
  });

  Object.defineProperty(given, '__clear__', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: () => {
      const keys = Object.keys(given.__env__);
      given.__env__ = {};
      keys.forEach(k => delete given[k]);
    },
  });

  return given;
};
