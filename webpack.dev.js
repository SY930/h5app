const path = require('path');
const {
  smart
} = require('webpack-merge');
const base = require('./webpack.base');
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin'); // 费时分析
const {
  BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer'); // 生成代码分析报告，帮助提升代码质量和网站性能
const smw = new SpeedMeasureWebpackPlugin();
module.exports = smw.wrap(smart(base, {
  devtool: 'cheap-module-eval-source-map',
  mode: 'development',
  watch: true,
  watchOptions: {
    poll: 1000, //每秒检查一次变动
    aggregateTimeout: 500, //防抖延迟，500秒之后输入，
    ignored: /node_modules/ //ignored: "files/**/*.js"
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'), // 以dist文件作为根目录，如果没有就访问整个./下的文件及文件夹
    port: 8080,
    host: 'localhost',
    compress: true,
    proxy: {}
  },
  module: {
    rules: [{
      // url-loader的引入路径拼接是以output.publicPath+url-loader.publicPath+url-loader.name
      // 当我们是一个单页面应用的时候,我们很可能会将output.public定义为/(根目录),然后直接利用url-loader.name做文章.这样可以既省去url-loader的publicPath,还能省去url-loader的outputPath
      test: /\.(gif|png|jpe?g|svg|bmp)$/,
      use: [{
        loader: 'url-loader', // 该loader内置了file-loader
        options: {
          limit: 10 * 1024, //如果要加载的图片大小小于10K的话，就把这张图片转成base64编码内嵌到html网页中去
          //要把图片拷贝到images目录下  以下是file-loder属性
          outputPath: 'images', // 导出的指定路径
          publicPath: '/images', // 外部引入时的路径前缀
          //  name: '[name].[hash:8].[ext]' // 文件名
        }
      }]
    }, ]
  },
  plugins: [
    // new BundleAnalyzerPlugin({
    //     analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
    //     generateStatsFile: true, // 是否生成stats.json文件
    // })
  ]
}))