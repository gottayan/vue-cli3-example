const analytisLog = (bundle) => {
  console.log(`%c GA統計數據對象 ${bundle.eventLabel}:`,
    'background-color: #666 color: #bada55 padding: 3px 10px',
    bundle)
  // window.ga('send', bundle)
  window.gtag('event', bundle.eventAction, {
    event_category: bundle.eventCategory,
    event_label: bundle.eventLabel
  })
}

// 首頁
export const doClickOldVersion = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '回到舊版'
  }
  analytisLog(bundle)
}

export const doClickSendNew = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '首頁+號發佈'
  }
  analytisLog(bundle)
}

export const doClick = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '活動預約'
  }
  analytisLog(bundle)
}

export const doClickSendNewGift = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '刊登',
    eventLabel: '刊登新禮物'
  }
  analytisLog(bundle)
}

export const doClickSendNewNeed = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    envetAction: '刊登',
    eventLabel: '刊登新需求'
  }
  analytisLog(bundle)
}

// 禮物詳情頁
export const doClickRequestGift = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '禮物索取'
  }
  analytisLog(bundle)
}

export const doClickSendGiftComment = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '發送留言'
  }
  analytisLog(bundle)
}

// 需求詳情頁1
export const doClickDonateNeed = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '贈送需求'
  }
  analytisLog(bundle)
}

export const doClickShareGift = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '分享禮物詳情頁'
  }
  analytisLog(bundle)
}

export const doClickShareNeed = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '分享需求詳情頁'
  }
  analytisLog(bundle)
}

export const doClickSendFeedBack = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '用戶反饋'
  }
  analytisLog(bundle)
}

export const doClickChangePW = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '修改密碼'
  }
  analytisLog(bundle)
}

export const doClickEmailForgetPW = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '郵箱註冊用戶忘記密碼'
  }
  analytisLog(bundle)
}

export const doClickPhoneForgetPW = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '手機註冊用戶忘記密碼'
  }
  analytisLog(bundle)
}

export const doClickUpdateBaseInfo = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '修改個人基本資料'
  }
  analytisLog(bundle)
}

export const doClickUpdateDefaultAdd = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '修改個人默認地址'
  }
  analytisLog(bundle)
}

export const doClickLogout = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '用戶登出'
  }
  analytisLog(bundle)
}

export const doClickGiftcar = () => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按鈕',
    eventAction: '點擊',
    eventLabel: '愛箱送物品加入禮物車'
  }
  analytisLog(bundle)
}

// 节日活动发布参与
export const doJoinFestival = (name) => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按钮',
    eventAction: '点击',
    eventLabel: `參與${name}活動`
  }
  analytisLog(bundle)
}

// 節日活動參與點讚
export const doVote = (name) => {
  const bundle = {
    hitType: 'event',
    eventCategory: '按钮',
    eventAction: '点击',
    eventLabel: `給${name}活動投票`
  }
  analytisLog(bundle)
}
