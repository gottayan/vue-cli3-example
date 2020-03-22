import festival from '../apis/festival'

const state = {
  myRecordInfo: {
    vote: []
  },
  dataInfo: {
    data: [],
    current_page: 0,
    next_page_url: '1',
    total: 0
  },
  famousList: [],
  // 人氣排名
  userInfo: [],
  views: 0,
  likes: 0
}

const actions = {
  getCurrentFestivalData ({commit, state}, {options, cb, isSearch}) {
    console.log('isSearch', isSearch)
    festival.getFestivalList(
      {
        ...options,
        page: isSearch ? 1 : state.dataInfo.current_page + 1
      },
      (data) => {
        if (data.data.length && !isSearch) {
          commit('setFestivalData', {data})
        }
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getFestivalFamousData ({commit}, {options, cb}) {
    festival.getFamousList(
      options,
      (data) => {
        if (data.length) {
          commit('setFestivalFamousData', {data})
        }
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getFestivalUserInfoData ({commit}, {id, cb}) {
    festival.getFestivalUserInfo(
      id,
      (data) => {
        if (data.length) {
          commit('setFestivalUserInfoData', {data})
        }
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getMyFestivalInfo ({commit}, {options, cb}) {
    festival.getMine(
      options,
      (data) => {
        cb(data)
        if (data.vote_ups && data.vote_ups.length) {
          commit('updateVoteStatus', {data: data.vote_ups})
        }
      }
    )
  },
  getCurrentFestivalLike ({commit}, {id}) {
    festival.getTotalLike(
      id,
      (data) => {
        if (!data.error) {
          commit('setTotalLike', {count: data})
        }
      }
    )
  },
  getCurrentFestivalViews ({commit}, {id}) {
    festival.addViews(
      id,
      (data) => {
        if (!data.error) {
          commit('setTotalViews', {count: data})
        }
      }
    )
  },
  sendRecord ({commit}, {bundle, cb}) {
    festival.publish(
      bundle,
      (data) => {
        cb(data)
        if (!data.error) {
          commit('clearDataInfo')
        }
      }
    )
  },
  sendVote ({commit}, {id, cb}) {
    festival.voteUp(
      id,
      (data) => {
        cb(data)
        if (!data.error) {
          commit('updateVote', {data})
        }
      }
    )
  }
}

const mutations = {
  setFestivalData (state, {data}) {
    data.data = data.data.map((item) => ({...item, isVoted: false}))
    state.dataInfo = {
      ...data,
      data: [...state.dataInfo.data, ...data.data],
      total: data.total
    }
  },
  setFestivalFamousData (state, {data}) {
    state.famousList = data.map(item => ({
      ...item,
      isVoted: false
    }))
  },
  setFestivalUserInfoData (state, {data}) {
    state.userInfo = data
  },
  setTotalLike (state, {count}) {
    state.likes = parseInt(count)
  },
  setTotalViews (state, {count}) {
    state.views = count
  },
  updateVote (state, {data}) {
    // 单个投票更新 投票状态
    state.dataInfo.data = state.dataInfo.data.map(item => {
      if (item.id === data.id) {
        return {
          ...item,
          isVoted: true,
          vote_up: data.vote_up
        }
      }
      return item
    })

    state.famousList = state.famousList.map(item => {
      if (item.id === data.id) {
        return {
          ...item,
          isVoted: true,
          vote_up: data.vote_up
        }
      }
      return item
    })
    state.likes = parseInt(state.likes) + 1
  },
  updateVoteStatus (state, {data}) {
    // 获取到我的投票后批量更新投票状态
    state.dataInfo.data = state.dataInfo.data.map(item => {
      if (data.some(child => child === item.id)) {
        return {
          ...item,
          isVoted: true
        }
      }
      return item
    })
    state.famousList = state.famousList.map(item => {
      if (data.some(child => child === item.id)) {
        return {
          ...item,
          isVoted: true
        }
      }
      return item
    })
  },
  clearDataInfo (state) {
    // 因為發佈后，再回到活動首頁，此時page是從store內取，導致可能page>1，沒有請求到剛剛刊登的數據
    // 當然這裡也可以把成功發佈的數據push進data::Array內
    state.dataInfo = {
      data: [],
      current_page: 0,
      next_page_url: '1',
      total: 0
    }
  }
}

export default {
  state,
  mutations,
  actions
}
