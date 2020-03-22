<!-- 登錄頁面 -->
<template>
  <div class="g-block login">
    <div class="pad-login">
      <header class="banner"></header>
      <div class="pad-info">
        <group class="row-email">
          <x-input placeholder="請輸入手機號或郵箱"
                   required
                   type="text"
                   v-model.trim="info.account">
            <span slot="label"
                 class="icon-label">
            </span>
          </x-input>
        </group>
        <group class="row-password">
          <x-input title="title"
                   type="password"
                   required
                   placeholder="請輸入密碼"
                   v-model.trim="info.password">
            <span slot="label"
                  class="icon-label">
            </span>
            <button
              slot="right"
              @click="$router.push('/resetpw')"
              class="btn-forgot-password">忘記密碼</button>
          </x-input>
        </group>
        <button class="g-button btn-to-login red"
                @click="doLogin"
                :disabled="!(info.account && info.password) && loginLoading">
          登入
        </button>
        <div class="row row-to-register">
          還沒加入贈物網？ <span @click="toRegister">快速註冊</span>
        </div>
        <!-- <div class="row tip-for-login" style="text-align: center;margin-top: 5px;">
          公益團體/機構請以電子信箱註冊
        </div> -->
        <div class="row row-and">
          <span>OR</span>
        </div>
        <div class="row" @click="toggleSNSLogin" style="text-align: center">其他登入方式</div>
      </div>
      <icon
        @click.native="() => $router.replace('/')"
        class="back-icon"
        type="cancel">
      </icon>
    </div>
    <span class="tip-for-login">
      登入/註冊為會員，即代表您已同意本站之 <span><router-link to="/service-protocol">服務條款</router-link></span>
    </span>
    <x-dialog
      v-model="showPreventDialog"
      hide-on-blur
      class="prevent-login-dialog-container"
      :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent', 'overflow': 'auto'}">
      <p class="dialog-content" @click="hideDialog">
        <!-- <span data-order="1" class="prevent-login-dialog">點擊右上角<i class="three-dot">“...”</i>按鈕</span>
        <br>
        <br>
        <span data-order="2" class="prevent-login-dialog">選擇“在瀏覽器中打開”</span>
        <br>
        <span style="padding-left: 32px">或點擊“拷貝網址”，打開系統瀏覽器“貼上並前往”</span>
        <br> -->
        由於您從第三方位置登入，請先複製網址，開啟Chrome/Safari或其他瀏覽器，貼上網址，即可順利登入。
      </p>
      <img class="btn-close" @click="hideDialog" src="@/assets/icon/extort/com_list_ic_picture_delete_normal@2x.png" alt="">
    </x-dialog>
    <div v-transfer-dom>
      <popup v-model="actionsheetVisible" height="126px" is-transparent>
        <div style="width: 95%;height:250px;margin:0 auto;border-radius:5px;background: white;">
          <fb-login style="width: 100%;border-radius: 0">
          </fb-login>
          <google-login style="width: 100%;border-radius: 0">
          </google-login>
          <div @click="toggleSNSLogin" style="height: 42px;line-height: 42px;clear: both;text-align: center;">
            取消
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import { XDialog, Icon, Popup, TransferDom } from 'vux'
import Enter from './../../store/apis/enter'
import FbLogin from '@/components/FbLogin.vue'
import GoogleLogin from '@/components/GoogleLogin.vue'
import { local, session, KEY_LOGIN_INFO, KEY_USER_TOKEN } from './../../tools/storage'
import { mapActions, mapState } from 'vuex'
import { isPhone } from '@/tools/strMap'

