<template>
  <div class="v-love-container">
    <x-header :title="$route.meta.title"></x-header>
    <section class="v-love-step-first" v-show="step === 0">
      <x-input
        aria-placeholder="綁定愛箱送驗證碼"
        placeholder="請輸入您的綁定碼"
        autocomplete="off"
        title="愛箱送綁定"
        v-model="code"
        required
        aria-required="true"
      ></x-input>
      <!-- <button class="g>瞭解愛箱送</button> -->
      <button class="g-button red" @click="handleSubmit">確認送出</button>
      <router-link to="/aboutlovebox" class="g-desc">瞭解愛箱送</router-link>
    </section>
    <section class="v-love-step-second" v-show="step === 1">
      <result-page
        :icon="SuccessIcon"
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
          已完成綁定無法直接修改，如需修改請聯繫愛箱送企業或網站客服
        </div>
      </result-page>
      <!-- <button class="g-button red" @click="$router.go(-1)">返回</button> -->
    </section>
  </div>
</template>

<script>
import ResultPage from '@/components/ResultPage'
import SuccessIcon from '@/assets/icon/com_pic_succeed@2x.png'
import { errorMap } from '@/tools/http'
export default {
  components: {
    ResultPage
  },
  data () {
    return {
      code: '',
      step: 0,
      isLoading: false,
      SuccessIcon
    }
  },
  methods: {
    handleSubmit () {
      if (this.isLoading) {
        return this.$vux.toast.text('綁定中...', 'bottom')
      }

      this.isLoading = true
      this.$store.dispatch('confirmVerifyLoveBox', {
        code: this.code,
        cb: (data) => {
          this.isLoading = false
          if (data.error) {
            return this.$vux.toast.text(errorMap(data.error), 'bottom')
          }

          this.step = 1
        }
      })
    }
  },
  computed: {
    isVerify () {
      return this.$store.state.user.userInfo.love
    }
  },
  created () {
    if (this.isVerify) {
      this.step = 1
    }
  }
}
</script>

<style lang="less" scoped>
  .v-love-container {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    .v-love-step-first{
      text-align: center;

      .g-button{
        display: block;
        width: 95%;
        margin: 10px auto;
      }
    }
    .v-love-step-second{
      flex: 1;
      padding-top: 40px;
    }
  }
</style>
