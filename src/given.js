const Container = require('./container');

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
