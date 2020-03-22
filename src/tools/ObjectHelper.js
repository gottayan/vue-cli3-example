/**
 * Created by lxhfight on 2017/11/16.
 * Email:
 * Description:
 */

/**
 * 對圖片進行判斷轉換成縮略圖位置或者小圖位置
 * @param path
 * @param isSmall
 */
import toTrad from '@/tools/zh_TW'

export const smartImagePath = (path, isSmall = true) => {
  let imagePath = path
  if (!imagePath) {
    return null
  }
  const type = isSmall ? '-small' : '-big'
  if (!imagePath.includes('3-ap-southeast-1.amazonaws.com') ||
    imagePath.includes('zrockgive') ||
    imagePath.includes('/test/') ||
    (imagePath.includes('/chat/') && type === '-big')) {
    return imagePath.replace('s3-ap-southeast-1.amazonaws.com/next.give543', 'd2hrw3sjxwwsb1.cloudfront.net')
  }
  const index = imagePath.lastIndexOf('.')
  imagePath = `${imagePath.substring(0, index)}${type}${imagePath.substring(index)}`
  return imagePath.replace('s3-ap-southeast-1.amazonaws.com/next.give543', 'd2hrw3sjxwwsb1.cloudfront.net')
}

export const newestImagePath = (path, isSmall = true) => {
  let link = path
  if (!link) {
    return null
  }
  const type = isSmall ? '-small' : ''
  if (link.includes('s3-ap-southeast-1.amazonaws.com')) {
    const index = link.lastIndexOf('.')
    link = `${link.substring(0, index)}${type}${link.substring(index)}`
    return link.replace('s3-ap-southeast-1.amazonaws.com/next.give543', 'd2hrw3sjxwwsb1.cloudfront.net')
  }
  const index = link.lastIndexOf('.')
  return `${link.substring(0, index)}${type}${link.substring(index)}`
}

export const shortString = (str) => {
  if (typeof str !== 'string') {
    return '-'
  }
  if (str.length > 12) {
    return `${str.substr(0, 12)}...`
  }
  return str
}

export const queryString = (obj) => {
  if (!obj) {
    return null
  }
  let result = ''
  for (const param in obj) {
    let content = ''
    if (!obj[param] && obj[param] !== 0) {
      continue
    }
    if (Array.isArray(obj[param])) {
      if (obj[param].length === 0) {
        continue
      }
      content = obj[param].toString()
    } else {
      content = obj[param]
    }
    result += ((result) ? `&${param}=${content}` : `?${param}=${content}`)
  }
  return result
}

export const setDefaultFami = (code, famiAry, containAdr = false) => {
  const result = famiAry.find(item => item.code === code)
  let area = ''
  let city = ''
  if (result) {
    const newAdr = toTrad(result.address)
    area = newAdr.slice(0, 3)
    let leftAddress = newAdr.slice(3)
    let matchItem = leftAddress.match(/市|鄉|嶼|鎮|區/)
    if (matchItem) {
      city = leftAddress.slice(0, matchItem.index + 1)
    }
  }
  const value = [area, city, (code === '無' || !code) ? '' : code]
  return containAdr ? value.concat(result.address) : value
}

export const setDefaultPalmBox = (code, palmBoxAry) => {
  let result = {}
  let city = ''
  let dict = ''
  if (code) {
    result = palmBoxAry.find(item => item.EDCODE === code)
    city = result.CITYNAME
    dict = result.DICTNAME
  }
  return [city, dict, code]
}
