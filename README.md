# Given2
> Lazy variable evaluation for js specs, inspired by [rspec](http://rspec.info/) and [given.js](https://github.com/freshtonic/given.js)

Basically the `given` helper will register a `beforeEach` and a `afterEach` hook that will create a memoized get accessor with the given name. The value will be cached across multiple calls in the same example but not across examples.

> Note that `given` variables is lazy-evaluated: it is not evaluated until the first time the method it defines is invoked.

# Installation

You can install given2 using `npm` or `yarn`

```
npm install given2
```

The next steps depend on which test framework you are using. `Given2` supports  [jest](https://facebook.github.io/jest/), [jasmine](https://jasmine.github.io/), [mocha](https://mochajs.org/). For each framework there is an installation files:

* `given2/jasmine`
* `given2/jest`
* `given2/mocha`

You can just import it into any of your setup or spec files like: `import 'given2/jest'`

Also it can be done in the framework specific configurations:

### Jest

```
{
  "setupTestFrameworkScriptFile": "./node_modules/given2/jest.js"
}
```

### Jasmine

```
{
  "helpers": ["./node_modules/given2/jasmine.js"]
}
```

### Mocha
Just add the path to `given/mocha.js` before running your tests:

```
mocha ./node_modules/given2/mocha.js yourTests.js
```

# Usage examples

```js
describe('given', () => {
  given('one', () => 1);
  given('two', () => 2);

  it('memoizes the value', () => {
    expect(given.one).toBe(1);
    expect(given.two).toBe(2);
  });
});
```

Caching behavior

```js
let count = 0;

describe('given', () => {
  given('count', () => count += 1);

  // The values cached in same examples
  it('memoizes the value', () => {
    expect(given.count).toBe(1);
    expect(given.count).toBe(1);
  });

  // But do not cached across examples
  it('is not cached across examples', () => {
    expect(given.count).toBe(2);
  });
});
```

Only `function` allowed as a value

```js
describe('given', () => {
  it('should throw error', () => {
    // Such use will cause an error
    expect(() => given('value', 123)).toThrow();
  });
});
```

Recursive dependency detection

```js
describe('given', () => {
  // Such use will cause an error
  given('one', () => given.one);

  it('should throw error', () => {
    expect(() => given.one).toThrow();
  });
});
```

You can disable caching

```js
describe('given', () => {
  given('random', { cache: false }, () => Math.random());

  it('should not cache', () => {
    const cached = given.random;

    // values not cached
    expect(given.random).not.toBe(cached);
    expect(given.random).not.toBe(cached);
  });
});
```

You can use `given` inside any context `describe/it` etc...

```js
describe('given', () => {
  // given will wrap it into beforeEach
  given('one', () => 1);
  given('two', () => 2);

  it('should change value', () => {
    given('two', () => 3);

    expect(given.one).not.toBe(1);
    expect(given.two).not.toBe(3); // the value will be equal to 3
  });
});
```

How to reset cached value?

```js
describe('given', () => {
  given('random', () => Math.random());

  it('should reset cached value', () => {
    const cached = given.random;

    // just set value to undefined
    given.random = undefined;

    expect(given.random).not.toBe(cached);
  });
});
```

How to reset all cached values?

```js
describe('given', () => {
  given('random', () => Math.random());

  it('should reset all cached values', () => {
    const cached = given.random;

    // You can use __clear__ method
    given.__clear__();

    expect(given.random).not.toBe(cached);
  });
});
```
