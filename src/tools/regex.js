/* eslint-disable */
export const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
/* eslint-disable */

export const passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/)

export const noSpaceRegex = new RegExp(/^\S+$/)

export const nameRegex = new RegExp(/\S/)

export const noNumberRegex = new RegExp(/^\D+$/)

export const phoneRegex = new RegExp(/^09\d{8}$/)

const numberOnlyRegex = new RegExp(/^\d+$/)

export const moneyRegex = numberOnlyRegex
export const accountRegex = numberOnlyRegex
export const telRegex = new RegExp(/^(\d|#|-)+$/)
export const taxnumRegex = numberOnlyRegex

export const SMSVerifyTextRegex = new RegExp(/\d{6}$/)

export const last5NumRegex = new RegExp(/^\d{5}$/)

export const last14NumRegex = new RegExp(/^\d{1,14}$/)

export const addressRegex = new RegExp(/^[\u4e00-\u9fa5a-zA-Z0-9]{4,}/)

// 会员变更
export const taxnumRegexVerify = new RegExp(/^\d{8}$/)
export const telRegexVerify = new RegExp(/^\d{9,10}$/)
