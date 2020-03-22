import fetch from '../../tools/axios'

export default {
  searchGift (keyW, page, onPool, cb) {
    return fetch('get', `/gifts?keyword=${keyW}&page=${page}&on_pool=${onPool}`, {}, cb)
  },
  searchNeed (keyW, page, onPool, cb) {
    return fetch('get', `/needs?keyword=${keyW}&page=${page}&on_pool=${onPool}`, {}, cb)
  },
  searchMember (keyW, page, cb) {
    return fetch('get', `/user?keyword=${keyW}&page=${page}`, {}, cb)
    // user?keyword=89&page=1
  }
}
