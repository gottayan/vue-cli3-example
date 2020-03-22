import Vue from 'vue'
import Router from 'vue-router'
import { local, KEY_USER_TOKEN } from '@/tools/storage'

Vue.use(Router)

// 路由文件必须放在container目录下
const _import = require('./_import_' + process.env.NODE_ENV)

const router = new Router({
  mode: 'history',
  routes: [
    /* 底部tab路由 */
    {
      path: '/',
      component: _import('Root'),
      meta: {
        keepAlive: true
      },
      children: [{
        path: 'gifts',
        name: 'Gifts',
        component: _import('gift/Gifts'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'needs',
        name: 'Needs',
        component: _import('need/Needs'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'message',
        name: 'message',
        component: _import('message/Index'),
        meta: {
          auth: true,
          keepAlive: true
        }
      },
      {
        path: '',
        name: 'home',
        component: _import('Home'),
        meta: {
          keepAlive: true
        }
      }, {
        path: '/userinfo',
        name: 'UserInfo',
        component: _import('UserInfo'),
        meta: {
          keepAlive: true
        }
      }]
    },
    /* 底部tab路由 */
    /* 讀故事 */
    {
      path: '/story',
      name: 'Story',
      meta: {
        keepAlive: true
      },
      component: _import('story/index')
    }, {
      path: '/story/:id',
      name: 'StoryDeatil',
      meta: {
        title: '故事詳情'
      },
      component: _import('story/Detail')
    },
    /* 讀故事 */
    /* 排行榜 */
    {
      path: '/bonusRanking',
      name: 'BonusRanking',
      component: _import('BonusRanking')
    },
    /* 排行榜 */
    /* 禮物 */
    {
      path: '/gift/:id(\\d+)',
      name: 'GiftDetail',
      component: _import('gift/GiftDetail')
    }, {
      path: '/gift/new',
      name: 'NewGift',
      component: _import('gift/NewGift'),
      meta: {
        auth: true
      }
    }, {
      path: '/gift/edit/:id',
      name: 'EditGift',
      component: _import('gift/EditGift'),
      meta: {
        auth: true
      }
    }, {
      path: '/gift/send',
      name: 'SendGift',
      component: _import('gift/SendGift')
    }, {
      path: '/request/:id',
      name: 'Request',
      component: _import('gift/Request'),
      meta: {
        auth: true
      }
    }, {
      path: '/requestSuc',
      name: 'RequestSuc',
      component: _import('gift/RequestSuc')
    },
    /* 禮物 */
    /* 需求 */
    {
      path: '/need/new',
      name: 'NewNeed',
      meta: {
        auth: true
      },
      component: _import('need/NewNeed')
    }, {
      path: '/need/edit/:id',
      name: 'EditNeed',
      component: _import('need/EditNeed'),
      meta: {
        auth: true
      }
    }, {
      path: '/need/:id(\\d+)',
      name: 'NeedDetail',
      component: _import('need/NeedDetail')
    }, {
      path: '/need/take',
      name: 'ReceiveDonate',
      component: _import('need/ReceiveDonate')
    }, {
      path: '/confirmShip',
      name: 'ConfirmShip',
      component: _import('need/ConfirmShip')
    }, {
      path: '/donate/:id',
      name: 'Donate',
      component: _import('need/Donate'),
      meta: {
        auth: true
      }
    }, {
      path: '/donateSuc',
      name: 'DonateSuc',
      component: _import('need/DonateSuc')
    },
    /* 需求 */
    /* 用戶主頁 */
    {
      path: '/user/:hash',
      // name: 'user',
      component: _import('user/index'),
      children: [{
        path: '',
        name: 'NotMe',
        meta: {
          title: {
            self: '我的用戶資料',
            other: 'TA的用戶資料'
          }
        },
        component: _import('user/User')
      }, {
        path: 'gifts',
        name: 'UserGifts',
        meta: {
          title: {
            self: '我的送禮物',
            other: 'TA的送禮物'
          }
          // keepAlive: true
        },
        component: _import('user/Gifts')
      }, {
        path: 'needs',
        name: 'UserNeeds',
        meta: {
          title: {
            self: '我的需求',
            other: 'TA的需求'
          }
        },
        component: _import('user/Needs')
      }, {
        path: 'thanksWord',
        name: 'UserThanks',
        meta: {
          title: {
            self: '我的感謝',
            other: 'TA的感謝'
          }
        },
        component: _import('user/thanksWord')
      },
      {
        path: 'deals',
        name: 'Deals',
        meta: {
          title: {
            self: '我索取過的物品',
            other: 'TA索取過的物品'
          }
        },
        component: _import('user/ReqGifts')
      },
      {
        path: 'wish',
        name: 'userWish',
        meta: {
          title: {
            self: '心願認養',
            other: 'TA的心願認養'
          }
        },
        component: _import('wishes/UserWish')
      },
      {
        path: 'traces',
        name: 'UserTraces',
        meta: {
          title: {
            self: '我的追蹤'
          }
        },
        component: _import('user/Traces')
      }, {
        path: 'subscribe',
        name: 'Subscribe',
        meta: {
          title: {
            self: '我的關鍵字訂閱'
          },
          auth: true
        },
        component: _import('user/Subscribe')
      }, {
        path: 'privateNote',
        name: 'PrivateNote',
        meta: {
          title: {
            self: '我的好壞名單'
          },
          auth: true
        },
        component: _import('user/PrivateNote')
      }, {
        path: 'love',
        name: 'Love',
        meta: {
          title: {
            self: '我寄送的愛箱'
          },
          auth: true
        },
        component: _import('user/Love')
      }, {
        path: 'shop',
        name: 'Shop',
        meta: {
          title: {
            self: '我索取的愛箱'
          },
          auth: true
        },
        component: _import('user/Shop')
      }, {
        path: 'deals',
        name: 'deals',
        meta: {
          isShowPrefix: true,
          title: '索取過的物品'
        },
        component: _import('user/ReqGifts')
      }, {
        path: 'fans',
        name: 'Fans',
        meta: {
          title: {
            self: ''
          }
        },
        component: _import('user/Fans')
      }, {
        path: 'traces',
        name: 'Traces',
        meta: {
          title: {
            self: '追蹤詳情'
          }
        },
        component: _import('user/Traces')
      }, {
        path: 'setting',
        name: 'Setting',
        meta: {
          title: {
            self: '設置'
          },
          auth: true
        },
        component: _import('user/Setting')
      }, {
        path: 'editBaseInfo',
        name: 'EditBaseInfo',
        meta: {
          title: {
            self: '基本資料'
          },
          auth: true
        },
        component: _import('user/EditBaseInfo')
      }, {
        path: 'change',
        name: 'Change',
        meta: {
          title: {
            self: '變更會員身份'
          },
          auth: true
        },
        component: _import('user/ChangeIdentity')
      }, {
        path: 'editRemit',
        name: 'EditRemit',
        meta: {
          title: {
            self: '匯款及寄送資訊'
          },
          auth: true
        },
        component: _import('user/EditRemit')
      }, {
        path: 'editAdr',
        name: 'EditAdr',
        meta: {
          title: {
            self: '聯絡地址'
          },
          auth: true
        },
        component: _import('user/EditAdr')
      }, {
        path: 'infos',
        name: 'Infos',
        meta: {
          title: {
            self: '個人介紹',
            other: '個人介紹'
          }
        },
        component: _import('user/Infos')
      }]
    },
    {
      path: '/resetpw',
      meta: {
        title: '忘記密碼'
      },
      component: _import('user/ResetPw')
    }, {
      path: '/verifycellphone',
      meta: {
        title: '手機驗證',
        auth: true
      },
      component: _import('user/VerifyCellPhone')
    }, {
      path: '/confirm/:hash/code/:code',
      redirect: to => {
        const { params } = to
        return {
          path: '/verifyemail',
          query: {
            hash: params.hash,
            code: params.code
          }
        }
      }
    }, {
      path: '/verifyemail',
      meta: {
        title: '郵箱驗證',
        auth: true
      },
      component: _import('user/VerifyEmail')
    }, {
      path: '/verifyname',
      meta: {
        title: '實名驗證',
        auth: true
      },
      component: _import('user/VerifyId')
    }, {
      path: '/verifylovebox',
      meta: {
        title: '愛箱送驗證',
        auth: true
      },
      component: _import('user/VerifyLoveBox')
    }, {
      path: '/chpw',
      name: 'Chpw',
      meta: {
        title: '修改密碼',
        auth: true
      },
      component: _import('user/ChangePw')
    }, {
      path: '/newconnect',
      name: 'NewConnect',
      meta: {
        title: '交接預告',
        auth: true
      },
      component: _import('user/NewConnect')

    },
    /* 用戶主頁 */
    /* 感謝 */
    {
      path: '/thanks',
      name: 'Thanks',
      component: _import('ThanksWall')
    },
    /* 登錄 */
    {
      path: '/login',
      name: 'Login',
      component: _import('enter/Login')
    },
    /* 註冊 */
    {
      path: '/register',
      name: 'Register',
      component: _import('enter/Register')
    }, {
      path: '/register/phone',
      name: 'RegisterPhone',
      component: _import('enter/RegisterPhoneDetail'),
      meta: {
        auth: true
      }
    }, {
      path: '/registerSuccess',
      name: 'RegisterSuccess',
      component: _import('enter/RegisterSuccess')
    }, {
      path: '/changeLogin',
      name: 'ChangeLogin',
      component: _import('enter/ChangeLogin')
    },
    /* 互動卡 */
    {
      path: '/chatroom/:id',
      name: 'chatroom',
      component: _import('message/Chatroom'),
      meta: {
        auth: true
      }
    },
    {
      path: '/service-protocol',
      name: 'ServiceProtocol',
      component: _import('info/ServiceProtocol')
    }, {
      path: '/about543new',
      name: 'About543New',
      meta: {
        title: '關於我們'
      },
      component: _import('info/About543New')
    }, {
      path: '/about543',
      name: 'About543',
      meta: {
        title: '關於我們'
      },
      component: _import('info/About543')
    }, {
      path: '/guide',
      name: 'Guide',
      component: _import('info/Guide')
    }, {
      path: '/privacy',
      name: 'Privacy',
      component: _import('info/Privacy')
    }, {
      path: '/search',
      name: 'Search',
      component: _import('Search')
    }, {
      path: '/taipei/about',
      name: 'TaiPeiAbout',
      component: _import('info/AboutTaiPei')
    }, {
      path: '/donatefood',
      name: 'DonateFood',
      component: _import('info/DonateFood')
    },
    /* 会员变更页面 */
    {
      path: '/firmIdentity/:hash',
      name: 'FirmIdentity',
      meta: {
        title: '企業行號',
        auth: true
      },
      component: _import('user/FirmIdentity')
    }, {
      path: '/officeIdentity/:hash',
      name: 'OfficeIdentity',
      meta: {
        title: '政府機關',
        auth: true
      },
      component: _import('user/OfficeIdentity')
    }, {
      path: '/schoolIdentity/:hash',
      name: 'SchoolIdentity',
      meta: {
        title: '學校單位',
        auth: true
      },
      component: _import('user/SchoolIdentity')
    }, {
      path: '/loveMemIdentity/:hash',
      name: 'LoveMemIdentity',
      meta: {
        title: '關懷會員',
        auth: true
      },
      component: _import('user/LoveMemIdentity')
    }, {
      path: '/benefitIdentity/:hash',
      name: 'BenefitIdentity',
      meta: {
        title: '公益團體',
        auth: true
      },
      component: _import('user/BenefitIdentity')
    },
    /* 確認收到提示頁面 */
    {
      path: '/confirmSent',
      name: 'ConfirmSent',
      component: _import('message/ItemSent')
    },
    /* 感謝頁面 */
    {
      path: '/thanksItem/:id',
      name: 'ThanksItem',
      component: _import('message/ThanksItem')
    },
    /* 愛箱送 */
    {
      path: '/lovebox',
      name: 'Lovebox',
      component: _import('lovebox/Index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/lovebox/:id',
      name: 'LoveboxDetail',
      component: _import('lovebox/Detail')
    }, {
      path: '/shopCart',
      name: 'ShopCart',
      component: _import('lovebox/ShopCart')
    }, {
      path: '/bookSuc',
      name: 'BookSuc',
      component: _import('lovebox/BookSuc')
    }, {
      path: '/aboutLovebox',
      name: 'AboutLovebox',
      component: _import('lovebox/About')
    }, {
      path: '/contactLovebox',
      name: 'ContactLovebox',
      component: _import('lovebox/Contact')
    }, {
      path: '/loveboxThanks/:id',
      name: 'LoveboxThanks',
      component: _import('lovebox/Thanks')
    }, {
      path: '/activitynotice',
      name: 'ActivityNotice',
      component: _import('ActivityNotice')
    },
    /* 索取赠送交易管理页面 */
    {
      path: '/dealsReq',
      name: 'ReqAll',
      component: _import('deals/request/Index'),
      meta: {
        auth: true,
        keepAlive: true
      }
    },
    // {
    //   path: '/dealsReq/:status',
    //   name: 'ReqStatus',
    //   component: _import('deals/request/status'),
    //   meta: {
    //     auth: true,
    //     // keepAlive: true
    //   }
    // },
    {
      path: '/dealsReq/requesting',
      name: 'ReqRequesting',
      component: _import('deals/request/Requesting'),
      meta: {
        auth: true,
        keepAlive: true
      }
    },
    {
      path: '/dealsReq/remitting',
      name: 'ReqRemitting',
      component: _import('deals/request/Remitting'),
      meta: {
        auth: true,
        keepAlive: true
      }
    },
    {
      path: '/dealsReq/remitted',
      name: 'ReqRemitted',
      component: _import('deals/request/Remitted'),
      meta: {
        auth: true,
        keepAlive: true
      }
    },
    {
      path: '/dealsReq/sent',
      name: 'ReqSent',
      component: _import('deals/request/Sent'),
      meta: {
        auth: true,
        keepAlive: true
      }
    },
    {
      path: '/dealsReq/finished',
      name: 'ReqFinished',
      component: _import('deals/request/Finished'),
      meta: {
        auth: true,
        keepAlive: true
      }
    },
    {
      path: '/dealsDonate',
      name: 'DonateAll',
      component: _import('deals/donate/Index'),
      meta: {
        auth: true,
        keepAlive: true
      }
    },
    // {
    //   path: '/dealsDonate/:status',
    //   name: 'donateStatus',
    //   component: _import('deals/donate/status'),
    //   meta: {
    //     auth: true
    //   }
    // },
    {
      path: '/dealsDonate/init',
      name: 'DonateInit',
      component: _import('deals/donate/Init'),
      meta: {
        auth: true,
        keepAlive: true
      }
    },
    {
      path: '/dealsDonate/remitted',
      name: 'DonateRemitted',
      component: _import('deals/donate/Remitted'),
      meta: {
        auth: true,
        keepAlive: true
      }
    },
    {
      path: '/dealsDonate/remitting',
      name: 'DonateRemitting',
      component: _import('deals/donate/Remitting'),
      meta: {
        auth: true,
        keepAlive: true
      }
    },
    {
      path: '/dealsDonate/sent',
      name: 'DonateSent',
      component: _import('deals/donate/Sent'),
      meta: {
        auth: true,
        keepAlive: true
      }
    },
    /* 索取赠送交易管理页面 */
    /* 台北社會局 */
    {
      path: '/city/taipei',
      name: 'CityTaipei',
      component: _import('taipei/Index')
    },
    {
      path: '/city/taipei/about',
      name: 'CityTaipeiAbout',
      component: _import('taipei/About')
    },
    {
      path: '/city/taipei/commonweal',
      name: 'CityTaipeiCommonweal',
      component: _import('taipei/Commonweal')
    },
    /* 常見問題 */
    {
      path: '/faq',
      name: 'Faq',
      component: _import('answer/faq')
    },
    {
      path: '/faq/becomeMember',
      name: 'BecomeMember',
      component: _import('answer/becomeMember')
    },
    {
      path: '/faq/uploadGift',
      name: 'UploadGift',
      component: _import('answer/uploadGift')
    },
    {
      path: '/faq/sendGift',
      name: 'FaqSendGift',
      component: _import('answer/sendGift')
    },
    {
      path: '/faq/successRecevieGift',
      name: 'SuccessRecevieGift',
      component: _import('answer/successRecevieGift')
    },
    {
      path: '/faq/demandGift',
      name: 'DemandGift',
      component: _import('answer/demandGift')
    },
    {
      path: '/faq/requestRequirement',
      name: 'RequestRequirement',
      component: _import('answer/requestRequirement')
    },
    {
      path: '/faq/requirementSend',
      name: 'RequirementSend',
      component: _import('answer/requirementSend')
    },
    {
      path: '/faq/memberExchange',
      name: 'MemberExchange',
      component: _import('answer/memberExchange')
    },
    {
      path: '/faq/managerGiftRequirement',
      name: 'ManagerGiftRequirement',
      component: _import('answer/managerGiftRequirement')
    },
    /* 用戶反饋 */
    {
      path: '/feedback',
      name: 'Feedback',
      component: _import('user/Feedback')
    },
    {
      path: '/nearbyPalmBox',
      name: 'nearbyPalmBox',
      meta: {
        title: '查看櫃機'
      },
      component: _import('palmbox/Nearby')
    },
    {
      path: '/palmboxusage',
      name: 'PalmBoxUsage',
      meta: {
        title: '如何使用掌櫃'
      },
      component: _import('PalmboxUsage')
    },
    {
      path: '/fathersDay/:id(\\d+)?',
      name: 'FathersDay',
      component: _import('FathersDay')
    },
    // {
    //   path: '/fathersDay/release',
    //   name: 'Release',
    //   component: _import('fathersDay/Release'),
    //   meta: {
    //     auth: true
    //   }
    // },
    // {
    //   path: '/fathersDay/rewards',
    //   name: 'Rewards',
    //   component: _import('fathersDay/Rewards')
    // },
    {
      path: '/sportsday/:id(\\d+)?',
      name: 'SportsDay',
      component: _import('SportsDay')
    }, {
      path: '/sportsday/release',
      name: 'Release',
      component: _import('fathersDay/release'),
      meta: {
        auth: true
      }
    }, {
      path: '/sportsday/rewards',
      name: 'Rewards',
      component: _import('fathersDay/rewards')
    }, {
      path: '/cabinetGift',
      name: 'CabinetGift',
      component: _import('cabinetGift/Index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/wishes',
      name: 'Wishes',
      component: _import('wishes/Wishes'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/wish/:id(\\d+)?',
      name: 'Wish',
      component: _import('wishes/Details')
    }, {
      path: '/wish/confirm/:id(\\d+)?',
      name: 'WishConfirm',
      component: _import('wishes/Confirm')
    }, {
      path: '/wish/finish/:id(\\d+)?',
      name: 'WishFinish',
      component: _import('wishes/Finish')
    }, {
      path: '/wish/explain',
      name: 'WishExplain',
      component: _import('wishes/Explain')
    }, {
      path: '/wish/after/:id(\\d+)',
      name: 'wishAfter',
      component: _import('wishes/After')
    }, {
      path: '/merge/request',
      name: 'mergeRequest',
      meta: {
        keepAlive: true
      },
      component: _import('merge/Request')
    }, {
      path: '/dealsDetail/:id',
      name: 'dealsDetail',
      component: _import('detail/Index')
    }, {
      path: '/unauthorized',
      name: 'Unauthorized',
      component: _import('Unauthorized'),
      meta: {
        title: '401 未授權'
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (to.matched.some(t => t.meta.keepAlive)) {
      if (savedPosition === null) {
        to.meta.saved_position = null
      } else {
        savedPosition = to.meta.saved_position
      }
      const back = savedPosition || { x: 0, y: 0 }
      return back
    }
  }
})

router.beforeEach((to, from, next) => {
  if (from.meta.keepAlive) {
    from.meta.saved_position = {
      x: window.pageXOffset,
      y: window.pageYOffset
    }
  }
  let token = local.get(KEY_USER_TOKEN)
  if (to.matched.some(record => record.meta.auth)) {
    if (token) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
        replace: true
      })
    }
  } else {
    next()
  }
})

// main.js 里，如果你使用了 vue-router
// router.afterEach((to) => {
//   if (window.ga) {
//     console.log('window.ga is avaible')
//     window.ga('set', 'page', to.fullPath) // 你可能想根据请求参数添加其他参数，可以修改这里的 to.fullPath
//     window.ga('send', 'pageview')
//   }
// })

export default router
