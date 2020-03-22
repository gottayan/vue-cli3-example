<template>
  <div class="g-block change-login">
    <div class="pad-change-login" v-if="!changeSuccess">
      <div class="linear-gradent">
        <div class="desc-wrapper">
          <span class="desc">提示：由於Google+服務即將關閉，2019年3月7日之後將無法使用Google+登入。為保護您的帳號安全，我們建議您立即更換為手機登入。</span>
        </div>
      </div>
      <div class="pad-info">
        <section >
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
        <button class="g-button btn-to-register red"
          @click="doChangeLogin"
          :disabled="isAbleConfirm ? false : true">
          確認送出
        </button>
      </div>
    </div>
    <div class="pad-change-success" v-else>
      <msg
        title="您已更換為手機登入！"
        description="您現在可以使用手機號碼+密碼的登入方式了~"
        :buttons="[{
          type: 'primary',
          text: '回到首頁',
          link: '/'
        }]"
        ></msg>
    </div>
  </div>
</template>

<script>
import { isPhone } from './../../tools/strMap'
import Enter from './../../store/apis/enter'
import { errorMap } from '@/tools/http'
import { passwordRegex } from '@/tools/regex'
import { mapState } from 'vuex'
import { Msg } from 'vux'

export default {
  components: {
    Msg
  },
  data () {
    return {
      leftTime: 60,
      isSendCodedisable: false,
      info: {
        cellphone: '',
        nickname: '',
        token: '',
        password: '',
        repeat_password: ''
      },
      nickname: '', // 把nickname单独放出来，v-model="info.nickname"在iOS设备上数据更新后会自动失焦隐藏掉输入法
      password: '',
      repeat_password: '',
      isAbleConfirm: false,
      changeSuccess: false,
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
  created () {
    if (this.userInfo) {
      this.info.cellphone = this.userInfo.cellphone
      this.nickname = this.userInfo.nickname
    }
  },
  watch: {
    userInfo: function (newUser, oldUser) {
      this.info.cellphone = newUser.cellphone
      this.nickname = newUser.nickname
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
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
      }).catch(err => {
        console.log(err)
        this.isSendCodedisable = false
      })
    },
    validatePw () {
      this.$vux.toast.show({
        text: '最少應該輸入6個字符，需包含英文和數字喔~',
        type: 'text',
        position: 'bottom'
      })
    },
    validateData () {
      const { cellphone, token } = this.info
      if (!isPhone(cellphone)) {
        this.isAbleConfirm = false
        return null
      }

      if (!this.nickname) {
        this.isAbleConfirm = false
        return null
      }

      if (!passwordRegex.test(this.password) || this.password !== this.repeat_password) {
        this.isAbleConfirm = false
        return null
      }

      if (token.length !== 6) {
        this.isAbleConfirm = false
        return null
      }

      this.isAbleConfirm = true
    },
    doChangeLogin () {
      this.$vux.loading.show({
        text: '正在送出中...'
      })

      Enter.changeTypeToPhone({
        cellphone: this.info.cellphone,
        password: this.password,
        repeat_password: this.repeat_password,
        nickname: this.nickname,
        token: this.info.token
      }).then((data) => {
        this.$vux.loading.hide()
        if (data.error) {
          this.$vux.toast.text(errorMap(data.error), 'bottom')
        } else {
          this.$store.dispatch('getLoginUserInfo')
          this.changeSuccess = true
        }
      })
    }
  }
}
</script>
<style lang="less">
  .pad-info {
    .weui-icon-success {
      color: @color-CO;
    }
    .weui-btn_primary {
      background-color: @color-CO;
      &:not(.weui-btn_disabled):active {
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
  }
  .pad-change-success {
    .weui-icon-success {
      color: #ffa507;
    }

    .weui-btn_primary {
      background-color: #ffa507;
    }
  }
</style>
<style lang="less" scoped>
  @import "./../../global.style.less";
  .pad-change-login {
    position: relative;
    background-color: white;
    border-radius: @border-radius-bg;
    overflow: hidden;

    .linear-gradent {
      height: 100px;
      border-radius: 10px 10px 0 0;
      background-image: linear-gradient(to top, #DB471A, #F3762A);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .desc-wrapper{
      padding: 0 15px;
      display: flex;
      flex-direction: column;
    }

    .desc {
      text-align: center;
      display: block;
      color: white;

      &:last-child{
        font-size: 14px;
      }
    }
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

  .row-password {
    .icon-label { background-image: url('./../../assets/icon/enter/icon-password.png'); }
    &:hover .icon-label { background-image: url('./../../assets/icon/enter/icon-password-focus.png'); }
  }
  .row-password-confirm {
    .icon-label { background-image: url('./../../assets/icon/enter/icon-password-confirm.png'); }
    &:hover .icon-label { background-image: url('./../../assets/icon/enter/icon-password-confirm-focus.png'); }
  }
  .row-nickname {
    .icon-label { background-image: url('./../../assets/icon/enter/icon-nickname.png'); }
    &:hover .icon-label { background-image: url('./../../assets/icon/enter/icon-nickname-focus.png'); }
  }
  .row-cellphone {
    .icon-label { background-image: url('./../../assets/icon/enter/login_ic_phone_normal.png') }
    &:hover .icon-label { background-image: url('./../../assets/icon/enter/login_ic_phone_selected.png'); }
  }
  .row-code {
    .icon-label { background-image: url('./../../assets/icon/enter/login_ic_code_normal.png') }
    .right-text { color: #E2462C;}
    &:hover .icon-label { background-image: url('./../../assets/icon/enter/login_ic_code_selected.png'); }
  }
</style>
