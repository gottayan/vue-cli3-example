import Loading from './Loading.vue'

/**
 * 暴露插件安装
 * @param {object} Vue vue实例对象
 */

export default {
  install (Vue) {
    const LoadingConstructor = Vue.extend(Loading)
    const instance = new LoadingConstructor()
    instance.$mount()
    document.body.appendChild(instance.$el)
    /**
     * 扩展原生方法，显示Loading
     * @param {string} message
     * @param {number} duration
     * @param {object} styleObj
     */
    Vue.prototype.$Loading = {
      show (layer = false) {
        instance.show = true
        instance.layer = layer
      },
      hide () {
        instance.show = false
      }
    }
  }
}
