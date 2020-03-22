import configApi from '../apis/config'
// import { local, KEY_FAMI_CONFIG } from '../../tools/storage'
import toTrad from '@/tools/zh_TW'

const state = {
  areaMap: {},
  filterOptions: {
    need: {
      searchType: '',
      sort: '',
      category: ''
    },
    gift: {
      searchType: '',
      sort: '',
      category: ''
    }
  },
  famiConfig: [],
  geoConfig: [],
  mobileType: '',
  keywords: null,
  keywordsIdx: 0,
  userCategories: [],
  bonusRank: [],
  isWebView: false,
  showPreventDialog: false,
  taipeiBureauCurIdx: 1 // 台北社会局页面tab
}

const actions = {
  getGeoConfig ({commit, state}, {cb = null} = {}) {
    configApi.getGeo(
      (data) => {
        commit('setGeoConfig', {data})
        commit('setAreaMap', {data})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getFamiConfig ({commit, state}, cb) {
    configApi.getFami((data, err) => {
      commit('setFamiConfig', data && data.data)
      typeof cb === 'function' && cb(data && data.data)
    })
  },
  getSubKeyW ({commit, state}, {cb = null} = {}) {
    configApi.getSubKeyW(
      (data) => {
        commit('setSubKeyW', {data})
        cb(data)
      }
    )
  },
  batchSubKeyW ({state}, {keywords, cb}) {
    configApi.batchSubKeyW(
      keywords,
      (data) => {
        cb(data)
      }
    )
  },
  getUserCategories ({commit, state}, {cb = null} = {}) {
    configApi.getUserCategories(
      (data) => {
        commit('setUserCategories', {data})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getBonusRank ({commit, state}, {cb = null} = {}) {
    configApi.getBonusRank(
      (data) => {
        commit('setBonusRank', {data})
        if (cb) {
          cb(data)
        }
      }
    )
  },
  getShareUrl ({ commit, state }, { para = {}, cb = null } = {}) {
    configApi.getShareUrl(
      para,
      data => cb(data)
    )
  }
}

const mutations = {
  toggleWebView (state, {value}) {
    console.log('enter mutation')
    console.log(value)
    state.isWebView = value
  },
  togglePreventLoginDialog (state, {value}) {
    state.showPreventDialog = value
  },
  setMobileType (state, {type}) {
    state.mobileType = type
  },
  setAreaMap (state, {data}) {
    let obj = {}
    data.forEach(item => {
      // 每一个市变成obj，可以添加区
      obj[item.city] = {}
    })
    data.forEach(item => {
      obj[item.city][item.district] = item.id
    })
    state.areaMap = obj
  },
  setFamiConfig (state, data) {
    // console.log('the data is: ', data)
    state.famiConfig = data
  },
  setFilterOptions (state, {searchType, sort, category, poolType}) {
    if (poolType === 'need') {
      state.filterOptions = {
        ...state.filterOptions,
        need: {
          type: 'need',
          searchType,
          sort,
          category
        }
      }
    } else if (poolType === 'gift') {
      state.filterOptions = {
        ...state.filterOptions,
        gift: {
          type: 'gift',
          searchType,
          sort,
          category
        }
      }
    }
  },
  setGeoConfig (state, {data}) {
    state.geoConfig = data
  },
  setSubKeyW (state, data) {
    state.keywords = data
  },
  setUserCategories (state, data) {
    state.userCategories = data.data
  },
  setBonusRank (state, data) {
    state.bonusRank = data.data.week_bonus
  },
  setTaipeiBureauCurIdx (state, idx) {
    state.taipeiBureauCurIdx = idx
  },
  setKeywordsCurIdx (state, idx) {
    state.keywordsIdx = idx
  }
}

export const getters = {
  famiPickerData (state) {
    // if (state.famiConfig.length) {
    //   var ary = []
    //   var obj = {}
    //   ary = state.famiConfig.map(item => {
    //     let newAdr = toTrad(item.address)
    //     const area = newAdr.slice(0, 3)
    //     const leftAddress = newAdr.slice(3)
    //     let city = leftAddress.slice(0, leftAddress.match(/市|鄉|嶼|鎮|區/).index + 1)
    //     if (!(city in obj)) {
    //       obj[city] = area
    //     }

    //     return {
    //       name: item.name,
    //       value: item.code,
    //       parent: city,
    //       address: newAdr,
    //       area,
    //       city
    //     }
    //   })
    //   var areas = Object.entries(obj).map(value => value[1])
    //   areas = [...new Set(areas)].map(item => ({
    //     name: item,
    //     value: item,
    //     parent: 0
    //   })).sort(function (a, b) { return a.name.localeCompare(b.name) })

    //   var cities = Object.keys(obj).map(key => ({
    //     name: key,
    //     value: key,
    //     parent: obj[key]
    //   }))

    //   var famis = ary.map(item => ({
    //     value: item.value,
    //     name: `${item.value} ${item.name}`,
    //     parent: item.city,
    //     address: item.address
    //   }))
    //   return [...areas, ...cities, ...famis]
    // }
    if (state.famiConfig.length) {
      var ary = []
      var obj = {}
      ary = state.famiConfig.map(item => {
        let newAdr = toTrad(item.address)
        // let newAdr = item.address
        const area = newAdr.slice(0, 3)
        const leftAddress = newAdr.slice(3)
        let matchItem = leftAddress.match(/市|鄉|嶼|鎮|區/)

        let city = ''
        if (matchItem) {
          city = leftAddress.slice(0, matchItem.index + 1)
        }
        if (!(area in obj)) {
          obj[area] = []
          obj[area].push(city)
        } else if (obj[area].every(item => item !== city)) {
          obj[area].push(city)
        }

        return {
          name: item.name,
          value: item.code,
          parent: city,
          address: newAdr,
          area,
          city
        }
      })

      var areas = Object.keys(obj).map(key => ({
        name: key,
        value: key,
        parent: 0
      })).sort(function (a, b) { return a.name.localeCompare(b.name) })

      var cities = Object.keys(obj).map(key => {
        return obj[key].map(item => ({
          name: item,
          value: `${key}-${item}`,
          parent: key
        }))
      }).reduce((pre, next) => [...pre, ...next])

      var famis = ary.map(item => ({
        value: item.value,
        name: `${item.value} ${item.name}`,
        parent: `${item.area}-${item.city}`,
        address: item.address
      }))
      return [...areas, ...cities, ...famis]
    }
    return state.famiConfig
  }
  // ,
  // getUserDefaultFami: (state) => (code) => {
  //   console.log(code)
  //   const result = setDefaultFami(code[0], state.famiConfig)
  //   return result
  // }
}

export default {
  state,
  actions,
  mutations,
  getters
}
