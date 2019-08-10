const Container = require('../src/container');

const given = new Container();

describe('Container', () => {
  describe('overridable props', () => {
    it('should be overrided', () => {
      expect(given.apply).toBeUndefined();
      expect(given.call).toBeUndefined();
      expect(given.bind).toBeUndefined();
      expect(given.constructor).toBeUndefined();
      expect(given.toString).toBeUndefined();
      expect(given.asPromise).toBeUndefined();
      expect(given.toString).toBeUndefined();
      expect(given.hasOwnProperty).toBeUndefined();
      expect(given.isPrototypeOf).toBeUndefined();
      expect(given.propertyIsEnumerable).toBeUndefined();
      expect(given.toLocaleString).toBeUndefined();
      expect(given.valueOf).toBeUndefined();
    });
  });

  describe('reserved props', () => {
    it('should throw error', () => {
      expect(() => given('length', () => 'foo')).toThrow();
      expect(() => given('name', () => 'foo')).toThrow();
      expect(() => given('caller', () => 'foo')).toThrow();
      expect(() => given('arguments', () => 'foo')).toThrow();
      expect(() => given('__foo__', () => 'foo')).toThrow();
    });
  });

  describe('basic variable declarations', () => {
    it('should define new variable', () => {
      given('foo', () => 'bar');
      expect(given.foo).toBe('bar');
    });

    it('should cache variable values', () => {
      given('random', () => Math.random());
      expect(given.random).toBe(given.random);
    });
  });

  describe('without caching', () => {
    it('should not cache values', () => {
      given('@foo', () => Math.random());
      expect(given.foo).not.toBe(given.foo);
    });
  });

  describe('immediate', () => {
    it('should call handler immediately', () => {
      const fn = jest.fn(() => 'bar');
      given('!foo', fn);
      expect(fn).toHaveBeenCalled();
      expect(given.__env__.foo).toBe('bar');
    });
  });

  describe('combine variables', () => {
    it('should return combined value', () => {
      given('one', () => 1);
      given('two', () => 2);
      given('three', () => given.one + given.two);

      expect(given.three).toBe(3);
    });
  });

  describe('when not a function given', () => {
    it('should throw', () => {
      expect(() => given('foo', 'bar')).toThrow();
    });
  });

  describe('when recursive dependency detected', () => {
    it('should throw error', () => {
      given('foo', () => given.foo);
      expect(() => given.foo).toThrow();
    });
  });

  describe('when fn throws error', () => {
    it('should throw same error', () => {
      let called = false;
      const err = new Error('fakeError');

      const handler = () => {
        if (called) {
          called = true;
        } else {
          throw err;
        }
      };

      given('@foo', handler);

      try {
        given.foo; // eslint-disable-line no-unused-expressions
      } catch (e) {
        // nothing
      }

      expect(() => given.foo).toThrow('fakeError'); // eslint-disable-line no-unused-expressions
    });
  });

  describe('__clear__', () => {
    it('should clear cache', () => {
      given('one', () => 1);
      given('two', () => 2);

      given.__clear__();

      expect(given.one).toBeUndefined();
      expect(given.two).toBeUndefined();
    });
  });

  describe('__reset__', () => {
    it('should clear cache', () => {
      const fn = jest.fn();

      given('foo', fn);

      given.foo; // eslint-disable-line no-unused-expressions

      given.__reset__('foo');

      given.foo; // eslint-disable-line no-unused-expressions

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});
