import axios from 'axios'
import config from './configs'
import { errorMap } from './http'
import { local, KEY_USER_TOKEN } from './storage'
import router from '../router/index'

const checkTokenValid = (response, cb) => {
  if (response.status === 200) {
    if (response.data.code === 270 && response.data.error === 'CONVERSATION_OPEN_WRONG') {
      router.replace('/unauthorized')
      return
    }
    if (response.data.code === 100 && response.data.error === 'TOKEN_EXPIRED') {
      local.remove(KEY_USER_TOKEN)
      router.replace(`/login?tips=登入身份過期，請重新登入&redirect=${window.location.pathname}`)
      return
    }

    if (response.data.code === 101 && response.data.error === 'TOKEN_INVALID') {
      local.remove(KEY_USER_TOKEN)
      router.replace(`/login?tips=登入信息無效，請重新登入&redirect=${window.location.pathname}`)
      return
    }

    const { error } = response.data
    if (error) {
      response.data.error = errorMap(error)
    }
    if (cb && typeof cb === 'function') {
      cb(response.data)
    }

    return response.data
  }
}

const getUrl = (url) => {
  return config.server + config.reqlApi + url
}

const fetch = (method, url, { data, headers = {} } = {}, cb) => {
  let token = local.get(KEY_USER_TOKEN)
  const reqHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...headers
  }

  let reqConfig = {
    method,
    url: getUrl(url),
    headers: reqHeaders
  }

  if (method === 'get' || method === 'delete') {
    reqConfig.params = data
  } else {
    reqConfig.data = data
  }

  return axios(reqConfig)
    .then(res => {
      return checkTokenValid(res, cb)
    }).catch(err => {
      console.error('catch error', err, '\n')
      cb && cb(null, err)
    })
}

export const doUpload = (url, data, cb) => {
  let token = local.get(KEY_USER_TOKEN)
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`
  }

  return axios.post(getUrl(url), data, {headers})
    .then(response => {
      return checkTokenValid(response, cb)
    }).catch(err => {
      console.error('catch error', err, '\n')
      cb && cb(null, err)
    })
}

export const doGet = (url, params = {}, cb) => {
  return fetch('get', url, { data: params }, cb)
}

export const doPost = (url, data, cb) => {
  return fetch('post', url, { data }, cb)
}

export const doDelete = (url, params = {}, cb) => {
  return fetch('get', url, { data: params }, cb)
}

export const doPut = (url, data, cb) => {
  return fetch('post', url, { data }, cb)
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

export default fetch
