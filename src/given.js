/* eslint no-use-before-define: 0 */
/* eslint no-param-reassign: 0 */

const REG_RESERVED = /^__(.+?)__$/;
const MSG_NOT_OVERRIDEBLE = 'Given2: Sorry, but javascript does not allow us override the "length" and "name" properties, could you use a different name?';
const MSG_RESERVED = 'Given2: Sorry, we use properties that begins and ends with "__" for internal work, could you use a another name?';

const ensureProperty = (key) => {
  if (key === 'name') throw new Error(MSG_NOT_OVERRIDEBLE);
  if (key === 'length') throw new Error(MSG_NOT_OVERRIDEBLE);
  if (REG_RESERVED.test(key)) throw new Error(MSG_RESERVED);
};

const removeProp = (target, property) => {
  Object.defineProperty(target, property, {
    configurable: true,
    enumerable: false,
  });
};

const removeBaseProps = (target) => {
  removeProp(target, 'apply');
  removeProp(target, 'call');
  removeProp(target, 'caller');
  removeProp(target, 'bind');
  removeProp(target, 'arguments');
  removeProp(target, 'constructor');
  removeProp(target, 'toString');
  removeProp(target, 'asPromise');
  removeProp(target, 'toString');
  removeProp(target, 'hasOwnProperty');
  removeProp(target, 'isPrototypeOf');
  removeProp(target, 'propertyIsEnumerable');
  removeProp(target, 'toLocaleString');
  removeProp(target, 'valueOf');
};

const parseProp = (key) => {
  const prefix = key[0];

  const defaults = {
    name: key,
    immediate: false,
    cache: true,
  };

  if (prefix === '!') {
    defaults.key = key.substr(1);
    defaults.immediate = true;

    return defaults;
  }

  if (prefix === '@') {
    defaults.key = key.substr(1);
    defaults.cache = false;

    return defaults;
  }

  return defaults;
};

module.exports = (next) => {
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
    });
  }

  function given(key, getter) {
    const property = parseProp(key);
    const { name, immediate, cache } = property;

    ensureProperty(name);

    if (typeof callback !== 'function') {
      define(name, getter, { immediate, cache });
    } else {
      next(() => define(name, getter, { immediate, cache }));
    }
  }

  removeBaseProps(given);

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
    value: (key) => {
      if (key) {
        delete given.__env__[key];
        return;
      }

      const keys = Object.keys(given.__env__);
      given.__env__ = {};
      keys.forEach(k => delete given[k]);
    },
  });

  return given;
};
