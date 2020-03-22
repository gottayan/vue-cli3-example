import dealApi from '../apis/deal'

const state = {
  mergeList: {
    total: 0,
    curPage: 0,
    data: [],
    nextPageUrl: '//'
  },
  category: {
    gift_request: {
      requesting_total: '',
      remitting_total: '',
      remitted_total: '',
      sent_total: '',
      finished_total: ''
    },
    need_donate: {
      init_total: '',
      remitting_total: '',
      remitted_total: '',
      sent_total: ''
    }
  },
  demands: {
    curIdx: 0,
    gift: {
      total: 0,
      curPage: 0,
      data: [],
      nextPageUrl: '//'
    },
    need: {
      total: 0,
      curPage: 0,
      data: [],
      nextPageUrl: '//'
    },
    requesting: {
      curIdx: 0,
      gift: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      },
      need: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      }
    },
    remitting: {
      curIdx: 0,
      gift: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      },
      need: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      }
    },
    remitted: {
      curIdx: 0,
      gift: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      },
      need: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      }
    },
    sent: {
      curIdx: 0,
      gift: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      },
      need: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      }
    },
    finished: {
      curIdx: 0,
      gift: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      },
      need: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      }
    }
  },
  donates: {
    curIdx: 0,
    gift: {
      total: 0,
      curPage: 0,
      data: [],
      nextPageUrl: '//'
    },
    need: {
      total: 0,
      curPage: 0,
      data: [],
      nextPageUrl: '//'
    },
    init: {
      curIdx: 0,
      gift: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      },
      need: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      }
    },
    remitting: {
      curIdx: 0,
      gift: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      },
      need: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      }
    },
    remitted: {
      curIdx: 0,
      gift: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      },
      need: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      }
    },
    sent: {
      curIdx: 0,
      gift: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      },
      need: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      }
    }
  }
}

