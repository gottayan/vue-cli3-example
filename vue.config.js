// vue.config.js
const path = require('path')

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/global.mixin.less')]
    }
  },
  configureWebpack: config => {
    config = require('vux-loader').merge(config, {
      options: {},
      plugins: [{
        name: 'vux-ui'
      }, {
        name: 'duplicate-style'
      }, {
        name: 'less-theme',
        path: 'src/theme.less'
      }]
    })
  }
}