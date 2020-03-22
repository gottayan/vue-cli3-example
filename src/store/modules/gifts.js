import giftApi from '../apis/gift'

const state = {
  giftList: {
    currentPage: 1,
    nextPageUrl: 'http://',
    data: []
  },
  giftListTaipei: {
    curIdx: 0,
    currentPage: 0,
    nextPageUrl: 'http://',
    data: []
  },
  searchGifts: [],
  newGift: {
    pics: []
  },
  requestGift: {
    pics: []
  },
  currentGift: {
    gift_images: [],
    user: {},
    show_at: ''
  },
  recruitScrollY: '',
  cabinetBanners: [],
  homeGiftList: [],
  cabinetGiftList: {
    currentPage: 1,
    nextPageUrl: 'http://',
    data: []
  }
}

const actions = {
  getCurrentGift ({commit, state}, {giftId}) {
    giftApi.getItemData(
      giftId,
      (data) => commit('setCurrentGift', {data})
    )
  },
  /**
   * @param commit
   * @param state
   * @param page
   * @param onPool
   * @param isNew
   * @param orgFirst
   * @param sort
   * @param category
   * @param isSearch
   * @param bureauId
   * @param cb
   * @param isClear
   * @param type 2为名柜好礼
   * @param perPage 每页多少个数
   * @param status ongoing进行中 finish索取完 end结案
   * @param refresh 每次请求刷新vuex数据
   * @param home 首页展示
   * @param noRequestList 没有索取者的信息，在后面加上/home
   */
  getGiftList ({commit, state}, {page = '', onPool = '', isNew = '',
    orgFirst = '', sort = '', category = '', isSearch = '', bureauId = '',
    cb = null, isClear = false, type = '', perPage = '', status = '', refresh = false, home = false,
    noRequestList = false} = {}) {
    giftApi.getGiftList(
      page,
      onPool,
      isNew,
      orgFirst,
      sort,
      category,
      bureauId,
      type,
      perPage,
      status,
      noRequestList,
      (data) => {
        if (isClear && bureauId) {
          commit('resetGiftListTaipei')
        } else if (isClear) {
          commit('resetGiftList')
        }
        if (bureauId) {
          commit('setGiftListTaipei', {data})
        } else {
          if (home) {
            commit('setHomeGiftList', {data})
          } else {
            if (type === 2) {
              // 名柜好礼
              commit('setCabinetGiftList', {isSearch, data, refresh})
            } else {
              commit('setGiftList', {isSearch, data, refresh})
            }
          }
        }
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getGiftInfo ({commit, state}, {id, cb = null} = {}) {
    giftApi.getGiftInfo(
      id,
      (data) => {
        if (!data.error) {
          commit('setCurrentGift', {data})
        }
        if (cb) {
          cb(data)
        }
      }
    )
  },
  giftsRequest ({commit, state}, {data, cb}) {
    giftApi.giftsRequest(
      data,
      (data) => cb(data)
    )
  },
  publishGift ({commit, state}, {data, cb}) {
    giftApi.publishGift(
      data,
      (data) => cb(data)
    )
  },
  editGift ({commit, state}, {data, id, cb}) {
    giftApi.editGift(
      data,
      id,
      (data) => cb(data)
    )
  },
  getCabinetBanners ({commit, state}) {
    giftApi.getCabinetBanners(
      (data) => commit('setCabinetBanners', {data})
    )
  }
}

const mutations = {
  setCurrentGift (state, {data}) {
    state.currentGift = {
      ...state.currentGift,
      ...data
    }
  },
  setGiftList (state, {isSearch, data, refresh}) {
    if (isSearch && data.current_page === 1) {
      state.giftList.data = []
    }
    let stateList = refresh ? [] : state.giftList.data
    state.giftList = {
      ...state.giftList,
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [
        ...stateList,
        ...data.data
      ]
    }
  },
  setCabinetGiftList (state, {isSearch, data, refresh}) {
    if (isSearch && data.current_page === 1) {
      state.cabinetGiftList.data = []
    }
    let stateList = refresh ? [] : state.cabinetGiftList.data
    state.cabinetGiftList = {
      ...state.cabinetGiftList,
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [
        ...stateList,
        ...data.data
      ]
    }
  },
  setHomeGiftList (state, {data}) {
    if (data) {
      state.homeGiftList = data.data
    }
  },
  resetGiftList (state) {
    state.giftList = {
      currentPage: 1,
      nextPageUrl: 'http://',
      data: []
    }
  },
  setGiftListTaipei (state, {data}) {
    state.giftListTaipei = {
      ...state.giftListTaipei,
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [
        ...state.giftListTaipei.data,
        ...data.data
      ]
    }
  },
  resetGiftListTaipei (state) {
    state.giftListTaipei = {
      curIdx: 0,
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    }
  },
  setNewGiftPics (state, {data}) {
    state.newGift.pics = [
      ...state.newGift.pics,
      data
    ]
  },
  deleteNewGiftPic (state, {i}) {
    state.newGift.pics = state.newGift.pics.filter((item, index) => i !== index)
  },
  setReqGiftPics (state, {data}) {
    state.requestGift.pics = [
      ...state.requestGift.pics,
      data
    ]
  },
  deleteReqGiftPic (state, {i}) {
    state.requestGift.pics = state.requestGift.pics.filter((item, index) => i !== index)
  },
  changeRecruitScrollY (state, { data }) {
    state.recruitScrollY = data
  },
  setCabinetBanners (state, { data }) {
    state.cabinetBanners = data
  }
}

export default {
  state,
  actions,
  mutations
}