const actions = {
  getShipsnPic ({commit, state}, {id, cb = null} = {}) {
    dealApi.getShipsnPic(
      id,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getDealsCategory ({commit, state}, {cb = null} = {}) {
    dealApi.getDealsCategory(
      (data) => {
        commit('setDealsCategory', {data})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getMyDemands ({commit, state}, {page, type, status, cb = null} = {}) {
    dealApi.getMyDemands(
      page,
      type,
      status,
      (data) => {
        commit('setMyDemands', {type, status, data})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getMyDonates ({commit, state}, {page, type, status, cb = null} = {}) {
    dealApi.getMyDonates(
      page,
      type,
      status,
      (data) => {
        commit('setMyDonates', {type, status, data})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getConversationId ({commit, state}, {id, tab, type, dirUserId, cb = null} = {}) {
    dealApi.getConversationId(
      id,
      tab,
      type,
      dirUserId,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getDemandTotal ({commit, state}, {type, status, cb = null} = {}) {
    dealApi.getDemandTotal(
      type,
      status,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getDonateTotal ({commit, state}, {type, status, cb = null} = {}) {
    dealApi.getDonateTotal(
      type,
      status,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  dealMerge ({commit, state}, {ids = [], cb = null} = {}) {
    dealApi.dealMerge(
      ids,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getMergeList ({commit, state}, {page, perPage, cb = null} = {}) {
    dealApi.getMergeList(
      page,
      perPage,
      (data) => {
        commit('setMergeList', data)
        if (cb) {
          cb(data)
        }
      }
    )
  },
  processMerge ({commit, state}, {giftRequestId, status, mergeRejectedReason, cb = null} = {}) {
    dealApi.processMerge(
      giftRequestId,
      status,
      mergeRejectedReason,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  }
}

const mutations = {
  setDealsCategory (state, {data}) {
    if (!data.error && data.gift_request && data.need_donate) {
      state.category = data
    }
  },
  setMyDemands (state, {type, status, data}) {
    if (type) {
      if (status) {
        state.demands[status].need = {
          ...state.demands[status].need,
          total: data.total,
          curPage: data.current_page,
          nextPageUrl: data.next_page_url
        }

        if (data.current_page === 1) {
          state.demands[status].need.data = data.data
        } else {
          state.demands[status].need.data = state.demands[status].need.data.concat(data.data)
        }
      } else {
        state.demands.need = {
          ...state.demands.need,
          total: data.total,
          curPage: data.current_page,
          nextPageUrl: data.next_page_url
        }

        if (data.current_page === 1) {
          state.demands.need.data = data.data
        } else {
          state.demands.need.data = state.demands.need.data.concat(data.data)
        }
      }
    } else {
      if (status) {
        state.demands[status].gift = {
          ...state.demands[status].gift,
          total: data.total,
          curPage: data.current_page,
          nextPageUrl: data.next_page_url
        }

        if (data.current_page === 1) {
          state.demands[status].gift.data = data.data
        } else {
          state.demands[status].gift.data = state.demands[status].gift.data.concat(data.data)
        }
      } else {
        state.demands.gift = {
          ...state.demands.gift,
          total: data.total,
          curPage: data.current_page,
          nextPageUrl: data.next_page_url
        }
      }
      if (data.current_page === 1) {
        state.demands.gift.data = data.data
      } else {
        state.demands.gift.data = state.demands.gift.data.concat(data.data)
      }
    }
  },
  setDemandsCurIdx (state, {status, index}) {
    if (status) {
      state.demands[status].curIdx = index
    } else {
      state.demands.curIdx = index
    }
  },
  setMergeList (state, data) {
    state.mergeList = {
      ...state.mergeList,
      total: data.total,
      data: [...state.mergeList.data, ...data.data],
      curPage: data.current_page,
      nextPageUrl: data.next_page_url
    }
  },
  setMyDonates (state, {type, status, data}) {
    if (type) {
      if (status) {
        state.donates[status].need = {
          ...state.donates[status].need,
          total: data.total,
          curPage: data.current_page,
          nextPageUrl: data.next_page_url
        }
        if (data.current_page === 1) {
          state.donates[status].need.data = data.data
        } else {
          state.donates[status].need.data = state.donates[status].need.data.concat(data.data)
        }
      } else {
        state.donates.need = {
          ...state.donates.need,
          total: data.total,
          curPage: data.current_page,
          nextPageUrl: data.next_page_url
        }
        if (data.current_page === 1) {
          state.donates.need.data = data.data
        } else {
          state.donates.need.data = state.donates.need.data.concat(data.data)
        }
      }
    } else {
      if (status) {
        state.donates[status].gift = {
          ...state.donates[status].gift,
          total: data.total,
          curPage: data.current_page,
          nextPageUrl: data.next_page_url
        }
        if (data.current_page === 1) {
          state.donates[status].gift.data = data.data
        } else {
          state.donates[status].gift.data = state.donates[status].gift.data.concat(data.data)
        }
      } else {
        state.donates.gift = {
          ...state.donates.gift,
          total: data.total,
          data: [...state.donates.gift.data, ...data.data],
          curPage: data.current_page,
          nextPageUrl: data.next_page_url
        }
        if (data.current_page === 1) {
          state.donates.gift.data = data.data
        } else {
          state.donates.gift.data = state.donates.gift.data.concat(data.data)
        }
      }
    }
  },
  setDonatesCurIdx (state, {status, index}) {
    if (status) {
      state.donates[status].curIdx = index
    } else {
      state.donates.curIdx = index
    }
  },
  resetSectionDeals (state, types) {
    const type1 = types[0]
    const type2 = types[1]
    const type3 = types[2]
    if (type3) {
      state[type1][type2][type3] = {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      }
    } else {
      state[type1][type2] = {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      }
    }
  },
  resetDeals (state) {
    state.demands = {
      ...state.demands,
      gift: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      },
      need: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      },
      requesting: {
        ...state.demands.requesting,
        gift: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        },
        need: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        }
      },
      remitting: {
        ...state.demands.remitting,
        gift: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        },
        need: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        }
      },
      remitted: {
        ...state.demands.remitted,
        gift: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        },
        need: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        }
      },
      sent: {
        ...state.demands.sent,
        gift: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        },
        need: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        }
      },
      finished: {
        ...state.demands.finished,
        gift: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        },
        need: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        }
      }
    }
    state.donates = {
      ...state.donates,
      gift: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      },
      need: {
        total: 0,
        curPage: 0,
        data: [],
        nextPageUrl: '//'
      },
      init: {
        ...state.donates.init,
        gift: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        },
        need: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        }
      },
      remitting: {
        ...state.donates.remitting,
        gift: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        },
        need: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        }
      },
      remitted: {
        ...state.donates.remitted,
        gift: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        },
        need: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        }
      },
      sent: {
        ...state.donates.sent,
        gift: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        },
        need: {
          total: 0,
          curPage: 0,
          data: [],
          nextPageUrl: '//'
        }
      }
    }
  }
}

export default {
  state,
  actions,
  mutations
}
