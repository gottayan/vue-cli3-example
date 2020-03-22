import fetch from '../../tools/axios'

export default {
  getStoryList (page, id, keyword = '', cb) {
    return fetch('get', `/stories?page=${page}&category_id=${id || ''}&keyword=${keyword}`, {}, (data) => {
      cb(data)
    })
  },
  getStoryDetail (id, cb) {
    fetch('get', `/stories/${id}`, {}, (data) => {
      cb(data)
    })
  },
  getStoryDetailComments (id, cb) {
    fetch('get', `/comments?type=story&story_id=${id}&page=1&perPage=100`, {}, (data) => {
      cb(data)
    })
  },
  readStory (id, cb) {
    fetch('post', `/analysis/story/${id}/read`, {}, (data) => {
      cb(data)
    })
  },
  voteUpStory (id, cb) {
    return fetch('post', `/stories/${id}/vote_up`, {}, (data) => {
      cb(data)
    })
  },
  deleteComment (id, cb) {
    return fetch('post', `/comments/${id}/remove`, {}, (data) => {
      cb(data)
    })
  }
}
