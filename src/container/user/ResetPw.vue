<template>
  <div class="resetpw-container">
    <x-header @on-click-back="goBack" :title="$route.meta.title">
    </x-header>
    <section v-if="step === 0" class="resetpw-step-first">
      <!-- <h2>忘記密碼了嗎？</h2> -->
      <!-- <p>填寫正確的郵箱，系統將確認您的身份</p> -->
      <x-input
        ref="user_account"
        :min="4"
        title="註冊帳號"
        placeholder="請輸入註冊時使用的帳號"
        v-model="account">
      </x-input>
      <button @click="sendResetCode" class="g-button red" :disabled="isSendCodedisable">確定</button>
    </section>
    <section v-if="step === 1" class="resetpw-step-second">
      <h2>傳送成功</h2>
      <p>密碼重設信已經發至你當初註冊的Email</p>
      <p>請於30分鐘內點擊信中的連結完成新的密碼設定。期待很快看到你回來！</p>
      <button @click="goBack" class="g-button red">關閉視窗</button>
    </section>
    <section v-if="step === 2" class="resetpw-step-third">
      <div class="title">歡迎回來</div>
      <div class="title">為你的帳號設定一個新密碼吧！</div>
      <group>
        <x-input
          title="新密碼"
          :min="6"
          aria-required
          required
          aria-placeholder="至少6字英數字組合"
          placeholder="至少6字英數字組合"
          v-model="newPassword"
        >
        </x-input>
      </group>
      <button class="g-button red">設定新密碼</button>
      <router-link to="/login" replace class="reset-gohome">回到登入畫面</router-link>
    </section>
    <section v-if="step === 3">
      <div class="show-detail-panel">
        <span>您的手機號碼</span>
        <span class="resetpw-phone">{{ account }}</span>
        <span class="g-desc">驗證碼已發送至您的手機！</span>
      </div>
      <group>
        <x-input
          title="驗證碼"
          aria-placeholder="請輸入您的驗證碼"
          placeholder="請輸入您的驗證碼"
          autocomplete="off"
          aria-required
          required
          v-model="token"
          :max="6"
        >
          <span
            slot="right"
            class="resend-token"
            @click="sendResetCode"
            >{{ this.isSendCodedisable ? `${this.leftTime}s後重新發送` : '發送驗證碼' }}</span>
        </x-input>
        <x-input
          title="新密碼"
          aria-placeholder="至少6字英數字組合"
          placeholder="至少6字英數字組合"
          aria-required
          required
          v-model="password"
          :min="6"
          type="password"
        >
        </x-input>
        <x-input
          title="確認密碼"
          aria-placeholder="請再次輸入"
          placeholder="請再次輸入"
          aria-required
          required
          v-model="repassword"
          :min="6"
          type="password"
        >
        </x-input>
      </group>
      <button class="g-button red" @click="handleSubmit">確認更改</button>
    </section>
  </div>
</template>

<script>
import { XInput } from 'vux'
import { emailRegex, phoneRegex } from '@/tools/regex'
import Enter from '@/store/apis/enter'
import { errorMap } from '@/tools/http'
export default {
  components: {
    XInput
  },
  data () {
    return {
      account: '',
      newPassword: '',
      password: '',
      repassword: '',
      isSendCodedisable: false,
      isChangePwDisable: false,
      leftTime: 60,
      step: 0,
      token: ''
    }
  },
  computed: {
    formatePhone () {
      return `${this.account.slice(0, 3)}-${this.account.slice(3)}`
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    sendResetCode () {
      if (this.isSendCodedisable) {
        return this.$vux.toast.text('請在手機上查看驗證碼', 'bottom')
      }

      if (this.account) {
        if (phoneRegex.test(this.account)) {
          this.isSendCodedisable = true
          Enter.sendPhoneCode({
            cellphone: this.account,
            type: '1'
          }, (data) => {
            this.isSendCodedisable = false
            if (!data.error) {
              this.step = 3
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
            } else {
              this.$vux.toast.text('發送驗證碼失敗，請稍後再試', 'bottom')
            }
          })
        } else if (emailRegex.test(this.account)) {
          this.isSendCodedisable = true
          this.$store.dispatch('resetUserPassword', {
            email: this.account,
            cb: (data) => {
              this.isSendCodedisable = false
              if (!data.error) {
                this.step = 1
              } else {
                console.log(data)
                this.$vux.toast.text(errorMap(data.error), 'bottom')
              }
            }
          })
        } else {
          this.$vux.toast.text('請填寫正確的註冊帳號(手機號碼或郵箱)', 'bottom')
        }
      } else {
        this.$vux.toast.text('請先填寫註冊帳號', 'bottom')
        this.$refs.user_account.focus()
      }
    },
    handleSubmit () {
      if (!this.token) {
        return this.$vux.toast.text('請填寫驗證碼')
      }

      if (!this.password) {
        return this.$vux.toast.text('請填寫新密碼')
      }

      if (!this.repassword) {
        return this.$vux.toast.text('請填寫確認密碼')
      }

      if (this.repassword !== this.password) {
        return this.$vux.toast.text('兩次密碼輸入不一致')
      }
      this.$store.dispatch('resetUserCellPhonePassword', {
        cellphone: this.account,
        password: this.password,
        repeatPassword: this.repassword,
        token: this.token,
        cb: (data) => {
          if (!data.error) {
            this.$vux.toast.text('重置密碼成功！', 'bottom')
            this.$router.replace('/login')
          } else {
            console.log(data.error)
            this.$vux.toast.text('重置密碼失敗，請稍後再試', 'bottom')
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
  .resetpw-container{
    height: 100%;
    display: flex;
    flex-direction: column;
    section{
      padding: 20px 15px;

      button{
        margin-top: 20px;
      }
    }
  }

  .reset-gohome{
    color: #aaa;
    display: block;
    margin: 10px auto;
    width: 200px;
    text-align: center;
  }

  .resetpw-step-first{
    p{
      color: @color-font-C2;
      font-size: @font-S3;
    }
  }

  .resetpw-step-second{
    // padding: 20px 0;
    // padding-top: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    h2{
      color: @color-font-CR;
    }
    p{
      color: @color-font-C1;
    }
  }

  .resetpw-step-third{
    .title{
      font-size: 22px;
    }
  }

  .show-detail-panel{
    text-align: center;
    >span{
      display: block;
    }
    >span:nth-of-type(1){
      font-size: @font-S3;
    }
  }

  .resetpw-phone{
    color: @color-font-CR;
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .resend-token{
    color: @color-font-CR;
  }
</style>
