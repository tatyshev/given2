module.exports = {
  entry: './src/given.js',
  mode: 'production',
  output: {
    filename: 'bundle.js',
    library: 'given',
    libraryTarget: 'umd',
  },
};
