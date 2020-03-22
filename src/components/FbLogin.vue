<template>
  <button @click="FBLogin" class="btn-facebook">
    <img width="18" height="18" src="./../assets/icon/enter/icon-facebook.png" alt="iconFacebook">
    <span class="name">Facebook</span>
  </button>
</template>

<script>
import Enter from '@/store/apis/enter'
import configs from '@/tools/configs'
import { local, KEY_LOGIN_INFO, KEY_USER_TOKEN } from '@/tools/storage'

window.fbAsyncInit = () => {
  /* eslint-disable */
    FB.init({
      appId: configs.facebookAppID,
      cookie: true,
      xfbml: true,
      version: 'v2.8'
    })
  /* eslint-disable */
}

(function (d, s, id) {
  let js
  const fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) return
  js = d.createElement(s)
  js.id = id
  js.src = 'https://connect.facebook.net/en_US/sdk.js'
  fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'facebook-jssdk'))

export default {
  data () {
    return {
      isLogin: false
    }
  },
  created () {

  },
  methods: {
    // FB登錄
    FBLogin () {
      if (this.$store.state.configs.isWebView) {
        return this.$store.commit('togglePreventLoginDialog', {value: true})
      }

      if (!this.isLogin) {
        this.isLogin = true
        /* eslint-disable */
          FB.login((response) => {
            this.isLogin = false
            this.FBLoginCb(response)
          }, {scope: 'public_profile,email'})
        /* eslint-disable */
      }
    },
    // FB登錄回調
    FBLoginCb (response) {
      if (response.status === 'connected') {
        const {accessToken} = response.authResponse
        Enter.ssLogin('facebook', accessToken, (data) => {
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
            const redirect = this.$route.query.redirect
            this.$router.replace(`${redirect || '/'}`)
          }
        })
        this.$vux.loading.show({
          text: '登入中...'
        })
      } else {
        return this.$vux.toast.text('登入失敗，請稍後重試', 'bottom')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .btn-facebook{
    color: @color-FACEBOOK;
    background-color: @color-FACEBOOK-LIGHT;
    width: calc(~"50% - 7px");
    height: @height-button-md;
    border-radius: @border-radius-sm;
    border: none;
    font-size: 0;
    line-height: 42px;
    vertical-align: middle;
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
