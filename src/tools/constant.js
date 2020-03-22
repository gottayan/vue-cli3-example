import ProfileGift from '@/assets/img/profile_ic_gift@2x.png'
import ProfileTrace from '@/assets/img/profile_ic_trace@2x.png'
import ProfileThanks from '@/assets/img/profile_list_ic_thanks@2x.png'
import ProfileSubscribe from '@/assets/img/profile_ic_subscription@2x.png'
import ProfilePriNote from '@/assets/img/profile_ic_list@2x.png'
import ProfileDemand from '@/assets/img/profile_ic_demand@2x.png'
import ProfileLoveboxAskFor from '@/assets/icon/profile/profile_list_ic_askfor@2x.png'
import userWish from '@/assets/icon/profile/profile_data_ic_love@2x.png'
import ProfileRequest from '@/assets/img/profile_list_ic_suoqu@2x.png'

// sidebar icon
import iconSidebar01 from '@/assets/icon/filter/sidebar_ic_01@2x.png'
import iconSidebar02 from '@/assets/icon/filter/sidebar_ic_03@2x.png'
import iconSidebar03 from '@/assets/icon/filter/sidebar_ic_02@2x.png'
import iconSidebar04 from '@/assets/icon/filter/sidebar_ic_04@2x.png'
import iconSidebar05 from '@/assets/icon/filter/sidebar_ic_05@2x.png'
import iconSidebar06 from '@/assets/icon/filter/sidebar_ic_06@2x.png'
import iconSidebar07 from '@/assets/icon/filter/sidebar_ic_07@2x.png'
import iconSidebar08 from '@/assets/icon/filter/sidebar_ic_08@2x.png'
import iconSidebar09 from '@/assets/icon/filter/sidebar_ic_09@2x.png'
import iconSidebar10 from '@/assets/icon/filter/sidebar_ic_10@2x.png'
import iconSidebar11 from '@/assets/icon/filter/sidebar_ic_11@2x.png'
import iconSidebar12 from '@/assets/icon/filter/sidebar_ic_12@2x.png'
import iconSidebar13 from '@/assets/icon/filter/sidebar_ic_13@2x.png'
import iconSidebar14 from '@/assets/icon/filter/sidebar_ic_14@2x.png'
import iconSidebar15 from '@/assets/icon/filter/sidebar_ic_15@2x.png'
import iconSidebar16 from '@/assets/icon/filter/sidebar_ic_16@2x.png'
import iconSidebar17 from '@/assets/icon/filter/sidebar_ic_17@2x.png'
import iconSidebar18 from '@/assets/icon/filter/sidebar_ic_18@2x.png'
import iconSidebar19 from '@/assets/icon/filter/sidebar_ic_19@2x.png'
import iconSidebar20 from '@/assets/icon/filter/sidebar_ic_20@2x.png'

export const googleClientID =
  '102978352106-mipjlpsqq3rvd4068c8ncpbfc60kj0tg.apps.googleusercontent.com'

export const userInfoCellList = [
  {
    text: '送禮物管理',
    textOther: 'TA的送禮物',
    link: '/user/:hash/gifts',
    icon: ProfileGift
  },
  {
    text: '需求管理',
    textOther: 'TA的需求',
    link: '/user/:hash/needs',
    icon: ProfileDemand
  },
  {
    text: '感謝的話',
    textOther: 'TA的感謝',
    link: '/user/:hash/thanksword',
    icon: ProfileThanks
  },
  {
    text: '心願認養',
    textOther: 'TA的心願認養',
    link: '/user/:hash/wish',
    icon: userWish
  }
]

export const userInfoExtraCellList = [
  {
    text: '索取管理',
    textOther: '索取管理',
    link: '/dealsReq',
    icon: ProfileRequest
  },
  {
    text: '我的追蹤',
    textOther: 'Ta的追蹤',
    link: '/user/:hash/traces',
    icon: ProfileTrace
  },
  {
    text: '我的關鍵字訂閱',
    textOther: 'TA的關鍵字訂閱',
    link: '/user/:hash/subscribe',
    icon: ProfileSubscribe
  },
  {
    text: '我的好壞名單',
    textOther: 'TA的好壞名單',
    link: '/user/:hash/privateNote',
    icon: ProfilePriNote
  },
  {
    text: '我索取的愛箱',
    textOther: 'TA索取的愛箱',
    link: '/user/:hash/shop',
    icon: ProfileLoveboxAskFor
  }
]

export const userGiftsNavList = [
  {
    text: '進行中',
    url: '/gifts?page=1',
    status: 'ongoing',
    key: 'ongoing'
  },
  {
    text: '未開始',
    url: '/gifts?page=1',
    status: 'pending',
    key: 'pending'
  },
  {
    text: '已結案',
    url: '/gifts?page=1',
    status: 'finish',
    key: 'finish'
  },
  {
    text: '已下架',
    url: '/gifts?page=1',
    status: 'pull_off',
    key: 'pulloff'
  }
  // {
  //   text: '已完成的指定贈送',
  //   url: '/needDonate?page=1',
  //   status: 'finished,thanks',
  //   key: 'needDonate'
  // }
]

