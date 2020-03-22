/**
 * Created by lxhfight on 2018/4/3.
 * Email: lxhfight1@gmail
 * Description:
 *  包含登錄和註冊接口
 */

import { doPost } from '../../tools/axios'

export default {
  login (bundle, cb) {
    return doPost(`/user/login`, bundle, cb)
  },
  phoneLogin (bundle, cb) {
    return doPost(`/phone/login`, bundle, cb)
  },
  signUp (bundle, cb) {
    return doPost(`/user/signup`, bundle, cb)
  },
  phoneSignUp (bundle, cb) {
    console.log(bundle)
    return doPost(`/phone/phoneSignup`, bundle, cb)
  },
  sendPhoneCode (bundle, cb) {
    return doPost(`/phone/identifying`, bundle, cb)
  },
  ssLogin (type, token, cb) {
    const bundle = {
      types: type.toString(),
      ss_token: token.toString()
    }
    return doPost(`/user/ssLogin`, bundle, cb)
  },
  changeTypeToPhone (bundle) {
    return doPost('/user/changeTypeToPhone', bundle)
  }
}
