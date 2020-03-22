<template>
  <div class="v-email-container">
    <x-header :title="$route.meta.title"></x-header>
    <div v-if="step === 0" class="v-email v-email-step-first">
      <x-input
        required
        aria-required="true"
        title="您的電子郵件"
        placeholder="請輸入"
        aria-placeholder="請輸入您的電子郵件"
        aria-readonly="true"
        :value="email"
        readonly
      ></x-input>
      <x-input
        v-model="code"
        title="驗證信"
        readonly
      >
        <span
          @click="sendCodeToEmail"
          :class="`${isSendCode ? 'sentCode' : 'sendCode' }`"
          slot="right"
          mini
        >
          {{ isSendCode ? `${leftTime}s` : '發送驗證信' }}
        </span>
      </x-input>
      <div class="g-desc" v-if="!email" style="margin: 0 15px;">
        請在個人資料中編輯郵箱地址
      </div>
      <div class="g-desc" style="margin: 0 15px;">
        輸入您的信箱地址，我們將會將驗證信傳送至您的信箱。
      </div>
      <div v-if="isSendCode" class="g-desc" style="margin: 0 15px;color: #e25443">
        驗證鏈接已發送，請打開信箱查收
      </div>
      <button v-if="!email" @click="goEditUserInfo" class="g-button red v-cellphone-btn-confirm">編輯資料</button>
    </div>
    <div v-else class="v-email-step-second v-email-result">
      <result-page
        :menus="[{
          text: '返回',
          func: () => {
            this.$router.go(-1)
          },
          type: 'primary'
        }]"
        title="驗證成功"
        desc=""
      >
        <div slot="desc" class="resultpage-desc">
          已完成驗證無法直接修改，如需修改請聯繫客服
        </div>
      </result-page>
    </div>
  </div>
</template>

<script>
import { XInput } from 'vux'
import ResultPage from '@/components/ResultPage'
export default {
  components: {
    XInput,
    ResultPage
  },
  computed: {
    email () {
      return this.$store.state.user.userInfo.email
    }
  },
  data () {
    return {
      code: '',
      isSendCode: false,
      leftTime: 60,
      step: 0
    }
  },
  methods: {
    goEditUserInfo () {
      this.$router.push('/')
    },
    sendCodeToEmail () {
      if (this.email) {
        this.$store.dispatch('sendVerifyEmail', {
          cb: (data) => {
            this.isSendCode = true
            this.$vux.toast.text('驗證信發送成功', 'bottom')
            const timer = setInterval(() => {
              --this.leftTime
              if (this.leftTime === 0) {
                this.isSendCode = false
                this.leftTime = 60
                clearInterval(timer)
              }
            }, 1000)
          }
        })
      }
    }
  },
  created () {
    const flag = this.$store.state.user.userInfo.veriMail === 'Y'
    if (flag) {
      this.step = 1
      return
    }

    const { query } = this.$route
    if (query.hash && query.code) {
      this.$store.dispatch('confirmVerifyEmail', {
        usrHash: query.hash,
        token: query.code,
        cb: (data) => {
          if (data.error) {
            console.log('verify email fail and error is', data)
            this.$vux.toast.text('用戶郵箱驗證失敗', 'bottom')
          } else {
            this.step += 1
          }
          this.$router.replace(this.$route.path) // 成功
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .v-email-container{
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .v-email-result{
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .v-email-btn-confirm{
    display: block;
    margin: 20px auto 0;
    width: 95%;
  }

  .sendCode{
    color: @number-button-font-color;
  }
  .sentCode{
    color: @color-font-C3;
  }
</style>
