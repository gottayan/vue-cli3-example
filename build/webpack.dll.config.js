const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const CompressionPlugin = require('compression-webpack-plugin')

const vendors = [
  'vux',
  'axios',
  'vue-router',
  'vuex',
  'vuex-router-sync',
  'dateformat',
  'date-fns',
  'html2canvas'
]
const dllConfig = {
  mode: 'production',
  entry: {
    vendors: vendors,
  },
  output: {
    path: path.join(__dirname, '..', 'dll'),
    filename: '[name].[chunkhash].dll.js',
    library: '[name]_[chunkhash]',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.scss'],
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
    },  {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      query: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
      }
    }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
            limit: 10000,
            name: 'fonts/[name].[hash:7].[ext]'
        }
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      path: path.join(__dirname, '..', 'dll', '[name].manifest.json'),
      name: '[name]_[chunkhash]'
    }),
    // new CompressionPlugin({
    //   test: /\.js$/,
    //   threshold: 10240,
    //   deleteOriginalAssets: false
    // }),
    new BundleAnalyzerPlugin()
  ],
  // optimization: {
  //   minimize: false
  // }
}
module.exports = require('vux-loader').merge(dllConfig, {
  plugins: [{
      name: 'vux-ui'
  }]
})