import fetch from '../../tools/axios'

export default {
  getGeo (cb) {
    return fetch('get', '/geo', {}, cb)
  },
  getFami (cb) {
    return fetch('get', '/config/fami', {}, cb)
  },
  // 订阅关键字
  batchSubKeyW (keywords, cb) {
    const data = {
      keywords
    }
    return fetch('post', '/keywords/batch', {data}, cb)
  },
  // 获取订阅关键字
  getSubKeyW (cb) {
    return fetch('get', '/keywords', {}, cb)
  },
  // 获取用户身份类别
  getUserCategories (cb) {
    return fetch('get', '/categories?type=users', {}, cb)
  },
  // 获取好人点
  getBonusRank (cb) {
    return fetch('get', '/config/bonusRanking', {}, cb)
  },
  getShareUrl (data, cb) {
    return fetch('post', '/shares', {data}, cb)
  }
}