export default {
  directives: {
    TransferDom
  },
  components: {
    FbLogin,
    GoogleLogin,
    XDialog,
    Icon,
    Popup
  },
  data () {
    return {
      info: {
        account: '',
        password: ''
      },
      loginLoading: false,
      actionsheetVisible: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    showPreventDialog () {
      return this.$store.state.configs.showPreventDialog
    }
  },
  methods: {
    ...mapActions({
      getLoginUserInfo: 'getLoginUserInfo',
      getMessageStatus: 'getMessageStatus',
      getDealsCategory: 'getDealsCategory'
    }),
    toggleSNSLogin () {
      this.actionsheetVisible = !this.actionsheetVisible
    },
    hideDialog () {
      this.$store.commit('togglePreventLoginDialog', {value: false})
    },
    toRegister () {
      const redirect = this.$route.query.redirect
      if (redirect) {
        session.save('redirect', redirect)
      }
      this.$router.push('/register')
    },
    doLogin (data, event) {
      if (this.loginLoading) {
        return this.$vux.toast.text('正在登入...', 'bottom')
      }

      if (!this.info.account) {
        return this.$vux.toast.text('請輸入手機號或郵箱', 'bottom')
      }
      if (!this.info.password) {
        return this.$vux.toast.text('請輸入密碼', 'bottom')
      }

      this.loginLoading = true
      const newIsPhone = isPhone(this.info.account)
      const tmp = newIsPhone ? 'phoneLogin' : 'login'
      Enter[tmp]({
        [`${newIsPhone ? 'cellphone' : 'email'}`]: this.info.account,
        password: this.info.password
      }, (data) => {
        const bundle = { account: this.info.account }
        local.save(KEY_LOGIN_INFO, bundle)
        this.loginLoading = false
        if (!data) {
          return
        }
        if (data.error) {
          console.log(data.error)
          this.$vux.toast.show({
            type: 'text',
            position: 'bottom',
            text: `${data.code === 215 ? '當前帳戶已被暫停使用：' : ''}${data.error}`
          })
        } else {
          const token = data.token
          local.save(KEY_USER_TOKEN, token)
          this.$store.commit('login', { token })
          this.getMessageStatus()
          this.getDealsCategory()
          let redirect = this.$route.query.redirect
          if (redirect) {
            if (!redirect.includes('feedback')) {
              this.getLoginUserInfo()
              return this.$router.replace(`${redirect || '/'}`)
            }
            this.getLoginUserInfo({
              cb: () => {
                redirect = `/user/${this.userInfo.id}/feedback`
                this.$vux.toast.hide()
                this.$router.replace(`${redirect || '/'}`)
              }
            })
          } else {
            return this.$router.replace('/')
          }
        }
      })
    }
  },
  mounted () {
    let bundle = local.get(KEY_LOGIN_INFO, true)
    const { tips } = this.$route.query
    bundle && (this.info.account = bundle.account)
    tips && this.$vux.toast.text(tips, 'bottom')
    const reg = /(Line|MicroMessenger|FBDV)/ig
    this.$store.commit('toggleWebView', {value: reg.test(navigator.userAgent)})
  }
}
</script>
<style lang="less">
  .login{
    .weui-cells {
      border-bottom: 1px solid @color-CL;
      .weui-cell {
        padding-left: 0;
        padding-right: 0;
        font-size: @font-S2;
      }
      &:before {
        display: none;
      }
      &:after {
        width: 0;
        transition: width .4s;
      }
      &:hover {
        &:after {
          width: 100%;
          background-color: @color-CR;
          margin: 0 auto;
          height: 4px;
          bottom: -1px;
        }
      }
    }

    .vux-tab{
      box-sizing: content-box;
    }
    .weui-mask{
      background-color: rgba(0, 0, 0, .85)
    }
  }
</style>

<style lang="less" scoped>
  @import "./../../global.style.less";
  .pad-login {
    position: relative;
    background-color: white;
    border-radius: @border-radius-bg;
    overflow: hidden;
    .back-icon{
      position: absolute;
      top: @pm-sm;
      right: @pm-sm;
      z-index: 2;
      &:before{
        margin: 0;
        color: #FFFF;
      }
    }
    .banner {
      height: 160px;
      width: 100%;
      display: block;
      background-image: url("../../assets/img/bg-login-banner.jpg");
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    .btn-forgot-password {
      font-size: @font-S2;
      color: @color-CR;
      background-color: transparent;
      border: none;
    }
    .pad-info {
      padding: @pm-bg @pm-bg @pm-lg;
      .icon-label {
        height: 20px;
        width: 20px;
        margin-right: @pm-md;
        float: left;
        background-size: 100% 100%;
      }
    }
    .btn-to-login {
      margin-top: 2 * @pm-lg;
    }
    .row-to-register {
      color: @color-font-C1;
      text-align: center;
      margin-top: @pm-lg;
      span {
        color: @color-CR;
      }
    }
    .row-and {
      color: @color-font-C3;
      margin: 2*@pm-md 0;
      text-align: center;
    }
  }
  .row-email  {
    .icon-label { background-image: url('./../../assets/icon/enter/icon-name.png'); }
    &:hover .icon-label { background-image: url('./../../assets/icon/enter/icon-name-focus.png'); }
  }
  .row-password  {
    .icon-label { background-image: url('./../../assets/icon/enter/icon-password-confirm.png'); }
    &:hover .icon-label { background-image: url('./../../assets/icon/enter/icon-password-confirm-focus.png'); }
  }
  .tip-for-login {
    color: @color-font-C3;
    margin-top: @pm-bg;
    font-size: @font-S3;
    display: block;
    a {
      color: @color-CO;
    }
  }

  .dialog-content{
    width: 230px;
    margin: 0 auto;
    color:#fff;
    text-align: left;
    font-size: 20px;
  }

  .three-dot{
    font-weight: bold;
  }

  .prevent-login-dialog-container{
    .dialog-content > span{
      display: inline-block;
    }
  }

  .prevent-login-dialog{
    &::before{
      content: attr(data-order);
      display: inline-block;
      color: white;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      background-color: #ffa507;
      text-align: center;
      font-size: 14px;
      vertical-align: top;
      line-height: 22px;
      margin-right: 10px;
    }
  }

  .btn-close{
    position: fixed;
    top: 0;
    right: 0;
    width: 40px;
    // margin-top: 20px;
    padding: 20px;
    box-sizing: content-box;
  }
</style>