export const userNeedsNavList = [
  {
    text: '進行中',
    url: '/needs',
    status: 'ongoing',
    key: 'ongoing'
  },
  {
    text: '未開始',
    url: '/needs',
    status: 'pending',
    key: 'pending'
  },
  {
    text: '已結案',
    url: '/needs',
    status: 'finish',
    key: 'finish'
  },
  {
    text: '已下架',
    url: '/needs',
    status: 'pull_off',
    key: 'pulloff'
  }
]

export const userReqGiftsNavList = [
  {
    text: '索取中',
    url: 'giftRequest',
    status: 'requesting,pass',
    key: 'ongoing'
  },
  {
    text: '已獲贈',
    url: 'giftRequest',
    status: 'remitting,remitted,received_money,sent,finished,thanks',
    key: 'token'
  },
  {
    text: '未獲贈',
    url: 'giftRequest',
    status: 'cancel',
    key: 'cancel'
  }
]

export const userThanksNavList = [
  {
    text: '獲得的感謝',
    url: '/thanks?to_user_id=id&&parent_thanks_id=0'
  },
  {
    text: '發出的感謝',
    url: '/thanks?from_user_id=id&page=1&parent_thanks_id=0'
  }
]

export const userWishesNavList = [
  {
    text: '已認養',
    url: '/wish_donates',
    status: 'init'
  },
  {
    text: '認養已送達',
    url: '/wish_donates',
    status: 'sent'
  }
]

export const userTraceNavList = [
  {
    text: '禮物',
    url: '/',
    status: ''
  },
  {
    text: '需求',
    url: '/',
    status: ''
  },
  {
    text: '會員',
    url: '/user_marks',
    status: ''
  }
]

export const roleList = [
  {
    label: '一般會員',
    value: 'normal',
    id: 36
  },
  {
    label: '關懷會員',
    value: 'care',
    id: 31
  },
  {
    label: '審核通過',
    value: 'commonweal',
    id: 32
  },
  {
    label: '學校單位',
    value: 'school',
    id: 34
  },
  {
    label: '政府機關',
    value: 'gov',
    id: 35
  },
  {
    label: '企業行號',
    value: 'company',
    id: 33
  }
]

// 運送狀態
export const stepOptions = [
  { label: '索取中', value: 'requesting' },
  { label: '已略過 ', value: 'pass' },
  { label: '匯款中', value: 'remitting' },
  { label: '已經匯款', value: 'remitted' },
  { label: '等待寄送', value: 'received_money' },
  { label: '已寄送', value: 'sent' },
  { label: '已取消', value: 'cancel' },
  { label: '已完成', value: 'finished' },
  { label: '已感謝', value: 'thanks' },
  { label: '未獲贈', value: 'not_obtained' },
  {
    label: '申請合併中',
    value: 'merge_requesting'
  },
  {
    label: '已同意',
    value: 'merge_allowed'
  },
  {
    label: '已拒絕',
    value: 'merge_rejected'
  }
]

// 筛选器
const filterCategory = [
  {
    icon: iconSidebar01,
    key: '1',
    label: '女裝、女用品',
    value: '女裝、女用品'
  },
  {
    icon: iconSidebar02,
    key: '2',
    label: '男裝、男用品',
    value: '男裝、男用品'
  },
  {
    icon: iconSidebar03,
    key: '3',
    label: '圖書、文具、影音',
    value: '圖書、文具、影音'
  },
  {
    icon: iconSidebar04,
    key: '4',
    label: '婦幼、童裝、嬰幼',
    value: '婦幼、童裝、嬰幼'
  },
  {
    icon: iconSidebar05,
    key: '5',
    label: '運動、戶外、休閒',
    value: '運動、戶外、休閒'
  },
  {
    icon: iconSidebar06,
    key: '6',
    label: '居家、餐廚',
    value: '居家、餐廚'
  },
  {
    icon: iconSidebar07,
    key: '7',
    label: '食品、飲料',
    value: '食品、飲料'
  },
  {
    icon: iconSidebar08,
    key: '8',
    label: '家電、視聽',
    value: '家電、視聽'
  },
  {
    icon: iconSidebar09,
    key: '9',
    label: '手機、配件',
    value: '手機、配件'
  },
  {
    icon: iconSidebar10,
    key: '10',
    label: '日用、清潔',
    value: '日用、清潔'
  },
  {
    icon: iconSidebar11,
    key: '11',
    label: '汽機車周邊',
    value: '汽機車周邊'
  },
  {
    icon: iconSidebar12,
    key: '12',
    label: '玩具、收藏',
    value: '玩具、收藏'
  },
  {
    icon: iconSidebar13,
    key: '13',
    label: '電腦、周邊',
    value: '電腦、周邊'
  },
  {
    icon: iconSidebar14,
    key: '14',
    label: '教學、人力',
    value: '教學、人力'
  },
  {
    icon: iconSidebar15,
    key: '15',
    label: '相機、攝影',
    value: '相機、攝影'
  },
  {
    icon: iconSidebar16,
    key: '16',
    label: '票卷、點數',
    value: '票卷、點數'
  },
  {
    icon: iconSidebar17,
    key: '17',
    label: '電玩相關',
    value: '電玩相關'
  },
  {
    icon: iconSidebar18,
    key: '18',
    label: '寵物相關',
    value: '寵物相關'
  },
  {
    icon: iconSidebar19,
    key: '19',
    label: '家具',
    value: '家具'
  },
  {
    icon: iconSidebar20,
    key: '20',
    label: '其他',
    value: '其他'
  }
]
export const filterOptionsGift = {
  isNew: [
    {
      key: '1',
      value: '全新'
    },
    {
      key: '0',
      value: '二手'
    },
    {
      key: '2',
      value: '公益團體優先'
    }
  ],
  sort: [
    {
      key: 'nearby',
      value: '我附近的禮物全新'
    },
    {
      key: 'trends',
      value: '熱門度'
    }
  ],
  category: filterCategory
}
export const filterOptionsNeed = {
  userRoleType: [
    {
      key: 'commonweal',
      value: '公益團體需求'
    },
    {
      key: 'school',
      value: '學校單位需求'
    },
    {
      key: 'care',
      value: '關懷會員需求'
    }
  ],
  sort: [
    {
      key: 'nearby',
      value: '我附近的需求'
    },
    {
      key: 'upcoming_pull_off',
      value: '即將下架'
    },
    {
      key: 'trends',
      value: '熱門度'
    }
  ],
  category: filterCategory
}

