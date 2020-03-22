<template>
  <div id="app">
    <keep-alive :max="10">
      <router-view v-if="$route.meta.keepAlive">
      </router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive">
    </router-view>
    <lg-preview>
    </lg-preview>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { local, KEY_USER_TOKEN } from '@/tools/storage'

export default {
  name: 'App',
  created () {
    window.addEventListener('offline', () => {
      this.$vux.toast.show({
        position: 'middle',
        text: '當前網路不穩定或已離線',
        type: 'cancel',
        time: 4000
      })
    })

    // 刷新頁面請求訊息狀態
    const token = local.get(KEY_USER_TOKEN)
    if (token && !(typeof this.msgStatus === 'boolean')) {
      this.getMessageStatus()
    }
    if (!this.mobileType) {
      let type = ''
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        type = 'ios'
      } else if (/(Android)/i.test(navigator.userAgent)) {
        type = 'android'
      } else {
        type = 'pc'
      }
      this.setMobileType({type})
    }
  },
  mounted () {
    const token = local.get(KEY_USER_TOKEN)
    if (token && !this.userId) {
      this.getLoginUserInfo({cb: this.loginCb})
    }
    if (!this.famiConfig.length) {
      this.getFamiConfig()
    }
    if (!this.palmBoxData.length) {
      this.getPalmBox({city: '', area: ''})
    }
  },
  methods: {
    ...mapActions({
      getLoginUserInfo: 'getLoginUserInfo',
      getMessageStatus: 'getMessageStatus',
      getFamiConfig: 'getFamiConfig',
      logoutCommit: 'logout',
      resetUserInfo: 'resetLoginUserInfo',
      recoverEnvMessage: 'recoverEnvMessage',
      recoverSysMessage: 'recoverSysMessage',
      getPalmBox: 'getPalmBox'
    }),
    ...mapMutations({
      setMobileType: 'setMobileType'
    }),
    loginCb (data) {
      if (data && data.user_restriction) {
        this.logoutCommit()
        this.resetUserInfo()
        this.recoverEnvMessage()
        this.recoverSysMessage()
        // 登出時清除輪詢定時器
        let localReadInterval = local.get('READ_INTERVAL', true)
        if (localReadInterval) {
          window.clearInterval(localReadInterval)
          localReadInterval = null
          local.remove('READ_INTERVAL')
        }
        this.$router.replace('/login?tips=當前帳號已被暫停使用')
      }
    }
  },
  computed: {
    ...mapState({
      msgStatus: state => state.user.msgStatus,
      famiConfig: state => state.configs.famiConfig,
      mobileType: state => state.configs.mobileType,
      userId: state => state.user.id,
      palmBoxData: state => state.things.palmBoxData.data
    })
  }
}
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import './global.style.less';
  html, body {
    height: 100%;
    width: 100%;
    max-width: @max-width;
    overflow-x: hidden;
    padding: 0;
    margin: 0 auto;
  }
  *, *:before, *:after {
    box-sizing: border-box;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
  }
</style>
