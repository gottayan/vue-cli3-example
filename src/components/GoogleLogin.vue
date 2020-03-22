<template>
  <button @click="GoogleLogin" class="btn-google-plus">
    <img width="18" height="18" :src="iconGooglePlus" alt="iconGoogle">
    <span class="name">Google+</span>
  </button>
</template>

<script>
import Vue from 'vue'
import GoogleAuth from 'vue-google-oauth'
import Enter from '@/store/apis/enter'
import configs from '@/tools/configs'
import iconGooglePlus from '@/assets/icon/enter/icon-google-plus.png'
import { local, KEY_LOGIN_INFO, KEY_USER_TOKEN } from '@/tools/storage'
Vue.use(GoogleAuth, { client_id: configs.googleClientID })
Vue.googleAuth().load()

export default {
  data () {
    return {
      iconGooglePlus,
      isLogin: false
    }
  },
  methods: {
    // loginByGooglePlus () {
    //   return this.$vux.toast.text('功能待開發中...', 'bottom')
    // },
    // Google+登錄
    GoogleLogin () {
      if (this.$store.state.configs.isWebView) {
        return this.$store.commit('togglePreventLoginDialog', {value: true})
      }

      if (!this.isLogin) {
        this.isLogin = true
        Vue.googleAuth().directAccess()
        Vue.googleAuth().signIn((googleUser) => {
          this.isLogin = false
          this.GoogleLoginCb(googleUser)
        }, () => {
          this.isLogin = false
          return this.$vux.toast.text('登錄失敗，請稍後重試', 'bottom')
        })
      }
    },
    // Google+登錄回調
    GoogleLoginCb (googleUser) {
      const idToken = googleUser.getAuthResponse().id_token
      Enter.ssLogin('google', idToken, (data) => {
        this.$vux.loading.hide()
        const bundle = { email: data.email }
        local.save(KEY_LOGIN_INFO, bundle)
        if (!data) {
          return
        }
        if (data.error) {
          return this.$vux.toast.text(data.error === 'CANT_LOGIN_BECAUSE_EMAIL_USED' ? '請使用您註冊時選擇的方式登入網站哦～' : '', 'bottom')
        } else {
          const token = data.token
          local.save(KEY_USER_TOKEN, token)
          this.$store.commit('login', { token })
          this.$store.dispatch('getLoginUserInfo')
          // const redirect = this.$route.query.redirect
          // this.$router.replace(`${redirect || '/'}`)
          this.$router.replace('/changeLogin')
        }
      })
      this.$vux.loading.show({
        text: '登入中...'
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .btn-google-plus{
    width: calc(~"50% - 7px");
    height: @height-button-md;
    border-radius: @border-radius-sm;
    border: none;
    font-size:0;
    line-height: 42px;
    vertical-align: middle;
    background-color: @color-CO-LIGHT;
    color: @color-CO;
    float: right;
    /*filter: grayscale(100%);*/
    img {
      height: 18px;
      width: 18px;
      position: relative;
      top: 3px;
      margin-right: @pm-sm;
    }
    .name{
      font-size: @font-S2;
    }
  }
</style>
