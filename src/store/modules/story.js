import storyApi from '../apis/story'

const state = {
  storyList: [],
  page: 1,
  total: 0,
  nextUrl: '',
  storyDetail: {
    title: '',
    user: {
      nickname: '',
      name: '',
      pics: ''
    },
    created_at: '',
    content: ''
  },
  comments: {
    data: [],
    total: 0
  },
  storyNew: {
    currentPage: 0,
    nextPageUrl: 'http://',
    data: []
  }
}

const actions = {
  getStoryList ({commit, state}, {page, categoryId, keyword, isSearch, cb = null} = {}) {
    return storyApi.getStoryList(page, categoryId, keyword, (data) => {
      if (isSearch) {
        data.isSearch = true
      }
      commit('setStoryList', {data})
      if (cb) {
        cb(data)
      }
    })
  },
  getStoryDetail ({commit, state}, {id}) {
    storyApi.getStoryDetail(id, (data) => {
      commit('setStoryDetatil', {data})
    })

    storyApi.readStory(id, (data) => {
      console.info(data)
    })

    storyApi.getStoryDetailComments(id, (data) => {
      commit('setStoryComments', {data})
    })
  },
  deleteComment ({commit, state}, {id, cb}) {
    storyApi.deleteComment(id, (data) => {
      cb(data)
      commit('deleteComment', {data, id})
    })
  },
  sendComment ({commit, state}, {content}) {
    storyApi.sendComment(content, (data) => {
      commit('updateComments', {data})
    })
  },
  voteUpStory ({commit, state}, {id, cb}) {
    storyApi.voteUpStory(id, (data) => {
      if (!data.error) {
        cb(data)
        commit('updateStory')
      }
    })
  }
}

const mutations = {
  setStoryList (state, {data}) {
    state.storyNew = {
      ...state.storyNew,
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: data.isSearch ? data.data : [
        ...state.storyNew.data,
        ...data.data
      ]
    }
  },
  setStoryDetatil (state, {data}) {
    state.storyDetail = data
  },
  setStoryComments (state, {data}) {
    state.comments = data
  },
  updateComments (state, {data}) {
    console.log('刪除評論', data)
  },
  deleteComment (state, {data, id}) {
    state.comments.data = state.comments.data.filter(item => item.id !== id)
  },
  updateStory (state) {
    state.storyDetail = {
      ...state.storyDetail,
      my_vote: 1,
      vote_up: state.storyDetail.vote_up + 1
    }
  }
}

export default {
  state,
  actions,
  mutations
}
