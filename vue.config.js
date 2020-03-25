// vue.config.js
const path = require('path')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  assetsDir: 'static',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/global.mixin.less')]
    }
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === "'development'") {
      config
      .plugin('webpack-bundle-analyzer')
      .use(BundleAnalyzerPlugin)
      .end()
    }
    config
    .plugin('speed-measure-webpack-plugin')
    .use(SpeedMeasurePlugin)
    .end()

    config
    .plugin('copy')
    .tap(options => {
      options[0] = [{
        from: path.resolve(__dirname, 'static'),
        to: 'static',
        ignore: ['.*']
      }]
      return options
    })
  },
  configureWebpack: config => {
    require('vux-loader').merge(config, {
      plugins: [
        {
          name: 'vux-ui'
        }, {
          name: 'duplicate-style'
        }, {
          name: 'less-theme',
          path: 'src/theme.less'
        },
      ]
    })
  }
}