/**
 * Created by lxhfight on 2018/4/8.
 * Email:
 * Description:
 *    匹配信息
 */
import { roleList, banklist, statusMap } from './constant'
import { phoneRegex } from './regex'

const wishTopic = '聖誕'

export const transferRole = (val) => {
  let match = roleList.find(item => item.value === val)
  if (match) {
    return match.label
  }
  return ''
}

export const MapMsg = (msg) => {
  let text = ''
  switch (msg.text) {
    // 心願認領相關消息枚舉值
    case 'WISH_DONATE_GIVER':
      text = `感謝您的愛心，已成功認養${msg.receiver}的${wishTopic}心願${msg.name}，我們將在收到禮物的五天内留言通知您。謝謝您~`
      break
    case 'WISH_DONATE_GREETING_GIVER':
      text = `收到了${msg.receiver}小朋友的感謝卡片，趕快點擊查看吧`
      break
    // case 'WISH_DONATE_RECEIVER':
    //   text = ``
    //   break
    case 'WISH_DONATE_THANKS_GIVER':
      text = `您的心願認養${msg.name}已送達，收到了一份感謝，趕快點擊查看吧`
      break
    case 'GIFT_REQUEST_REQUESTING_GIVER':
      text = `${msg.receiver}向您索取${msg.name}`
      break
    case 'NEED_DONATE_INIT_GIVER':
      text = `您想將${msg.name}送給${msg.receiver}`
      break
    case 'NEED_DONATE_INIT_RECEIVER':
      text = `${msg.giver}想將${msg.name}送給您`
      break
    case 'NEED_DONATE_REMITTING_GIVER':
      text = `${msg.receiver}已確認收下您的${msg.name}`
      break
    case 'NEED_DONATE_REMITTING_RECEIVER':
      text = `您已確認收下${msg.giver}的${msg.name}`
      break
    case 'NEED_DONATE_REMITTED_GIVER':
      text = `${msg.receiver}已經匯款給您的${msg.name}`
      break
    case 'NEED_DONATE_REMITTED_RECEIVER':
      text = `您已匯款給${msg.giver}的${msg.name}`
      break
    case 'NEED_DONATE_THANKS_GIVER':
      text = `您的禮物${msg.name}收到一則感謝`
      break
    case 'NEED_DONATE_THANKS_RECEIVER':
      text = ``
      break
    case 'NEED_DONATE_REQUESTING_GIVER':
      text = `您想將${msg.name}送給${msg.receiver}`
      break
    case 'NEED_DONATE_REQU ESTING_RECEIVER':
      text = `${msg.giver}想將${msg.name}送給您`
      break
    case 'NEED_DONATE_PASS_GIVER':
      text = `${msg.receiver}婉拒了${msg.name}`
      break
    case 'NEED_DONATE_PASS_RECEIVER':
      text = `您婉拒了${msg.name}`
      break
    case 'NEED_DONATE_QUANTITY_FULL_GIVER':
      text = `${msg.name}已經募滿了`
      break
    case 'NEED_DONATE_QUANTITY_FULL_RECEIVER':
      text = `${msg.name}已經募滿了`
      break
    case 'NEED_DONATE_PULL_OFF_GIVER':
      text = `${msg.receiver}的${msg.name}募集已結束`
      break
    case 'NEED_DONATE_PULL_OFF_RECEIVER':
      text = `${msg.receiver}的${msg.name}募集已結束`
      break
    case 'NEED_DONATE_CANCEL_GIVER':
      text = `您取消了${msg.name}的贈送`
      break
    case 'NEED_DONATE_CANCEL_RECEIVER':
      text = `${msg.giver}取消了${msg.name}的贈送`
      break
    case 'NEED_DONATE_RECEIVED_GIVER':
      text = `您已收到${msg.receiver}的匯款`
      break
    case 'NEED_DONATE_RECEIVED_RECEIVER':
      text = `${msg.giver}已收到您的匯款`
      break
    case 'NEED_DONATE_SENT_GIVER':
      text = `您已將${msg.name}${msg.isMeet ? '面交' : '寄出'}`
      break
    case 'NEED_DONATE_SENT_RECEIVER':
      text = `${msg.giver}已將${msg.name}${msg.isMeet ? '面交' : '寄出'}`
      break
    case 'NEED_DONATE_FINISHED_GIVER':
      text = `${msg.name}已完成贈送`
      break
    case 'NEED_DONATE_FINISHED_RECEIVER':
      text = `${msg.name}已完成贈送`
      break
    case 'GIFT_REQUEST_REMITTING_GIVER':
      text = `您已確定要將${msg.name}送給${msg.receiver}`
      break
    case 'GIFT_REQUEST_REMITTING_RECEIVER':
      text = `${msg.giver}已確定要將${msg.name}送給您`
      break
    case 'GIFT_REQUEST_REMITTED_GIVER':
      text = `${msg.receiver}已匯款給您的${msg.name}`
      break
    case 'GIFT_REQUEST_REMITTED_RECEIVER':
      text = `您已匯款給${msg.giver}的${msg.name}`
      break
    case 'GIFT_REQUEST_THANKS_GIVER':
      text = `您的禮物${msg.name}收到一則感謝`
      break
    case 'GIFT_REQUEST_THANKS_RECEIVER':
      text = ``
      break
    case 'GIFT_REQUEST_PASS_GIVER':
      text = ``
      break
    case 'GIFT_REQUEST_PASS_RECEIVER':
      text = ``
      break
    case 'GIFT_REQUEST_CANCEL_GIVER':
      text = `您取消了${msg.name}的贈送`
      break
    case 'GIFT_REQUEST_CANCEL_RECEIVER':
      text = `${msg.giver}取消了${msg.name}的贈送`
      break
    case 'GIFT_REQUEST_RECEIVED_MONEY_GIVER':
      text = `您已收到${msg.receiver}對${msg.name}的匯款`
      break
    case 'GIFT_REQUEST_RECEIVED_MONEY_RECEIVER':
      text = `${msg.giver}已收到您對${msg.name}的匯款`
      break
    case 'GIFT_REQUEST_SENT_GIVER':
      text = `您已將${msg.name}${msg.isMeet ? '面交' : '寄出'}`
      break
    case 'GIFT_REQUEST_SENT_RECEIVER':
      text = `${msg.giver}已將${msg.name}${msg.isMeet ? '面交' : '寄出'}`
      break
    case 'GIFT_REQUEST_FINISHED_GIVER':
      text = `${msg.name}已完成贈送`
      break
    case 'GIFT_REQUEST_FINISHED_RECEIVER':
      // text = `${msg.giver}已將${msg.name}${msg.isMeet ? '面交' : '寄出'}`
      text = `${msg.name}已完成贈送`
      break
    case 'SYSTEM_CONTENT_USER_ROLE_PASS':
      text = `您已通過審核，會員身份成功變更為 ${transferRole(msg.user_category)}`
      break
    case 'SYSTEM_CONTENT_USER_ROLE_REJECT':
      text = `您的身分變更申請被暫時擱置，請補充資料後重新提交`
      break
    case 'SYSTEM_CONTENT_USER_ROLE_TIMEOUT':
      text = '您的關懷會員文件已過期，請重新提交最新的證明文件'
      break
    case 'SYSTEM_CONTENT_USER_IDENTITY_PASS':
      text = '恭喜～您已完成實名驗證！'
      break
    case 'SYSTEM_CONTENT_USER_IDENTITY_REJECT':
      text = '您的實名驗證資料有誤，請補充資料後重新提交唷！'
      break
    case 'WISH_DONATE_NOT_RECEIVED':
      text = `感謝您認養2018聖誕心願禮物，提醒您已認養第五天。 由於孩子都相當期待一年一度的聖誕禮物， 如果在第10天您尚未寄出禮物， 我們只好忍痛將此付出機會開放給下一位愛心網友。 
      收件資料
      姓名：GIVE543 幸福偏鄉小組 收 
      電話：02-2747-6107
      地址：114台北市內湖區新明路273巷6號4樓 
      
      祝 平安、順心 
      GIVE543 幸福偏鄉小組 敬上`
      break
    case 'NEW_USER_INTERESTS':
      if (msg.business) {
        const {keyword, gift_id: giftId, title} = msg.business
        text = `您訂閱的“${keyword}”有了新的${giftId ? '禮物' : '需求'}上傳“${title}”, 快去看下吧`
      }
      break
    case 'LOVE_BOX_RECEIVED':
      text = '您收到的物品是支持公益環保的優質企業所提供，現在是您回饋的時候了～要的不多，請點我上傳照片及感謝話語，讓贈送者有源源不絕的分享動力哦！'
      break
    case 'GIFT_REQUEST_MERGE_NOTICE_GIVER':
      text = `您合併了送給${msg.receiver}的${msg.name}禮物`
      break
    case 'GIFT_REQUEST_MERGE_APPLY_GIVER':
      text = `您收到來自${msg.receiver}的合併請求`
      break
    case 'GIFT_REQUEST_MERGE_REJECT_GIVER':
      text = `您拒絕了來自${msg.receiver}的合併請求`
      break
    case 'GIFT_REQUEST_MERGE_ALLOW_GIVER':
      text = `您接受了來自${msg.receiver}的合併請求`
      break
    case 'GIFT_REQUEST_MERGE_ALLOW_RECEIVED':
      text = `您的合併請求已被${msg.giver}接受`
      break
    case 'GIFT_REQUEST_MERGE_NOTICE_RECEIVED':
      text = `${msg.giver}合併了${msg.name}禮物`
      break
    case 'GIFT_REQUEST_MERGE_REJECT_RECEIVED':
      text = `您的合併請求已被${msg.giver}拒绝`
      break
    case 'GIFT_REQUEST_MERGE_APPLY_RECEIVED':
      text = `您的合併請求已發出給${msg.giver}`
      break
  }
  return text
}

