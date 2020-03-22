<template>
  <div class="chpw-container">
    <x-header
      :title="$route.meta.title"
      @on-click-back="goback"
      ></x-header>
    <section v-if="!step" class="step-first chpw-content">
      <x-input
        placeholder="請輸入舊密碼"
        aria-placeholder="請輸入舊密碼"
        aria-required
        required
        title="舊密碼 "
        @on-change="checkOldPw"
        :value="oldpw"
        :min="4"
        :max="20"
        name="oldpw"
        :should-toast-error="false"
        type="password">
        </x-input>
      <div class="g-desc danger chpw-error-desc" v-show="!valid.oldpw.valid && valid.oldpw.changed">{{ valid.oldpw.msg }}</div>
      <x-input
        placeholder="請輸入新密碼"
        :min="6"
        :max="20"
        aria-placeholder="請輸入新密碼"
        aria-required
        required
        @on-change="checkNewPw"
        :is-type="checkPassword"
        :value="newpw"
        title="新密碼 "
        :should-toast-error="false"
        name="newpw"
        type="password"></x-input>
      <div class="g-desc danger chpw-error-desc" v-show="!valid.newpw.valid && valid.newpw.changed">{{ valid.newpw.msg }}</div>
      <div class="g-desc danger chpw-error-desc"></div>
      <x-input
        :should-toast-error="false"
        :min="6"
        :max="20"
        aria-required
        required
        placeholder="請再輸入一次新密碼"
        aria-placeholder="請再輸入一次新密碼"
        title="確認密碼"
        :is-type="checkRePassword"
        @on-change="checkConfirmPw"
        :value="confirmpw"
        name="confirmpw"
        type="password"></x-input>
      <div class="g-desc danger chpw-error-desc" v-show="!valid.confirmpw.valid && valid.confirmpw.changed">{{ valid.confirmpw.msg }}</div>
      <!-- <div class="g-desc chpw-content-desc" style="color: rgb(245, 170, 56);">密碼須由6到20位組成且包含數字和字母</div> -->
      <button @click="submitChangePw" class="g-button red chpw-btn" :disabled="!checkAllValid">確認更新密碼</button>
    </section>
    <section v-else-if="step === 1" class="step-second">
      <result-page
        :menus="[{
          text: '重新登入',
          func: () => {
            this.$store.commit('logout')
            this.$router.replace('/login')
          },
          type: 'primary'
        }]"
        title="修改成功"
        desc="您的密碼已成功修改，請重新登入確保帳號安全"
      ></result-page>
    </section>
    <section v-else class="step-third">
      <icon type="warn" is-msg></icon>
      <div class="g-desc chpw-warn chpw-content-desc" >若您為Facebook或Google+</div>
      <div class="g-desc chpw-warn chpw-content-desc" >社群登入的用戶，不適用此功能</div>
      <button @click="$router.go(-1)" class="g-button red" style="display: block; margin: 20px auto 0; width: 40%; border-radius: 30px">返回</button>
    </section>
  </div>
</template>

<script>
import ResultPage from '@/components/ResultPage'
import { Icon } from 'vux'
import { errorMap } from '@/tools/http'
import { passwordRegex } from '@/tools/regex'

export default {
  components: {
    ResultPage,
    Icon
  },
  data () {
    return {
      step: 0,
      oldpw: '',
      newpw: '',
      confirmpw: '',
      valid: {
        oldpw: {valid: false, changed: false},
        newpw: {valid: false, changed: false},
        confirmpw: {valid: false, changed: false}
      },
      isSubmiting: false,
      checkPassword: (e) => {
        return {
          valid: passwordRegex.test(e) && e !== this.oldpw,
          msg: '最少應該輸入6個字符，需包含英文和數字喔'
        }
      },
      checkRePassword: (e) => {
        return {
          valid: e === this.newpw,
          msg: '兩次密碼輸入不一致'
        }
      }
    }
  },
  computed: {
    checkAllValid () {
      return Object.keys(this.valid).every(key => this.valid[key].valid)
    }
  },
  methods: {
    goback () {
      if (this.step !== 1) {
        this.$router.go(-1)
      } else {
        // 强制登出
        this.$store.commit('logout')
        this.$router.push('/')
      }
    },
    checkOldPw (e) {
      if (e.trim().length < 4) {
        this.valid.oldpw = {
          valid: false,
          changed: true,
          msg: '舊密碼至少為4位'
        }
      } else {
        this.valid.oldpw = {
          valid: true,
          changed: true
        }
      }
      this.oldpw = e
    },
    checkNewPw (e) {
      if (e !== this.confirmpw && this.valid.confirmpw.changed) {
        this.valid.confirmpw = {
          valid: false,
          changed: true,
          msg: '與新密碼不一致'
        }
      } else if (e === this.confirmpw) {
        this.valid.confirmpw = {
          valid: true,
          changed: true
        }
      }

      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(e.trim())) {
        this.valid.newpw = {
          valid: false,
          changed: true,
          msg: '新密碼至少為6位數字+字母的組合'
        }
      } else if (e === this.oldpw) {
        this.valid.newpw = {
          valid: false,
          changed: true,
          msg: '新舊密碼不可一致'
        }
      } else {
        this.valid.newpw = {
          valid: true,
          changed: true
        }
      }
      this.newpw = e
    },
    checkConfirmPw (e) {
      if (e !== this.newpw) {
        this.valid.confirmpw = {
          valid: false,
          msg: '與新密碼不一致',
          changed: true
        }
      } else {
        this.valid.confirmpw = {
          valid: true,
          changed: true
        }
      }
      this.confirmpw = e
    },
    submitChangePw () {
      if (this.isSubmiting) {
        return
      }
      const flag = this.checkAllValid
      if (flag) {
        this.isSubmiting = true
        this.$store.dispatch('changeUserPassword', {
          oldpw: this.oldpw,
          newpw: this.newpw,
          cb: (data) => {
            this.isSubmiting = false
            if (data.error) {
              console.log('修改密碼失敗', data)
              return this.$vux.toast.text(errorMap(data.error), 'bottom')
            }
            this.step = 1
          }
        })
      } else {
        this.$vux.toast.text('新密碼需包含數字和字母喔', 'bottom')
      }
    }
  },
  created () {
    if (this.$store.state.user.userInfo.types === 'FACEBOOK' ||
        this.$store.state.user.userInfo.types === 'GOOGLE') {
      this.step = 2
    }
  }
}
</script>

<style lang="less" scoped>
  .chpw-container{
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .chpw-content-desc{
    margin: 0 15px;
  }

  .chpw-btn{
    display: block;
    margin: 0 auto;
    width: 90%;
    margin-top: 20px;
  }

  .chpw-error-desc{
    padding: 0 15px;
  }

  .step-second{
    flex: 1;
  }

  .step-third{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .chpw-warn{
      // color: black;
      font-size: 18px;
      &:nth-of-type(1){
        margin-top: 40px;
      }
    }
  }
</style>
