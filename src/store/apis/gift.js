import fetch, { doPost } from '../../tools/axios'

const updateGiftInfo = (id, status, cb, edcode) => {
  const _url = `/gifts/process`
  const bundle = {
    gift_request_id: id,
    status,
    edcode
  }
  return doPost(_url, bundle, cb)
}

const postGiftInfo = (bundle, cb) => {
  const _url = `/gifts/process`
  const { gift_request_id: id } = bundle
  if (!id) {
    console.warn('GiftAPI.sendGift 請求參數中需要帶上 gift_request_id 一值')
  }
  return doPost(_url, bundle, cb)
}

export default {
  getItemData (id, cb) {
    return fetch('get', `/gifts/${id}`, {}, cb)
  },
  getGiftList (page, onPool, isNew, orgFirst, sort, category, bureauId, type, perPage, status, noRequestList, cb) {
    const query = (isNew && `&is_new=${isNew}`) + (orgFirst && `&org_first=${orgFirst}`) +
      (sort && `&sort=${sort}`) + (category && `&category_id=${category}`) +
      (bureauId && `&bureau_id=${bureauId}`) +
      (type && `&type=${type}`) +
      (perPage && `&perPage=${perPage}`) +
      (status && `&status=${status}`)
    return fetch('get', `/gifts${noRequestList ? '/home' : ''}?page=${page}&on_pool=${onPool}${query}`, {}, cb)
  },
  getGiftInfo (id, cb) {
    return fetch('get', `/gifts/${id}`, {}, cb)
  },
  searchGift (keyW, page, onPool, cb) {
    return fetch('get', `/gifts?keyword=${keyW}&page=${page}&on_pool=${onPool}`, {}, cb)
  },
  /* eslint-disable */
  /* 取消贈物 */
  cancelGift (gift_request_id, cb) {
    return updateGiftInfo(gift_request_id, 'cancel', cb)
  },
  /* 取消贈物 */
  ignoreGift (gift_request_id, cb) {
    return updateGiftInfo(gift_request_id, 'pass', cb)
  },
  /* 確認送出贈物 */
  sentGift (gift_request_id, cb) {
    return updateGiftInfo(gift_request_id, 'sent', cb)
  },
  /* 將禮物送給指定用戶*/
  sendGift (bundle, cb) {
    bundle.status = 'remitting'
    return postGiftInfo(bundle, cb)
  },
  /* 確認轉帳信息 */
  transferGift (bundle, cb) {
    bundle.status = 'remitted'
    return postGiftInfo(bundle, cb)
  },
  /* 確認收貨信息 */
  receiveMoneyGift (gift_request_id, cb, edcode) {
    return updateGiftInfo(gift_request_id, 'received_money', cb, edcode)
  },
  /* 確認寄出信息 */
  sentGift (gift_request_id, cb) {
    return updateGiftInfo(gift_request_id, 'sent', cb)
  },
  /* 完成 */
  finishGift (gift_request_id, cb) {
    return updateGiftInfo(gift_request_id, 'finished', cb)
  },
  /* 感谢 */
  thanksGift (bundle, cb) {
    bundle.status = 'thanks'
    return postGiftInfo(bundle, cb)
  },
  giftsRequest (data, cb) {
    return fetch('post', '/gifts/request', {data}, cb)
  },
  // 发布礼物
  publishGift (data, cb) {
    return fetch('post', '/gifts', {data}, cb)
  },
  // 編輯禮物
  editGift (data, id, cb) {
    return fetch('put', `/gifts/${id}`, {data}, cb)
  },
  getCabinetBanners (cb) {
    return fetch('get', `/admin/banners?scene=2`, {}, cb)
  }
}
