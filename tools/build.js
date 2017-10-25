/* eslint-disable */

var rollup = require('rollup').rollup;
var uglify = require('rollup-plugin-uglify');
var buble = require('rollup-plugin-buble');
var globals = require('rollup-plugin-node-globals');
var _ = require('./utils');

function pack(file) {
  var bundle = rollup({
    input: 'src/' + file,
    plugins: [
      buble(),
      globals()
    ]
  });

  bundle.then(function (bundle) {
    var bundled = bundle.generate({
      format: 'umd',
      name: 'given2'
    });

    bundled.then(function (bundled) {
      var output = _.banner + bundled.code;
      _.write(file, output);
    });
  });

  bundle.catch(function (reason) {
    console.log(reason);
  });
}

pack('given.js');
pack('jasmine.js');
pack('jest.js');
pack('mocha.js');
