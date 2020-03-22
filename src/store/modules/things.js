import thingApi from '../apis/thing'

const state = {
  commentList: [],
  commentPic: [],
  famiStore: [],
  activities: {
    data: []
  },
  palmBoxData: {
    total: 0,
    data: []
  }
}

const actions = {
  getCMsg ({commit, state}, {type, cType, id, perPage, cb}) {
    thingApi.getCMsg(
      type,
      cType,
      id,
      perPage,
      (data) => cb(data)
    )
  },
  submitMsg ({commit, state}, {cType, data, cb}) {
    thingApi.submitMsg(
      cType,
      data,
      (data) => cb(data)
    )
  },
  traceItem ({commit, state}, {type, id, isTrace, cb}) {
    thingApi.traceItem(
      type,
      id,
      isTrace,
      (data) => cb(data)
    )
  },
  uploadImg ({commit, state}, {file, type, cb}) {
    thingApi.uploadImgNew(
      file,
      type,
      1,
      (data) => cb(data)
    )
  },
  getFamiStores ({commit}, {cb}) {
    thingApi.getFamiStore(
      (data) => cb(data)
    )
  },
  removeCommentPic ({commit, state}, {i}) {
    commit('deleteCommentPic', {i})
  },
  sendFeedBack ({commit}, {data, cb}) {
    thingApi.sendFeedBack(
      data,
      (data) => cb(data)
    )
  },
  updateStatus ({commit}, {type, id, status, cb}) {
    thingApi.updateStatus(
      type,
      id,
      status,
      (data) => cb(data)
    )
  },
  getCurrentActivities ({commit, state}) {
    thingApi.getCurrentActivities((data) => commit('setActivities', {data}))
  },
  receiveCurrentActivity ({commit, state}, {id, cb}) {
    thingApi.receiveCurrentActivity(id, (data) => {
      cb(data)
    })
  },
  report ({commit, state}, {type, id, reason, cb = null} = {}) {
    thingApi.report(
      type,
      id,
      reason,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getPalmBox ({commit}, {city, area, cb}) {
    thingApi.getPalmBox(city, area, (data) => {
      if (cb && typeof cb === 'function') {
        cb(data)
      }
      if (Array.isArray(data)) {
        commit('setPalmBox', {data})
      } else {
        console.error('獲取掌櫃櫃機信息失敗')
        commit('setPalmBox', {data: []})
      }
    })
  }
}

const mutations = {
  setCommentList (state, {data}) {
    state.commentList = data
  },
  setCommentPic (state, {data}) {
    state.commentPic = [
      ...state.commentPic,
      data
    ]
  },
  deleteCommentPic (state, {i}) {
    state.commentPic = state.commentPic.filter((item, index) => i !== index)
  },
  setActivities (state, {data}) {
    state.activities = data
  },
  setPalmBox (state, {data}) {
    state.palmBoxData = {
      data,
      total: data.length
    }
  }
}

const getters = {
  palmBoxPickerData: state => {
    if (state.palmBoxData.data.length) {
      var obj = {}
      state.palmBoxData.data.forEach(item => {
        if (!(item.CITYNAME in obj)) {
          obj[item.CITYNAME] = {}
          obj[item.CITYNAME][item.DICTNAME] = []
          obj[item.CITYNAME][item.DICTNAME].push(item)
        } else if (!(item.DICTNAME in obj[item.CITYNAME])) {
          obj[item.CITYNAME][item.DICTNAME] = []
          obj[item.CITYNAME][item.DICTNAME].push(item)
        } else if (item.DICTNAME in obj[item.CITYNAME]) {
          obj[item.CITYNAME][item.DICTNAME].push(item)
        }
      })
      var area = Object.keys(obj).map(key => ({name: key, value: key, parent: 0}))
      var city = Object.keys(obj).map(key => {
        return Object.keys(obj[key]).map(item => ({
          name: item,
          value: item,
          parent: key
        }))
      }).reduce((pre, next) => [...pre, ...next])
      var palmbox = state.palmBoxData.data.map(item => ({
        name: `${item.THROWBUILDINGNAME} ${item.EDCODE}`,
        value: item.EDCODE,
        parent: item.DICTNAME
      }))
      var ary = [...area, ...city, ...palmbox]
      return ary
    }
    return []
  },
  currentPalmBoxInfo: state => code => {
    if (code && state.palmBoxData.data.length) {
      return state.palmBoxData.data.find(item => item.EDCODE === code)
    }
    return ''
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