export const thingsStatusList = [
  { label: '進行中', value: 'ongoing' },
  { label: '未開始', value: 'pending' },
  { label: '已結案', value: 'finish' },
  { label: '已下架', value: 'pull_off' }
]

export const filterOptionsLoveBox = {
  userRoleType: [
    {
      key: 'VIPONLY',
      value: '公益團體索取'
    },
    {
      key: 'NOTVIP',
      value: '一般會員索取'
    }
  ],
  sort: [
    // {
    //   key: 'nearby',
    //   value: '我附近的需求'
    // },
    {
      key: 'upcoming_pull_off',
      value: '即將下架'
    },
    {
      key: 'trends',
      value: '熱門度'
    }
  ],
  category: filterCategory
}
// 物品價值
export const valuationList = [
  { label: '0~500元', key: 0 },
  { label: '500~1000元', key: 500 },
  { label: '1000~5000元', key: 1000 },
  { label: '5000~10000元', key: 5000 },
  { label: '10000~50000元', key: 10000 },
  { label: '50000元以上', key: 50000 }
]

export const statusMap = [
  {
    value: 0,
    text: 'requesting',
    step: 0
  },
  {
    value: 2,
    text: 'init',
    step: 0
  },
  {
    value: 4,
    text: 'pass',
    step: 0
  },
  {
    value: 8,
    text: 'remitting',
    step: 1
  },
  {
    value: 16,
    text: 'remitted',
    step: 1
  },
  {
    value: 32,
    text: 'received_money',
    step: 2
  },
  {
    value: 48,
    text: 'sent',
    step: 2
  },
  {
    value: 64,
    text: '確認收到',
    step: 3
  },
  {
    value: 80,
    text: 'cancel',
    step: 0
  },
  {
    value: 128,
    text: 'finished',
    step: 3
  },
  {
    value: 255,
    text: 'thanks',
    step: 3
  },
  {
    value: 80,
    text: 'not_obtained',
    step: 0
  }
]

export const ShipStatus = {
  SHIP_STATUS_REQUESTING: 'requesting',
  SHIP_STATUS_MERGE_REQUESTING: 'merge_requesting',
  SHIP_STATUS_MERGE_REJECTED: 'merge_rejected',
  SHIP_STATUS_INIT: 'init',
  SHIP_STATUS_PASS: 'pass',
  SHIP_STATUS_REMITTING: 'remitting',
  SHIP_STATUS_REMITTED: 'remitted',
  SHIP_STATUS_RECEIVED_MONEY: 'received_money',
  SHIP_STATUS_SENT: 'sent', // step #48, 已寄送
  SHIP_STATUS_CANCEL: 'cancel',
  SHIP_STATUS_FINISHED: 'finished',
  SHIP_STATUS_THANKS: 'thanks',
  SHIP_STATUS_NOT_OBTAINED: 'not_obtained'
}

// 互動卡消息類型
export const messageType = {
  MESSAGE_TYPE_TEXT: 1,
  MESSAGE_TYPE_PICTURE: 2,
  MESSAGE_TYPE_SYSTEM: 3,
  MESSAGE_TYPE_REQUEST_REASON: 4,
  MESSAGE_TYPE_THANKS: 5
}

// 運送方式
export const shipMapping = {
  way: {
    palmbox: '掌櫃',
    fami: '全家店到店',
    hct: '新竹物流',
    others: '其他物流寄送',
    meet: '面交',
    homeng: '賀盟物流(大型物資)'
  },
  opt: {
    pod: '索取者貨到付款',
    receiver: '匯運費給贈送者',
    sender: '贈送者負擔運費',
    [undefined]: '免運費'
  },
  infos: {
    STRING_TYPES_WANTS: 'WANTS',
    STRING_NOT_PROVIDE: '(暫不提供)',
    STRING_SHOW_AFTER_SEND: '(確認贈送後顯示)',
    STRING_SHOW_AFTER_ACCEPT: '(確認收下後顯示)',
    STRING_WAIT_FOR_PROVIDE: '(廠商報價後另行提供)',
    STRING_SHOW_AFTER_TRANSFER: '(確認匯款後顯示)',
    STRING_SHOW_AFTER_GOT_MONEY: '(確認收款後5-10分鐘內產生單號)',
    STRING_SHOW_AFTER_CONFIRM_DETAIL: '(確認「運送細節」後顯示)',
    STRING_SHIPSN_TIPS_FOR_HCT: '(物流士上門收件前一天下午六點後產生單號)'
  }
}
export const Shipways = {
  SHIPWAY_PALMBOX: 'palmbox',
  SHIPWAY_FAMI: 'fami',
  SHIPWAY_HCT: 'hct',
  SHIPWAY_OTHERS: 'others',
  SHIPWAY_MEET: 'meet',
  SHIPWAY_HOMENG: 'homeng'
}

