import Vue from 'vue'
import Vuex from 'vuex'

import home from './modules/home'
import gifts from './modules/gifts'
import needs from './modules/needs'
import user from './modules/user'
import messages from './modules/messages'
import wishes from './modules/wishes'
import things from './modules/things'
import configs from './modules/configs'
import story from './modules/story'
import thanks from './modules/thanks'
import deals from './modules/deals'
import lovebox from './modules/lovebox'
import commonweals from './modules/commonweals'
import enters from './modules/enters'
import searchs from './modules/searchs'
import festival from './modules/festival'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    home,
    gifts,
    needs,
    user,
    messages,
    wishes,
    things,
    configs,
    story,
    thanks,
    deals,
    lovebox,
    commonweals,
    enters,
    searchs,
    festival
  },
  strict: debug
})
