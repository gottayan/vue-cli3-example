/* eslint-disable */
import { shipMapping, Shipways } from '../../tools/constant'
import { statusMapStep, getBankFromCode } from '@/tools/strMap'
import requestingPic from '@/assets/icon/merge/order_top_pic_askfor@2x.png'
import remittingPic from '@/assets/icon/merge/order_top_pic_accept@2x.png'
import receivedMoneyPic from '@/assets/icon/merge/order_top_pic_freight@2x.png'
import sentPic from '@/assets/icon/merge/order_top_pic_send@2x.png'
import finishedPic from '@/assets/icon/merge/order_top_pic_thanks@2x.png'
import thanksPic from '@/assets/icon/merge/order_top_pic_affirm@2x.png'
import cancelPic from '@/assets/icon/merge/order_top_pic_shipments@2x.png'
import mergeRequestingPic from '@/assets/icon/merge/order_top_pic_merge@2x.png'
import pointer from '@/tools/pointer'

export const headerMap = {
  isNotMerge: {
    iAmNotOwner: '索取詳情',
    iAmOwner: '贈送詳情'
  },
  isMerge: '合併詳情'
}

export const detailIcons = (detail) => {
  const icons = {
    requesting: requestingPic,
    init: requestingPic,
    pass: requestingPic,
    remitting: remittingPic,
    remitted: receivedMoneyPic,
    received_money: receivedMoneyPic,
    sent: sentPic,
    cancel: cancelPic,
    not_obtained: cancelPic,
    finished: finishedPic,
    thanks: thanksPic,
    merge_requesting: mergeRequestingPic,
    merge_rejected: cancelPic
  }
  const shipway = pointer(detail).item.shipway()
  const shipopts = pointer(detail).item.shipopts()
  if (shipway === Shipways.SHIPWAY_HCT) {
    icons.received_money = remittingPic
  }
  if (shipway === Shipways.SHIPWAY_PALMBOX && shipopts === 'pod') {
    icons.received_money = remittingPic
  }
  return icons
}

export const detailMap = (detail) => {
  const map = {
    iAmNotOwner: {
      requesting: ['索取中', '請耐心等待贈送者確認'],
      remitting: ['等待您匯款中', '請您匯款給贈送者后確認'],
      remitted: ['您已經匯款', '請耐心等待贈送者確認收款'],
      sent: ['贈送者已寄送', '請耐心等待收件'],
      received_money: ['匯款已經送達', '請等待贈送者寄送'],
      not_obtained: ['交易已經取消'],
      cancel: ['交易已經取消'],
      merge_requesting: ['您正在申請合併寄送', '請耐心等待'],
      merge_allowed: ['贈送者同意了該合併寄送申請'],
      merge_rejected: ['贈送者拒絕了該合併寄送申請'],
      finished: ['禮物已經確認送達', '去感謝禮物主人的無私贈送吧'],
      thanks: ['本次贈送已經完成']
    },
    iAmOwner: {
      requesting: ['您的禮物已有人索取', '請決定是否要送給TA'],
      remitting: ['索取者正在匯款中', '請耐心等待'],
      remitted: ['索取者已經匯款', '請確認收款'],
      sent: ['您已經寄送', '請耐心等待索取者收取禮物'],
      received_money: ['匯款已經送達', '正在等候您將物品寄出'],
      not_obtained: ['交易已經取消'],
      cancel: ['交易已經取消'],
      merge_requesting: ['索取者正在申請合併寄送', '請盡快確認'],
      merge_allowed: ['您同意了該合併寄送申請'],
      merge_rejected: ['您拒絕了該合併寄送申請'],
      finished: ['禮物已經確認送達', '等待索取者的感謝'],
      thanks: ['本次贈送已經完成']
    }
  }

  const shipway = pointer(detail).item.shipway()
  const shipopts = pointer(detail).item.shipopts()
  if (shipway === Shipways.SHIPWAY_HCT) {
    map.iAmNotOwner.received_money = ['正在等候贈送者將物品寄出']
    map.iAmOwner.received_money = ['正在等候您將物品寄出']
  }
  if (shipway === Shipways.SHIPWAY_PALMBOX && shipopts === 'pod') {
    map.iAmNotOwner.received_money = ['請等待贈送者寄送']
    map.iAmOwner.received_money = ['正在等候您將物品寄出']
  }

  return map
}

export const shipStatus = {
  SHIP_STATUS_SEND: 7, // 確認贈送
  SHIP_STATUS_REMITTED: 16, // 確認匯款
  SHIP_STATUS_GOT_THE_FEE: 32 // 確認收款
}

export function noWork (step) {
  return step !== 80
}

export function handleErr (shipopts, status, shipway) {
  if (status >= shipStatus.SHIP_STATUS_GOT_THE_FEE) {
    return shipopts === 'pod' ? shipMapping.infos.STRING_SHOW_AFTER_SEND : shipMapping.infos.STRING_SHOW_AFTER_GOT_MONEY
  } else if(status >= shipStatus.SHIP_STATUS_REMITTED) {
    if (shipway === Shipways.SHIPWAY_HCT) {
      // 新竹REMITTED
      return shipMapping.infos.STRING_SHOW_AFTER_CONFIRM_DETAIL
    } else {
      return shipMapping.infos.STRING_SHOW_AFTER_TRANSFER
    }
  } else {
    return shipMapping.infos.STRING_SHOW_AFTER_SEND
  }
}

export const getBankInfo = (type, data) => {
  return `
  ${getBankFromCode(data[`${type}_bank`])}
  ${data[`${type}_bank_branch`]}
  ${data[`${type}_bank_account_number`]}
  ${data[`${type}_bank_account_name`]}
  `
}

export const getGiverAdress = data => `
  ${data.giver_city}
  ${data.giver_district}
  ${data.giver_address}
`

export const shipwayMap = {
  send: function(deal, data) {
    const status = statusMapStep(data.status)
    const shipway = data.shipway
    const statusMap = shipStatus.SHIP_STATUS_SEND
    return status > statusMap && noWork(status)
    ? deal : handleErr(data.shipopts, statusMap, shipway)
  },
  remitted: function (deal, data) {
    const status = statusMapStep(data.status)
    const shipway = data.shipway
    const statusMap = shipStatus.SHIP_STATUS_REMITTED
    return status >= statusMap && noWork(status)
    ? deal : handleErr(data.shipopts, statusMap, shipway)
  },
  gotFee: function (deal, data) {
    const status = statusMapStep(data.status)
    const shipway = data.shipway
    const statusMap = shipStatus.SHIP_STATUS_GOT_THE_FEE
    return status >= statusMap && noWork(status)
    ? deal : handleErr(data.shipopts, statusMap, shipway)
  },
  cancel: function(deal, data) {
    const status = statusMapStep(data.status)
    return noWork(status) ? (deal || shipMapping.infos.STRING_SHOW_AFTER_ACCEPT) : shipMapping.infos.STRING_SHOW_AFTER_ACCEPT
  }
}

export const isRequested = status => statusMapStep(status) >= shipStatus.SHIP_STATUS_SEND