export const getConversationContent = (content, conversation, business, isMergeChild, mregeChildTitle) => {
  const item = conversation
  const accepter = item && ((item.to_user_id === item.user_id) ? item.user : item.direct_user || (item.gift_request && (item.gift_request.user_id === item.direct_user_id ? item.user : item.direct_user)))
  const receiver = item && (
    (item.need_donate && (item.need_donate.user_id === item.user.id ? item.direct_user : item.user)) ||
    (item.gift_request && (item.gift_request.user_id === item.direct_user_id ? item.direct_user : item.user)) ||
    (item.wish_donate && item.wish_donate.wish))
  let name = item && (
    (item.gift_request && item.gift_request.gift && item.gift_request.gift.title) ||
    (item.need_donate && item.need_donate.need_item && item.need_donate.need_item.name) ||
    (item.wish_donate && item.wish_donate.wish && item.wish_donate.wish.title))
  const isMeet = item && (
    (item.gift_request && item.gift_request.shipway === 'meet') ||
    (item.need_donate && item.need_donate.shipway === 'meet'))
  if (item && item.gift_request && item.gift_request.children && item.gift_request.children.length) {
    name = []
    name.push(item.gift_request.children.map(item => item.gift.title))
  }
  if (isMergeChild) {
    name = mregeChildTitle
  }
  let bundle = {
    text: content,
    name,
    isMeet,
    receiver: receiver && (receiver.nickname || receiver.student_name),
    giver: accepter && accepter.nickname,
    user_category: (item && item.user && item.user.cat_hash) || ''
  }
  if (business) {
    bundle = {
      ...bundle,
      business: JSON.parse(business)
    }
  }
  const text = MapMsg(bundle)
  return (text || content)
}

