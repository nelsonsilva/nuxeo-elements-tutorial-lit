const { resolve } = require('path');
const webpack = require('webpack');
const memoryfs = require('memory-fs');

const basePath = resolve(__dirname, '..');

module.exports = (fixture, options = {}) => {
  const compiler = webpack({
    context: basePath,
    mode: 'development',
    entry: `./${fixture}`,
    output: {
      path: basePath,
      filename: 'bundle.js',
    },
    resolveLoader: {
      modules: [
        'node_modules',
        resolve(basePath, '../..')
      ]
    },
    resolve: {
      extensions: ['.js', '.json']
    },
    module: {
      rules: [
        {
          type: 'javascript/auto', // skip default json loader
          test: /\.json$/,
          include: [
            resolve(basePath, 'fixtures/layouts')
          ],
          use: ['layout-loader']
        }
      ]
    }
  });

  compiler.outputFileSystem = new memoryfs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {

      if (err || stats.hasErrors()) {
        console.log(stats.compilation.errors);
        reject(err);
      }

      resolve(stats);
    });
  });
};