<template>
  <div class="v-cellphone-container">
    <x-header :title="$route.meta.title">
    </x-header>
    <div v-if="step === 0" class="v-cellphone-step-first">
      <x-input
        required
        aria-required="true"
        title="您的手機號碼"
        placeholder="請輸入"
        aria-placeholder="請輸入您的手機號碼"
        aria-readonly="true"
        :max="10"
        :is-type="checkCellPhone"
        v-model.trim="phone">
      </x-input>
      <x-input
        v-model="code"
        title="驗證碼"
        aria-required="true"
        autocomplete="off"
        required
        ref="ipt"
        :max="6"
        aria-placeholder="請輸入手機驗證碼"
        placeholder="請輸入"
        :should-toast-error="false">
        <span
          @click="sendCodeToPhone"
          :class="`${isSendCode ? 'sentCode' : 'sendCode' }`"
          slot="right"
          type="primary"
          mini>
          {{ isSendCode ? `${leftTime}s` : '發送驗證碼' }}
        </span>
      </x-input>
      <!--<div class="g-desc v-cellphone-desc" v-if="!cellphone">请先編輯完整個人資料填寫手機號碼</div>-->
      <div>
        <div class="g-desc v-cellphone-desc">請在15分鐘內輸入手機簡訊所收到的驗證碼，否則驗證碼將會失效</div>
        <!-- <div class="g-desc v-cellphone-desc">驗證成功後，您可以使用手機號+密碼 或 郵箱+密碼 進行登錄，如需修改手機號，請聯繫網站客服</div> -->
        <div class="g-desc v-cellphone-desc">驗證成功後，此號碼與您身份綁定，如需修改請聯繫網站客服</div>
      </div>
      <!--<button v-if="!cellphone" @click="goEditUserInfo" class="g-button red v-cellphone-btn-confirm">編輯資料</button>-->
      <button @click="handleSubmit" class="g-button red v-cellphone-btn-confirm">確認</button>
    </div>
    <div v-else class="v-cellphone-step-second v-cellphone-result">
      <result-page
        :menus="[{
          text: '返回',
          func: () => {
            this.$router.go(-1)
          },
          type: 'primary'
        }]"
        title="驗證成功"
        desc="您已綁定手機號碼，此號碼與您身份綁定，如需修改手機號，請聯繫網站客服"
      >
      </result-page>
    </div>
  </div>
</template>

<script>
import { XInput } from 'vux'
import ResultPage from '@/components/ResultPage'
import { phoneRegex } from '@/tools/regex'

export default {
  components: {
    XInput,
    ResultPage
  },
  data () {
    return {
      code: '',
      leftTime: 60,
      isSendCode: false,
      step: 0,
      isLoading: false,
      phone: '',
      checkCellPhone: function (e) {
        return {
          valid: phoneRegex.test(e),
          msg: '請填寫正確手機號碼'
        }
      }
    }
  },
  computed: {
    cellphone () {
      return this.$store.state.user.userInfo.cellphone
    },
    isVerify () {
      return this.$store.state.user.userInfo.veriCell === 'Y'
    }
  },
  watch: {
    isVerify: (newVal, oldVal) => {
      console.log(newVal, oldVal)
    }
  },
  methods: {
    goEditUserInfo () {
      this.$router.push('/')
    },
    sendCodeToPhone () {
      if (!this.phone) {
        return this.$vux.toast.text('請輸入手機號碼', 'bottom')
      } else if (!phoneRegex.test(this.phone)) {
        return this.$vux.toast.text('請輸入正確的手機號碼', 'bottom')
      }

      if (this.isSendCode) {
        return this.$vux.toast.text('驗證碼已發送請核驗', 'bottom')
      }
      // 点击发送验证码
      this.$store.dispatch('sendCodeVerifyCellPhone', {
        cellphone: this.phone,
        cb: (code) => {
          this.isSendCode = true
          this.$refs.ipt.focus()
          this.$vux.toast.text('驗證碼已發送至手機', 'bottom')
          const timer = setInterval(() => {
            --this.leftTime
            if (this.leftTime === 0) {
              clearInterval(timer)
              this.isSendCode = false
              this.leftTime = 60
            }
          }, 1000)
        }
      })
    },
    handleSubmit () {
      if (!this.phone) {
        return this.$vux.toast.text('請輸入手機號碼', 'bottom')
      } else if (!phoneRegex.test(this.phone)) {
        return this.$vux.toast.text('請輸入正確的手機號碼', 'bottom')
      }
      if (!this.code) {
        return this.$vux.toast.text('請填寫驗證碼', 'bottom')
      }
      // 点击确定
      this.isLoading = true
      this.$store.dispatch('confirmVerifyCellPhone', {
        cellphone: this.phone,
        token: this.code,
        cb: (data) => {
          if (data.error) {
            console.log('手机验证失败', data.error)
            this.$vux.toast.text('手機驗證失敗')
          } else {
            this.step += 1
          }
        }
      })
    }
  },
  created () {
    const flag = this.$store.state.user.userInfo.veriCell === 'Y'
    if (flag) {
      this.step = 1
    }
    this.phone = this.cellphone
  }
}
</script>

<style lang="less" scoped>
  .v-cellphone-container{
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .v-cellphone-btn-confirm{
    display: block;
    margin: 20px auto 0;
    width: 95%;
  }

  .v-cellphone-desc{
    margin: 0 15px;
    line-height: 2;
    // text-align: center;
  }

  .v-cellphone-result{
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .sendCode{
    color: @number-button-font-color;
  }
  .sentCode{
    color: @color-font-C3;
  }
</style>
