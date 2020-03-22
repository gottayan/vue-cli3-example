import loveboxApi from '../apis/lovebox'

const state = {
  loveboxs: {
    currentPage: 1,
    nextPageUrl: 'http://',
    data: []
  },
  filterOptions: {
    lovebox: {
      searchType: '',
      sort: '',
      category: ''
    }
  },
  curLovebox: {},
  curLoveCart: {
    box_count: 0,
    items: [],
    ttl: 0
  },
  shopBoxs: {
    curPage: 0,
    nextPageUrl: '//',
    data: []
  },
  loveCollections: {
    curPage: 0,
    nextPageUrl: '//',
    data: []
  }
}

const actions = {
  getLovebox ({commit, state}, {userRoleType, sort, category, isSearch, page, cb, isClear = false}) {
    loveboxApi.getLovebox(
      userRoleType,
      sort,
      category,
      page,
      (data) => {
        if (isClear) {
          commit('resetLoveboxs')
        }
        commit('setLoveboxs', {isSearch, data})
        cb(data)
      }
    )
  },
  getLoveboxInfo ({commit, state}, {id, cb = null} = {}) {
    loveboxApi.getLoveboxInfo(
      id,
      (data) => {
        commit('setCurrentLovebox', {data})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getLoveboxThanks ({commit, state}, {id, cb = null} = {}) {
    loveboxApi.getLoveboxThanks(
      id,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getLoveboxOrderItems ({commit, state}, {id, cb = null} = {}) {
    loveboxApi.getLoveboxOrderItems(
      id,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  addlovboxItem ({commit, state}, {id, quantity, cb = null} = {}) {
    loveboxApi.addlovboxItem(
      id,
      quantity,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getLoveCart ({commit, state}, {cb = null} = {}) {
    loveboxApi.getLoveCart(
      (data) => {
        commit('setCurLoveCart', {data})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  updateCount ({commit, state}, {rowId, quantity, cb = null} = {}) {
    loveboxApi.updateCount(
      rowId,
      quantity,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  settleLoveCart ({commit, state}, {consignee, cellphone, address, cb = null} = {}) {
    loveboxApi.settleLoveCart(
      consignee,
      cellphone,
      address,
      (data) => {
        commit('resetCurLoveCart', {data})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getMyShopBoxs ({commit, state}, {page, cb = null} = {}) {
    loveboxApi.getMyShopBoxs(
      page,
      (data) => {
        commit('setMyShopBoxes', {data})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getMyLoveCollections ({commit, state}, {page, cb = null} = {}) {
    loveboxApi.getMyLoveCollections(
      page,
      (data) => {
        commit('setMyLoveCollections', {data})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  bookLoveCollections ({commit, state}, {params, cb = null} = {}) {
    loveboxApi.bookLoveCollections(
      params,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  removeItem ({commit, state}, {rowId, cb = null} = {}) {
    loveboxApi.removeItem(
      rowId,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  contactCompany ({commit, state}, {data, cb = null} = {}) {
    loveboxApi.contactCompany(
      data,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  thanksLovebox ({commit, state}, {id, data, cb = null} = {}) {
    loveboxApi.thanks(
      id,
      data,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  }
}

const mutations = {
  setLoveboxs (state, {isSearch, data}) {
    if (isSearch && data.current_page === 1) {
      state.loveboxs.data = []
    }
    state.loveboxs = {
      ...state.loveboxs,
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [
        ...state.loveboxs.data,
        ...data.data
      ]
    }
  },
  resetLoveboxs (state) {
    state.loveboxs = {
      currentPage: 1,
      nextPageUrl: 'http://',
      data: []
    }
  },
  setLoveboxFilterOptions (state, {searchType, sort, category, poolType}) {
    if (poolType === 'lovebox') {
      state.filterOptions = {
        ...state.filterOptions,
        lovebox: {
          type: 'lovebox',
          searchType,
          sort,
          category
        }
      }
    }
  },
  setCurrentLovebox (state, {data}) {
    state.curLovebox = data
  },
  setCurLoveCart (state, {data}) {
    state.curLoveCart = {
      ...state.curLoveCart,
      ...data
    }
  },
  resetCurLoveCart (state) {
    state.curLoveCart = {
      box_count: 0,
      items: [],
      ttl: 0
    }
  },
  setMyShopBoxes (state, {data}) {
    state.shopBoxs = {
      curPage: data.current_page,
      data: [...state.shopBoxs.data, ...data.data],
      nextPageUrl: data.next_page_url
    }
  },
  resetMyShopBoxes (state) {
    state.shopBoxs = {
      curPage: 0,
      nextPageUrl: '//',
      data: []
    }
  },
  setMyLoveCollections (state, {data}) {
    state.loveCollections = {
      curPage: data.current_page,
      data: [...state.loveCollections.data, ...data.data],
      nextPageUrl: data.next_page_url
    }
  },
  addMyLoveCollections (state, {data}) {
    state.loveCollections = {
      ...state.loveCollections,
      data: [data, ...state.loveCollections.data]
    }
  }
}

export default {
  state,
  actions,
  mutations
}
