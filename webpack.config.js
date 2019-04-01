const { resolve, relative, join } = require('path');
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const fs = require('fs-extra')

const ENV = process.argv.find(arg => arg.includes('production'))
  ? 'production'
  : 'development';

// we can copy things to 'src' in dev mode since if uses a mem fs
const TARGET = ENV === 'production' ? resolve('dist') : resolve('src');;

const polyfills = [
  {
    from: 'node_modules/@webcomponents/webcomponentsjs/*.{js,map}',
    to: join(TARGET, 'vendor/webcomponentsjs'),
    flatten: true
  }
];
class AddonsPlugin {
  constructor(folder) {
    this.folder = folder;
  }

  apply(compiler) {
    const { make } = compiler.hooks;
    console.log('Apply AddonsPlugin');
    make.tapPromise('AddonsPlugin', async (compiler) => {
      console.log('Copying overrides');
      await fs.copy(this.folder, 'src');
    });
  }
}

//const forEachBail = require('enhanced-resolver/lib/forEachBail.js')

class AddonsResolverPlugin {
	constructor(root, directories) {
    this.root = root;
    this.source = "file";
    this.target = "resolve";
		this.directories = [...directories];
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("AddonsResolverPlugin", (request, resolveContext, callback) => {

        // only override src files
        if (!request.path.startsWith(this.root)) {
          return callback();
        }

        const log = resolveContext.log || console.log;

        const relativeSrcPath = relative(this.root, request.path);

        log(`looking for ${relativeSrcPath}`);

        const directory = this.directories.find((d) => {
          const file = resolve(d, relativeSrcPath);
          try {
            return fs.statSync(file).isFile();
          } catch(_) {
            //
          }
        });

        // log(`looking for file ${relativeSrcPath} in ${directory}`);
        if (directory) {
          const file = resolve(directory, relativeSrcPath);
          log(`found override for ${relativeSrcPath} in ${directory}`);
          const obj = Object.assign({}, request, {
            directory: request.directory,
            path: request.path,
            query: request.query,
            request: file
          });
          resolver.doResolve(
            target,
            obj,
            `looking for file ${relativeSrcPath} in ${directory}`,
            resolveContext,
            callback
          );
        } else {
          callback();
        } 
    });
	}
};

const common = merge([
  {
    entry: './src/index.js',
    output: {
      filename: '[name].[chunkhash:8].js',
      path: TARGET
    },
    mode: ENV,
    resolveLoader: {
      modules: [
        'node_modules',
        resolve(__dirname, 'loaders')
      ]
    },
    resolve: {
      extensions: ['.js', '.json'],
      plugins: [new AddonsResolverPlugin(resolve(__dirname, 'src'), ['overrides'])]
    },
    module: {
      rules: [
        {
          type: 'javascript/auto', // skip default json loader
          test: /\.json$/,
          include: [
            resolve(__dirname, 'src/layouts')
          ],
          use: ['layout-loader'],
        },
      ],
    },
  }
]);

const development = merge([
  {
    devtool: 'cheap-module-source-map',
    plugins: [
      //new AddonsPlugin('overrides'),
      new CopyWebpackPlugin([
        ...polyfills,
      ], { debug: 'info' }),
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
      // new AddonsPlugin('overrides'),
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