// 假日
export const holidays = [
  '2018-01-01',
  '2018-02-15',
  '2018-02-16',
  '2018-02-17',
  '2018-02-19',
  '2018-02-20',
  '2018-02-28',
  '2018-04-04',
  '2018-04-05',
  '2018-04-06',
  '2018-04-07',
  '2018-06-18',
  '2018-09-24',
  '2018-10-10',
  '2018-12-31',
  '2019-01-01',
  '2019-02-01',
  '2019-02-02',
  '2019-02-04',
  '2019-02-05',
  '2019-02-06',
  '2019-02-07',
  '2019-02-08',
  '2019-02-09',
  '2019-02-28',
  '2019-03-01',
  '2019-03-02',
  '2019-04-04',
  '2019-04-05',
  '2019-04-06',
  '2019-05-01',
  '2019-06-07',
  '2019-06-08',
  '2019-09-13',
  '2019-09-14',
  '2019-10-10',
  '2019-10-11',
  '2019-10-12'
]

export const issuesAry = [
  '兒童青少年福利',
  '婦女福利',
  '老人福利',
  '身心障礙福利',
  '綜合性服務',
  '環境保護',
  '教育與科學',
  '動物保護',
  '醫療服務',
  '宗教信仰',
  '國際救援',
  '文教藝術',
  '社區規劃',
  '政府單位',
  '其他'
]

// 上新和指定赠送完成时Modal引流活动配置
export const projectInfo = {
  startTime: '2018/9/1 00:00:00',
  endTime: '2018/9/31 23:59:59',
  // link: 'http://bit.ly/2Pdb0ZV',
  link: '/sportsday',
  name: '點擊參加替選手加油活動嗎？',
  color: '#ff3067'
}

// 礼物池谁索取了礼物的排序规则
export const giveSortRules = [
  {
    rule: 'time_up',
    value: '最近索取'
  },
  {
    rule: 'time_down',
    value: '最先索取'
  },
  {
    rule: 'thanks_rate',
    value: '感謝率從高到低'
  },
  {
    rule: 'charitys',
    value: '好人點從高到低'
  }
]

export const feedBackList = [
  {
    label: '使用問題回報'
  },
  {
    label: '操作流程諮詢',
    action: 'SHOW_WELFLOW'
  },
  {
    label: '違規行為檢舉'
  },
  {
    label: '使用回饋建議'
  },
  {
    label: '平台合作提案'
  },
  {
    label: '其他'
  }
]

