import wishApi from '../apis/wish'

const state = {
  wishList: {
    currentPage: 1,
    nextPageUrl: 'http://',
    data: []
  },
  wishItem: {},
  commentsList: [],
  userWishList: [],
  myUserWishList1: [], // 2017
  myUserWishList2: [], // 2018
  otherUserWishList1: [], // 2017
  otherUserWishList2: [] // 2018
}

const actions = {
  getWishList ({commit, state}, {page, status, cb}) {
    wishApi.getWishList(
      page,
      status,
      (data) => {
        commit('setWishList', { data })
        cb(data)
      }
    )
  },
  getWishItem ({ commit, state }, { id, cb }) {
    wishApi.getWishItem(
      id,
      (data) => {
        commit('setWishItem', { data })
        cb(data)
      }
    )
  },
  getCommentsList ({ commit, state }, { id, cb }) {
    wishApi.getCommentsList(
      id,
      (data) => {
        commit('setCommentsList', { data })
        cb(data)
      }
    )
  },
  submitComments ({ commit, state }, {data, cb}) {
    wishApi.submitComments(
      data,
      (data) => cb(data)
    )
  },
  donate ({ commit, state }, {id, cb}) {
    wishApi.donate(
      id,
      (data) => cb(data)
    )
  },
  voteUp ({ commit, state }, { id, cb }) {
    wishApi.voteUp(id, (data) => cb(data))
  },
  cancelVote ({ commit, state }, { id, cb }) {
    wishApi.cancelVote(id, (data) => cb(data))
  },
  sendRead ({ commit, state }, { id }) {
    wishApi.sendRead(id)
  },
  getUserWishList ({ commit, state }, { id, cb, batch, isSelf }) {
    wishApi.getUserWishList(id, batch, data => {
      commit('setUserWishList', {data, batch, isSelf})
      cb(data)
    })
  }
}

const mutations = {
  setWishList (state, { data }) {
    state.wishList = {
      ...state.wishList,
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [
        ...state.wishList.data,
        ...data.data
      ]
    }
  },
  setWishItem (state, { data }) {
    state.wishItem = data
  },
  clearWishList (state) {
    state.wishList.data = []
  },
  setCommentsList (state, { data }) {
    state.commentsList = data
  },
  setUserWishList (state, { data, batch, isSelf }) {
    const prefix = isSelf ? 'my' : 'other'
    batch = batch === undefined ? '' : batch
    state[`${prefix}UserWishList${batch}`] = data.data
  }
}

export default {
  state,
  actions,
  mutations
}
