export function Given(callback) {
  function define(key, getter, options = {}) {
    const env = given.__env__;
    const { cache } = options;

    env[key] = undefined;

    function handler() {
      if (cache === false) return getter();
      if (env[key]) return env[key];

      return (env[key] = getter());
    }

    Object.defineProperty(given, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        if (handler.in) throw new Error(`Given2: Recursive dependency in given "${key}"`);

        handler.in = true;
        const value = handler();
        delete handler.in;
        return value;
      },
    });
  }

  function given(key, getter, options = {}) {
    if (typeof getter !== 'function') throw new Error('Given2: second argument should be function');

    if (typeof callback !== 'function') {
      define(key, getter, options);
    } else {
      callback(define);
    }
  }

  given.__env__ = {};

  given.__reset__ = () => {
    const keys = Object.keys(given.__env__);
    given.__env__ = {};
    keys.forEach(k => delete given[k]);
  };

  given.__clear__ = (key) => {
    if (key) {
      if (!given[key]) throw new Error(`Given2: Cannot find given: "${key}"`);
      given.__env__[key] = undefined;
      return;
    }

    const keys = Object.keys(given.__env__);
    keys.forEach((k) => { given.__env__[k] = undefined; });
  };

  return given;
}
