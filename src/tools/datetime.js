/**
 * Created by lxhfight on 2018/4/8.
 * Email:
 * Description:
 *
 */
export const DATE_TIMESTAMP = 24 * 60 * 60 * 1000

export const compareDate = (str1, str2) => {
  const _getDateTimeStamp = (dateStr) => {
    const date = new Date(dateStr)
    const str = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    return new Date(str).getTime()
  }
  const date1 = _getDateTimeStamp(str1)
  const date2 = _getDateTimeStamp(str2)
  return Math.floor((date1 - date2) / DATE_TIMESTAMP)
}

export const getSmartDate = (str) => {
  if (!str) {
    console.warn('the param is undefined or null', str)
    return '-'
  }
  let datetime = `${str.split(' ')[0].split('-').join('/')} ${str.split(' ')[1]}`
  let year = new Date(datetime).getFullYear()
  let month = new Date(datetime).getMonth() + 1
  let date = new Date(datetime).getDate() >= 10 ? new Date(datetime).getDate() : `0${new Date(datetime).getDate()}`
  let hour = new Date(datetime).getHours() >= 10 ? new Date(datetime).getHours() : `0${new Date(datetime).getHours()}`
  let minute = new Date(datetime).getMinutes() >= 10 ? new Date(datetime).getMinutes() : `0${new Date(datetime).getMinutes()}`
  let count = compareDate(new Date(), datetime)
  const onlyDate = (new Date().getFullYear()) === year
  switch (count) {
    case 0:
      return `${hour}:${minute}`
    case 1:
      return `昨天 ${hour}:${minute}`
    case 2:
      return `前天 ${hour}:${minute}`
    default:
      return onlyDate ? `${month >= 10 ? month : '0' + month}.${date} ${hour}:${minute}`
        : `${year}.${month >= 10 ? month : '0' + month}.${date}`
  }
  // if (onlyDate) {
  //   switch (count) {
  //     case 0:
  //       return `今天`
  //     case 1:
  //       return `昨天`
  //     case 2:
  //       return `前天`
  //     default:
  //       return `${year}.${month >= 10 ? month : '0' + month}.${date}`
  //   }
  // } else {
  //   switch (count) {
  //     case 0:
  //       return `${hour}:${minute}`
  //     case 1:
  //       return `昨天 ${hour}:${minute}`
  //     case 2:
  //       return `前天 ${hour}:${minute}`
  //     default:
  //       return `${month >= 10 ? month : '0' + month}.${date} ${hour}:${minute}`
  //   }
  // }
}

export const getDate = (str, format) => {
  let date
  (str) ? date = new Date(str) : date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
  if (format.indexOf('-') !== -1) {
    return `${year}-${month >= 10 ? month : '0' + month}-${day}`
  } else if (format.indexOf('/') !== -1) {
    return `${year}/${month >= 10 ? month : '0' + month}/${day}`
  } else if (format.indexOf('.') !== -1) {
    return `${year}.${month >= 10 ? month : '0' + month}.${day}`
  }
}

export const dateStandard = (dateStr, isReg = false) => {
  let rtn = ''
  if (dateStr) {
    // let _tmp = isReg && new Date(new Date(dateStr).getTime()+ (15 * 24 * 60 * 60 * 1000));
    // const str = isReg ? dateFormat(_tmp, 'yyyy-mm-dd hh:mm:ss') : dateStr.toString();
    const str = dateStr.toString()
    const a = str.split(' ')
    const d = a[0] ? a[0].split('-') : [0, 0, 0]
    const t = a[1] ? a[1].split(':') : [0, 0, 0]
    let date = new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2])
    if (isReg) {
      (date = new Date(date.getTime() + (15 * 24 * 60 * 60 * 1000)))
    }
    rtn = date
  }
  return rtn
}
