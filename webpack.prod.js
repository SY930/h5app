const path = require('path');
const webpack = require('webpack');
const {
  smart,
} = require('webpack-merge');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const safeParser = require('postcss-safe-parser');
const base = require('./webpack.base');
const {
  BundleAnalyzerPlugin,
} = require('webpack-bundle-analyzer');

const recursiveIssuer = (m, c) => {
  // if (m.issuer) {
  //   return recursiveIssuer(m.issuer);
  // } else if (m.name) {
  //   return m.name;
  // } else {
  //   return false;
  // }
  const issuer = m.issuer;

  if (issuer) {
    return recursiveIssuer(issuer, c);
  }

  const chunks = m.issuer;

  for (const chunk of chunks) {
    return chunk.name;
  }

  return false;
}


module.exports = smart(base, {
  mode: 'production',
  optimization: {
    minimizer: [
      // 表示放优化的插件
      new TerserWebpackPlugin({
        parallel: true,
        cache: true,
        extractComments: false,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),

    ],
    // 某些chunk的子chunk已一种方式被确定，这些子chunk在加载更大的块时不必加载这些 chunk 子集 ???
    flagIncludedChunks: true,
    // 给经常使用的ids更短的值
    occurrenceOrder: true,
    // 确定每个模块下被使用的导出
    usedExports: true,
    // 识别package.json or rules sideEffects标志
    sideEffects: true,
    // 尝试查找模块图中可以安全连接到单个模块中的段
    concatenateModules: true,
    minimize: true,
    moduleIds: 'hashed',
    // runtimeChunk: false, // 目前项目较小不必要单独
    splitChunks: {
      // chunks: 'all', 
      // minSize: 3000, 
      // minChunks: 1, 
      // maxAsyncRequests: 5, 
      // maxInitialRequests: 3, 
      // name: true, 
      // automaticNameDelimiter: '~', 
      cacheGroups: {
        commons: {
          chunks: 'initial',
          name: 'commons',
          minSize: 0,
          minChunks: 2,
          maxInitialRequests: 5,
          maxAsyncRequests: 3,
          // reuseExistingChunk: true, // 可设置是否重用该chunk 配置项允许重用已经存在的代码块而不是创建一个新的代码块
        },
        vendors: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendors',
          priority: 10,
          enforce: true,
        },
        fooStyles: {
          name: 'foo',
          test: (m, c, entry = 'foo') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true
        }
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin({
      // analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      // generateStatsFile: true, // 是否生成stats.json文件
    }), // 没有参数则使用默认配置
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css/g, // 指定要压缩的模块规则
      // cssnano时postCss的css优化和分解插件，cssnano采用很好的css， 并通过许多优化, 以确保最终的生产环境尽可能的小
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        parser: safeParser,
        discardComments: {
          removeAll: true
        },
        // 避免 cssnano 重新计算 z-index
        safe: true,
      },
      canPrint: true,
    }),
  ],
});