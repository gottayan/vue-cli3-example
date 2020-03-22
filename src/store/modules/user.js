import userApi from '../apis/user'
import { KEY_USER_TOKEN } from '@/tools/storage'
const state = {
  // resetPwStep: 0,
  msgStatus: '',
  marks: {
    WHITE: {
      curPage: 0,
      data: []
    },
    BLACK: {
      curPage: 0,
      data: []
    },
    curIdx: 0
  },
  userInfo: {
    id: 0,
    pics: '',
    avatar: [],
    catHash: 'normal',
    catId: 36,
    nickname: '',
    name: '',
    email: '',
    cellphone: '',
    phone: '',
    income: '', // 年收入
    infos: '', // 自我介绍
    createTime: '',
    lastLoginTime: '',
    isGOV: false,
    isComMger: false,
    isCompany: false,
    verify: {
      cell: false,
      ppl: false, // 实名
      email: false,
      love: false // 爱箱送
    },
    others: {
      addresses: {
        meets: {
          address: '',
          city: '',
          district: ''
        },
        rcvs: {
          address: '',
          city: '',
          district: ''
        },
        things: {
          address: '',
          city: '',
          district: ''
        },
        users: {
          address: '',
          city: '',
          district: ''
        }
      },
      banks: [{
        accounts: '',
        banks: '',
        branchs: '',
        title: ''
      }, {
        accounts: '',
        banks: '',
        branchs: '',
        title: ''
      }],
      birthday: {
        value: '',
        isPub: false
      },
      jobs: {
        value: '', // 枚举值 有工作 无工作 学生
        isPub: false
      },
      childs: {
        value: false, // 是否育儿
        isPub: false
      },
      marry: {
        value: false,
        isPub: false
      },
      gender: null,
      isIPOCompany: false,
      issues: [], // 关心议题
      fami: '' // 预设全家收件
    },
    verifyInfo: {
      position: '',
      fullname: '',
      cat_hash: '',
      taxnum: '',
      no: '',
      type: '',
      purpose: '',
      advise_no: '',
      contact_tel: '',
      contact_phone: '',
      contact_name: ''
    },
    bonus: 0, // 好人点
    reviewsRate: 0, // 感谢率
    charitys: 0, // 公益捐赠
    fans: 0, // 粉丝人数
    traces: 0, // 追踪人数
    inviteCode: '', // 爱箱送邀请码
    token: '',
    myGiftsTabIndex: 0,
    myGifts: {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    },
    myNeedDonates: {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    },
    myNeeds: {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    },
    myRequestsTabIndex: 0,
    myRequests: [{
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []}, {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []}, {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    }],
    traceUsers: {
      currentPage: 0,
      nextPageUrl: '//',
      data: []
    },
    traceGifts: {
      currentPage: 0,
      nextPageUrl: '//',
      data: []
    },
    traceNeeds: {
      currentPage: 0,
      nextPageUrl: '//',
      data: []
    },
    traceIdx: 0
  },
  otherUserInfo: {
    id: 0,
    pics: '',
    catHash: 'normal',
    catId: 36,
    nickname: 'Give543 會員',
    name: '',
    email: '',
    cellphone: '',
    phone: '',
    income: '', // 年收入
    infos: '這個傢伙很懶，什麼也沒留下~', // 自我介绍
    createTime: '',
    lastLoginTime: '',
    isGOV: false,
    isComMger: false,
    isCompany: false,
    verify: {
      cell: false,
      ppl: false, // 实名
      email: false,
      love: false // 爱箱送
    },
    myOthGifts: {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    },
    others: {
      addresses: {
        meets: {
          address: '',
          city: '',
          district: ''
        },
        rcvs: {
          address: '',
          city: '',
          district: ''
        },
        things: {
          address: '',
          city: '',
          district: ''
        },
        users: {
          address: '',
          city: '',
          district: ''
        }
      },
      banks: [{
        accounts: '',
        banks: '',
        branchs: '',
        title: ''
      }, {
        accounts: '',
        banks: '',
        branchs: '',
        title: ''
      }],
      birthday: {
        value: '',
        isPub: false
      },
      jobs: {
        value: '', // 枚举值 有工作 无工作 学生
        isPub: false
      },
      childs: {
        value: false, // 是否育儿
        isPub: false
      },
      marry: {
        value: false,
        isPub: false
      },
      gender: null,
      isIPOCompany: false,
      issues: [], // 关心议题
      fami: '' // 预设全家收件
    },
    verifyInfo: {
      position: '',
      fullname: '',
      cat_hash: '',
      taxnum: '',
      no: '',
      type: '',
      purpose: '',
      advise_no: '',
      contact_tel: '',
      contact_phone: '',
      contact_name: ''
    },
    bonus: 0, // 好人点
    reviewsRate: 0, // 感谢率
    charitys: 0, // 公益捐赠
    fans: 0, // 粉丝人数
    traces: 0, // 追踪人数
    inviteCode: '', // 爱箱送邀请码
    token: '',
    myGiftsTabIndex: 0,
    myGifts: {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    },
    myNeedDonates: {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    },
    myNeeds: {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    },
    myRequestsTabIndex: 0,
    myRequests: [{
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []}, {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []}, {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    }],
    traceUsers: {
      currentPage: 0,
      nextPageUrl: '//',
      data: []
    },
    traceGifts: {
      currentPage: 0,
      nextPageUrl: '//',
      data: []
    },
    traceNeeds: {
      currentPage: 0,
      nextPageUrl: '//',
      data: []
    }
  }
}

