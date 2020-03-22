import searchApi from '../apis/search'

const state = {
  tabIndex: 0,
  keyW: '',
  gifts: {
    keyW: '',
    data: [],
    curPage: 0,
    nextPageUrl: '//'
  },
  needs: {
    keyW: '',
    data: [],
    curPage: 0,
    nextPageUrl: '//'
  },
  members: {
    keyW: '',
    data: [],
    curPage: 0,
    nextPageUrl: '//'
  }
}

const actions = {
  searchGift ({commit, state}, {keyW, page, onPool, cb}) {
    searchApi.searchGift(
      keyW,
      page,
      onPool,
      (data) => {
        cb(data)
        commit('setSearchGifts', {data})
      }
    )
  },
  searchNeed ({commit, state}, {keyW, page, onPool, cb}) {
    searchApi.searchNeed(
      keyW,
      page,
      onPool,
      (data) => {
        commit('setSearchNeeds', {data})
        cb(data)
      }
    )
  },
  searchMember ({commit, state}, {keyW, page, cb}) {
    searchApi.searchMember(
      keyW,
      page,
      // onPool,
      (data) => {
        commit('setSearchMembers', {data})
        cb(data)
      }
    )
  }
}

const mutations = {
  setSearchGifts (state, {data}) {
    state.gifts = {
      ...state.gifts,
      data: [...state.gifts.data, ...data.data],
      curPage: data.current_page,
      nextPageUrl: data.next_page_url
    }
  },
  setSearchNeeds (state, {data}) {
    state.needs = {
      ...state.needs,
      data: [...state.needs.data, ...data.data],
      curPage: data.current_page,
      nextPageUrl: data.next_page_url
    }
  },
  setSearchMembers (state, {data}) {
    const newUsers = data.data.map(item => ({
      ...item,
      nickname: (item.nickname && item.nickname.replace(/null/i, '暫無')) || '暫無'
    }))
    state.members = {
      ...state.members,
      data: [...state.members.data, ...newUsers],
      curPage: data.current_page,
      nextPageUrl: data.next_page_url
    }
  },
  setSearchKeyW (state, {keyW}) {
    state.keyW = keyW
  },
  setTypeKeyW (state, {type, keyW}) {
    state[type].keyW = keyW
  },
  setSearchTabIndex (state, {index}) {
    state.tabIndex = index
  },
  initSearch (state, {type}) {
    state[type] = {
      ...state[type],
      data: [],
      curPage: 0,
      nextPageUrl: '//'
    }
  }
}

export default {
  state,
  actions,
  mutations
}
