/*!
 * Given2 v1.0.1
 * (c) 2017 Ruslan Tatyshev
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.given = factory());
}(this, (function () { 'use strict';

/* eslint no-use-before-define: 0 */
/* eslint no-param-reassign: 0 */

var RESERVED = /^__(.+?)__$/;

function Given(callback) {
  function define(key, getter, options) {
    if ( options === void 0 ) options = {};

    var env = given.__env__;
    var cache = options.cache;

    env[key] = undefined;

    function handler() {
      if (cache === false) { return getter(); }
      if (env[key]) { return env[key]; }

      env[key] = getter();
      return env[key];
    }

    Object.defineProperty(given, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        if (handler.in) { throw new Error(("Given2: Recursive dependency in given \"" + key + "\"")); }

        handler.in = true;
        var value = handler();
        delete handler.in;
        return value;
      },
      set: function (value) { env[key] = value; },
    });
  }

  function given(key, getter, options) {
    if ( options === void 0 ) options = {};

    if (RESERVED.test(key)) {
      throw new Error(("Given2: \"" + key + "\" key is reserved"));
    }

    if (typeof getter !== 'function') {
      if (typeof options === 'function') {
        var assign;
        (assign = [options, getter], getter = assign[0], options = assign[1]);
      } else {
        throw new Error('Given2: Second argument should be function');
      }
    }

    if (typeof callback !== 'function') {
      define(key, getter, options);
    } else {
      callback(function () { return define(key, getter, options); });
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
    value: function () {
      var keys = Object.keys(given.__env__);
      given.__env__ = {};
      keys.forEach(function (k) { return delete given[k]; });
    },
  });

  return given;
}

return Given;

})));