export const banklist = [
  { code: '', name: '無' },
  { code: '004', name: '台灣銀行' },
  { code: '005', name: '土地銀行' },
  { code: '006', name: '合庫商銀' },
  { code: '007', name: '第一銀行' },
  { code: '008', name: '華南銀行' },
  { code: '009', name: '彰化銀行' },
  { code: '011', name: '上海銀行' },
  { code: '012', name: '台北富邦' },
  { code: '013', name: '國泰世華' },
  { code: '016', name: '高雄銀行' },
  { code: '017', name: '兆豐商銀' },
  { code: '018', name: '農業金庫' },
  { code: '020', name: '日商瑞穗銀行' },
  { code: '021', name: '花旗銀行' },
  { code: '022', name: '美商美國銀行' },
  { code: '023', name: '泰國盤谷銀行' },
  { code: '025', name: '菲律賓首都銀行' },
  { code: '028', name: '美商美國紐約梅隆銀行' },
  { code: '029', name: '新加坡大華銀行' },
  { code: '030', name: '美商道富銀行' },
  { code: '037', name: '法國興業銀行' },
  { code: '039', name: '澳盛銀行' },
  { code: '048', name: '王道銀行' },
  { code: '050', name: '台灣企銀' },
  { code: '052', name: '渣打商銀' },
  { code: '053', name: '台中商銀' },
  { code: '054', name: '京城商銀' },
  { code: '072', name: '德商德意志銀行' },
  { code: '075', name: '香港商東亞銀行' },
  { code: '076', name: '美商摩根大通銀行' },
  { code: '078', name: '新加坡商星展銀行' },
  { code: '081', name: '匯豐銀行' },
  { code: '082', name: '法商法國巴黎銀行' },
  { code: '083', name: '英商渣打銀行' },
  { code: '085', name: '新加坡商新加坡華僑銀行' },
  { code: '086', name: '法商東方匯理銀行' },
  { code: '092', name: '瑞士商瑞士銀行' },
  { code: '093', name: '荷蘭商安智銀行' },
  { code: '097', name: '美商富國銀行' },
  { code: '098', name: '日商三菱日聯銀行' },
  { code: '101', name: '瑞興銀行' },
  { code: '102', name: '華泰銀行' },
  { code: '103', name: '臺灣新光銀行' },
  { code: '104', name: '台北五信' },
  { code: '106', name: '台北九信' },
  { code: '108', name: '陽信銀行' },
  { code: '114', name: '基隆一信' },
  { code: '115', name: '基隆二信' },
  { code: '118', name: '板信銀行' },
  { code: '119', name: '淡水一信' },
  { code: '120', name: '淡水信合社' },
  { code: '124', name: '宜蘭信合社' },
  { code: '127', name: '桃園信合社' },
  { code: '130', name: '新竹一信' },
  { code: '132', name: '新竹三信' },
  { code: '146', name: '台中二信' },
  { code: '147', name: '三信銀行' },
  { code: '158', name: '彰化一信' },
  { code: '161', name: '彰化五信' },
  { code: '162', name: '彰化六信' },
  { code: '163', name: '彰化十信' },
  { code: '165', name: '鹿港信合社' },
  { code: '178', name: '嘉義三信' },
  { code: '179', name: '嘉義四信' },
  { code: '188', name: '台南三信' },
  { code: '204', name: '高雄三信' },
  { code: '215', name: '花蓮一信' },
  { code: '216', name: '花蓮二信' },
  { code: '222', name: '澎湖一信' },
  { code: '223', name: '澎湖二信' },
  { code: '224', name: '金門信合社' },
  { code: '321', name: '日商三井住友銀行' },
  { code: '324', name: '美商花旗銀行' },
  { code: '325', name: '香港上海滙豐銀行' },
  { code: '326', name: '西班牙商西班牙對外銀行' },
  { code: '327', name: '澳商澳盛銀行' },
  { code: '328', name: '法商法國外貿銀行' },
  { code: '508', name: '通苑區漁會' },
  { code: '510', name: '南龍區漁會' },
  { code: '511', name: '彰化區漁會' },
  { code: '512', name: '雲林區漁會' },
  { code: '513', name: '瑞芳漁會' },
  { code: '514', name: '萬里漁會' },
  { code: '515', name: '嘉義區漁會' },
  { code: '517', name: '南市區漁會' },
  { code: '518', name: '南縣區漁會' },
  { code: '520', name: '小港漁會' },
  { code: '521', name: '彌陀永安興達林園漁會' },
  { code: '523', name: '東港林邊琉球區漁會' },
  { code: '524', name: '新港漁會' },
  { code: '525', name: '澎湖區漁會' },
  { code: '542', name: '麻豆農會' },
  { code: '549', name: '下營農會' },
  { code: '551', name: '官田農會' },
  { code: '552', name: '大內農會' },
  { code: '557', name: '新市農會' },
  { code: '558', name: '安定農會' },
  { code: '562', name: '仁德農會' },
  { code: '567', name: '南化農會' },
  { code: '568', name: '七股區農會' },
  { code: '600', name: '農金資中心' },
  { code: '605', name: '高雄市農會' },
  { code: '606', name: '新北市地區農會' },
  { code: '607', name: '宜蘭農會' },
  { code: '608', name: '桃園地區農會' },
  { code: '612', name: '神岡豐原農會' },
  { code: '613', name: '名間鄉農會' },
  { code: '614', name: '彰化地區農會' },
  { code: '615', name: '基隆農會' },
  { code: '616', name: '雲林地區農會' },
  { code: '617', name: '嘉義地區農會' },
  { code: '618', name: '台南地區農會' },
  { code: '619', name: '高雄地區農會' },
  { code: '620', name: '屏東地區農會' },
  { code: '621', name: '花蓮地區農會' },
  { code: '622', name: '台東地區農會' },
  { code: '624', name: '澎湖區農會' },
  { code: '625', name: '台中市農會' },
  { code: '627', name: '連江縣農會' },
  { code: '633', name: '北斗農會' },
  { code: '635', name: '線西農會' },
  { code: '636', name: '伸港鄉農會' },
  { code: '650', name: '福興農會' },
  { code: '651', name: '彰化市農會' },
  { code: '700', name: '中華郵政' },
  { code: '781', name: '三峽農會' },
  { code: '803', name: '聯邦銀行' },
  { code: '805', name: '遠東銀行' },
  { code: '806', name: '元大銀行' },
  { code: '807', name: '永豐銀行' },
  { code: '808', name: '玉山銀行' },
  { code: '809', name: '凱基銀行' },
  { code: '810', name: '星展銀行' },
  { code: '812', name: '台新銀行' },
  { code: '814', name: '大眾銀行' },
  { code: '815', name: '日盛銀行' },
  { code: '816', name: '安泰銀行' },
  { code: '822', name: '中國信託' },
  { code: '870', name: '梧棲區農會' },
  { code: '882', name: '大肚區農會' },
  { code: '901', name: '大里市農會' },
  { code: '903', name: '汐止市農會' },
  { code: '904', name: '新莊市農會' },
  { code: '910', name: '桃園新竹區農會' },
  { code: '912', name: '冬山鄉農會' },
  { code: '915', name: '西湖鄉農會' },
  { code: '916', name: '草屯鎮農會' },
  { code: '919', name: '三義農會' },
  { code: '921', name: '南庄鄉農會' },
  { code: '922', name: '台南市農會' },
  { code: '928', name: '板橋市農會' },
  { code: '951', name: '新北市農會北區共用中心' },
  { code: '953', name: '田尾鄉農會' },
  { code: '954', name: '農漁會中區共用中心' },
  { code: '984', name: '北投農會' },
  { code: '985', name: '士林農會' },
  { code: '988', name: '木柵農會' }
]

