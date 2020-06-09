// vue.config.js
const path = require('path')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { ProgressPlugin, DllReferencePlugin } = require('webpack')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

// const threadLoader = require('thread-loader')
// threadLoader.warmup({}, [
//   'vue-loader',
//   'eslint-loader'
// ]);

const isDevelopment = (process.env.NODE_ENV === 'development')

module.exports = {
  assetsDir: 'static',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/global.mixin.less')]
    }
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config
      .plugin('webpack-bundle-analyzer')
      .use(BundleAnalyzerPlugin)
      .end()
    }
    config
    .plugin('speed-measure-webpack-plugin')
    .use(SpeedMeasurePlugin)
    .end()

    // config
    // .plugin('progress')
    // .use(ProgressPlugin)
    // .tap(options => {
    //   options = [{
    //     // handler (percentage, msg) {
    //     //   console.info((percentage.toFixed(2) * 100) + '%', msg)
    //     // },
    //     profile: true,
    //   }]
    //   return options
    // })
    // .end()

    // config.module.rule('images')
    // .use('image-webpack-loader')
    // .loader('image-webpack-loader')
    // .tap(options => {
    //   return {}
    // })

    // config.module.rule('eslint')
    //   .use('thread-loader')
    //   .loader('thread-loader')
    //   .before('eslint-loader')

    // config.module.rule('vue')
    //   .use('thread-loader')
    //   .loader('thread-loader')
    //   .before('vue-loader')

    Array.from(['src', 'node_modules/vux-loader', 'node_modules/vue-core-image-upload', 'node_modules/vue-svg-icon']).forEach(item => {
      config.module.rule('vue').include.add(__dirname + `/${ item }`)
    })

    config.module.rule('images').include.add(__dirname, '/src')

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
    .end()
    

    config
    .plugin('dll')
    .use(DllReferencePlugin)
    .tap(options => {
      options[0] = {
        manifest: path.join(__dirname, 'dll', 'vendors.manifest.json')
      }
      return options
    })

    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload')

    config
    .plugin('asset')
    .use(AddAssetHtmlPlugin)
    .tap(options => {
      options[0] = {
        filepath: path.resolve(__dirname, 'dll/*.js'),
        // dll 引用路径
        publicPath: './vendor',
        // dll最终输出的目录
        outputPath: './vendor'
      }
      return options
    })
    .end()
  },
  configureWebpack: config => {
    const mergeConfig =  require('vux-loader').merge(config, {
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
    // mergeConfig.module.rules[0].use[0] = {
    //   loader: 'vux-loader',
    //   options: {
    //     cacheDirectory: path.join(__dirname, 'node_modules', '.cache', 'vux-loader'),
    //     cacheIdentifier: '0753t592'
    //   }
    // }
    config = mergeConfig
  }
}