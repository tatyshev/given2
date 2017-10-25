/* eslint-disable */

var version = require('../package.json').version;
var fs = require('fs');

var banner =
  '/*!\n' +
  ' * Given2 v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' Ruslan Tatyshev\n' +
  ' * Released under the MIT License.\n' +
  ' */\n';

function iife (code) {
  var globals = ['window', 'document'].join(', ');
  return '!function (' + globals + ') {\n' + code + '\n}('+ globals +');';
}

function size (code) {
  return code.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' bytes';
}

function write (dest, code) {
  fs.writeFileSync(dest, code);
  console.log(tap() + green('created') + ' ' + dest + ' ' + red(size(code)));
}

function tap (amount) {
  amount = amount + 1 || 2;
  return new Array(amount).join('  ');
}

function green (value) {
  return '\x1b[92m' + value + '\x1b[0m';
}

function red (value) {
  return '\x1b[91m' + value + '\x1b[0m';
}

module.exports = {
  size: size,
  write: write,
  banner: banner,
  iife: iife
};
