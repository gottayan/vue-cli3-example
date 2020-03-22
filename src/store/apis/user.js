import fetch from '../../tools/axios'

export default {
  getLoginUserInfo (cb) {
    return fetch('get', '/user/info', {}, cb)
  },
  getUserInfo (id, cb) {
    return fetch('get', `/user/${id}`, {}, cb)
  },
  // 我的送礼物
  getUserGives (userId, cb) {
    // const perPage = 20
    // const status = ['ongoing', 'pending', 'finish', 'pull_off']
    // const specialUrl = `needDonate?user_id=${userId}&status=finished,thanks&perPage=${perPage}`
    // const url = status.map(item => {
    //   return `/gifts?page=1&user_id=${userId}&status=${item}&perPage=${perPage}`
    // }).concat(specialUrl)

    // [
    //   `/gifts?page=1&user_id=${userId}&status=finish&perPage=${perPage}`,
    //   `/gifts?page=1&user_id=${userId}&status=pending&perPage=${perPage}`,
    //   `/gifts?page=1&user_id=${userId}&status=pull_off&perPage=${perPage}`,
    //   `/gifts?page=1&user_id=${userId}&status=ongoing&perPage=${perPage}`,
    //   `needDonate?user_id=${userId}&status=finished,thanks`
    // ]
    // return fetch('get', `/gifts/`)
  },
  getUserGifts (page, userId, cb) {
    const url = `/gifts?page=${page}&user_id=${userId}&perPage=10`
    return fetch('get', url, {}, cb)
  },
  getUserNeedDonates (page, userId, cb) {
    const url = `/needDonate?page=${page}&user_id=${userId}&perPage=10`
    return fetch('get', url, {}, cb)
  },
  getUserNeeds (page, userId, cb) {
    const url = `/needs?page=${page}&user_id=${userId}&perPage=10`
    return fetch('get', url, {}, cb)
  },
  getUserRequests (page, userId, status, cb) {
    const url = `/giftRequest?page=${page}&user_id=${userId}&perPage=10&status=${status}`
    return fetch('get', url, {}, cb)
  },
  getTraceThing (type, cb) {
    const _type = {
      user: 'Users',
      gift: 'Gifts',
      need: 'Needs'
    }[type]
    const url = `/user/trace${_type}?perPage=100`
    return fetch('get', url, {}, cb)
  },
  unTraceThing (id, type, cb) {
    // console.log('取消追踪 type', type)
    const key = type === 'user' ? 'trace_user' : type
    const url = type === 'user' ? 'user' : `${type}s`
    const data = {
      [`${key}_id`]: id
    }
    return fetch('post', `/${url}/untrace`, {data}, cb)
  },
  changePassword (oldpw, newpw, cb) {
    const data = {
      old_password: oldpw,
      new_password: newpw
    }
    return fetch('post', '/user/changePassword', {data}, cb)
  },
  resetpassword (email, cb) {
    const data = {
      email
    }
    return fetch('post', '/user/forgetPassword', {data}, cb)
  },
  // 手机注册用户的找回密码
  resetcellphonepassword (cellphone, password, repeatPassword, token, cb) {
    const data = {
      cellphone,
      password,
      repeat_password: repeatPassword,
      token
    }
    return fetch('post', '/phone/forgetPassword', {data}, cb)
  },
  // 编辑资料
  modify (data, cb) {
    return fetch('post', '/user/modify', {data}, cb)
  },
  sendCodeVerifyCellPhone (cellphone, cb) {
    const data = {
      cellphone
    }
    return fetch('post', '/user/verifyCellphoneSendCode', {data}, cb)
  },
  confirmVerifyCellPhone (cellphone, token, cb) {
    const data = {
      cellphone,
      token
    }
    return fetch('post', '/user/verifyCellphone', {data}, cb)
  },
  sendVerifyEmail (email, cb) {
    return fetch('post', '/user/verifyEmailSend', {email}, cb)
  },
  confirmVerifyEmail (usrHash, token, cb) {
    return fetch('get', `/user/verifyEmail?user_id=${usrHash}&token=${token}`, {}, cb)
  },
  confirmVerifyName (idImage, docImage, cb) {
    const data = {
      front: idImage,
      back: docImage
    }
    return fetch('post', '/user_identities', {data}, cb)
  },
  confirmVerifyLoveBox (code, cb) {
    const data = {
      invite_code: code
    }
    return fetch('post', '/love/user/bind', {data}, cb)
  },
  // 会员变更
  changeUserRoles (data, cb) {
    return fetch('post', '/user_roles', {data}, cb)
  },
  // 好壞名單
  getUserMarks (type, cb) {
    return fetch('get', `/user_marks?type=${type}&perPage=100`, {}, cb)
  },
  cancelMark (userId, cb) {
    const data = {
      mark_user_id: userId
    }
    return fetch('post', '/user/cancelMark', {data}, cb)
  },
  makeMarks (content, userId, type, cb) {
    const data = {
      content,
      mark_user_id: userId,
      type
    }
    return fetch('post', '/user/mark', {data}, cb)
  },
  traceUser (isTrace, userId, cb) {
    const data = {
      trace_user_id: userId
    }
    return fetch('post', `/user/${isTrace ? 'untrace' : 'trace'}`, {data}, cb)
  },
  updateConnect (data, cb) {
    return fetch('post', '/transfer', {data}, cb)
  }
}
