/**
 * Created by lxhfight on 2018/4/8.
 * Email:
 * Description:
 *   管理訊息的全局數據
 */

import messageApi from './../apis/message'

const state = {
  msgStatus: {
    conversations: '',
    messages: ''
  },
  current: 1, // 表示當前所在
  envMessage: {
    items: [],
    page: 1,
    busy: false,
    nextPageUrl: '//'
  },
  sysMessage: {
    items: [],
    page: 1,
    busy: false,
    nextPageUrl: '//'
  }
}

const actions = {
  getEnvMessageList ({ commit, state }, {page, cb}) {
    messageApi.getEnvMessageList(
      page,
      (data) => cb(data)
    )
  },
  getSysMessageList ({ commit, state }, {page, cb}) {
    messageApi.getSysMessageList(
      page,
      (data) => cb(data)
    )
  },
  getChatId ({ commit, state }, {type, thingId, directUserId, cb}) {
    messageApi.getChatId(
      type,
      thingId,
      directUserId,
      (data) => cb(data)
    )
  },
  readMsg ({ commit, state }, {type, msgId, cb = null} = {}) {
    messageApi.readMsg(
      msgId,
      (data) => {
        commit('setReadMsg', {type, msgId})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getMessageStatus ({commit, state}, {cb = null} = {}) {
    messageApi.getMessageStatus(
      (data) => {
        commit('setMessageStatus', {data})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getChatByDirectId ({commit, state}, {id, cb = null} = {}) {
    messageApi.getChattingDetail(
      id,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  readAllMsg ({commit, state}, {type, cb = null} = {}) {
    messageApi.readAllMsg(
      type,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  }
}

const mutations = {
  recoverEnvMessage () {
    state.envMessage = {
      items: [],
      page: 1,
      busy: false,
      nextPageUrl: '//'
    }
  },
  recoverSysMessage () {
    state.sysMessage = {
      items: [],
      page: 1,
      busy: false,
      nextPageUrl: '//'
    }
  },
  updateEnvMessageList (state, payload) {
    const { items } = state.envMessage
    const { data, currentPage } = payload
    if (currentPage === 1) {
      state.envMessage.items = payload.data
    } else {
      state.envMessage.items = items.concat(data)
    }
  },
  updateEnvMessageNextPageUrl (state, data) {
    state.envMessage.nextPageUrl = data
  },
  updateSysMessageList (state, payload) {
    const { items } = state.sysMessage
    const { data, currentPage } = payload
    if (currentPage === 1) {
      state.sysMessage.items = data
    } else {
      state.sysMessage.items = items.concat(data)
    }
  },
  updateSysMessageNextPageUrl (state, data) {
    state.sysMessage.nextPageUrl = data
  },
  setEnvMessagePage (state, page) {
    state.envMessage.page = page
  },
  setSysMessagePage (state, page) {
    state.sysMessage.page = page
  },
  setEnvMessageBusy (state, busy) {
    state.envMessage.busy = busy
  },
  setSysMessageBusy (state, busy) {
    state.sysMessage.busy = busy
  },
  setCurrent (state, current) {
    state.current = current
  },
  setReadMsg (state, {type, msgId}) {
    let match = state[type].items.find(item => item.id === msgId)
    if (match) {
      match.is_read = 1
    }
    state[type] = {
      ...state[type],
      items: [...state[type].items]
    }
  },
  setMessageStatus (state, {data}) {
    if (data) {
      state.msgStatus = {
        ...state.msgStatus,
        conversations: data.conversation,
        messages: data.message
      }
    }
  },
  setMessageAllRead (state, {type}) {
    const msgType = type === 'messages' ? 'sysMessage' : 'envMessage'
    const messageItems = state[msgType].items.map(item => {
      return {
        ...item,
        is_read: 1
      }
    })
    state[msgType] = {
      ...state[msgType],
      items: [...messageItems]
    }
    state.msgStatus = {
      ...state.msgStatus,
      [type]: false
    }
  }
}

export default {
  state,
  actions,
  mutations
}
