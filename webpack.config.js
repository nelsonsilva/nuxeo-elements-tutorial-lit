const { resolve, join } = require('path');
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const ENV = process.argv.find(arg => arg.includes('production'))
  ? 'production'
  : 'development';

const TARGET = ENV === 'production' ? resolve('dist') : resolve('src');;

const polyfills = [
  {
    from: 'node_modules/@webcomponents/webcomponentsjs/*.{js,map}',
    to: join(TARGET, 'vendor/webcomponentsjs'),
    flatten: true
  }
];

const common = merge([
  {
    entry: './src/index.js',
    output: {
      filename: '[name].[chunkhash:8].js',
      path: TARGET
    },
    mode: ENV
  }
]);

const development = merge([
  {
    devtool: 'cheap-module-source-map',
    plugins: [
      new CopyWebpackPlugin(polyfills),
      new HtmlWebpackPlugin({
        template: 'index.html'
      })
    ],
    devServer: {
      contentBase: TARGET,
      compress: true,
      overlay: true,
      port: 5000,
      host: '0.0.0.0',
      historyApiFallback: true,
      proxy: {
        '/nuxeo': 'http://localhost:8080/nuxeo'
      }
    }
  }
]);

const analyzer = process.argv.find(arg => arg.includes('--analyze')) ? [new BundleAnalyzerPlugin()] : [];

const production = merge([
  {
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    plugins: [
      new CleanWebpackPlugin([TARGET], { verbose: true }),
      new HtmlWebpackPlugin({
        template: resolve('index.html')
      }),
      new CopyWebpackPlugin([
        ...polyfills,
        { from: 'manifest.json' },
        { from: 'images', to: 'images' },
      ]),
      ...analyzer
    ]
  }
]);

module.exports = mode => merge(common, mode === 'production' ? production : development, { mode });