// 判断打开小地球后点击消息列表应该做出的操作
// 1. 打开互动卡 default
// 2. 跳转到对应 礼物页面
// 2.1 礼物页面评论
// 3. 跳转到对应 需求页面
// 3.1 需求页面评论
// 4. 赠送者： 打开一个新的【一般礼物的弹窗】 需求者： 互动卡
export const mapBusinessId = (msg, userHash) => {
  let value = ''
  const { conversation, user_id: userId, business_id: businessId, content } = msg
  const _getTips = (str) => `${str}行動裝置新版暫未實現，請移步舊版進行操作`
  const business = (typeof businessId === 'string' ? JSON.parse(businessId) : businessId)
  if (business) {
    const {
      need_id: needId,
      gift_id: giftId,
      wish_id: wishId,
      story_id: storyId,
      bureau_id: bureauId,
      box_id: boxId
    } = business
    if (needId) {
      const isInterest = (msg.content === 'NEW_USER_INTERESTS')
      value = { path: `/need/${needId}${!isInterest ? '?area=comment' : ''}` }
    } else if (wishId) {
      // 修改： 跳轉至用戶認養心願頁面  value = `/wish/${wish_id}`
      // value = { path: `/user/${userHash}/wishes` }
      // value = { tips: _getTips('心願認養功能') }
      if (content === 'WISH_DONATE_GREETING_GIVER') {
        value = { path: `/wish/finish/${wishId}` }
      } else {
        value = { path: `/wish/${wishId}` }
      }
    } else if (storyId) {
      // value = { path: `/story/${storyId}?area=comment` }
      value = { tips: _getTips('讀故事功能') }
    } else if (bureauId) {
      // value = { path: `/city/taipei/give/${needId || 0}` }
      value = { tips: _getTips('社會局專案') }
    } else if (boxId) {
      value = { path: `/user/${userId}/shop` }
    } else if (giftId) {
      const isInterest = (msg.content === 'NEW_USER_INTERESTS')
      value = { path: `/gift/${giftId}${!isInterest ? '?area=comment' : ''}` }
    }
  } else {
    switch (msg.content) {
      case 'GIFT_REQUEST_THANKS_GIVER':
        value = { path: `/gift/${conversation.gift_request.gift_id}` }
        break
      case 'NEED_DONATE_THANKS_GIVER':
        value = { path: `/need/${conversation.need_donate.need_item.need_id}` }
        break
      case 'NEED_DONATE_QUANTITY_FULL_GIVER': // 赠送者 xxx 募满
      case 'NEED_DONATE_PULL_OFF_GIVER':
        value = 'specialModal'
        break
      case 'SYSTEM_CONTENT_USER_IDENTITY_PASS':
      case 'SYSTEM_CONTENT_USER_ROLE_PASS':
        // 实名验证通过
        value = { path: `/user/${userId}` }
        break
      case 'SYSTEM_CONTENT_USER_ROLE_REJECT':
      case 'SYSTEM_CONTENT_USER_ROLE_TIMEOUT':
        // 跳转到身份转换页面
        // value = '/dashboard/switch'
        value = { tips: _getTips('會員身份轉換功能') }
        break
      case 'SYSTEM_CONTENT_USER_IDENTITY_REJECT':
        value = `reverifyName?${msg.user_id}`
        break
      case 'LOVE_BOX_RECEIVED':
        value = { path: `/user/${userId}/shop` }
        break
      case 'NEW_USER_INTERESTS':
        const {gift_id: giftId, need_id: needId} = JSON.parse(msg.business_id)
        if (giftId) {
          value = { path: `/gift/${giftId}` }
        } else if (needId) {
          value = { path: `/need/${needId}` }
        }
        break
      // case 'SYSTEM_CONTENT_SOCIAL_GIFT':
      // value = `/city/taipei/give/${gift_id}`
      // break
      default:
        value = { modal: 'openChatRoomModal' }
        break
    }
  }
  return value
}

