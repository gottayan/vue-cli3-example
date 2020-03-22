import fetch, { queryString } from '../../tools/axios'

export default {
  // 获取某个节日的数据
  getFestivalList (options, cb) {
    const search = queryString(options)
    return fetch('get', `/festival/records${search}`, {}, cb)
  },
  getFamousList (options, cb) {
    const search = queryString(options)
    return fetch('get', `/festival/records/daily_famous${search}`, {}, cb)
  },
  // 获取我参与某个节日的相关信息
  getMine (options, cb) {
    const search = queryString(options)
    return fetch('get', `/festival/records/my${search}`, {}, cb)
  },
  // 参与某个节日
  publish (data, cb) {
    return fetch('post', '/festival/records', {data}, cb)
  },
  // 对节日某参与者投票
  voteUp (id, cb) {
    return fetch('post', `/festival/records/${id}/vote_up`, {}, cb)
  },
  // 根据id获取用户信息
  getFestivalUserInfo (id, cb) {
    return fetch('get', `/festival/records/${id}`, {}, cb)
  },
  // 獲取當前節日的點讚統計
  getTotalLike (id, cb) {
    return fetch('post', `/festival/records/vote_count?festical_id=${id}`, {}, cb)
  },
  // 當前節日頁面的訪問統計
  addViews (id, cb) {
    return fetch('post', `/festival/records/statistics?type=${id}`, {}, cb)
  }
}
