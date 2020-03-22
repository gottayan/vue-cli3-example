/**
 * Created by lxhfight on 2018/4/8.
 * Email: lxhfight1@gmail.com
 * Description:
 *  獲取用戶訊息相關內容
 */

import fetch, { doPost } from '../../tools/axios'

export default {
  getEnvMessageList (page, cb) {
    return fetch('get', `/conversations?page=${page}`, {}, cb)
  },
  getSysMessageList (page, cb) {
    return fetch('get', `/messages?page=${page}`, {}, cb)
  },
  getConversationDetail (id, cb) {
    return fetch('get', `/conversations/${id}`, {}, cb)
  },
  getChattingDetail (id, cb) {
    return fetch('get', `/messages/directMessages?direct_user_id=${id}`, { }, cb)
  },
  /**
   * 发送交易信息
   * @param bundle
   * @param {number} bundle.direct_user_id
   * @param {number} bundle.gift_request_id
   * @param {string} bundle.message_content 消息内容
   * @param {string} bundle.message_type    消息类型 text 和 image
   * @param {string} bundle.need_donate_id
   * @param {string} bundle.type
   * @param cb
   */
  sendTradeMessage (bundle, cb) {
    return doPost(`/conversations/sendTradeMessage`, bundle, cb)
  },
  sendUserMessage (bundle, cb) {
    return doPost(`/conversations/sendDirectMessage`, bundle, cb)
  },
  getChatId (type, thingId, directUserId, cb) {
    let str = ``
    if (type === 'gift_request') {
      str = `type=gift_request&gift_request_id=${thingId}`
    } else {
      str = `type=need_donate&need_donate_id=${thingId}`
    }
    return fetch('get', `/conversations/getTradeConversation?direct_user_id=${directUserId}&${str}`, {}, cb)
  },
  // 消息已讀
  readMsg (msgId, cb) {
    return fetch('post', `/messages/${msgId}/read`, {}, cb)
  },
  // 最新消息通知
  getMessageStatus (cb) {
    return fetch('get', '/user/notices', {}, cb)
  },
  // 全部已读
  readAllMsg (type, cb) {
    return fetch('post', `/${type}/readAll`, {}, cb)
  }
}
