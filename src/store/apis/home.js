import fetch from '../../tools/axios'

export default {
  // 獲取首頁頂部輪播圖
  getBanner (cb) {
    return fetch('get', '/banners', {}, cb)
  },
  // 获取首页公益组织需求
  getCommonweal (cb) {
    return fetch('get', '/needs?user_role_type=commonweal&on_pool=1&perPage=4', {}, cb)
  },
  getGifts (cb) {
    return fetch('get', '/gifts?&page=1&on_pool=1', {}, cb)
  },
  toggleTraceGift (giftId, isTracing, cb) {
    const data = {
      gift_id: giftId
    }
    const url = isTracing ? '/gifts/untrace' : '/gifts/trace'
    return fetch('post', url, {data}, cb)
  }
}
