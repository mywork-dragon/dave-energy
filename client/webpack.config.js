const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

// TODO: Minify production build using Terser plugin
const isProd = process.env.NODE_ENV === 'production';

/**
 * Alias folders under ./src so that webpack can resolve imports directly
 * instead of having to jump through directories
 * @returns {Record<string, string>}
 * @example {components: './src/components'}
 */
function aliasSrcFolders() {
  const srcFolderPath = path.resolve(__dirname, 'src');

  return fs.readdirSync(srcFolderPath).reduce((accumulator, file) => {
    const dirPath = path.join(srcFolderPath, file);
    const isDirectory = fs.statSync(dirPath).isDirectory();

    if (isDirectory) {
      accumulator[file] = dirPath;
    }

    return accumulator;
  }, {});
}

const config = {
  mode: isProd ? 'production' : 'development',
  entry: {
    index: './src/index.tsx',
  },
  output: {
    filename: 'static/[name].[contenthash].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    mainFields: ['module', 'browser', 'main'],
    alias: {
      ...aliasSrcFolders(),
      '../../theme.config$': path.join(__dirname, '/semantic-ui/theme.config'),
      '../semantic-ui/site': path.join(__dirname, '/semantic-ui/site'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|less)$/,
        loader: 'style-loader!css-loader!less-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true, // true outputs JSX tags
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader?name=fonts/[name].[ext]!static',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.OLARK_SITE_ID': JSON.stringify(process.env.OLARK_SITE_ID || ''),
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'David Energy',
      template: 'src/index.html',
    }),
    new CaseSensitivePathsPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/images/cropped-favicon-32x32.png',
          to: 'favicon.png',
        },
        {
          from: 'public/swagger.json',
          to: 'static/swagger.json',
        },
        {
          from: 'tools/**/*',
          to: '',
        },
      ],
    }),
  ],
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};

module.exports = config;
