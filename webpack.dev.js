const path = require('path');
const webpack = require('webpack');
const {
  smart,
} = require('webpack-merge');
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin'); // 费时分析
const {
  BundleAnalyzerPlugin,
} = require('webpack-bundle-analyzer'); // 生成代码分析报告，帮助提升代码质量和网站性能
// const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const base = require('./webpack.base');

const smw = new SpeedMeasureWebpackPlugin();
module.exports = smw.wrap(smart(base, {
  // devtool: 'cheap-module-eval-source-map',
  mode: 'development',
  watch: true,
  watchOptions: {
    poll: 1000, // 每秒检查一次变动
    aggregateTimeout: 500, // 防抖延迟，500秒之后输入，
    ignored: /node_modules/, // ignored: "files/**/*.js"
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'), // 以dist文件作为根目录，如果没有就访问整个./下的文件及文件夹
    port: 8080,
    host: 'localhost', // 支持 IP 访问
    compress: true,
    open: true,
    proxy: {
      '/crm_h': {
        target: 'http://dohko.shop.crm.api21.hualala.com',
        changeOrigin: true,
        host: 'http://dohko.shop.crm.api21.hualala.com',
      }
    },
    // historyApiFallback: {//因为我们可能会使用浏览器路由，刷新的时候需要重定向到根文件
    //   index: './index.html'
    // }
  },
  // 缓存模块, 避免在未更改时重建它们。
  cache: true,
  optimization: {

  },
  module: {
    // 缓存已解决的依赖项, 避免重新解析它们。
    // unsafeCache: true,
    rules: [{
      test: /\.(gif|png|jpe?g|svg|bmp)$/,
      use: [{
        loader: 'url-loader', // 该loader内置了file-loader
        options: {
          limit: 10 * 1024,
          outputPath: 'images', // 导出的指定路径
          publicPath: '/images', // 外部引入时的路径前缀
          //  name: '[name].[hash:8].[ext]' // 文件名
        },
      }],
    }],
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new BundleAnalyzerPlugin({
      // analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      // generateStatsFile: true, // 是否生成stats.json文件
    }), // 没有参数则使用默认配置

  ],
}));
