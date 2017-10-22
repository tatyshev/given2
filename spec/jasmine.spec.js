require('../jasmine');

describe('Given', () => {
  describe('Basic usage', () => {
    given('one', () => 1);
    given('two', () => 2);

    it('should return given values', () => {
      expect(given.one).toBe(1);
      expect(given.two).toBe(2);
    });

    it('should cache value', () => {
      given('random', () => Math.random());
      const cached = given.random;

      expect(given.random).toBe(cached);
      expect(given.random).toBe(cached);
      expect(given.random).toBe(cached);
    });

    it('should not cache when cache option is false', () => {
      given('random', { cache: false }, () => Math.random());
      const cached = given.random;
      expect(given.random).not.toBe(cached);
      expect(given.random).not.toBe(cached);
    });

    it('should return calculated dependency', () => {
      given('one', () => 2);
      given('multiply', () => given.one * given.two);

      expect(given.multiply).toBe(4);
    });

    it('should throw error when dependency are recursive', () => {
      given('one', () => given.one * 2);
      expect(() => given.one).toThrowError('Given2: Recursive dependency in given "one"');
    });

    it('should throw error when getter is not a function', () => {
      expect(() => given('one', 'two')).toThrowError('Given2: Second argument should be function');
    });

    it('should not allow to use reserved keys', () => {
      expect(() => given('__one__', () => 123)).toThrowError('Given2: "__one__" key is reserved');
    });
  });

  describe('__reset__', () => {
    it('should not have any vars from previous suits', () => {
      // eslint-disable-next-line no-underscore-dangle
      expect(Object.keys(given.__env__)).toEqual([]);
    });
  });
});
