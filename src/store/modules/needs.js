import needApi from '../apis/need'

const state = {
  needList: {
    currentPage: 1,
    nextPageUrl: 'http://',
    data: []
  },
  needListTaipei: {
    curIdx: 1,
    currentPage: 0,
    nextPageUrl: 'http://',
    data: []
  },
  currentNeed: {
    need_images: []
  },
  donateNeed: {
    pics: [[]]
  }
}

const actions = {
  getNeedList ({commit, state}, {page = '', onPool = '', userRoleType = '', isTraceUser = '',
    sort = '', category = '', isSearch = '', bureauId = '', cb = null, isClear = false, noRequestList = false} = {}) {
    needApi.getNeedList(
      page,
      onPool,
      userRoleType,
      isTraceUser,
      sort,
      category,
      bureauId,
      noRequestList,
      (data) => {
        if (isClear && bureauId) {
          commit('resetNeedListTaipei')
        } else if (isClear) {
          commit('resetNeedList')
        }

        if (bureauId) {
          commit('setNeedListTaipei', {data})
        } else {
          commit('setNeedList', {isSearch, data})
        }
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getNeedInfo ({commit, state}, {id, cb = null} = {}) {
    needApi.getNeedInfo(
      id,
      (data) => {
        if (cb) {
          cb(data)
        }
        commit('setCurrentNeed', {data})
      }
    )
  },
  submitNewNeed ({commit}, {data, cb}) {
    needApi.submitNewNeed(data, (data) => cb(data))
  },
  editNeed ({commit, state}, {data, id, cb}) {
    needApi.editNeed(
      data,
      id,
      (data) => cb(data)
    )
  }
}

const mutations = {
  setNeedList (state, {isSearch, data}) {
    if (isSearch && data.current_page === 1) {
      state.needList.data = []
    }
    state.needList = {
      ...state.needList,
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [
        ...state.needList.data,
        ...data.data
      ]
    }
  },
  resetNeedList (state) {
    state.needList = {
      currentPage: 1,
      nextPageUrl: 'http://',
      data: []
    }
  },
  setNeedListTaipei (state, {data}) {
    state.needListTaipei = {
      ...state.needListTaipei,
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [
        ...state.needListTaipei.data,
        ...data.data
      ]
    }
  },
  resetNeedListTaipei (state) {
    state.needListTaipei = {
      curIdx: 1,
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    }
  },
  setCurrentNeed (state, {data}) {
    if (data.error) {
      return console.log('需求不存在')
    }
    state.currentNeed = {
      ...state.currentNeed,
      ...data,
      need_donates: [...data.need_donates.reverse()]
    }
  },
  setDonateNeedPics (state, {data, index}) {
    if (state.donateNeed.pics[index]) {
      state.donateNeed.pics[index] = [
        ...state.donateNeed.pics[index],
        ...data
      ]
    } else {
      state.donateNeed.pics[index] = data
    }
  },
  deleteDonateNeedPic (state, {i, itemIndex}) {
    state.donateNeed.pics[i] = state.donateNeed.pics[i].filter((item, index) => itemIndex !== index)
    state.donateNeed.pics = [
      ...state.donateNeed.pics
    ]
  }
}

export default {
  state,
  actions,
  mutations
}
