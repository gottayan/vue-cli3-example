<template>
  <div class="comment-item">
    <div class="detail">
      <div
        @click="toUser"
        class="avatar"
        :style="{backgroundImage: `url(${(info.user.pics) || UserDefault})`}">
      </div>
      <div class="wrapper">
        <div class="user-name" @click="toUser">{{info.user.nickname || '無暱稱' }}</div>
        <div class="sum">
          <span class="extort">索取{{info.quantity}}個</span>
          <!--<span class="receive">獲贈{{info.gift_request.quantity}}個</span>-->
        </div>
      </div>
      <div class="create-at">{{ info.created_at | smartDate }}</div>
    </div>
  </div>
</template>

<script>
import UserDefault from '@/assets/icon/icon-default-avatar.png'
import {smartImagePath} from '@/tools/ObjectHelper'
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    info: {
      type: Object
    }
  },
  data () {
    return {
      UserDefault,
      smartImagePath
    }
  },
  created () {
    if (localStorage.getItem('KEY_USER_TOKEN') && !this.userInfo.id) {
      return this.getLoginUserInfo({cb: () => this.getLoginUserInfoCb()})
    }
  },
  methods: {
    ...mapActions({
      getLoginUserInfo: 'getLoginUserInfo'
    }),
    toUser () {
      const userId = this.info.user.id
      this.$router.push(this.userInfo.id === userId ? '/userinfo' : `/user/${userId}`)
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  }
}
</script>

<style lang="less" scoped>
  @import '../global.mixin.less';
  .comment-item{
    padding: @pm-bg 0;
    .g-border-1px();
    &:last-child{
      .g-border-none();
    }
    .detail {
      display: flex;
      align-items: center;
      .avatar {
        margin-right: @pm-bg;
        width: 40px;
        height: 40px;
        border: 1px solid @color-CL;
        border-radius: 50%;
        overflow: hidden;
        background-size: 40px auto;
        background-repeat: no-repeat;
        background-position: center center;
      }
      & > .wrapper {
        flex: 1;
        .user-name {
          font-size: @font-S2;
          font-weight: bold;
        }
        .sum {
          margin-top: @pm-md;
          color: @color-font-C2;
          font-size: @font-S4;
          .extort{
            .thank-user-name{
              color: @color-font-C1;
              font-style: normal;
            }
          }
          .receive{}
        }
      }
      .create-at{
        color:  @color-font-C2;
        font-size: @font-S4;
      }
    }
    .content{
      padding:@pm-md 0 0;
      line-height: 23px;
      .txt{
        color: @color-font-C1;
        font-size: @font-S4;
        text-align: justify;
        word-break:break-all
      }
      .pic{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: @pm-md 0 0 0;
        width: 75px;
        height: 75px;
        overflow: hidden;
        background-color: @color-CBG;
        img{
          display: block;
          width: 75px;
        }
      }
    }
  }
</style>
