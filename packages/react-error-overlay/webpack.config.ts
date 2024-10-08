/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

import path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, './lib'),
    filename: 'index.js',
    library: 'ReactErrorOverlay',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /iframe-bundle\.js$/,
        use: 'raw-loader',
      },
      {
        test: /\.(js|ts)x?$/,
        include: path.resolve(__dirname, './src'),
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      iframeScript$: path.resolve(__dirname, './lib/iframe-bundle.js'),
    },
    fallback: {
      fs: false,
      path: false,
    },
  },
  optimization: {
    nodeEnv: false,
  },
  performance: {
    hints: false,
  },
};

export default config;