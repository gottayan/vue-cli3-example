import thankApi from '../apis/thank'
import {} from '../modules/user'
const state = {
  thanksWall: {
    currentPage: 0,
    nextPageUrl: 'http://',
    data: []
  },
  userInfo: {
    id: 0,
    myThanksTabIndex: 0,
    // 收到的感謝
    myToThanks: {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    },
    myFromThanks: {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    }
  },
  otherUserInfo: {
    myThanksTabIndex: 0,
    myToThanks: {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    },
    myFromThanks: {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    }
  }
}
const actions = {
  getThanks ({commit, state}, {page, cb = null} = {}) {
    thankApi.getThanks(
      page,
      (data) => {
        commit('setThanks', {data})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getToThanks ({ commit, state }, {userId, page, parentThanksId, perPage, cb = null, isSelf}) {
    thankApi.getToThanks(
      userId,
      page,
      parentThanksId,
      perPage,
      (data) => {
        commit('setToThanks', {isSelf, data})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getFromThanks ({ commit, state }, {userId, page, parentThanksId, perPage, cb = null, isSelf}) {
    thankApi.getFromThanks(
      userId,
      page,
      parentThanksId,
      perPage,
      (data) => {
        commit('setFromThanks', {isSelf, data})
        if (cb) {
          cb(data)
        }
      }
    )
  }
}

const mutations = {
  // 登出
  // logout (state) {
  //   state.userInfo = {
  //     myThanksTabIndex: 0,
  //     myToThanks: {
  //       currentPage: 0,
  //       nextPageUrl: 'http://',
  //       data: []
  //     },
  //     myFromThanks: {
  //       currentPage: 0,
  //       nextPageUrl: 'http://',
  //       data: []
  //     }
  //   }
  // },
  // 初始化
  resetOtherUserInfo (state) {
    state.otherUserInfo = {
      myThanksTabIndex: 0,
      myToThanks: {
        currentPage: 0,
        nextPageUrl: 'http://',
        data: []
      },
      myFromThanks: {
        currentPage: 0,
        nextPageUrl: 'http://',
        data: []
      }
    }
  },
  setThanks (state, {data}) {
    state.thanksWall = {
      ...state.thanksWall,
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [
        ...state.thanksWall.data,
        ...data.data
      ]
    }
  },
  setToThanks (state, {isSelf, data}) {
    const user = isSelf ? 'userInfo' : 'otherUserInfo'
    state[user].myToThanks = {
      ...state[user].myToThanks,
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [
        ...state[user].myToThanks.data,
        ...data.data
      ]
      // if (nextPageUrl === null) {

      // }
    }
  },
  setFromThanks (state, {isSelf, data}) {
    const user = isSelf ? 'userInfo' : 'otherUserInfo'
    state[user].myFromThanks = {
      ...state[user].myFromThanks,
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [
        ...state[user].myFromThanks.data,
        ...data.data
      ]
    }
  },
  setMyThanksTabIndex (state, {isSelf, index}) {
    const user = isSelf ? 'userInfo' : 'otherUserInfo'
    state[user].myThanksTabIndex = index
  },
  setThanksTabIndex (state, {index}) {
    state.thanksWall = {
      ...state.thanksWall,
      index
    }
  }
}

export default {
  state,
  mutations,
  actions
}
