# Given2 <sup>:exclamation:WIP:exclamation:</sup>
  inspired by [given.js](https://github.com/freshtonic/given.js) and [Rspec](http://rspec.info/)

Use `given` to define a memoized helper method. The value will be cached
across multiple calls in the same example but not across examples.

Note that `given` is lazy-evaluated: it is not evaluated until the first time
the method it defines is invoked.
