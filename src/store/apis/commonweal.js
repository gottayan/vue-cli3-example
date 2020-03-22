import fetch from '../../tools/axios'

export default {
  getCommonwealUser (page, cb) {
    fetch('get', `/social/users?bureau_id=1&page=${page}`, {}, cb)
  }
}
