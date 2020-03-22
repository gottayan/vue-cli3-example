import commonwealApi from '../apis/commonweal'
const state = {
  commonwealUser: {
    curPage: 0,
    nextPageUrl: '//',
    data: []
  }
}

const actions = {
  getCommonwealUser ({commit, state}, {page, cb = null} = {}) {
    commonwealApi.getCommonwealUser(
      page,
      (data) => {
        commit('setCommonwealUsers', {data})
        if (cb) {
          cb(data)
        }
      }
    )
  }
}

const mutations = {
  setCommonwealUsers (state, {data}) {
    state.commonwealUser = {
      ...state.commonwealUser,
      curPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [...state.commonwealUser.data, ...data.data]
    }
  }
}

export default {
  state,
  mutations,
  actions
}