export const isEmail = (str) => {
  const regExp = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return regExp.test(str)
}

export const getLastChar = (str, number = 5) => {
  const length = str.length
  if (length <= number) {
    return str
  }
  return str.substr(length - number)
}

export const getBankFromCode = (bankCode) => {
  for (let item of banklist) {
    if (item.code === bankCode) {
      return `${item.code} ${item.name}`
    }
  }
  return `無`
}

export const isPhone = (phone) => {
  return phoneRegex.test(phone)
}

export const mapGeo = (geo) => {
  let obj = {}
  let arr = []
  geo.forEach(item => {
    // 每一个市变成obj，可以添加区
    obj[item.city] = {}
  })
  geo.forEach(item => {
    obj[item.city][item.district] = item.id
  })
  for (const [key1] of Object.entries(obj)) {
    arr.push({
      name: key1,
      value: key1,
      parent: 0
    })
    for (const [key2] of Object.entries(obj[key1])) {
      arr.push({
        name: key2,
        value: key2,
        parent: key1
      })
    }
  }
  return arr
}

export const statusMapStep = (status) => {
  if (!status) {
    return 0
  }

  let match = statusMap.find(item => (item.text === status))
  if (match) {
    return match.value
  }
  return 0
}

export const formatPalmBox = (originData) => {
  const obj = {}
  originData.forEach(item => {
    if (!(item.CITYNAME in obj)) {
      obj[item.CITYNAME] = {}
      obj[item.CITYNAME][item.DICTNAME] = []
      obj[item.CITYNAME][item.DICTNAME].push(item)
    } else if (!(item.DICTNAME in obj[item.CITYNAME])) {
      obj[item.CITYNAME][item.DICTNAME] = []
      obj[item.CITYNAME][item.DICTNAME].push(item)
    } else if (item.DICTNAME in obj[item.CITYNAME]) {
      obj[item.CITYNAME][item.DICTNAME].push(item)
    }
  })
  return obj
}
