import fetch, { doUpload } from '../../tools/axios'

export default {
  getCMsg (type, cType, id, perPage, cb) {
    let _type = 'gift_id'
    if (type === 'need') {
      _type = 'need_id'
    }
    return fetch('get', `/${cType}s?type=${type}&${_type}=${id}&perPage=${perPage}`, {}, cb)
  },
  submitMsg (cType, data, cb) {
    let url = `/${cType}s${cType !== 'comment' ? '/reply' : ''}`
    return fetch('post', url, {data}, cb)
  },
  traceItem (type, id, isTrace, cb) {
    const data = {
      [`${type}_id`]: id
    }
    return fetch('post', `/${type}s/${isTrace ? 'untrace' : 'trace'}`, {data}, cb)
  },
  getThanksWallList (cb) {
    return fetch('get', `/thanks?page=1&type=`, {}, cb)
  },
  uploadImg (file, type, cb) {
    const data = new FormData()
    data.append('file', file)
    data.append('type', type)
    return doUpload('/file/uploadImage', data, cb)
  },
  // type: gift, need, avatar, chat, resource, love
  uploadImgNew (file, type, syncS3 = 1, cb = null) {
    const data = new FormData()
    data.append('file', file)
    data.append('type', type)
    data.append('sync_s3', syncS3 ? 1 : 0)
    return doUpload('/file/uploadImg', data, cb)
  },
  getFamiStore (cb) {
    return fetch('get', '/config/fami', {}, cb)
  },
  sendFeedBack (data, cb) {
    return fetch('post', '/feedback', {data}, cb)
  },
  updateStatus (type, id, status, cb) {
    const data = {
      [`${type}_id`]: id,
      status
    }
    return fetch('post', `/${type}s/updateStatus`, {data}, cb)
  },
  getCurrentActivities (cb) {
    return fetch('get', '/reservations', {}, cb)
  },
  receiveCurrentActivity (id, cb) {
    return fetch('post', `/reservations/${id}/appointment`, {}, cb)
  },
  report (type, id, reason, cb) {
    const data = {
      reason
    }
    return fetch('post', `/${type}s/${id}/report`, {data}, cb)
  },
  getPalmBox (city, area, cb) {
    // 獲取某個地區的掌櫃分佈信息
    return fetch('get', `/ec/getCabinets?city=${city}&area=${area}`, {}, cb)
  }
}
