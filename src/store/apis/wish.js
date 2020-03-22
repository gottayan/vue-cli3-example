import fetch from '../../tools/axios'

const API_SUFFIX = '&batch=2'

export default {
  getWishList (page, status, cb) {
    const query = status && `&status=${status}`
    return fetch('get', `/wishes?page=${page}${query}${API_SUFFIX}`, {}, cb)
  },
  getWishItem (id, cb) {
    return fetch('get', `/wishes/${id}`, {}, cb)
  },
  getCommentsList (id, cb) {
    return fetch('get', `/comments?type=wish&wish_id=${id}`, {}, cb)
  },
  submitComments (data, cb) {
    return fetch('post', `/comments`, {data}, cb)
  },
  donate (id, cb) {
    return fetch('post', `/wishes/${id}/donate`, {}, cb)
  },
  voteUp (id, cb) {
    return fetch('post', `/wishes/${id}/voteUp`, {}, cb)
  },
  cancelVote (id, cb) {
    return fetch('post', `/wishes/${id}/cancelVote`, {}, cb)
  },
  sendRead (id) {
    return fetch('post', `/analysis/wishes/${id}/read`)
  },
  getUserWishList (id, batch, cb) {
    const query = (batch && `&batch=${batch}`) || ''
    return fetch('get', `/wish_donates?user_id=${id}${query}`, {}, cb)
  }
}
