// import { errorMap } from '../tools/http'

const checkUserInfoMixin = {
  methods: {
    preventRequest () {
      // const requireKey = [
      //   'cellphone'
      // ]
      // const isLogin = !!this.$store.state.user.userInfo.token
      // console.log('isLogin!!!!!!!!!!!!!!!!', isLogin)
      // const flag = requireKey.every(key => this.$store.state.user.userInfo[key])
      // if (!isLogin) {
      //   this.$vux.toast.show({
      //     type: 'text',
      //     position: 'bottom',
      //     width: '10em',
      //     text: errorMap('LOGIN_BEFORE_ACTION')
      //   })
      //   this.$router.replace('/login')
      // } else if (!flag) {
      //   this.$vux.toast.show({
      //     type: 'text',
      //     position: 'bottom',
      //     width: '11em',
      //     text: errorMap('FULLFIL_IN_BEFORE_ACTION')
      //   })
      // }
      return 1
    }
  }
}

export default checkUserInfoMixin