const actions = {
  getLoginUserInfo ({commit, state}, {cb = null} = {}) {
    userApi.getLoginUserInfo((data) => {
      commit('setLoginUserInfo', {data: data && data.user})
      if (cb) {
        return cb(data && data.user)
      }
    })
  },
  getOtherUserInfo ({commit, state}, {hash}) {
    userApi.getUserInfo(hash, (data) => {
      return commit('setOtherUserInfo', {data})
    })
  },
  getUserGifts ({commit, state}, {page, userId, cb}) {
    userApi.getUserGifts(page, userId, (data) => {
      commit('setMyGifts', {userId, data})
      return cb(data)
    })
  },
  getUserOtherGifts ({commit, state}, {page, userId, cb}) {
    userApi.getUserGifts(page, userId, (data) => {
      commit('setMyOtherGifts', {userId, data})
      return cb(data)
    })
  },
  getUserNeedDonates ({commit, state}, {page, userId, cb}) {
    userApi.getUserNeedDonates(page, userId, (data) => {
      commit('setMyNeedDonates', {userId, data})
      return cb(data)
    })
  },
  getUserNeeds ({commit, state}, {page, userId, cb}) {
    userApi.getUserNeeds(page, userId, (data) => {
      commit('setMyNeeds', {userId, data})
      return cb()
    })
  },
  getUserRequests ({commit, state}, {page, userId, status, index, cb}) {
    userApi.getUserRequests(page, userId, status, (data) => {
      commit('setMyRequests', {userId, data, index})
      return cb(data)
    })
  },
  changeUserPassword ({commit, state}, {oldpw, newpw, cb}) {
    userApi.changePassword(oldpw, newpw, (data) => {
      return cb(data)
    })
  },
  resetUserPassword ({commit, state}, {email, cb}) {
    userApi.resetpassword(email, (data) => {
      cb(data)
      // return commit('changeResetPwStep', )
    })
  },
  resetUserCellPhonePassword ({commit, state}, {cellphone, password, repeatPassword, token, cb}) {
    userApi.resetcellphonepassword(cellphone, password, repeatPassword, token, (data) => {
      cb(data)
    })
  },
  getTraceThing ({commit, state}, {userId, type, cb = null} = {}) {
    userApi.getTraceThing(type, (data) => {
      commit(`setTraceThing`, {userId, type, data})
      if (cb) {
        cb(data)
      }
    })
  },
  unTraceThing ({commit, state}, {userId, id, type}) {
    userApi.unTraceThing(id, type, (data) => {
      commit(`setUnTraceThing`, {userId, type, data})
    })
  },
  modify ({commit, state}, {dataObj, cb}) {
    userApi.modify(dataObj, (data) => {
      cb(data)
    })
  },
  confirmVerifyLoveBox ({commit, state}, {code, cb}) {
    userApi.confirmVerifyLoveBox(code, (data) => {
      if (!data.error) {
        commit('updateVerifyLoveBox')
      }
      cb(data)
    })
  },
  sendCodeVerifyCellPhone ({commit, state}, {cellphone, cb}) {
    userApi.sendCodeVerifyCellPhone(cellphone, (data) => {
      cb(data)
    })
  },
  async confirmVerifyCellPhone ({commit, state}, {cellphone, token, cb}) {
    const data = await userApi.confirmVerifyCellPhone(cellphone, token)
    if (!data.error) {
      commit('updateVerifyCellphone', {data})
    }
    cb(data)
  },
  sendVerifyEmail ({commit, state}, {email, cb}) {
    userApi.sendVerifyEmail(email, (data) => {
      cb(data)
    })
  },
  confirmVerifyEmail ({commit, state}, {usrHash, token, cb}) {
    userApi.confirmVerifyEmail(usrHash, token, (data) => {
      if (!data.error) {
        commit('updateVerifyEmail')
      }
      cb(data)
    })
  },
  confirmVerifyName ({commit, state}, {idImage, docImage, cb}) {
    userApi.confirmVerifyName(idImage, docImage, (data) => {
      cb(data)
    })
  },
  changeUserRoles ({commit, state}, {dataObj, cb}) {
    userApi.changeUserRoles(dataObj, (data) => {
      cb(data)
    })
  },
  getUserMarks ({commit, state}, {type, cb = null} = {}) {
    userApi.getUserMarks(
      type,
      (data) => {
        commit('setUserMarks', {type, data})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  cancelMark ({commit, state}, {userId, cb = null} = {}) {
    userApi.cancelMark(
      userId,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  makeMarks ({commit, state}, {content, userId, type, cb = null} = {}) {
    userApi.makeMarks(
      content,
      userId,
      type,
      (data) => {
        if (cb) {
          cb(data)
        }
      }
    )
  },
  traceUser ({commit, state}, {isTrace, userId, cb = null} = {}) {
    userApi.traceUser(
      isTrace,
      userId,
      (data) => {
        commit('setTraceUser', {isTrace})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  updateConnect ({commit, state}, {data, cb}) {
    userApi.updateConnect(
      data,
      (data) => cb(data)
    )
  }
}

const mutations = {
  logout (state) {
    state.userInfo.id = ''
    state.userInfo.token = ''
    state.userInfo.traceUsers = {
      currentPage: 0,
      nextPageUrl: '//',
      data: []
    }
    state.userInfo.traceGifts = {
      currentPage: 0,
      nextPageUrl: '//',
      data: []
    }
    state.userInfo.traceNeeds = {
      currentPage: 0,
      nextPageUrl: '//',
      data: []
    }
    state.userInfo.myGiftsTabIndex = 0
    state.userInfo.myGifts = {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    }
    state.userInfo.myNeedDonates = {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    }
    state.userInfo.myNeeds = {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    }
    state.userInfo.myRequestsTabIndex = 0
    state.userInfo.myRequests = [{
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []}, {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []}, {
      currentPage: 0,
      nextPageUrl: 'http://',
      data: []
    }]
    state.otherUserInfo = {
      token: '',
      myGiftsTabIndex: 0,
      myGifts: {
        currentPage: 0,
        nextPageUrl: 'http://',
        data: []
      },
      myNeedDonates: {
        currentPage: 0,
        nextPageUrl: 'http://',
        data: []
      },
      myNeeds: {
        currentPage: 0,
        nextPageUrl: 'http://',
        data: []
      },
      myRequestsTabIndex: 0,
      myRequests: [{
        currentPage: 0,
        nextPageUrl: 'http://',
        data: []
      }, {
        currentPage: 0,
        nextPageUrl: 'http://',
        data: []
      }, {
        currentPage: 0,
        nextPageUrl: 'http://',
        data: []
      }],
      traceUsers: {
        currentPage: 0,
        nextPageUrl: '//',
        data: []
      },
      traceGifts: {
        currentPage: 0,
        nextPageUrl: '//',
        data: []
      },
      traceNeeds: {
        currentPage: 0,
        nextPageUrl: '//',
        data: []
      },
      traceIdx: 0
    }
    localStorage.removeItem(KEY_USER_TOKEN)
  },
  resetOtherUserInfo (state) {
    state.otherUserInfo = {
      myGiftsTabIndex: 0,
      myGifts: {
        currentPage: 0,
        nextPageUrl: 'http://',
        data: []
      },
      myNeedDonates: {
        currentPage: 0,
        nextPageUrl: 'http://',
        data: []
      },
      myNeeds: {
        currentPage: 0,
        nextPageUrl: 'http://',
        data: []
      },
      myRequestsTabIndex: 0,
      myRequests: [{
        currentPage: 0,
        nextPageUrl: 'http://',
        data: []
      }, {
        currentPage: 0,
        nextPageUrl: 'http://',
        data: []
      }, {
        currentPage: 0,
        nextPageUrl: 'http://',
        data: []
      }],
      traceUsers: {
        currentPage: 0,
        nextPageUrl: '//',
        data: []
      },
      traceGifts: {
        currentPage: 0,
        nextPageUrl: '//',
        data: []
      },
      traceNeeds: {
        currentPage: 0,
        nextPageUrl: '//',
        data: []
      }
    }
  },
  login (state, {token}) {
    state.userInfo.token = token
  },
  setLoginUserInfo (state, {data}) {
    if (!data) {
      console.log('已登錄用戶數據為空')
      return
    }
    const others = JSON.parse(data.others)
    const verifyInfo = data.verify_info && JSON.parse(data.verify_info)
    const {veri_cell: veriCell, veri_mail: veriMail, veri_ppl: veriPpl} = data
    let verify = {
      mail: typeof veriMail === 'boolean' ? veriMail : (veriMail === 'Y'),
      cell: typeof veriCell === 'boolean' ? veriCell : (veriCell === 'Y'),
      ppl: typeof veriPpl === 'boolean' ? veriPpl : (veriPpl === 'Y')
    }
    verify.vip = verify.mail && verify.cell

    state.userInfo = {
      ...state.userInfo,
      ...Object.assign({}, Object.keys(data).map(key => {
        return {
          [key.replace(/_(\w{1})/, (a, b) => (b.toUpperCase()))]: data[key]
        }
      }).reduce((pre, next) => ({...pre, ...next})), {others, verifyInfo}),
      // 部分老用戶的nickname或infos均為字符串 'NULL' 因此也要替換
      nickname: data.nickname && data.nickname.replace(/null/i, ''),
      infos: data.infos && data.infos.replace(/null/i, ''),
      verify
    }
  },
  setOtherUserInfo (state, {data}) {
    if (!data) {
      console.log('mutation', data)
      console.log('查无此人')
      return
    }
    const others = JSON.parse(data.others)
    state.otherUserInfo = {
      ...state.otherUserInfo,
      ...Object.assign({}, Object.keys(data).map(key => {
        return {
          [key.replace(/_(\w{1})/, (a, b) => (b.toUpperCase()))]: data[key]
        }
      }).reduce((pre, next) => ({...pre, ...next})), {others}),
      nickname: data.nickname && data.nickname.replace(/null/i, '') ? data.nickname : '暫無',
      infos: data.infos && data.infos.replace(/null/i, '') ? data.infos : '這個傢伙很懶，什麼也沒留下~'
    }
  },
  resetLoginUserInfo () {
    state.userInfo = {
      id: 0,
      pics: '',
      catHash: 'normal',
      catId: 36,
      nickname: '',
      name: '',
      email: '',
      cellphone: '',
      phone: '',
      income: '', // 年收入
      infos: '這個傢伙很懶，什麼也沒留下~', // 自我介绍
      createTime: '',
      lastLoginTime: '',
      isGOV: false,
      isComMger: false,
      isCompany: false,
      verify: {
        cell: false,
        ppl: false, // 实名
        email: false,
        love: false // 爱箱送
      },
      others: {
        addresses: {
          meets: {
            address: '',
            city: '',
            district: ''
          },
          rcvs: {
            address: '',
            city: '',
            district: ''
          },
          things: {
            address: '',
            city: '',
            district: ''
          },
          users: {
            address: '',
            city: '',
            district: ''
          }
        },
        banks: [{
          accounts: '',
          banks: '',
          branchs: '',
          title: ''
        }, {
          accounts: '',
          banks: '',
          branchs: '',
          title: ''
        }],
        birthday: {
          value: '',
          isPub: false
        },
        jobs: {
          value: '', // 枚举值 有工作 无工作 学生
          isPub: false
        },
        childs: {
          value: false, // 是否育儿
          isPub: false
        },
        marry: {
          value: false,
          isPub: false
        },
        gender: null,
        isIPOCompany: false,
        issues: [], // 关心议题
        fami: '' // 预设全家收件
      },
      verifyInfo: {
        position: '',
        fullname: '',
        cat_hash: '',
        taxnum: '',
        no: '',
        type: '',
        purpose: '',
        advise_no: '',
        contact_tel: '',
        contact_phone: '',
        contact_name: ''
      },
      bonus: 0, // 好人点
      reviews_rate: 0, // 感谢率
      charitys: 0, // 公益捐赠
      fans: 0, // 粉丝人数
      traces: 0, // 追踪人数
      invite_code: '', // 爱箱送邀请码
      token: ''
    }
  },
  setMyGifts (state, {userId, data}) {
    const user = Number(userId) === Number(state.userInfo.id) ? 'userInfo' : 'otherUserInfo'
    state[user].myGifts = {
      ...state[user].myGifts,
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [
        ...state[user].myGifts.data,
        ...data.data
      ]
    }
  },
  setMyOtherGifts (state, {userId, data}) {
    state.otherUserInfo.myOthGifts = {
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [
        ...data.data
      ]
    }
  },
  setMyGiftsTabIndex (state, {userId, index}) {
    const user = Number(userId) === Number(state.userInfo.id) ? 'userInfo' : 'otherUserInfo'
    state[user].myGiftsTabIndex = index
  },
  setMyNeedDonates (state, {userId, data}) {
    const user = Number(userId) === Number(state.userInfo.id) ? 'userInfo' : 'otherUserInfo'
    state[user].myNeedDonates = {
      ...state[user].myNeedDonates,
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [
        ...state[user].myNeedDonates.data,
        ...data.data
      ]
    }
  },
  setMyNeeds (state, {userId, data}) {
    const user = Number(userId) === Number(state.userInfo.id) ? 'userInfo' : 'otherUserInfo'
    state[user].myNeeds = {
      ...state[user].myNeeds,
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [
        ...state[user].myNeeds.data,
        ...data.data
      ]
    }
  },
  setMyRequests (state, {userId, data, index}) {
    const user = Number(userId) === Number(state.userInfo.id) ? 'userInfo' : 'otherUserInfo'
    state[user].myRequests[index] = {
      ...state[user].myRequests[index],
      currentPage: data.current_page,
      nextPageUrl: data.next_page_url,
      data: [
        ...state[user].myRequests[index].data,
        ...data.data
      ]
    }
    state[user].myRequests = [...state[user].myRequests]
  },
  setMyRequestsTabIndex (state, {userId, index}) {
    const user = Number(userId) === Number(state.userInfo.id) ? 'userInfo' : 'otherUserInfo'
    state[user].myRequestsTabIndex = index
  },
  setTraceThing (state, {userId, type, data}) {
    // “我”追蹤的用戶，不能查看其它用戶的追蹤
    // console.log('type is', type)
    const user = Number(userId) === Number(state.userInfo.id) ? 'userInfo' : 'otherUserInfo'
    state[user][`trace${type.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}s`] = data
  },
  setUnTraceThing (state, {userId, type, data}) {
    const user = Number(userId) === Number(state.userInfo.id) ? 'userInfo' : 'otherUserInfo'
    const tmp = `trace${type.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}s`
    state[user][tmp].data = state.userInfo[tmp].data.filter(item => item[`${type === 'user' ? 'trace_user_id' : `${type}_id`}`] !== data.id)
  },
  setMyAvatar (state, {data}) {
    state.userInfo.avatar = [
      ...state.userInfo.avatar,
      data
    ]
  },
  deleteMyAvatar (state, {i}) {
    state.userInfo.avatar = state.userInfo.avatar.filter((item, index) => i !== index)
  },
  updateVerifyCellphone (state, {data}) {
    if (data.error) {
      return 'error'
    }
    state.userInfo.veriCell = 'Y'
  },
  updateVerifyEmail (state) {
    state.userInfo.veriMail = 'Y'
  },
  updateVerifyLoveBox (state) {
    state.userInfo.love = 1
  },
  setTraceUser (state, {isTrace}) {
    state.otherUserInfo = {
      ...state.otherUserInfo,
      isTracing: !isTrace
    }
  },
  setTraceIdx (state, {idx}) {
    state.userInfo.traceIdx = idx
  },
  setUserMarks (state, {type, data}) {
    state.marks = {
      ...state.marks,
      [type]: {
        curPage: data.current_page,
        data: [...data.data]
      }
    }
  },
  setMarksCurIdx (state, idx) {
    state.marks.curIdx = idx
  }
}

export default {
  state,
  actions,
  mutations
}
