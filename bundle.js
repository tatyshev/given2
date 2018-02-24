(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["given"] = factory();
	else
		root["given"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Container = __webpack_require__(1);

let it = false;

const before = (fn) => {
  if (typeof beforeEach === 'function') {
    beforeEach(fn);
  }
};

const after = (fn) => {
  if (typeof afterEach === 'function') {
    afterEach(fn);
  }
};

const given = Container((run) => {
  if (it) run();
  else before(() => run());
});

Object.defineProperty(given, '__up__', {
  configurable: false,
  enumerable: false,
  value: () => { it = true; },
});

Object.defineProperty(given, '__down__', {
  configurable: false,
  enumerable: false,
  value: () => {
    it = false;
    given.__clear__();
  },
});

before(given.__up__);
after(given.__down__);

module.exports = given;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/* eslint no-use-before-define: 0 */
/* eslint no-param-reassign: 0 */

const RESERVED = ['name', 'length', 'caller', 'arguments'];
const REG_RESERVED = /^__(.+?)__$/;

function Given2Error(msg) {
  const error = new Error();
  error.name = 'Given2';
  error.message = Array.isArray(msg) ? msg.join('\n') : msg;
  return error;
}

const ensureProperty = (property) => {
  if (RESERVED.indexOf(property) !== -1) {
    throw new Given2Error([
      'Can not override the "length", "caller", "arguments" and "name" properties.',
      'Could you use a another property name?',
    ]);
  }

  if (REG_RESERVED.test(property)) {
    throw new Given2Error([
      'Sorry, Given2 use properties that begins and ends with "__" for internal causes.',
      'Could you use an another name?',
    ]);
  }
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
  removeProp(target, 'bind');
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
    defaults.name = key.substr(1);
    defaults.immediate = true;

    return defaults;
  }

  if (prefix === '@') {
    defaults.name = key.substr(1);
    defaults.cache = false;

    return defaults;
  }

  return defaults;
};

module.exports = function Container(run) {
  function define(options, fn) {
    const env = given.__env__;
    const { name, immediate, cache } = options;
    env[name] = undefined;

    const handler = () => {
      if (cache === false) return fn();
      if (env[name]) return env[name];
      env[name] = fn();
      return env[name];
    };

    const getter = () => {
      if (handler.in) {
        throw new Given2Error(`An attempt to use a variable recursively at given '${name}'.`);
      }

      handler.in = true;
      let value;

      try {
        value = handler();
      } catch (e) {
        delete handler.in;
        throw e;
      }

      delete handler.in;

      return value;
    };

    Object.defineProperty(given, name, {
      enumerable: true,
      configurable: true,
      get: getter,
    });

    if (immediate) getter();
  }

  function given(property, fn) {
    const options = parseProp(property);
    ensureProperty(options.name);

    if (typeof fn !== 'function') {
      throw new Given2Error([
        `You used not a function as a value for a given variable "${options.name}"`,
        `Could you declare variables something like this: given("${options.name}", () => ${JSON.stringify(fn)})?`,
        'Because we need a function to declare a getter.',
      ]);
    }

    if (typeof run !== 'function') {
      define(options, fn);
    } else {
      run(() => define(options, fn));
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
    value: () => {
      const keys = Object.keys(given.__env__);
      given.__env__ = {};
      keys.forEach(k => delete given[k]);
    },
  });

  Object.defineProperty(given, '__reset__', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: (key) => {
      if (key) {
        given.__env__[key] = undefined;
      } else {
        given.__env__ = {};
      }
    },
  });

  return given;
};


/***/ })
/******/ ]);
});