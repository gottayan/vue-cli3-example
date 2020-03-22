<template>
  <div class="book-suc">
    <x-header title="完成">
    </x-header>
    <div class="container">
      <img :src="picLove" class="pic" width="150" height="150" alt="love">
      <div class="tip">已提交到愛箱倉庫</div>
      <div class="hint">我們會盡快安排工作人員為您打包發貨</div>
      <span
        @click="() => this.$router.push('/lovebox')"
        class="btn look"
      >
        繼續逛逛
      </span>
      <span
        @click="() => this.$router.push(`/user/${this.userInfo.id}/shop`)"
        class="btn check"
      >
        查看我的愛箱
      </span>
    </div>
  </div>
</template>

<script>
import picLove from '@/assets/icon/lovebox/love_pic_submit_done@2x.png'
import {mapActions, mapState} from 'vuex'

export default {
  data () {
    return {
      picLove
    }
  },
  created () {
    if (localStorage.getItem('KEY_USER_TOKEN') && !this.userInfo.id) {
      this.getLoginUserInfo()
    }
  },
  methods: {
    ...mapActions({
      getLoginUserInfo: 'getLoginUserInfo'
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  }
}
</script>

<style lang="less" scoped>
  .book-suc{
    height: 100%;
    .container{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 @pm-bg;
      height: calc(~"100% - 44px");
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .pic{
        margin: 128px 0 40px;
      }
      .tip{
        color: @color-font-C1;
        font-size: @font-S1;
        font-weight: 700;
      }
      .hint{
        color: @color-font-C2;
        font-size: @font-S3;
      }
      .btn.look{
        display: block;
        width: 100%;
        height: 40px;
        margin: 128px 0 24px 0;
        line-height: 40px;
        color: #FFF;
        font-size: @color-font-C2;
        text-align: center;
        border-radius: 3px;
        background: @color-CR;
      }
      .btn.check{
        margin-bottom: 30px;
        color: @color-CR;
        font-size: @font-S3;
      }
    }
  }
</style>
