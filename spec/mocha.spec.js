const assert = require('assert');

describe('Given', () => {
  describe('Basic usage', () => {
    given('one', () => 1);
    given('two', () => 2);

    it('should return given values', () => {
      assert.equal(given.one, 1);
      assert.equal(given.two, 2);
    });

    it('should cache value', () => {
      given('random', () => Math.random());
      const cached = given.random;

      assert.equal(given.random, cached);
      assert.equal(given.random, cached);
      assert.equal(given.random, cached);
    });

    it('should not cache when cache option is false', () => {
      given('random', { cache: false }, () => Math.random());
      const cached = given.random;

      assert.notEqual(given.random, cached);
      assert.notEqual(given.random, cached);
    });

    it('should return calculated dependency', () => {
      given('one', () => 2);
      given('multiply', () => given.one * given.two);

      assert.equal(given.multiply, 4);
    });

    it('should throw error when dependency are recursive', () => {
      given('one', () => given.one * 2);
      assert.throws(() => given.one, 'Given2: Recursive dependency in given "one"');
    });

    it('should throw error when getter is not a function', () => {
      assert.throws(() => given('one', 'two'), 'Given2: Second argument should be function');
    });

    it('should not allow to use reserved keys', () => {
      assert.throws(() => given('__one__', () => 123), 'Given2: "__one__" key is reserved');
    });
  });

  describe('__reset__', () => {
    it('should not have any vars from previous suits', () => {
      // eslint-disable-next-line no-underscore-dangle
      assert.deepEqual(Object.keys(given.__env__), []);
    });
  });
});
