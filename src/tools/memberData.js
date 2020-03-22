/**
 * check user required data
 */
export default {
  isValid (state) {
    const userState = state.user.userInfo

    /* Name, Nickname, Phone */
    if (!(userState.nickname || userState.name)) {
      return false
    }
    if (!userState.cellphone) {
      return false
    }

    if (!userState.others) {
      return false
    }

    if (userState.others) {
      const {addresses} = userState.others
      if (!addresses) {
        return false
      }
      if (addresses) {
        const {users, things, rcvs} = addresses
        /* Address( users, things, rcvs ) */
        if (Object.values(users).includes('')) {
          return false
        }
        if (Object.values(things).includes('')) {
          return false
        }
        if (Object.values(rcvs).includes('')) {
          return false
        }
      }
    }
    /* nice */
    return true
  },
  isValidBaseInfo (state) {
    const userState = state.user.userInfo
    /* Name, Nickname, Phone */
    if (!(userState.nickname || userState.name)) {
      return false
    }
    if (!userState.cellphone) {
      return false
    }
    return true
  },
  isValidAdr (state) {
    const userState = state.user.userInfo
    if (!userState.others) {
      return false
    }

    if (userState.others) {
      const {addresses} = userState.others
      if (!addresses) {
        return false
      }
      if (addresses) {
        const {users, things, rcvs} = addresses
        if (!users || Object.values(users).includes('')) {
          return false
        }
        if (!things || Object.values(things).includes('')) {
          return false
        }
        if (!rcvs || Object.values(rcvs).includes('')) {
          return false
        }
      }
    }
    return true
  }
}
