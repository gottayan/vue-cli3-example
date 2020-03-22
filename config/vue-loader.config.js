module.exports = {
  loaders: {
    css: [
      'vue-style-loader',
      {
        loader: 'css-loader',
        options: {
          //  sourceMap: true
          modules: {
            mode: 'local',
            localIdentName: '[local]--[hash:base64:5]',
          },
        }
      }
    ],
    postcss: [
      'vue-style-loader',
      {
        loader: 'css-loader',
        // options: {
        //   sourceMap: true
        // }
      }
    ],
    less: [
      'vue-style-loader',
      {
        loader: 'css-loader',
        // options: {
        //   sourceMap: true
        // }
      },
      {
        loader: 'less-loader',
        // 
      }
    ],
    // sass: [
    //   'vue-style-loader',
    //   {
    //     loader: 'css-loader',
    //     options: {
    //       sourceMap: true
    //     }
    //   },
    //   {
    //     loader: 'sass-loader',
    //     options: {
    //       indentedSyntax: true,
    //       sourceMap: true
    //     }
    //   }
    // ],
    // scss: [
    //   'vue-style-loader',
    //   {
    //     loader: 'css-loader',
    //     options: {
    //       sourceMap: true
    //     }
    //   },
    //   {
    //     loader: 'sass-loader',
    //     options: {
    //       sourceMap: true
    //     }
    //   }
    // ],
    // stylus: [
    //   'vue-style-loader',
    //   {
    //     loader: 'css-loader',
    //     options: {
    //       sourceMap: true
    //     }
    //   },
    //   {
    //     loader: 'stylus-loader',
    //     options: {
    //       sourceMap: true
    //     }
    //   }
    // ],
    // styl: [
    //   'vue-style-loader',
    //   {
    //     loader: 'css-loader',
    //     options: {
    //       sourceMap: true
    //     }
    //   },
    //   {
    //     loader: 'stylus-loader',
    //     options: {
    //       sourceMap: true
    //     }
    //   }
    // ]
  },
  // cssSourceMap: true,
  // cacheBusting: true,
  // transformToRequire: {
  //   video: [
  //     'src',
  //     'poster'
  //   ],
  //   source: 'src',
  //   img: 'src',
  //   image: 'xlink:href'
  // }
}
