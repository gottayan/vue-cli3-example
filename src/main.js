// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import App from './App'
import router from './router'
import store from './store/'
import Vuex from 'vuex'
import { sync } from 'vuex-router-sync'
import axios from './tools/axios'
import Icon from 'vue-svg-icon/Icon.vue'
// import { LoadingPlugin, ToastPlugin, ConfirmPlugin, XInput, Group, Toast, Confirm, AlertPlugin } from 'vux'

import LoadingPlugin from 'vux/src/plugins/loading'
import ToastPlugin from 'vux/src/plugins/toast'
import ConfirmPlugin from 'vux/src/plugins/confirm'
import XInput from 'vux/src/components/x-input'
import Group from 'vux/src/components/group'
import Toast from 'vux/src/components/toast'
import Confirm from 'vux/src/components/confirm'
import AlertPlugin from 'vux/src/plugins/alert'

import { shipMapping, roleList, stepOptions, thingsStatusList,
  storyType, valuationList, needDonateDealStatusMap } from './tools/constant'
import { getSmartDate } from './tools/datetime'
import Elapsed from 'elapsed'
import SocialSharing from 'vue-social-sharing'
import vuePicturePreview from 'vue-picture-preview'
import {smartImagePath} from '@/tools/ObjectHelper'
import { dateStandard } from '@/tools/datetime'
import FastClick from 'fastclick'
import VueLoading from '@/plugin/loading'
import CHeader from '@/components/CHeader'
import gallery from './components/public/img-vuer/gallery'

Vue.use(VueLoading)
Vue.use(gallery)

// input type(file) 上傳圖片
FastClick.prototype.onTouchEnd = (event) => {
  if (event.target.hasAttribute('type') &&
    event.target.getAttribute('type') === 'file') {
    return false
  }
}

const veeValidateConfig = {
  errorBagName: 'errorBags',
  fieldsBagName: 'fieldBags'
}
Vue.use(SocialSharing)
Vue.use(LoadingPlugin, ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.use(Vuex)
Vue.use(VeeValidate, veeValidateConfig)
Vue.use(ToastPlugin, { position: 'bottom' })
Vue.component('toast', Toast)
Vue.component('confirm', Confirm)
Vue.component('x-input', XInput)
Vue.component('group', Group)
Vue.component('icon', Icon)
Vue.component('x-header', CHeader)
Vue.use(vuePicturePreview)
FastClick.attach(document.body)

Vue.config.productionTip = false
Vue.prototype.$http = axios

const smartFilter = (value, array, paramName = 'value', isFilterThingVal = false, defaultRes = '') => {
  if (!isFilterThingVal && !value) return defaultRes || '-'
  for (const item of array) {
    if (value === item[paramName]) {
      return item.label
    }
  }
  return ''
}

Vue.filter('role', function (value) {
  return smartFilter(value, roleList, 'value', false, '一般會員')
})

Vue.filter('shipStatus', (value) => {
  return smartFilter(value, stepOptions)
})

Vue.filter('needDonateDealStatus', (value) => {
  return smartFilter(value, needDonateDealStatusMap)
})

Vue.filter('shipway', (value) => {
  const { way } = shipMapping
  if (way[value]) {
    return way[value]
  } else {
    return '-'
  }
})

Vue.filter('thingStatus', (value) => {
  return smartFilter(value, thingsStatusList)
})

// Vue.filter('smartDateTime', (str) => {
//   return getSmartDate(str)
// })

Vue.filter('smartDate', (str) => {
  return getSmartDate(str)
})

Vue.filter('storyType', (value) => {
  return smartFilter(value, storyType, 'id')
})

// const dateStandard = (dateStr, _isReg = false) => {
//   let rtn = ''
//   if (dateStr) {
//     const str = dateStr.toString()
//     const a = str.split(' ')
//     const d = a[0] ? a[0].split('-') : [0, 0, 0]
//     const t = a[1] ? a[1].split(':') : [0, 0, 0]
//     let date = new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2])
//     _isReg && (date = new Date(date.getTime() + (15 * 24 * 60 * 60 * 1000)))
//     rtn = date
//   }
//   return rtn
// }
Vue.filter('distanceDays', (date) => {
  // if date is same as today, Elapsed will be 0, so need minus 1.
  const days = 15 - new Elapsed(new Date(dateStandard(date)), new Date()).days.num - 1
  return days > 0 ? days : 0
})
Vue.filter('thingValue', (value) => {
  return smartFilter(value, valuationList, 'key', true)
})

Vue.filter('smallImage', (path, type) => {
  return smartImagePath(path, type)
})

Vue.filter('toCdnBigImage', (path) => {
  return smartImagePath(path, false)
})

sync(store, router)

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   store,
//   components: { App },
//   template: '<App/>'
// })
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
