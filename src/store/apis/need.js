import fetch, { doPost } from '../../tools/axios'

const updateNeedInfo = (id, status, cb, edcode) => {
  const _url = `/needs/process`
  const bundle = {
    need_donate_id: id,
    status,
    edcode
  }
  return doPost(_url, bundle, cb)
}

const postNeedInfo = (bundle, cb) => {
  const _url = `/needs/process`
  const { need_donate_id: id } = bundle
  if (!id) {
    console.warn('NeedAPI方法 請求參數中需要帶上 need_donate_id 一值')
  }
  return doPost(_url, bundle, cb)
}

export default {
  submitNewNeed (data, cb) {
    return fetch('post', `/needs`, {data}, cb)
  },
  getNeedList (page, onPool, userRoleType, isTraceUser, sort, category, bureauId, noRequestList, cb) {
    const query = (userRoleType && `&user_role_type=${userRoleType}`) +
      (isTraceUser && `&is_trace_user=${isTraceUser}`) +
      (sort && `&sort=${sort}`) +
      (category && `&need_items_category_id=${category}`) +
      (bureauId && `&bureau_id=${bureauId}`)
    return fetch('get', `/needs${noRequestList ? '/home' : ''}?page=${page}&on_pool=${onPool}${query}`, {}, cb)
  },
  getNeedInfo (id, cb) {
    return fetch('get', `/needs/${id}`, {}, cb)
  },
  /* eslint-disable */
  /* 取消需求 */
  confirmShip (bundle, cb) {
    const _url = `/needs/process`
    return doPost(_url, bundle, cb)
  },
  /* 取消需求 */
  cancelNeedDonate (need_donate_id, cb) {
    return updateNeedInfo(need_donate_id, 'cancel', cb)
  },
  /* 忽略需求 */
  ignoreNeedDonate (need_donate_id, cb) {
    return updateNeedInfo(need_donate_id, 'pass', cb)
  },
  // 贈送需求
  needsDonate (data, cb) {
    return fetch('post', '/needs/donate', {data}, cb)
  },
  /* 確認送出 */
  sentNeed (need_donate_id, cb) {
    return updateNeedInfo(need_donate_id, 'sent', cb)
  },
  /* 指定贈送 */
  sendNeed (bundle, cb) {
    bundle.status = 'remitting'
    return postNeedInfo(bundle, cb)
  },
  /* 確認轉帳信息 */
  transferNeed (bundle, cb) {
    bundle.status = 'remitted'
    return postNeedInfo(bundle, cb)
  },
  /* 確認收貨信息 */
  receiveMoneyNeed (need_donate_id, cb, edcode) {
    return updateNeedInfo(need_donate_id, 'received_money', cb, edcode)
  },
  /* 確認寄出信息 */
  sentNeed (need_donate_id, cb) {
    return updateNeedInfo(need_donate_id, 'sent', cb)
  },
  /* 完成 */
  finishNeed (need_donate_id, cb) {
    return updateNeedInfo(need_donate_id, 'finished', cb)
  },
  /* 感谢 */
  thanksNeed (bundle, cb) {
    bundle.status = 'thanks'
    return postNeedInfo(bundle, cb)
  },
  // 編輯需求
  editNeed (data, id, cb) {
    return fetch('put', `/needs/${id}`, {data}, cb)
  }
}
