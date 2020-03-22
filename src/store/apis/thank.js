import fetch from '../../tools/axios'

export default {
  // 感謝墻
  getThanks (page, cb) {
    return fetch('get', `/thanks?page=${page}`, {}, cb)
  },
  // 發出感謝的話
  // thanks?to_user_id=37705&page=1&parent_thanks_id=0&perPage=300
  // 收到感謝的話
  // thanks?from_user_id=37705&page=1&parent_thanks_id=0&perPage=300
  // 收到感謝的話
  getToThanks (id, page, parentThanksId, perPage, cb) {
    return fetch('get', `/thanks?to_user_id=${id}&page=${page}&parent_thanks_id=${parentThanksId}&perPage=${perPage}`, {}, cb)
  },
  // 發出感謝的話
  getFromThanks (id, page, parentThanksId, perPage, cb) {
    return fetch('get', `/thanks?from_user_id=${id}&page=${page}&parent_thanks_id=${parentThanksId}&perPage=${perPage}`, {}, cb)
  }
}
