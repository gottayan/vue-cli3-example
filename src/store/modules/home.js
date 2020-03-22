import homeapi from '../apis/home'

const state = {
  bannerList: [],
  commonwealList: [],
  giftsList: []
}

const mutations = {
  setHomeBanner (state, {bannerList}) {
    if (!bannerList) {
      return
    }
    state.bannerList = bannerList.map(item => {
      if (item.text) {
        return {
          url: item.url || 'javascript:',
          img: item.image,
          title: item.text || null
        }
      }
      return {
        url: item.url || 'javascript:',
        img: item.image
      }
    })
  },
  setCommonweal (state, {commonwealList}) {
    if (commonwealList) {
      state.commonwealList = commonwealList.data.slice(0, 4)
    }
  },
  setHomeGifts (state, {gifts}) {
    if (gifts) {
      state.giftsList = gifts.data
    }
  },
  setTraceGift (state, {data}) {
    // console.log('xxxxxxxxxxxxxxxxdsdada', data)
    // console.log('current datalist', state.giftList.forEach(item => console.log(item.id, data.id)))
    // console.log(state.giftsList)
    // console.log('will update data.is_tracing', data.is_tracing)
    state.giftsList.find(item => item.id === data.id).is_tracing = data.is_tracing
    state.giftsList = [...state.giftsList]
  }
}

const actions = {
  getHomeBanner ({commit, state}) {
    homeapi.getBanner((bannerList) => commit('setHomeBanner', {bannerList}))
  },
  getHomeCommonweal ({commit, state}) {
    homeapi.getCommonweal((commonwealList) => commit('setCommonweal', {commonwealList}))
  },
  getHomeGifts ({commit, state}) {
    homeapi.getGifts((gifts) => commit('setHomeGifts', {gifts}))
  },
  toggleTraceGift ({commit, state}, {giftId, isTracing, cb}) {
    homeapi.toggleTraceGift(
      giftId,
      isTracing,
      (data) => {
        commit('setTraceGift', {data})
        cb()
      }
    )
  }
}

export default {
  state,
  mutations,
  actions
}