export const shipWays = [
  {
    way: '掌櫃',
    key: 'palmbox',
    hint: `掌櫃為櫃到櫃寄件，便利快捷。大中小格<span class="g-origin-price">原價60/55/50</span>，贈物網專享價一律45元。<br />
    請確保物品體積小於31*34*41公分。<br />
    掌櫃櫃機預設小格，臨櫃可修改。<br /><br />`,
    radios: [
      {
        id: 'palmbox-0',
        text: '索取者(貨到付款)',
        value: 'pod'
      },
      {
        id: 'palmbox-1',
        text: '索取者(匯款給贈送者)',
        value: 'receiver'
      },
      {
        id: 'palmbox-2',
        text: '贈送者',
        value: 'sender'
      }
    ]
  },
  {
    way: '全家店到店',
    key: 'fami',
    hint:
      '全家店到店寄件限制，三邊總長<105公分，單邊<45公分，重量<5公斤。',
    radios: [
      {
        id: 'fami-0',
        text: '索取者(匯款給贈送者)',
        value: 'receiver'
      },
      {
        id: 'fami-1',
        text: '贈送者',
        value: 'sender'
      }
    ]
  },
  {
    way: '新竹物流',
    key: 'hct',
    hint:
      '新竹物流單箱三邊總長度<180公分，重量<25公斤，贈物網專享價，全台灣本島均一價150元。',
    radios: [
      {
        id: 'hct-0',
        text: '索取者(貨到付款)',
        value: 'pod'
      },
      {
        id: 'hct-1',
        text: '贈送者',
        value: 'sender'
      }
    ]
  },
  {
    way: '其他物流寄送',
    key: 'others',
    farePlaceHolder: '請輸入運費',
    radios: [
      {
        id: 'others-0',
        text: '索取者(貨到付款)',
        value: 'pod'
      },
      {
        id: 'others-1',
        text: '索取者(匯款給贈送者)',
        value: 'receiver'
      },
      {
        id: 'others-2',
        text: '贈送者',
        value: 'sender'
      }
    ]
  },
  {
    way: '面交',
    key: 'meet',
    farePlaceHolder: '請輸入運費'
  },
  {
    way: '賀盟物流(大型物資)',
    key: 'homeng',
    hint: '賀盟物流運費請參考運費價目表',
    farePlaceHolder: '請參考上方運費價目表',
    radios: [
      {
        id: 'homeng-0',
        text: '索取者(貨到付款)',
        value: 'pod'
      },
      {
        id: 'homeng-1',
        text: '贈送者',
        value: 'sender'
      }
    ]
  }
]

export const guideNavList = [
  {
    path: 'member',
    label: '如何成為會員'
  },
  {
    path: 'give',
    label: '如何發佈禮物'
  },
  {
    path: 'donate',
    label: '如何把禮物送出去呢'
  },
  {
    path: 'extort',
    label: '如何索取禮物'
  },
  {
    path: 'extort_success',
    label: '如何知道已成功獲贈禮物'
  },
  {
    path: 'want',
    label: '如何發佈需求'
  },
  {
    path: 'want_donate',
    label: '如何針對需求贈送'
  },
  {
    path: 'link',
    label: '如何與其他會員溝通'
  },
  {
    path: 'manager',
    label: '如何管理禮物與需求'
  },
  {
    path: 'houselet',
    label: '圖片上小房子標誌代表'
  }
]

// 指定贈送狀態
export const needDonateDealStatusMap = [
  {
    label: '贈送中',
    value: 'init'
  },
  {
    label: '對方已婉拒',
    value: 'pass'
  },
  {
    label: '對方匯款中',
    value: 'remitting'
  },
  {
    label: '對方已匯款',
    value: 'remitted'
  },
  {
    label: '等待寄送',
    value: 'received_money'
  },
  {
    label: '已寄送',
    value: 'sent'
  },
  {
    label: '取消贈送',
    value: 'cancel'
  },
  {
    label: '完成',
    value: 'finished'
  },
  {
    label: '對方已感謝',
    value: 'thanks'
  },
  {
    label: '申請合併中',
    value: 'merge_requesting'
  },
  {
    label: '已同意',
    value: 'merge_allowed'
  },
  {
    label: '已拒絕',
    value: 'merge_rejected'
  }
]

// 年收入
export const incomesList = [
  {
    label: '0-30萬',
    value: '0'
  },
  {
    label: '30-60萬',
    value: '30'
  },
  {
    label: '60-100萬',
    value: '60'
  },
  {
    label: '100-200萬',
    value: '100'
  },
  {
    label: '200萬以上',
    value: '200'
  }
]

