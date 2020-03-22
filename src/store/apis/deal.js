import fetch from '../../tools/axios'

export default {
  getShipsnPic (id, cb) {
    return fetch('get', `/ship/printFami?shipsn=${id}`, {}, cb)
  },
  getDealsCategory (cb) {
    return fetch('get', '/my/category', {}, cb)
  },
  getMyDemands (page, type, status, cb) {
    const query = (type ? `&type=${type}` : '') +
      (status ? `&status=${status}` : '')
    const url = `/my/myDemands?perPage=15&page=${page}${query}`
    return fetch('get', url, {}, cb)
  },
  getDemandTotal (type, status, cb) {
    const query = (type ? `type=${type}` : '') +
      (status ? `&status=${status}` : '')
    return fetch('get', `/my/demandTotal?${query}`, {}, cb)
  },
  getMyDonates (page, type, status, cb) {
    const query = (type ? `&type=${type}` : '') +
      (status ? `&status=${status}` : '')
    const url = `/my/myPresent?perPage=15&page=${page}${query}`
    return fetch('get', url, {}, cb)
  },
  getDonateTotal (type, status, cb) {
    const query = (type ? `type=${type}` : '') +
      (status ? `&status=${status}` : '')
    return fetch('get', `/my/presentTotal?${query}`, {}, cb)
  },
  getConversationId (id, tab, type, dirUserId, cb) {
    const url = `/conversations?id=${id}&tab=${tab}&type=${type}&direct_user_id=${dirUserId}`
    return fetch('get', url, {}, cb)
  },
  dealMerge (ids, cb) {
    const url = `/giftRequest/merge`
    return fetch('post', url, {data: {gift_request_ids: ids}}, cb)
  },
  getMergeList (page, perPage, cb) {
    const url = `/giftRequest/mergeList?perPage=${perPage}&page=${page}`
    return fetch('get', url, {}, cb)
  },
  processMerge (giftRequestId, status, mergeRejectedReason, cb) {
    const url = `/gifts/process`
    return fetch('post', url, {data: {
      gift_request_id: giftRequestId, status, merge_rejected_reason: mergeRejectedReason
    }}, cb)
  }
}
