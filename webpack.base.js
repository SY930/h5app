const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 将CSS提取到单独的文件中
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
// const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
// const {
//   CleanWebpackPlugin,
// } = require('clean-webpack-plugin');
// const webpack = require('webpack');
const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle-[contenthash].js',
  },
  optimization: {
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', 'less'],
    alias: {
      '@ant-design/icons/lib/dist$': path.resolve(__dirname,'src/components/Icon')
   }
  },
  module: {
    noParse: /jquery/,
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        // ?cacheDirectory 表示传给 babel-loader 的参数，用于缓存 babel 编译结果加快重新编译速度
        use: ['babel-loader?cacheDirectory'],
        // use: 'babel-loader',
      },
      // 普通模式
      {
        test: new RegExp(`^(.*\\.global).*\\.css`),
        use: [{
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader'
          }
        ],
        exclude: /node_modules/
      }, {
        test: /\.(less|css)$/,
        include: /node_modules/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: {
                'primary-color': '#1AB495',
                'link-color': '#1AB495',
                'border-radius-base': '4px',
              },
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.(less|css)$/,
        exclude: /node_modules/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: 'css-loader',
            options: {
              modules: {
                // mode: 'local',
                localIdentName: isProduction ? "[hash:base64]" : "[path][name]__[local]--[hash:base64:5]",
              },
              importLoaders: 0,
              // modules: true,
              // camelCase: true,
              // localIdentName: '[name]_[local]__[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              // parser: 'postcss-js',
              plugins: [
                require('autoprefixer'), // eslint-disable-line
              ],
            },
          },
          // {
          //   loader: 'px2rem-loader',//可以把px单位变成rem单位
          //   options: {
          //     remUnit: 75,//在标准设计稿下1rem对应的是75px
          //     remPrecesion: 8 //计算后的小数精度是8位
          //   }
          // },
          'less-loader',
        ],
      },
      {
        test: /\.(ttf|svg|eot|woff|woff2|otf)/,
        use: {
          loader: 'url-loader',
        },
      },
      {
        test: /\.(htm|html)$/,
        loader: 'html-withimg-loader', // ，html中直接使用img标签src加载图片图片会被打包而且路径也处理妥当。npm -> 额外提供html的include子页面功能。
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      hash: true, // 为了避免缓存，可以在产出的资源后面添加hash值
    }),
  ],

};