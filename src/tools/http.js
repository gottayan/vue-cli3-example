/**
 * Created by lxhfight on 2018/4/3.
 * Email: lxhfight1@gmail.com
 * Description:
 *    提供各种和HTTP請求相關的工具方法
 */

export const errorMap = (str) => {
  switch (str) {
    case 'PASSWORD_ERROR':
      return '會員密碼錯誤'
    case 'EMAIL_NOT_EXISTS':
      return '該郵箱不存在，請重新輸入'
    case 'SIGNUP_EMAIL_EXISTS':
      return '註冊郵箱已存在'
    case 'INVAILD_TOKEN':
      return '請重新登入'
    case 'LOGIN_BEFORE_ACTION':
      return '請先登入/註冊會員'
    case 'FULLFIL_IN_BEFORE_ACTION':
      return '請先完善會員基本資料'
    case 'PHONE_NOT_FOUND':
      return '手機號未註冊'
    case 'NO_VERIFICATION_CODE':
      return '無效的驗證碼'
    case 'PASSWORD_NOT_SAME':
      return '兩次密碼輸入不一致'
    case 'CELLPHONE_HAS_BEEN_TAKEN':
      return '手機已被註冊或綁定'
    case 'PHONE_VERIFICATION_WRONG':
      return '手機驗證碼錯誤'
    case 'INVALID_INVITE_CODE':
      return '愛箱送綁定碼錯誤'
    case 'PASSWORD_UNCHANGED':
      return '新密碼不能與上次密碼相同'
    case 'TOKEN_INVALID':
      return '請先登入'
    case 'LOGIN_TYPE_ERROR':
      return '請使用您註冊的方式登入'
    case 'EC_DATA_FORMAT_WRONG':
      return '掌櫃訂單數據異常'
    case 'NOT_FOUND_CABINETS':
      return '當前地區暫未提供掌櫃服務'
    case 'GIFT_NOT_FOUND':
      return '禮物不存在'
    case 'NEED_NOT_FOUND':
      return '需求不存在'
    case 'TOKEN_EXPIRED':
      return '登入過期，請重新登入'
    case 'GIFT_LEFT_NOT_ENOUGH':
      return '禮物剩餘數量不足'
    case 'REPEATED_ADDITION':
      return '您已參與本次活動，不可重複參與，去給喜歡的作品送愛心吧~'
    case 'GIFT_HAS_BEEN_DELETED':
      return '抱歉，此礼物您無法瀏覽...'
    case 'NEED_HAS_BEEN_DELETED':
      return '抱歉，此需求您無法瀏覽...'
    case 'EDCODE_IS_NULL':
      return '請求錯誤，掌櫃櫃機信息不完整'
    case 'GIVER_SENT_AT_IS_NULL':
      return '請選擇新竹物流上門取件日期'
    case 'CANT_LOGIN_BECAUSE_EMAIL_USED':
      return '請使用您註冊時選擇的方式登入網站哦～'
    case 'CANT_LOGIN_BECAUSE_EMAIL_USED_BY_FACEBOOK_LOGIN':
      return '您的賬號為FB註冊方式，請使用FB登入'
    case 'CANT_LOGIN_BECAUSE_EMAIL_USED_BY_GOOGLE_LOGIN':
      return '您的賬號為G+註冊方式，請使用G+登入'
    case 'CANT_LOGIN_BECAUSE_EMAIL_USED_BY_EMAIL_LOGIN':
      return '您的賬號為信箱註冊方式，請使用信箱密碼登入'
  }
  return str
}