// 關心議題
export const issues = [
  {
    label: '兒童青少年福利',
    index: 0,
    id: 'issues-0'
  },
  {
    label: '婦女福利',
    index: 1,
    id: 'issues-1'
  },
  {
    label: '老人福利',
    index: 2,
    id: 'issues-2'
  },
  {
    label: '身心障礙福利',
    index: 3,
    id: 'issues-3'
  },
  {
    label: '綜合性服務',
    index: 4,
    id: 'issues-4'
  },
  {
    label: '環境保護',
    index: 5,
    id: 'issues-5'
  },
  {
    label: '教育與科學',
    index: 6,
    id: 'issues-6'
  },
  {
    label: '動物保護',
    index: 7,
    id: 'issues-7'
  },
  {
    label: '醫療服務',
    index: 8,
    id: 'issues-8'
  },
  {
    label: '宗教信仰',
    index: 9,
    id: 'issues-9'
  },
  {
    label: '國際救援',
    index: 10,
    id: 'issues-10'
  },
  {
    label: '文教藝術',
    index: 11,
    id: 'issues-11'
  },
  {
    label: '社區規劃',
    index: 12,
    id: 'issues-12'
  },
  {
    label: '其他',
    index: 13,
    id: 'issues-13'
  }
]

export const serviceArea = ['全球性', '全國性', '區域性']

export const servicePeoNum = ['1~30', '31~50', '51~100', '101~200', '201以上']

// 自評
export const assesses = [
  {
    label: '獲得內政部評鑑甲等以上公益團體',
    index: 0,
    id: 'assesses-0'
  },
  {
    label: '台灣公益團體自律聯盟會員',
    index: 1,
    id: 'assesses-1'
  },
  {
    label: '曾取得[中華社會福利聯合勸募協會]方案計畫補助之社福團體',
    index: 2,
    id: 'assesses-2'
  },
  {
    label: '曾取得主管機關勸募活動核准字號',
    index: 3,
    id: 'assesses-3'
  },
  {
    label: '其他',
    index: 4,
    id: 'assesses-4'
  }
]

// 得知GIVE-543渠道
export const howKnow = [
  {
    label: '報章雜誌',
    index: 0,
    id: 'howKnow-0'
  },
  {
    label: '廣播/電視節目',
    index: 1,
    id: 'howKnow-1'
  },
  {
    label: '網路平台(如:facebook)',
    index: 2,
    id: 'howKnow-2'
  },
  {
    label: '親友介紹',
    index: 3,
    id: 'howKnow-3'
  },
  {
    label: '其他',
    index: 4,
    id: 'howKnow-4'
  }
]

export const storyType = (function () {
  if (/m\.give543\.com/.test(window.location.href)) {
    return [
      {
        id: 21,
        label: '公告消息'
      },
      {
        id: 22,
        label: '企業合作'
      },
      {
        id: 23,
        label: '公益活動'
      },
      {
        id: 24,
        label: '公益走訪'
      },
      {
        id: 28,
        label: '志工活動'
      },
      {
        id: 37,
        label: '媒體報導'
      },
      {
        id: 38,
        label: '觀點543'
      },
      {
        id: 39,
        label: '搜奇543'
      },
      {
        id: 45,
        label: '贈物網學堂'
      }
    ]
  } else {
    return [
      {
        id: 0,
        label: '所有'
      },
      {
        id: 21,
        label: '公告消息'
      },
      {
        id: 22,
        label: '企業合作'
      },
      {
        id: 23,
        label: '公益活動'
      },
      {
        id: 24,
        label: '公益走訪'
      },
      {
        id: 28,
        label: '志工活動'
      },
      {
        id: 37,
        label: '媒體報導'
      },
      {
        id: 42,
        label: '觀點543'
      },
      {
        id: 43,
        label: '搜奇543'
      },
      {
        id: 45,
        label: '贈物網學堂'
      }
    ]
  }
})()

const oldVersionFn = () => {
  const { href } = window.location
  if (/localhost/.test(href)) {
    return {
      url: 'http://localhost:8000',
      path: 'localhost'
    }
  } else if (/m\.give543\.com/.test(href)) {
    return {
      url: 'https://www.give543.com',
      path: '.give543.com'
    }
  } else if (/m\.qa\.give543\.com/.test(href)) {
    return {
      url: 'https://qa.give543.com',
      path: '.give543.com'
    }
  }
  return {
    url: 'https://give543.shengxintech.com',
    path: '.shengxintech.com'
  }
}

export const oldVersionUrl = oldVersionFn()

