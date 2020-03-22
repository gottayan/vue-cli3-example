<!-- 登錄頁面 -->
<template>
  <div class="g-block register">
    <div class="pad-register" v-if="!registerSuccess">
      <header class="banner"></header>
      <p-icon
        @click.native="() => $router.push('/')"
        class="back-icon"
        type="cancel">
      </p-icon>
      <!-- <tab
        active-color="#E2462C"
        :line-width="2"
        prevent-default
        custom-bar-width="24px"
        @on-before-index-change="switchTabItem">
        <tab-item :selected="regActiveIndex === 0">手機註冊</tab-item>
        <tab-item :selected="regActiveIndex === 1">郵箱註冊</tab-item>
      </tab> -->
      <div class="pad-info">
        <section v-show="regActiveIndex === 0">
          <!-- 手機註冊 手機賬號 -->
          <group class="row-cellphone">
            <x-input
              aria-placeholder="請輸入手機號"
              placeholder="請輸入手機號"
              aria-required
              required
              type="tel"
              :max="10"
              :is-type="checkCellPhone"
              @on-change="validateData"
              v-model.trim="info.cellphone"
            >
              <span slot="label" class="icon-label"></span>
            </x-input>
          </group>

          <group class="row-code">
            <x-input
              aria-placeholder="請輸入驗證碼"
              placeholder="請輸入驗證碼"
              autocomplete="off"
              aria-required
              required
              type="tel"
              @on-change="validateData"
              v-model.trim="info.token"
              :max="6"
            >
              <span slot="label"
                    class="icon-label">
              </span>
              <span
                slot="right"
                class="right-text"
                @click="sendCode"
              >{{ this.isSendCodedisable ? `${this.leftTime}s後重新發送` : '發送驗證碼' }}</span>
            </x-input>
          </group>

          <group class="row-nickname">
            <x-input placeholder="請輸入20個字符內的暱稱"
                    @on-change="validateData"
                    :max="20"
                    required
                    v-model="nickname">
              <span slot="label"
                    class="icon-label">
              </span>
            </x-input>
          </group>

          <group class="row-password">
            <x-input
              aria-placeholder="請輸入6個字以上英數組合密碼"
              placeholder="請輸入6個字以上英數組合密碼"
              aria-required
              required
              :min="6"
              :max="20"
              :is-type="checkPassword"
              @on-change="validateData"
              v-model.trim="password"
              type="password"
            >
              <span slot="label"
                    class="icon-label">
              </span>
            </x-input>
          </group>

          <group class="row-password-confirm">
            <x-input
              aria-placeholder="請確認密碼"
              placeholder="請確認密碼"
              aria-required
              required
              :min="6"
              :max="20"
              :is-type="checkRePassword"
              @on-change="validateData"
              v-model.trim="repeat_password"
              type="password"
            >
              <span slot="label"
                    class="icon-label">
              </span>
            </x-input>
          </group>
        </section>
        <section v-show="regActiveIndex === 1">
          <!-- 電子郵箱 -->
          <group class="row-email">
            <x-input
              placeholder="請輸入正確的電子郵箱"
              type="email"
              is-type="email"
              required
              @on-change="validateData"
              v-model="info.email">
              <span slot="label"
                    class="icon-label">
              </span>
            </x-input>
          </group>
          <!-- 密碼 -->
          <group class="row-password">
            <x-input title="title"
                    type="password"
                    :min="6"
                    :max="20"
                    @on-change="validateData"
                    required
                    :should-toast-error="false"
                    @on-click-error-icon="validatePw"
                    placeholder="請輸入6個字以上英數組合密碼"
                    v-model="info.password">
              <span slot="label"
                    class="icon-label">
              </span>
            </x-input>
          </group>
          <!-- 密碼確認 -->
          <group class="row-password-confirm">
            <x-input title="title"
                    type="password"
                    :min="6"
                    :max="20"
                    @on-change="validateData"
                    required
                    placeholder="請確認密碼"
                    v-model="info.repeat_password">
              <span slot="label"
                    class="icon-label">
              </span>
            </x-input>
          </group>
          <!-- 真實姓名 -->
          <group class="row-name">
            <x-input placeholder="請輸入10個字符內的真實姓名"
                    :max="10"
                    @on-change="validateData"
                    required
                    v-model="info.name">
              <span slot="label"
                    class="icon-label">
              </span>
            </x-input>
          </group>
          <!-- 會員暱稱 -->
          <group class="row-nickname">
            <x-input placeholder="請輸入20個字符內的暱稱"
                    @on-change="validateData"
                    :max="20"
                    v-model="info.nickname">
              <span slot="label"
                    class="icon-label">
              </span>
            </x-input>
          </group>
          <!-- 愛箱送綁定碼 -->
          <group class="row-lovebox">
            <x-input placeholder="愛箱送綁定碼（可選）"
                    @on-change="validateData"
                    v-model="info.invite_code">
              <span slot="label"
                    class="icon-label">
              </span>
            </x-input>
          </group>
        </section>

        <div class="row tip-info" @click="doAgreeProtocol()">
           <icon scale="2.0"
                 style="float: left; margin-right: 10px"
                 :name="isAgree ? 'icon-check-selected' : 'icon-check'">
           </icon>
          我已同意贈物網 <span @click="toPage('/service-protocol')">服務條款</span>
        </div>
        <button class="g-button btn-to-register red"
                @click="doRegister"
                :disabled="isAbleRegister ? false : true">
          確認送出
        </button>
      </div>
    </div>
    <div class="pad-register-success" v-else>
      <msg
        title="註冊成功"
        :buttons="buttons"
        ></msg>
    </div>
  </div>