// 社会局食材捐赠
export const donateTarget = [
  {
    name: '臺北市健軍團體家庭',
    type: '身心障礙福利',
    area: '中正區',
    foodType: '熟食、食材',
    num: '7人份',
    time: '下午13點半到16點前',
    shipway: '捐贈者協助運送',
    phone: '02-2365-9037'
  },
  {
    name: '臺北市鵬程啟能中心',
    type: '身心障礙福利',
    area: '松山區',
    foodType: '熟食、食材',
    num: '70人份',
    time: '24小時都可',
    shipway: '視物資遠近',
    phone: '02-2760-6277'
  },
  {
    name: '創世基金會 萬華平安站',
    type: '綜合性服務',
    area: '萬華區',
    foodType: '熟食、食材',
    num: '70人份',
    time: `食材：週一至週五上午8時至17時(需冷藏及冷凍，需事先聯繫)
  便當及餐盒：晚餐，下午14-16時(僅接受晚餐時段。亦需事先聯繫)`,
    shipway: '視物資遠近',
    phone: '02-2336-1247'
  },
  {
    name: '友緣基金會(高風險家綜單位)',
    type: '兒童青少年福利',
    area: '士林區',
    foodType: '熟食、食材',
    num: '38人份',
    time: '早上9點至下午16點',
    shipway: '捐贈者協助運送',
    phone: '02-2837-1910'
  },
  {
    name: '財團法人基督教臺北市伯大尼兒少家園',
    type: '兒童青少年福利',
    area: '文山區',
    foodType: '食材',
    num: '50人份',
    time: '早上8點到下午17點',
    shipway: '視物資遠近',
    phone: '02-2939-6396'
  },
  {
    name: '財團法人利伯他茲教育基金會-選擇家園',
    type: '兒童青少年福利',
    area: '信義區',
    foodType: '食材',
    num: '15人份',
    time: '24小時都可',
    shipway: '視物資遠近',
    phone: '02-2634-1363'
  },
  {
    name: '財團法人利伯他茲教育基金會-曙光家園',
    type: '兒童青少年福利',
    area: '信義區',
    foodType: '食材',
    num: '8人份',
    time: '24小時都可',
    shipway: '視物資遠近',
    phone: '02-8791-7593'
  },
  {
    name: '財團法人基督教芥菜種會',
    type: '兒童青少年福利',
    area: '南港區',
    foodType: '食材',
    num: '100人份',
    time: '早上9點到下午17點',
    shipway: '視物資遠近',
    phone: '02-2597-4868'
  },
  {
    name: '財團法人天主教善牧社會福利基金會-德蓓之家',
    type: '兒童青少年福利',
    area: '信義區',
    foodType: '食材',
    num: '4人份',
    time: '早上9點至下午20點',
    shipway: '視物資遠近',
    phone: '02-2726-6617'
  },
  {
    name: '財團法人臺北市基督教勵友中心-家處',
    type: '兒童青少年福利',
    area: '中山區',
    foodType: '食材',
    num: '10人份',
    time: '早上9點至下午17點',
    shipway: '捐贈者協助運送',
    phone: '02-2595-2052'
  },
  {
    name: '內湖老人服務中心',
    type: '老人福利',
    area: '內湖區',
    foodType: '食材',
    num: '10人份',
    time: '早上9點至下午17點',
    shipway: '捐贈者協助運送',
    phone: '02-2632-5560'
  },
  {
    name: '臺北市大同發展中心',
    type: '身心障礙福利',
    area: '大同區',
    foodType: '食材',
    num: '10人份',
    time: '早上9點至下午16點',
    shipway: '視物資遠近',
    phone: '02-2598-6886'
  },
  {
    name: '臺北市東區單親家庭服務中心',
    type: '婦女福利',
    area: '松山區',
    foodType: '食材',
    num: '10人份',
    time: '週二、週四、週五、週六早上9點至下午17點；週三下午1點至晚間20點',
    shipway: '捐贈者協助運送',
    phone: '02-2768-5256'
  },
  {
    name: '台北兒童福利中心',
    type: '兒童青少年福利',
    area: '信義區',
    foodType: '食材',
    num: '30人份',
    time: '週三下午1點至晚間20點',
    shipway: '捐贈者協助運送',
    phone: '02-3765-2575'
  },
  {
    name: '台北市城中發展中心',
    type: '身心障礙福利',
    area: '中正區',
    foodType: '食材',
    num: '50人份',
    time: '週一至週五早上9點至晚間21點',
    shipway: '捐贈者協助運送',
    phone: '02-2364-3036'
  },
  {
    name: '崇愛發展中心',
    type: '身心障礙福利',
    area: '新北市中和區',
    foodType: '食材',
    num: '150人份',
    time: '早上9點至下午16點',
    shipway: '視物資遠近',
    phone: '02-2246-0820'
  }
]

export const FATHERSDAY_ENDTIME = '2018/9/1'

export const SPORTSDAY_ENDTIME = '2018/10/1' // 地板滚球国际积分赛活动

/* eslint-disable */
export const baseInfoDesc = {
  reviewsRate: {
    text:
      '感謝率代表頁面主人在索取成功後，是否留言或刊登照片向贈送者表達感謝。感謝率以百分比呈現，每次都有說謝謝，就是100%哦！溫馨提示：贈送者經常以此判斷索取者，究竟是惦惦收禮不答謝的人，還是會主動回報禮物使用情況',
    label: '感謝率'
  },
  bonus: {
    text:
      '贈送者分享禮物，「確認寄出/已面交」後，系統依所贈送物品數量所累計的點數。1個好人點代表1個物資的流轉，為地球也為社會人情味，多1點貢獻唷！',
    label: '好人點'
  }
}
/* eslint-disable */

export const LOVE_BOX_STATUS = {
  STATUS_DELETED: 0,
  STATUS_ON_SHELVE: 1,
  STATUS_OFF_SHELVE: 2
}