</template>

<script>
import { isEmail, isPhone } from './../../tools/strMap'
import Enter from './../../store/apis/enter'
import { Icon, Msg } from 'vux'
import { local, session, KEY_LOGIN_INFO, KEY_USER_TOKEN } from './../../tools/storage'
import { errorMap } from '@/tools/http'
import { passwordRegex } from '@/tools/regex'
import {mapMutations, mapState} from 'vuex'

export default {
  components: {
    PIcon: Icon,
    Msg
  },
  data () {
    return {
      // activeIndex: 0,
      buttons: [{
        type: 'primary',
        text: '完善會員資料',
        link: '/register/phone'
      }, {
        type: 'default',
        text: '逛逛網站',
        link: '/'
      }],
      registerSuccess: false,
      registerType: 'cellphone',
      leftTime: 60,
      isSendCodedisable: false,
      info: {
        email: '',
        password: '',
        invite_code: '',
        repeat_password: '',
        name: '',
        nickname: '',
        token: '',
        cellphone: ''
      },
      nickname: '', // 把nickname单独放出来，v-model="info.nickname"在iOS设备上数据更新后会自动失焦隐藏掉输入法
      password: '',
      repeat_password: '',
      isAgree: false,
      isAbleRegister: false,
      checkCellPhone: function (e) {
        return {
          valid: isPhone(e),
          msg: '請填寫正確手機號碼'
        }
      },
      checkPassword: function (e) {
        return {
          valid: passwordRegex.test(e),
          msg: '最少應該輸入6個字符，需包含英文和數字喔'
        }
      },
      checkRePassword: (e) => {
        return {
          valid: e === this.password,
          msg: '兩次輸入的密碼不同'
        }
      }
    }
  },
  methods: {
    ...mapMutations({
      setRegActiveIndex: 'setRegActiveIndex'
    }),
    switchTabItem (i) {
      // this.activeIndex = i
      this.setRegActiveIndex({index: i})
      this.registerType = this.regActiveIndex ? 'email' : 'cellphone'
    },
    sendCode () {
      if (this.isSendCodedisable) {
        return this.$vux.toast.text('請在手機上查看驗證碼', 'bottom')
      }

      if (!isPhone(this.info.cellphone)) {
        return this.$vux.toast.text('請輸入正確手機號碼', 'bottom')
      }

      this.isSendCodedisable = true
      Enter.sendPhoneCode({cellphone: this.info.cellphone, type: '0'}, (data) => {
        if (data.error) {
          this.isSendCodedisable = false
          this.$vux.toast.text(errorMap(data.error), 'bottom')
          return
        }
        this.$vux.toast.text('發送成功，請在手機上查看驗證碼', 'bottom')
        let timer = setInterval(() => {
          if (this.leftTime === 0) {
            this.isSendCodedisable = false
            this.leftTime = 60
            clearInterval(timer)
            timer = null
            return
          }
          this.leftTime = this.leftTime - 1
        }, 1000)
      })
    },
    validatePw () {
      this.$vux.toast.show({
        text: '最少應該輸入6個字符，需包含英文和數字喔~',
        type: 'text',
        position: 'bottom'
      })
    },
    doAgreeProtocol () {
      this.isAgree = !this.isAgree
      this.validateData()
    },
    toPage (path) {
      window.sessionStorage.setItem('REGISTER_INFO', JSON.stringify(this.info))
      window.sessionStorage.setItem('REGISTER_TYPE', this.regActiveIndex === 0 ? 'cellphone' : 'email')
      this.$router.push(path)
    },
    afterRegister (type) {
      const method = type === 'email' ? 'login' : 'phoneLogin'
      Enter[method]({
        [type]: this.info[type],
        password: type === 'email' ? this.info.password : this.password
      }, (data) => {
        const token = data.token
        local.save(KEY_LOGIN_INFO, { account: this.info.cellphone })
        local.save(KEY_USER_TOKEN, token)
        this.$store.commit('login', { token })
        this.$store.dispatch('getLoginUserInfo', {cb: () => {
          // this.$router.replace('/register/phone')
          const redirect = session.get('redirect')
          this.buttons = [{
            type: 'primary',
            text: '完善會員資料',
            link: '/register/phone'
          }, {
            type: 'default',
            text: '逛逛網站',
            link: `${redirect ? `/${redirect}` : '/'}`
          }]
          this.registerSuccess = true
        }})
      })
    },
    doRegister () {
      this.$vux.loading.show({
        text: '正在註冊中...'
      })

      if (this.registerType === 'email') {
        const { cellphone, token, ...info } = this.info
        Enter.signUp(info, (data) => {
          this.$vux.loading.hide()
          if (data.error) {
            this.$vux.toast.text(data.error, 'bottom')
          } else {
            window.sessionStorage.removeItem('REGISTER_INFO')
            this.afterRegister('email')
          }
        })
      } else {
        Enter.phoneSignUp({
          cellphone: this.info.cellphone,
          password: this.password,
          repeat_password: this.repeat_password,
          nickname: this.nickname,
          token: this.info.token
        }, (data) => {
          this.$vux.loading.hide()
          if (data.error) {
            this.$vux.toast.text(errorMap(data.error), 'bottom')
          } else {
            window.sessionStorage.removeItem('REGISTER_INFO')
            this.afterRegister('cellphone')
          }
        })
      }
    },
    validateData () {
      if (this.registerType === 'email') {
        const { email, password, repeat_password: repeatPassword, name, nickname } = this.info
        if (!isEmail(email)) {
          this.isAbleRegister = false
          return null
        }
        if (!passwordRegex.test(password) || password !== repeatPassword) {
          this.isAbleRegister = false
          return null
        }
        if (!name || !nickname) {
          this.isAbleRegister = false
          return null
        }
        if (!this.isAgree) {
          this.isAbleRegister = false
          return null
        }
        this.isAbleRegister = true
      } else if (this.registerType === 'cellphone') {
        const { cellphone, token } = this.info
        if (!isPhone(cellphone)) {
          this.isAbleRegister = false
          return null
        }

        if (!this.nickname) {
          this.isAbleRegister = false
          return null
        }

        if (!passwordRegex.test(this.password) || this.password !== this.repeat_password) {
          this.isAbleRegister = false
          return null
        }

        if (token.length !== 6) {
          this.isAbleRegister = false
          return null
        }

        if (!this.isAgree) {
          this.isAbleRegister = false
          return null
        }

        this.isAbleRegister = true
      }
    }
  },
  created () {
    const data = window.sessionStorage.getItem('REGISTER_INFO')
    const registerType = window.sessionStorage.getItem('REGISTER_TYPE')
    if (data) {
      this.info = JSON.parse(data)
    }
    if (registerType) {
      this.registerType = registerType
    }
    // this.activeIndex = registerType === 'cellphone' ? 0 : 1
  },
  computed: {
    ...mapState({
      regActiveIndex: state => state.enters.regActiveIndex
    })
  }
}
</script>
<style lang="less">
  .register{
    .weui-icon-success{
      color: @color-CO;
    }
    .weui-btn_primary{
      background-color: @color-CO;
      &:not(.weui-btn_disabled):active{
        background-color: @color-CO;
      }
    }
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

    .vux-tab .vux-tab-item{
      background: transparent;
    }

    .vux-tab .vux-tab-bar-inner{
      background: linear-gradient(to right, #e25443 50%, #ffa507 50%);
    }
  }
</style>
<style lang="less" scoped>
  @import "./../../global.style.less";
  .pad-register {
    position: relative;
    background-color: white;
    border-radius: @border-radius-bg;
    overflow: hidden;
    .banner {
      height: 160px;
      width: 100%;
      display: block;
      background-image: url("../../assets/img/bg-register-banner.png");
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
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
    .btn-forgot-password {
      font-size: @font-S2;
      color: @color-CR;
    }
    .pad-info {
      padding: @pm-bg @pm-bg @pm-lg;
      .icon-label {
        height: 20px;
        width: 20px;
        display: inline-block;
        margin-right: @pm-md;
        float: left;
        background-size: 100% 100%;
      }
    }
    .btn-to-register {
      margin-top: @pm-bg;
    }
    .row-to-register {
      color: @color-font-C1;
      margin-top: @pm-lg;
      span {
        color: @color-CR;
      }
    }
    .row-and {
      color: @color-font-C3;
      margin: 2*@pm-md 0;
    }
    .btn-facebook, .btn-google-plus {
      width: calc(~"50% - 7px");
      height: @height-button-md;
      border-radius: @border-radius-sm;
      border: none;
      font-size: @font-S2;
    }
    .btn-facebook {
      color: @color-FACEBOOK;
      background-color: @color-FACEBOOK-LIGHT;
    }
    .btn-google-plus {
      background-color: @color-CO-LIGHT;
      color: @color-CO;
      float: right;
    }
  }
  .tip-info {
    color: @color-font-C3;
    margin-top: @pm-bg;
    font-size: @font-S3;
    display: block;
    text-align: left;
    vertical-align: middle;
    span {
      color: @color-CO;
      vertical-align: top;
    }
  }

  .row-email  {
    .icon-label { background-image: url('./../../assets/icon/enter/icon-mail.png'); }
    &:hover .icon-label { background-image: url('./../../assets/icon/enter/icon-mail-focus.png'); }
  }
  .row-password  {
    .icon-label { background-image: url('./../../assets/icon/enter/icon-password.png'); }
    &:hover .icon-label { background-image: url('./../../assets/icon/enter/icon-password-focus.png'); }
  }
  .row-password-confirm  {
    .icon-label { background-image: url('./../../assets/icon/enter/icon-password-confirm.png'); }
    &:hover .icon-label { background-image: url('./../../assets/icon/enter/icon-password-confirm-focus.png'); }
  }
  .row-name  {
    .icon-label { background-image: url('./../../assets/icon/enter/icon-name.png'); }
    &:hover .icon-label { background-image: url('./../../assets/icon/enter/icon-name-focus.png'); }
  }
  .row-nickname  {
    .icon-label { background-image: url('./../../assets/icon/enter/icon-nickname.png'); }
    &:hover .icon-label { background-image: url('./../../assets/icon/enter/icon-nickname-focus.png'); }
  }
  .row-lovebox  {
    .icon-label { background-image: url('./../../assets/icon/enter/icon-lovebox.png'); }
    &:hover .icon-label { background-image: url('./../../assets/icon/enter/icon-lovebox-focus.png'); }
  }

  .row-cellphone{
    .icon-label { background-image: url('./../../assets/icon/enter/login_ic_phone_normal.png') }
    &:hover .icon-label { background-image: url('./../../assets/icon/enter/login_ic_phone_selected.png'); }
  }

  .row-code{
    .icon-label { background-image: url('./../../assets/icon/enter/login_ic_code_normal.png') }
    .right-text { color: #E2462C;}
    &:hover .icon-label { background-image: url('./../../assets/icon/enter/login_ic_code_selected.png'); }
  }
</style>
